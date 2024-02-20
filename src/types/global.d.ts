export type UserCredential = {
  userId?: number
  userName: string | null
  password: string | null
  isAutoCheckIn: boolean
  isAutoCheckOut: boolean
  isAutoConfirmWorkingTime: boolean
  accessToken?: string | null
  accessKintaiToken?: string | null
  isCheckedIn?: boolean
  isCheckedOut?: boolean
  checkedInDatetime?: string
  checkedOutDatetime?: string
}

// APIs
export type RequestParam = Record<string, any>
export type PageInstance = {
  axios: AxiosInstance
}
export type ApiResponse = {
  success: boolean
  data: any | null
}

declare global {
  interface Window {
    chrome: any
  }
}
