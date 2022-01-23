export class BaseAPI {
  static baseURL = "http://localhost:8080"
  static get(path: string) {
    return fetch(`${BaseAPI.baseURL}${path}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    }).then((r: any) => r.json())
  }

  static post<T>(path: string, body?: T) {
    return fetch(`${BaseAPI.baseURL}${path}`, {
      method: "POST",
      body: body ? JSON.stringify(body) : "",
      headers: {
        "Content-Type": "application/json"
      }
    }).then((r: any) => r.json())
  }

  static patch<T>(path: string, body?: T) {
    return fetch(`${BaseAPI.baseURL}${path}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      }
    }).then((r: any) => r.json())
  }

  static put<T>(path: string, body?: T) {
    return fetch(`${BaseAPI.baseURL}${path}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      }
    }).then((r: any) => r.json())
  }

  static delete<T>(path: string, body?: T) {
    return fetch(`${BaseAPI.baseURL}${path}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      }
    }).then((r: any) => r.json())
  }
}