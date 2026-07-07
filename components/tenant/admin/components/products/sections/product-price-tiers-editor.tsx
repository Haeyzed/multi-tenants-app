"use client"

import { format, parse } from "date-fns"
import { Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DatePicker } from "@/components/ui/date-picker"
import { Input } from "@/components/ui/input"
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
import { useGetCustomerGroupOptions } from "@/hooks/tenant/use-customer-group-query"
import { type ProductPriceTierFormValues } from "@/schemas/tenant/product-schema"

const noneGroupOption = { label: "All customers", value: 0 }

function parseTierDate(value: string | null | undefined): Date | undefined {
  if (!value) return undefined

  try {
    return parse(value, "yyyy-MM-dd", new Date())
  } catch {
    return undefined
  }
}

function createEmptyTier(): ProductPriceTierFormValues {
  return {
    min_quantity: 1,
    max_quantity: null,
    price: 0,
    customer_group_id: null,
    starts_at: null,
    ends_at: null,
  }
}

type ProductPriceTiersEditorProps = {
  tiers: ProductPriceTierFormValues[]
  onChange: (tiers: ProductPriceTierFormValues[]) => void
}

export function ProductPriceTiersEditor({
  tiers,
  onChange,
}: ProductPriceTiersEditorProps) {
  const { data: customerGroupOptions = [] } = useGetCustomerGroupOptions()
  const groupOptions = [noneGroupOption, ...customerGroupOptions]

  const addTier = () => {
    onChange([...tiers, createEmptyTier()])
  }

  const removeTier = (index: number) => {
    onChange(tiers.filter((_, itemIndex) => itemIndex !== index))
  }

  const updateTier = (
    index: number,
    patch: Partial<ProductPriceTierFormValues>
  ) => {
    onChange(
      tiers.map((tier, itemIndex) =>
        itemIndex === index ? { ...tier, ...patch } : tier
      )
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium">Volume pricing</p>
          <p className="text-sm text-muted-foreground">
            Offer quantity breaks and optional customer-group pricing.
          </p>
        </div>
        <Button type="button" variant="outline" size="sm" onClick={addTier}>
          <Plus className="mr-2 size-4" />
          Add tier
        </Button>
      </div>

      {tiers.length === 0 ? (
        <p className="text-sm text-muted-foreground">No price tiers configured.</p>
      ) : (
        <>
          <div className="space-y-4 md:hidden">
            {tiers.map((tier, index) => {
              const selectedGroup =
                groupOptions.find(
                  (option) => option.value === (tier.customer_group_id ?? 0)
                ) ?? noneGroupOption

              return (
                <div
                  key={`price-tier-mobile-${index}`}
                  className="space-y-3 rounded-lg border p-4"
                >
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-muted-foreground">
                        Min qty
                      </p>
                      <Input
                        type="number"
                        min={1}
                        value={tier.min_quantity}
                        onChange={(event) =>
                          updateTier(index, {
                            min_quantity: Number(event.target.value) || 1,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-muted-foreground">
                        Max qty
                      </p>
                      <Input
                        type="number"
                        min={1}
                        value={tier.max_quantity ?? ""}
                        onChange={(event) =>
                          updateTier(index, {
                            max_quantity:
                              event.target.value === ""
                                ? null
                                : Number(event.target.value),
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground">Price</p>
                    <Input
                      type="number"
                      step="0.01"
                      min={0}
                      value={tier.price}
                      onChange={(event) =>
                        updateTier(index, {
                          price: Number(event.target.value) || 0,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground">
                      Customer group
                    </p>
                    <Combobox
                      items={groupOptions}
                      itemToStringValue={(item) => item.label}
                      value={selectedGroup}
                      onValueChange={(item) => {
                        updateTier(index, {
                          customer_group_id:
                            !item || item.value === 0 ? null : item.value,
                        })
                      }}
                    >
                      <ComboboxInput placeholder="All customers" className="w-full" />
                      <ComboboxContent>
                        <ComboboxEmpty>No groups found.</ComboboxEmpty>
                        <ComboboxList>
                          {(item) => (
                            <ComboboxItem key={item.value} value={item}>
                              {item.label}
                            </ComboboxItem>
                          )}
                        </ComboboxList>
                      </ComboboxContent>
                    </Combobox>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-muted-foreground">Starts</p>
                      <DatePicker
                        selected={parseTierDate(tier.starts_at)}
                        onSelect={(date) =>
                          updateTier(index, {
                            starts_at: date ? format(date, "yyyy-MM-dd") : null,
                          })
                        }
                        placeholder="Start date"
                        minDate={new Date("1900-01-01")}
                        maxDate={new Date("2099-12-31")}
                      />
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-muted-foreground">Ends</p>
                      <DatePicker
                        selected={parseTierDate(tier.ends_at)}
                        onSelect={(date) =>
                          updateTier(index, {
                            ends_at: date ? format(date, "yyyy-MM-dd") : null,
                          })
                        }
                        placeholder="End date"
                        minDate={new Date("1900-01-01")}
                        maxDate={new Date("2099-12-31")}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeTier(index)}
                    >
                      <Trash2 className="mr-2 size-4" />
                      Remove tier
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="hidden overflow-x-auto md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Min qty</TableHead>
              <TableHead>Max qty</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Customer group</TableHead>
              <TableHead>Starts</TableHead>
              <TableHead>Ends</TableHead>
              <TableHead className="w-[60px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {tiers.map((tier, index) => {
              const selectedGroup =
                groupOptions.find(
                  (option) =>
                    option.value === (tier.customer_group_id ?? 0)
                ) ?? noneGroupOption

              return (
                <TableRow key={`price-tier-${index}`}>
                  <TableCell>
                    <Input
                      type="number"
                      min={1}
                      value={tier.min_quantity}
                      onChange={(event) =>
                        updateTier(index, {
                          min_quantity: Number(event.target.value) || 1,
                        })
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      min={1}
                      value={tier.max_quantity ?? ""}
                      onChange={(event) =>
                        updateTier(index, {
                          max_quantity:
                            event.target.value === ""
                              ? null
                              : Number(event.target.value),
                        })
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      step="0.01"
                      min={0}
                      value={tier.price}
                      onChange={(event) =>
                        updateTier(index, {
                          price: Number(event.target.value) || 0,
                        })
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Combobox
                      items={groupOptions}
                      itemToStringValue={(item) => item.label}
                      value={selectedGroup}
                      onValueChange={(item) => {
                        updateTier(index, {
                          customer_group_id:
                            !item || item.value === 0 ? null : item.value,
                        })
                      }}
                    >
                      <ComboboxInput placeholder="All customers" />
                      <ComboboxContent>
                        <ComboboxEmpty>No groups found.</ComboboxEmpty>
                        <ComboboxList>
                          {(item) => (
                            <ComboboxItem key={item.value} value={item}>
                              {item.label}
                            </ComboboxItem>
                          )}
                        </ComboboxList>
                      </ComboboxContent>
                    </Combobox>
                  </TableCell>
                  <TableCell>
                    <DatePicker
                      selected={parseTierDate(tier.starts_at)}
                      onSelect={(date) =>
                        updateTier(index, {
                          starts_at: date ? format(date, "yyyy-MM-dd") : null,
                        })
                      }
                      placeholder="Start date"
                      minDate={new Date("1900-01-01")}
                      maxDate={new Date("2099-12-31")}
                    />
                  </TableCell>
                  <TableCell>
                    <DatePicker
                      selected={parseTierDate(tier.ends_at)}
                      onSelect={(date) =>
                        updateTier(index, {
                          ends_at: date ? format(date, "yyyy-MM-dd") : null,
                        })
                      }
                      placeholder="End date"
                      minDate={new Date("1900-01-01")}
                      maxDate={new Date("2099-12-31")}
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeTier(index)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
          </div>
        </>
      )}
    </div>
  )
}
