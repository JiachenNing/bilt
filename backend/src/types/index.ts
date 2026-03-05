export interface User {
  id: number
  name: string
  email: string
  created_at?: string
  updated_at?: string
}

export interface CreateUserInput {
  name: string
  email: string
}

export interface UpdateUserInput {
  id: number
  name: string
  email: string
}