export interface User {
  email: string,
  password: string
}
export interface DataAuth {
  token: string,
  role: string
}
export interface UserRegister {
  first_name: string,
  email: string,
  password: string
}
export interface UserFullDate {
  id: number,
  email: string,
  first_name: string,
  role: string,
  is_active: boolean
}
export interface UserUpdate {
  email: string,
  first_name: string,
  role: string,
  password: string
}
export interface UserWithRole {
  first_name: string,
  email: string,
  password: string,
  role: string
}
