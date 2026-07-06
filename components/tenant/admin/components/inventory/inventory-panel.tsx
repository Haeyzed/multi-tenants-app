"use client"

import * as React from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  useGetInventories,
  useGetInventoryMovements,
  useGetStockAlerts,
} from "@/hooks/tenant/use-inventory-query"

export function InventoryPanel() {
  const [search, setSearch] = React.useState("")
  const [lowStockOnly, setLowStockOnly] = React.useState(false)
  const [page, setPage] = React.useState(1)

  const inventoriesQuery = useGetInventories({
    search: search || undefined,
    low_stock: lowStockOnly || undefined,
    per_page: 15,
    page,
  })
  const movementsQuery = useGetInventoryMovements({ per_page: 15, page: 1 })
  const alertsQuery = useGetStockAlerts({
    is_notified: false,
    per_page: 15,
    page: 1,
  })

  const inventories = inventoriesQuery.data?.data ?? []
  const meta = inventoriesQuery.data?.meta

  return (
    <Tabs defaultValue="levels" className="space-y-4">
      <TabsList>
        <TabsTrigger value="levels">Stock levels</TabsTrigger>
        <TabsTrigger value="movements">Movements</TabsTrigger>
        <TabsTrigger value="alerts">Back-in-stock alerts</TabsTrigger>
      </TabsList>

      <TabsContent value="levels" className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Input
            value={search}
            onChange={(event) => {
              setSearch(event.target.value)
              setPage(1)
            }}
            placeholder="Search SKU, product, or location"
            className="max-w-sm"
          />
          <Button
            type="button"
            variant={lowStockOnly ? "default" : "outline"}
            onClick={() => {
              setLowStockOnly((current) => !current)
              setPage(1)
            }}
          >
            Low stock only
          </Button>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Warehouse</TableHead>
                <TableHead>Available</TableHead>
                <TableHead>Reorder level</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inventories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    No inventory records found.
                  </TableCell>
                </TableRow>
              ) : (
                inventories.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>
                      {record.variant?.product?.name ?? record.product?.name ?? "—"}
                    </TableCell>
                    <TableCell>{record.variant?.sku ?? "—"}</TableCell>
                    <TableCell>{record.warehouse?.name ?? "—"}</TableCell>
                    <TableCell>{record.available_quantity}</TableCell>
                    <TableCell>{record.reorder_level ?? "—"}</TableCell>
                    <TableCell>
                      {record.available_quantity <= 0 ? (
                        <Badge variant="destructive">Out of stock</Badge>
                      ) : record.is_low_stock ? (
                        <Badge variant="secondary">Low stock</Badge>
                      ) : (
                        <Badge variant="outline">In stock</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {meta && meta.last_page > 1 && (
          <div className="flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((current) => current - 1)}
            >
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {meta.current_page} of {meta.last_page}
            </span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={page >= meta.last_page}
              onClick={() => setPage((current) => current + 1)}
            >
              Next
            </Button>
          </div>
        )}
      </TabsContent>

      <TabsContent value="movements">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Change</TableHead>
                <TableHead>After</TableHead>
                <TableHead>Reason</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(movementsQuery.data?.data ?? []).length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    No movements recorded yet.
                  </TableCell>
                </TableRow>
              ) : (
                movementsQuery.data?.data.map((movement) => (
                  <TableRow key={movement.id}>
                    <TableCell>
                      {new Date(movement.created_at).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {movement.inventory?.variant?.product?.name ??
                        movement.inventory?.variant?.sku ??
                        "—"}
                    </TableCell>
                    <TableCell className="capitalize">{movement.type}</TableCell>
                    <TableCell>
                      {movement.quantity_change > 0
                        ? `+${movement.quantity_change}`
                        : movement.quantity_change}
                    </TableCell>
                    <TableCell>{movement.quantity_after}</TableCell>
                    <TableCell>{movement.reason ?? "—"}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </TabsContent>

      <TabsContent value="alerts">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Requested</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(alertsQuery.data?.data ?? []).length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                    No pending back-in-stock subscriptions.
                  </TableCell>
                </TableRow>
              ) : (
                alertsQuery.data?.data.map((alert) => (
                  <TableRow key={alert.id}>
                    <TableCell>{alert.email}</TableCell>
                    <TableCell>
                      {alert.variant?.product?.name ?? "—"}
                    </TableCell>
                    <TableCell>{alert.variant?.sku ?? "—"}</TableCell>
                    <TableCell>
                      {new Date(alert.created_at).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </TabsContent>
    </Tabs>
  )
}
