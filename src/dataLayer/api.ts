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

export type CompanyType = {
  id: number;
  name: string;
  description: string;
  email: string;
  address: string;
  phone: string;
}

function getConnectedCompaniesFromStorage() {
  const connectedCompaniesJSON = window.localStorage.getItem('connected-companies');
  let connectedCompanies = {} as any

  if (connectedCompaniesJSON) {
    connectedCompanies = JSON.parse(connectedCompaniesJSON)
  }
  return connectedCompanies
}

export default class API {
  static async signUp(formValues: SignUpFormValues): Promise<APIResponse<any>> {
    return BaseAPI.post('/signup', formValues)
  }

  static async login(username: string, password: string): Promise<APIResponse<UserType>> {
    return BaseAPI.post('/login', { username, password })
  }

  static getCompanies(): Promise<APIResponse<CompanyType[]>> {
    return BaseAPI.get("/companies");
  }

  static getConnectedCompanies(userId: string): Promise<APIResponse<number[]>> {
    let connectedCompanies = getConnectedCompaniesFromStorage()
    return new Promise((resolve) => {
      setTimeout(resolve, 1500, {
        data: connectedCompanies[userId] || [],
        status: 'success'
      })
    })
  }

  static connectToCompany(userId: string, companyId: number): Promise<APIResponse<number[]>> {
    const connectedCompaniesJSON = window.localStorage.getItem('connected-companies');
    let connectedCompanies = {} as any

    if (connectedCompaniesJSON) {
      connectedCompanies = JSON.parse(connectedCompaniesJSON)
    }

    connectedCompanies[userId] = connectedCompanies[userId] || [];
    connectedCompanies[userId].push(companyId);
    window.localStorage.setItem('connected-companies', JSON.stringify(connectedCompanies))

    return new Promise((resolve) => {
      setTimeout(resolve, 1500, {
        data: connectedCompanies[userId],
        status: 'success'
      })
    })
  }

  static disconnectFromCompany(userId?: string, companyId?: number): Promise<APIResponse<number[]>> {
    if (!userId || !companyId) {
      return Promise.resolve({ status: "error" })
    }
    let connectedCompanies = getConnectedCompaniesFromStorage()

    connectedCompanies[userId] = connectedCompanies[userId] || [];
    connectedCompanies[userId].splice(connectedCompanies[userId].indexOf(companyId), 1);
    window.localStorage.setItem('connected-companies', JSON.stringify(connectedCompanies))

    return new Promise((resolve) => {
      setTimeout(resolve, 1500, {
        data: connectedCompanies[userId],
        status: 'success'
      })
    })
  }
}