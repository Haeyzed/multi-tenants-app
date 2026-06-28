"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Field, FieldContent, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { tenantSchema, updateTenantSchema, TenantFormValues, UpdateTenantFormValues } from "@/schemas/central/tenant-schema";
import { Tenant } from "@/types/central/tenant";

interface TenantFormProps {
  tenant?: Tenant;
  onSubmit: (values: TenantFormValues | UpdateTenantFormValues) => void;
  isSubmitting?: boolean;
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-sm text-destructive mt-1">{message}</p>;
}

export function TenantForm({ tenant, onSubmit, isSubmitting = false }: TenantFormProps) {
  const isEditMode = !!tenant;
  const schema = isEditMode ? updateTenantSchema : tenantSchema;

  const form = useForm<TenantFormValues | UpdateTenantFormValues>({
    resolver: zodResolver(schema),
    defaultValues: isEditMode
      ? {
        name: tenant.name,
        email: tenant.email,
        phone: tenant.phone,
        plan: tenant.plan,
        trial_ends_at: tenant.trial_ends_at,
      }
      : {
        name: "",
        slug: null,
        email: null,
        phone: null,
        plan: null,
        trial_ends_at: null,
        subdomain: null,
        owner: { name: "", email: "", phone: null },
      },
  });

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <Field>
        <FieldLabel>Name *</FieldLabel>
        <FieldContent>
          <Input placeholder="Acme Inc." {...form.register("name")} />
          <FieldError message={form.formState.errors.name?.message} />
        </FieldContent>
      </Field>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field>
          <FieldLabel>Email</FieldLabel>
          <FieldContent>
            <Input placeholder="contact@acme.inc" {...form.register("email")} />
            <FieldError message={form.formState.errors.email?.message} />
          </FieldContent>
        </Field>
        <Field>
          <FieldLabel>Phone</FieldLabel>
          <FieldContent>
            <Input placeholder="+1234567890" {...form.register("phone")} />
            <FieldError message={form.formState.errors.phone?.message} />
          </FieldContent>
        </Field>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field>
          <FieldLabel>Plan</FieldLabel>
          <FieldContent>
            <Input placeholder="pro" {...form.register("plan")} />
            <FieldError message={form.formState.errors.plan?.message} />
          </FieldContent>
        </Field>
        <Field>
          <FieldLabel>Trial Ends At</FieldLabel>
          <FieldContent>
            <Input type="datetime-local" {...form.register("trial_ends_at")} />
            <FieldError message={form.formState.errors.trial_ends_at?.message} />
          </FieldContent>
        </Field>
      </div>

      {!isEditMode && (
        <>
          <Field>
            <FieldLabel>Subdomain</FieldLabel>
            <FieldContent>
              <Input placeholder="acme" {...form.register("subdomain")} />
              <FieldError message={(form.formState.errors as any).subdomain?.message} />
            </FieldContent>
          </Field>

          <div className="border rounded-lg p-4 space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Owner Information
            </h3>

            <Field>
              <FieldLabel>Owner Name *</FieldLabel>
              <FieldContent>
                <Input placeholder="John Doe" {...form.register("owner.name")} />
                <FieldError message={(form.formState.errors as any).owner?.name?.message} />
              </FieldContent>
            </Field>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field>
                <FieldLabel>Owner Email *</FieldLabel>
                <FieldContent>
                  <Input placeholder="john.doe@acme.inc" {...form.register("owner.email")} />
                  <FieldError message={(form.formState.errors as any).owner?.email?.message} />
                </FieldContent>
              </Field>
              <Field>
                <FieldLabel>Owner Phone</FieldLabel>
                <FieldContent>
                  <Input placeholder="+1234567890" {...form.register("owner.phone")} />
                  <FieldError message={(form.formState.errors as any).owner?.phone?.message} />
                </FieldContent>
              </Field>
            </div>
          </div>
        </>
      )}

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : isEditMode ? "Update Tenant" : "Create Tenant"}
      </Button>
    </form>
  );
}