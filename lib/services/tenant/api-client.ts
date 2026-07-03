import {
  resolveTenantApiBaseUrl,
  TENANT_TOKEN_KEY,
  TENANT_CUSTOMER_TOKEN_KEY,
} from "@/lib/tenant-api-url"

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public errors?: Record<string, string[]>
  ) {
    super(message)
    this.name = "ApiError"
  }
}

class TenantApiClient {
  private token: string | null = null

  constructor(private readonly tokenKey: string) {
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem(this.tokenKey)
    }
  }

  public setToken(token: string | null) {
    this.token = token
    if (typeof window === "undefined") {
      return
    }

    if (token) {
      localStorage.setItem(this.tokenKey, token)
    } else {
      localStorage.removeItem(this.tokenKey)
    }
  }

  public getToken(): string | null {
    return this.token
  }

  private buildQueryString(
    params?: Record<
      string,
      string | number | boolean | string[] | number[] | undefined
    >
  ): string {
    if (!params) return ""

    const searchParams = new URLSearchParams()
    for (const [key, value] of Object.entries(params)) {
      if (value === undefined) continue
      if (Array.isArray(value)) {
        for (const item of value) {
          searchParams.append(`${key}[]`, String(item))
        }
        continue
      }
      searchParams.append(key, String(value))
    }

    const query = searchParams.toString()
    return query ? `?${query}` : ""
  }

  private async request<T>(
    method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH",
    path: string,
    body?: unknown,
    params?: Record<
      string,
      string | number | boolean | string[] | number[] | undefined
    >
  ): Promise<T> {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      Accept: "application/json",
    }

    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`
    }

    const url = `${resolveTenantApiBaseUrl()}${path}${this.buildQueryString(params)}`

    const response = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    })

    const responseData = await response.json().catch(() => null)

    if (!response.ok) {
      throw new ApiError(
        responseData?.message ||
          `HTTP ${response.status}: ${response.statusText}`,
        response.status,
        responseData?.errors
      )
    }

    return responseData as T
  }

  public get<T>(
    path: string,
    params?: Record<
      string,
      string | number | boolean | string[] | number[] | undefined
    >
  ) {
    return this.request<T>("GET", path, undefined, params)
  }

  public post<T>(path: string, body: unknown) {
    return this.request<T>("POST", path, body)
  }

  public put<T>(path: string, body: unknown) {
    return this.request<T>("PUT", path, body)
  }

  public patch<T>(path: string, body: unknown) {
    return this.request<T>("PATCH", path, body)
  }

  public delete<T>(path: string, body?: unknown) {
    return this.request<T>("DELETE", path, body)
  }

  public async postFileDownload(
    path: string,
    body?: unknown,
    options?: {
      accept?: string
      defaultFilename?: string
    }
  ): Promise<string> {
    const headers: HeadersInit = {
      Accept:
        options?.accept ??
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, text/csv, application/octet-stream",
    }

    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`
    }

    if (body) {
      headers["Content-Type"] = "application/json"
    }

    const response = await fetch(`${resolveTenantApiBaseUrl()}${path}`, {
      method: "POST",
      headers,
      body: body ? JSON.stringify(body) : undefined,
    })

    if (!response.ok) {
      const responseData = await response.json().catch(() => null)
      throw new ApiError(
        responseData?.message ||
          `HTTP ${response.status}: ${response.statusText}`,
        response.status,
        responseData?.errors
      )
    }

    const { parseFilenameFromContentDisposition, triggerBrowserDownload } =
      await import("@/lib/export-utils")

    const blob = await response.blob()
    const filename =
      parseFilenameFromContentDisposition(
        response.headers.get("Content-Disposition")
      ) ?? options?.defaultFilename ?? "export.xlsx"

    triggerBrowserDownload(blob, filename)
    return filename
  }

  public async getFileDownload(
    path: string,
    params?: Record<
      string,
      string | number | boolean | string[] | number[] | undefined
    >,
    defaultFilename = "download.xlsx"
  ): Promise<string> {
    const headers: HeadersInit = {
      Accept:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, text/csv, application/octet-stream",
    }

    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`
    }

    const url = `${resolveTenantApiBaseUrl()}${path}${this.buildQueryString(params)}`

    const response = await fetch(url, { method: "GET", headers })

    if (!response.ok) {
      const responseData = await response.json().catch(() => null)
      throw new ApiError(
        responseData?.message ||
          `HTTP ${response.status}: ${response.statusText}`,
        response.status,
        responseData?.errors
      )
    }

    const { parseFilenameFromContentDisposition, triggerBrowserDownload } =
      await import("@/lib/export-utils")

    const blob = await response.blob()
    const filename =
      parseFilenameFromContentDisposition(
        response.headers.get("Content-Disposition")
      ) ?? defaultFilename

    triggerBrowserDownload(blob, filename)
    return filename
  }

  public async upload<T>(path: string, formData: FormData): Promise<T> {
    const headers: HeadersInit = {
      Accept: "application/json",
    }

    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`
    }

    const response = await fetch(`${resolveTenantApiBaseUrl()}${path}`, {
      method: "POST",
      headers,
      body: formData,
    })

    const responseData = await response.json().catch(() => null)

    if (!response.ok) {
      throw new ApiError(
        responseData?.message ||
          `HTTP ${response.status}: ${response.statusText}`,
        response.status,
        responseData?.errors
      )
    }

    return responseData as T
  }
}

export const tenantApiClient = new TenantApiClient(TENANT_TOKEN_KEY)
export const tenantCustomerApiClient = new TenantApiClient(
  TENANT_CUSTOMER_TOKEN_KEY
)
