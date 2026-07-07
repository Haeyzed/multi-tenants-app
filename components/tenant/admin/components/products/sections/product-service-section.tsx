"use client"

import * as React from "react"
import { Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldContent, FieldLabel } from "@/components/ui/field"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Spinner } from "@/components/ui/spinner"
import { useGetTeamMembers } from "@/hooks/tenant/use-team-query"
import { useSyncProductService } from "@/hooks/tenant/use-product-variant-query"
import {
  syncProductServiceSchema,
  type SyncProductServiceFormValues,
} from "@/schemas/tenant/product-schema"
import { type Product } from "@/types/tenant/product"
import { toastApiError, toastApiSuccess } from "@/lib/toast-api"
import { FieldError, serviceLocationTypeOptions } from "./product-form-shared"

type ProductServiceSectionProps = {
  product: Product
}

function defaultServiceValues(product: Product): SyncProductServiceFormValues {
  return {
    service: {
      duration_minutes: product.service?.duration_minutes ?? 60,
      buffer_minutes_before: product.service?.buffer_minutes_before ?? 0,
      buffer_minutes_after: product.service?.buffer_minutes_after ?? 0,
      max_participants: product.service?.max_participants ?? null,
      location_type: product.service?.location_type ?? "any",
      location_address: product.service?.location_address ?? "",
      meeting_url: product.service?.meeting_url ?? "",
      requires_confirmation: product.service?.requires_confirmation ?? false,
      cancellation_hours: product.service?.cancellation_hours ?? 24,
      instructions: product.service?.instructions ?? "",
    },
    providers:
      product.providers?.map((provider) => ({
        provider_id: provider.provider_id,
        is_primary: provider.is_primary ?? false,
        commission_rate: provider.commission_rate
          ? Number(provider.commission_rate)
          : null,
      })) ?? [],
  }
}

function createEmptyProvider(): SyncProductServiceFormValues["providers"][number] {
  return {
    provider_id: 0,
    is_primary: false,
    commission_rate: null,
  }
}

export function ProductServiceSection({ product }: ProductServiceSectionProps) {
  const syncService = useSyncProductService(product.id)
  const { data: teamResponse } = useGetTeamMembers({ is_active: "active" })
  const teamOptions =
    teamResponse?.data.map((member) => ({
      label: member.name,
      value: member.id,
    })) ?? []
  const [formValues, setFormValues] = React.useState(() => defaultServiceValues(product))
  const [errors, setErrors] = React.useState<Record<string, string>>({})

  React.useEffect(() => {
    setFormValues(defaultServiceValues(product))
  }, [product])

  const selectedLocationType =
    serviceLocationTypeOptions.find(
      (option) => option.value === (formValues.service.location_type ?? "any")
    ) ?? serviceLocationTypeOptions[0]

  const updateService = (
    patch: Partial<SyncProductServiceFormValues["service"]>
  ) => {
    setFormValues((current) => ({
      ...current,
      service: { ...current.service, ...patch },
    }))
  }

  const updateProvider = (
    index: number,
    patch: Partial<SyncProductServiceFormValues["providers"][number]>
  ) => {
    setFormValues((current) => ({
      ...current,
      providers: current.providers.map((provider, providerIndex) =>
        providerIndex === index ? { ...provider, ...patch } : provider
      ),
    }))
  }

  const handleSave = () => {
    const result = syncProductServiceSchema.safeParse(formValues)

    if (!result.success) {
      const fieldErrors: Record<string, string> = {}
      result.error.issues.forEach((issue) => {
        fieldErrors[issue.path.join(".")] = issue.message
      })
      setErrors(fieldErrors)
      return
    }

    setErrors({})
    syncService.mutate(result.data, {
      onSuccess: (response) =>
        toastApiSuccess(response.message, "Service settings saved"),
      onError: (error) => toastApiError(error, "Failed to save service settings"),
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Service configuration</CardTitle>
        <p className="text-sm text-muted-foreground">
          Duration, location, and staff assigned to this service.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <Field>
            <FieldLabel>Duration (minutes)</FieldLabel>
            <FieldContent>
              <Input
                type="number"
                min={1}
                value={formValues.service.duration_minutes}
                onChange={(event) =>
                  updateService({ duration_minutes: Number(event.target.value) || 1 })
                }
              />
              <FieldError message={errors["service.duration_minutes"]} />
            </FieldContent>
          </Field>
          <Field>
            <FieldLabel>Max participants</FieldLabel>
            <FieldContent>
              <Input
                type="number"
                min={1}
                value={formValues.service.max_participants ?? ""}
                onChange={(event) =>
                  updateService({
                    max_participants: event.target.value
                      ? Number(event.target.value)
                      : null,
                  })
                }
                placeholder="Unlimited"
              />
            </FieldContent>
          </Field>
          <Field>
            <FieldLabel>Buffer before (minutes)</FieldLabel>
            <FieldContent>
              <Input
                type="number"
                min={0}
                value={formValues.service.buffer_minutes_before ?? 0}
                onChange={(event) =>
                  updateService({
                    buffer_minutes_before: Number(event.target.value) || 0,
                  })
                }
              />
            </FieldContent>
          </Field>
          <Field>
            <FieldLabel>Buffer after (minutes)</FieldLabel>
            <FieldContent>
              <Input
                type="number"
                min={0}
                value={formValues.service.buffer_minutes_after ?? 0}
                onChange={(event) =>
                  updateService({
                    buffer_minutes_after: Number(event.target.value) || 0,
                  })
                }
              />
            </FieldContent>
          </Field>
          <Field>
            <FieldLabel>Location type</FieldLabel>
            <FieldContent>
              <Combobox
                items={serviceLocationTypeOptions}
                itemToStringValue={(item) => item.label}
                value={selectedLocationType}
                onValueChange={(item) => {
                  if (!item) return
                  updateService({ location_type: item.value })
                }}
              >
                <ComboboxInput placeholder="Select location type..." />
                <ComboboxContent>
                  <ComboboxEmpty>No options found.</ComboboxEmpty>
                  <ComboboxList>
                    {(item) => (
                      <ComboboxItem key={item.value} value={item}>
                        {item.label}
                      </ComboboxItem>
                    )}
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
            </FieldContent>
          </Field>
          <Field>
            <FieldLabel>Cancellation notice (hours)</FieldLabel>
            <FieldContent>
              <Input
                type="number"
                min={0}
                value={formValues.service.cancellation_hours ?? 24}
                onChange={(event) =>
                  updateService({
                    cancellation_hours: Number(event.target.value) || 0,
                  })
                }
              />
            </FieldContent>
          </Field>
        </div>

        <Field>
          <FieldLabel>Location address</FieldLabel>
          <FieldContent>
            <Textarea
              value={formValues.service.location_address ?? ""}
              onChange={(event) =>
                updateService({ location_address: event.target.value })
              }
              rows={2}
            />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel>Meeting URL</FieldLabel>
          <FieldContent>
            <Input
              value={formValues.service.meeting_url ?? ""}
              onChange={(event) => updateService({ meeting_url: event.target.value })}
              placeholder="https://"
            />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel>Instructions</FieldLabel>
          <FieldContent>
            <Textarea
              value={formValues.service.instructions ?? ""}
              onChange={(event) => updateService({ instructions: event.target.value })}
              rows={3}
            />
          </FieldContent>
        </Field>

        <div className="flex items-center gap-2">
          <Checkbox
            id="requires-confirmation"
            checked={formValues.service.requires_confirmation ?? false}
            onCheckedChange={(checked) =>
              updateService({ requires_confirmation: !!checked })
            }
          />
          <label htmlFor="requires-confirmation" className="text-sm">
            Requires manual confirmation
          </label>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="font-medium">Service providers</h3>
              <p className="text-sm text-muted-foreground">
                Team members who can deliver this service.
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                setFormValues((current) => ({
                  ...current,
                  providers: [...current.providers, createEmptyProvider()],
                }))
              }
            >
              <Plus className="mr-1 size-4" />
              Add provider
            </Button>
          </div>

          {formValues.providers.length === 0 ? (
            <p className="text-sm text-muted-foreground">No providers assigned.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Team member</TableHead>
                  <TableHead>Commission %</TableHead>
                  <TableHead>Primary</TableHead>
                  <TableHead className="w-12" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {formValues.providers.map((provider, index) => {
                  const selectedMember =
                    teamOptions.find((option) => option.value === provider.provider_id) ??
                    null

                  return (
                    <TableRow key={`provider-${index}`}>
                      <TableCell className="min-w-[240px]">
                        <Combobox
                          items={teamOptions}
                          itemToStringValue={(item) => item.label}
                          value={selectedMember}
                          onValueChange={(item) =>
                            updateProvider(index, {
                              provider_id: item ? item.value : 0,
                            })
                          }
                        >
                          <ComboboxInput placeholder="Select team member" />
                          <ComboboxContent>
                            <ComboboxEmpty>No team members found.</ComboboxEmpty>
                            <ComboboxList>
                              {(item) => (
                                <ComboboxItem key={item.value} value={item}>
                                  {item.label}
                                </ComboboxItem>
                              )}
                            </ComboboxList>
                          </ComboboxContent>
                        </Combobox>
                        <FieldError message={errors[`providers.${index}.provider_id`]} />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          min={0}
                          max={100}
                          value={provider.commission_rate ?? ""}
                          onChange={(event) =>
                            updateProvider(index, {
                              commission_rate: event.target.value
                                ? Number(event.target.value)
                                : null,
                            })
                          }
                          placeholder="—"
                        />
                      </TableCell>
                      <TableCell>
                        <Checkbox
                          checked={provider.is_primary ?? false}
                          onCheckedChange={(checked) =>
                            updateProvider(index, { is_primary: !!checked })
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            setFormValues((current) => ({
                              ...current,
                              providers: current.providers.filter(
                                (_, providerIndex) => providerIndex !== index
                              ),
                            }))
                          }
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </div>

        <div className="flex justify-end">
          <Button type="button" onClick={handleSave} disabled={syncService.isPending}>
            {syncService.isPending && <Spinner />}
            Save service
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
