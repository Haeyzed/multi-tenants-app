export interface InventoryWarehouseRef {
  id: number
  name: string
  code?: string
}

export interface InventoryVariantRef {
  id: number
  title: string
  sku: string
  product?: {
    id: number
    name: string
    slug: string
  }
}

export interface InventoryRecord {
  id: number
  product_variant_id: number
  warehouse_id: number
  quantity: number
  reserved_quantity: number
  incoming_quantity: number
  damaged_quantity: number
  available_quantity: number
  reorder_level?: number | null
  reorder_quantity?: number | null
  location_code?: string | null
  batch_number?: string | null
  expiry_date?: string | null
  is_low_stock: boolean
  warehouse?: InventoryWarehouseRef
  variant?: InventoryVariantRef
  product?: InventoryVariantRef["product"]
}

export interface InventoryMovement {
  id: number
  inventory_id: number
  quantity_change: number
  quantity_before: number
  quantity_after: number
  type: string
  reason?: string | null
  reference_type?: string | null
  reference_id?: number | null
  created_by?: number | null
  creator?: {
    id: number
    name: string
  } | null
  inventory?: InventoryRecord
  created_at: string
}

export interface InventoryStatistics {
  total_records: number
  low_stock: number
  out_of_stock: number
  pending_stock_alerts: number
}

export interface ProductStockAlert {
  id: number
  product_variant_id: number
  customer_id?: number | null
  email: string
  is_notified: boolean
  notified_at?: string | null
  created_at: string
  variant?: {
    id: number
    title: string
    sku: string
    product?: InventoryVariantRef["product"]
  }
}

export type InventoryMovementType =
  | "adjustment"
  | "sale"
  | "return"
  | "transfer"
  | "receipt"
  | "reservation"
  | "release"
  | "damage"
  | "shrinkage"
  | "restock"
  | "initial"
