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

export type StoreItemType = {
  id: number;
  name: string;
  description: string;
  email: string;
  address: string;
  phone: string;
}

function getConnectedStoresFromStorage() {
  const connectedStoreJSON = window.localStorage.getItem('shopping-cart');
  let connectedStore = {} as any

  if (connectedStoreJSON) {
    connectedStore = JSON.parse(connectedStoreJSON)
  }
  return connectedStore
}

export default class API {
  static signUp(formValues: SignUpFormValues): Promise<APIResponse<any>> {
    return BaseAPI.post('/sign-up', formValues)
  }

  static login(username: string, password: string): Promise<APIResponse<UserType>> {
    return BaseAPI.post('/login', { username, password })
  }

  static getStore(): Promise<APIResponse<StoreItemType[]>> {
    return BaseAPI.get("/Stores");
  }

  static getConnectedStore(userId: string): Promise<APIResponse<number[]>> {
    let connectedStore = getConnectedStoresFromStorage()
    return new Promise((resolve) => {
      setTimeout(resolve, 1500, {
        data: connectedStore[userId] || [],
        status: 'success'
      })
    })
  }

  static connectToStore(userId: string, storeId: number): Promise<APIResponse<number[]>> {
    const connectedStoreJSON = window.localStorage.getItem('shopping-cart');
    let connectedStore = {} as any

    if (connectedStoreJSON) {
      connectedStore = JSON.parse(connectedStoreJSON)
    }

    connectedStore[userId] = connectedStore[userId] || [];
    connectedStore[userId].push(storeId);
    window.localStorage.setItem('shopping-cart', JSON.stringify(connectedStore))

    return new Promise((resolve) => {
      setTimeout(resolve, 1500, {
        data: connectedStore[userId],
        status: 'success'
      })
    })
  }

  static disconnectFromStore(userId?: string, storeId?: number): Promise<APIResponse<number[]>> {
    if (!userId || !storeId) {
      return Promise.resolve({ status: "error" })
    }
    let connectedStore = getConnectedStoresFromStorage()

    connectedStore[userId] = connectedStore[userId] || [];
    connectedStore[userId].splice(connectedStore[userId].indexOf(storeId), 1);
    window.localStorage.setItem('shopping-cart', JSON.stringify(connectedStore))

    return new Promise((resolve) => {
      setTimeout(resolve, 1500, {
        data: connectedStore[userId],
        status: 'success'
      })
    })
  }
}