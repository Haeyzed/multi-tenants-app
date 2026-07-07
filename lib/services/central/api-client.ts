class ApiClient {
  private readonly baseURL: string
  private token: string | null = null

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_CENTRAL_API_URL || ""
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("token")
    }
  }

  public setToken(token: string | null) {
    this.token = token
    if (token) {
      localStorage.setItem("token", token)
    } else {
      localStorage.removeItem("token")
    }
  }

  public getToken(): string | null {
    return this.token
  }

  public get<T>(path: string, params?: Record<string, any>): Promise<T> {
    return this.request<T>("GET", path, undefined, params)
  }

  public post<T>(path: string, body: unknown): Promise<T> {
    return this.request<T>("POST", path, body)
  }

  public put<T>(path: string, body: unknown): Promise<T> {
    return this.request<T>("PUT", path, body)
  }

  public patch<T>(path: string, body: unknown): Promise<T> {
    return this.request<T>("PATCH", path, body)
  }

  public delete<T>(path: string, body?: unknown): Promise<T> {
    return this.request<T>("DELETE", path, body)
  }

  /**
   * POST export request and trigger browser download from Laravel Excel response.
   */
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

    const response = await fetch(`${this.baseURL}${path}`, {
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
      ) ??
      options?.defaultFilename ??
      "export.xlsx"

    triggerBrowserDownload(blob, filename)
    return filename
  }

  /**
   * GET file download (import samples, etc.).
   */
  public async getFileDownload(
    path: string,
    params?: Record<string, string | undefined>,
    defaultFilename = "download.xlsx"
  ): Promise<string> {
    const headers: HeadersInit = {
      Accept:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, text/csv, application/octet-stream",
    }

    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`
    }

    let url = `${this.baseURL}${path}`
    if (params) {
      const filteredParams = Object.fromEntries(
        Object.entries(params).filter(([, value]) => value !== undefined)
      ) as Record<string, string>
      const query = new URLSearchParams(filteredParams).toString()
      if (query) url += `?${query}`
    }

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

    const response = await fetch(`${this.baseURL}${path}`, {
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

  private async request<T>(
    method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH",
    path: string,
    body?: unknown,
    params?: Record<string, any>
  ): Promise<T> {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      Accept: "application/json",
    }

    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`
    }

    let url = `${this.baseURL}${path}`
    if (params) {
      const filteredParams = Object.fromEntries(
        Object.entries(params).filter(([, v]) => v !== undefined && v !== null)
      )
      const query = new URLSearchParams(filteredParams).toString()
      if (query) url += `?${query}`
    }

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

    // Return the FULL response body (including success, message, data, meta)
    return responseData as T
  }
}

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

export const apiClient = new ApiClient()
