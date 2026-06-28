"use client";

import * as React from "react";
import { FormDialog } from "@/components/form-dialog";
import { useCreatePlan, useUpdatePlan } from "@/hooks/central/use-plan-query";
import { PlanFormValues } from "@/schemas/central/plan-schema";
import { Plan } from "@/types/central/plan";
import { PlanForm } from "./plan-form";
import { toast } from "sonner";

interface PlanDialogProps {
  children: React.ReactElement;
  plan?: Plan;
}

export function PlanDialog({ children, plan }: PlanDialogProps) {
  const [open, setOpen] = React.useState(false);
  const createPlan = useCreatePlan();
  const updatePlan = useUpdatePlan();

  const isSubmitting = createPlan.isPending || updatePlan.isPending;

  const onSubmit = (values: PlanFormValues) => {
    if (plan) {
      updatePlan.mutate(
        { id: plan.id, plan: values },
        {
          onSuccess: () => {
            toast.success("Plan updated successfully");
            setOpen(false);
          },
          onError: (error) => {
            toast.error(error.message || "Failed to update plan");
          },
        }
      );
    } else {
      createPlan.mutate(values, {
        onSuccess: () => {
          toast.success("Plan created successfully");
          setOpen(false);
        },
        onError: (error) => {
          toast.error(error.message || "Failed to create plan");
        },
      });
    }
  };

  return (
    <FormDialog
      open={open}
      onOpenChange={setOpen}
      trigger={children}
      title={plan ? "Edit Plan" : "Create Plan"}
    >
      <PlanForm plan={plan} onSubmit={onSubmit} isSubmitting={isSubmitting} />
    </FormDialog>
  );
}