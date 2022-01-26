import { SignUpFormValues } from "../components/signUpForm"
import { BaseAPI } from './baseApi'

type APIResponse<T> = {
  data?: T,
  status: string,
  message?: string
}

export type UserType = {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
}

export type CategoryType = {
  id: number;
  items: [];
  name: string;
  description: string;
  email: string;
  address: string;
  phone: string;
}

export type ProductType = {
  id: number;
  name: string;
  price: number;
}

function getConnectedProductsFromStorage() {
  const connectedProductJSON = window.localStorage.getItem('shopping-cart');
  let connectedProduct = {} as any

  if (connectedProductJSON) {
    connectedProduct = JSON.parse(connectedProductJSON)
  }
  return connectedProduct
}

export default class API {
  static signUp(formValues: SignUpFormValues): Promise<APIResponse<any>> {
    return BaseAPI.post('/sign-up', formValues)
  }

  static login(username: string, password: string): Promise<APIResponse<UserType>> {
    return BaseAPI.post('/login', { username, password })
  }

  static getCategory(): Promise<APIResponse<CategoryType[]>> {
    return BaseAPI.get("/shopzone");
  }

  static getProducts(): Promise<APIResponse<ProductType[]>> {
    return BaseAPI.get("/shopzone");
  }

  static getConnectedProduct(userId: string): Promise<APIResponse<number[]>> {
    let connectedProduct = getConnectedProductsFromStorage()
    return new Promise((resolve) => {
      setTimeout(resolve, 1500, {
        data: connectedProduct[userId] || [],
        status: 'success'
      })
    })
  }

  static connectToProduct(userId: string, productId: number): Promise<APIResponse<number[]>> {
    const connectedProductJSON = window.localStorage.getItem('shopping-cart');
    let connectedProduct = {} as any

    if (connectedProductJSON) {
      connectedProduct = JSON.parse(connectedProductJSON)
    }

    connectedProduct[userId] = connectedProduct[userId] || [];
    connectedProduct[userId].push(productId);
    window.localStorage.setItem('shopping-cart', JSON.stringify(connectedProduct))

    return new Promise((resolve) => {
      setTimeout(resolve, 1500, {
        data: connectedProduct[userId],
        status: 'success'
      })
    })
  }

  static disconnectFromProduct(userId?: string, ProductId?: number): Promise<APIResponse<number[]>> {
    if (!userId || !ProductId) {
      return Promise.resolve({ status: "error" })
    }
    let connectedProduct = getConnectedProductsFromStorage()

    connectedProduct[userId] = connectedProduct[userId] || [];
    connectedProduct[userId].splice(connectedProduct[userId].indexOf(ProductId), 1);
    window.localStorage.setItem('shopping-cart', JSON.stringify(connectedProduct))

    return new Promise((resolve) => {
      setTimeout(resolve, 1500, {
        data: connectedProduct[userId],
        status: 'success'
      })
    })
  }

  static getUsersCart(userId: string) {
    return BaseAPI.get(`/users/cart/${userId}`)
  }

  static addToUsersCart(userId: string, productId: number) {
    return BaseAPI.post(`/users/cart/${userId}/${productId}`)
  }

  static removeFromUsersCart(userId: string, productId: number) {
    return BaseAPI.delete(`/users/cart/${userId}/${productId}`)
  }
}