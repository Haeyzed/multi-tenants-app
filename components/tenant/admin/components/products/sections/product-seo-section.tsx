"use client"

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
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
import { MediaPickerField } from "@/components/tenant/admin/components/media/media-picker-field"
import { type StoreProductFormValues } from "@/schemas/tenant/product-schema"
import { type ProductFormSectionProps } from "./product-form-shared"

const twitterCardOptions = [
  { label: "Summary", value: "summary" },
  { label: "Summary Large Image", value: "summary_large_image" },
  { label: "App", value: "app" },
  { label: "Player", value: "player" },
]

const robotsMetaOptions = [
  { label: "Index, Follow", value: "index, follow" },
  { label: "No Index, Follow", value: "noindex, follow" },
  { label: "Index, No Follow", value: "index, nofollow" },
  { label: "No Index, No Follow", value: "noindex, nofollow" },
]

export function ProductSeoSection({ form }: ProductFormSectionProps) {
  const seo = form.watch("seo")
  const twitterCard =
    twitterCardOptions.find((item) => item.value === seo?.twitter_card) ??
    twitterCardOptions[1]
  const robotsMeta =
    robotsMetaOptions.find((item) => item.value === seo?.robots_meta) ??
    robotsMetaOptions[0]

  const updateSeo = (
    patch: Partial<NonNullable<StoreProductFormValues["seo"]>>
  ) => {
    form.setValue(
      "seo",
      {
        canonical_url: "",
        og_title: "",
        og_description: "",
        og_image_media_id: null,
        twitter_card: "summary_large_image",
        twitter_title: "",
        twitter_description: "",
        twitter_image_media_id: null,
        robots_meta: "index, follow",
        ...seo,
        ...patch,
      },
      { shouldDirty: true }
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Search engine listing</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <Field>
            <FieldLabel>Meta title</FieldLabel>
            <FieldContent>
              <Input placeholder="SEO title" {...form.register("meta_title")} />
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel>Meta description</FieldLabel>
            <FieldContent>
              <Textarea
                placeholder="Short description for search results"
                {...form.register("meta_description")}
              />
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel>Meta keywords</FieldLabel>
            <FieldContent>
              <Input
                placeholder="keyword-one, keyword-two"
                {...form.register("meta_keywords")}
              />
            </FieldContent>
          </Field>
        </div>

        <div className="space-y-4 border-t pt-4">
          <p className="text-sm font-medium">Open Graph</p>

          <Field>
            <FieldLabel>Canonical URL</FieldLabel>
            <FieldContent>
              <Input
                placeholder="https://store.example.com/products/item"
                value={seo?.canonical_url ?? ""}
                onChange={(event) =>
                  updateSeo({ canonical_url: event.target.value })
                }
              />
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel>OG title</FieldLabel>
            <FieldContent>
              <Input
                placeholder="Social share title"
                value={seo?.og_title ?? ""}
                onChange={(event) =>
                  updateSeo({ og_title: event.target.value })
                }
              />
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel>OG description</FieldLabel>
            <FieldContent>
              <Textarea
                placeholder="Social share description"
                value={seo?.og_description ?? ""}
                onChange={(event) =>
                  updateSeo({ og_description: event.target.value })
                }
              />
            </FieldContent>
          </Field>

          <MediaPickerField
            label="OG image"
            value={seo?.og_image_media_id ?? null}
            onChange={(mediaId) => updateSeo({ og_image_media_id: mediaId })}
          />
        </div>

        <div className="space-y-4 border-t pt-4">
          <p className="text-sm font-medium">Twitter</p>

          <Field>
            <FieldLabel>Card type</FieldLabel>
            <FieldContent>
              <Combobox
                items={twitterCardOptions}
                itemToStringValue={(item) => item.label}
                value={twitterCard}
                onValueChange={(item) => {
                  if (!item) return
                  updateSeo({ twitter_card: item.value })
                }}
              >
                <ComboboxInput placeholder="Select card type..." showClear />
                <ComboboxContent>
                  <ComboboxEmpty>No card types found.</ComboboxEmpty>
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
            <FieldLabel>Twitter title</FieldLabel>
            <FieldContent>
              <Input
                placeholder="Twitter title"
                value={seo?.twitter_title ?? ""}
                onChange={(event) =>
                  updateSeo({ twitter_title: event.target.value })
                }
              />
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel>Twitter description</FieldLabel>
            <FieldContent>
              <Textarea
                placeholder="Twitter description"
                value={seo?.twitter_description ?? ""}
                onChange={(event) =>
                  updateSeo({ twitter_description: event.target.value })
                }
              />
            </FieldContent>
          </Field>

          <MediaPickerField
            label="Twitter image"
            value={seo?.twitter_image_media_id ?? null}
            onChange={(mediaId) =>
              updateSeo({ twitter_image_media_id: mediaId })
            }
          />
        </div>

        <Field>
          <FieldLabel>Robots meta</FieldLabel>
          <FieldContent>
            <Combobox
              items={robotsMetaOptions}
              itemToStringValue={(item) => item.label}
              value={robotsMeta}
              onValueChange={(item) => {
                if (!item) return
                updateSeo({ robots_meta: item.value })
              }}
            >
              <ComboboxInput
                placeholder="Select robots directive..."
                showClear
              />
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
      </CardContent>
    </Card>
  )
}
