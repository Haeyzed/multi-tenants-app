const api = {
  async get<T>(path: string): Promise<T> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_CENTRAL_API_URL}${path}`, {
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.data;
  },

  async post<T>(path: string, body: unknown): Promise<T> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_CENTRAL_API_URL}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.data;
  },

  async put<T>(path: string, body: unknown): Promise<T> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_CENTRAL_API_URL}${path}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.data;
  },

  async delete<T>(path: string): Promise<T> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_CENTRAL_API_URL}${path}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.data;
  },
};

export const apiClient = api;