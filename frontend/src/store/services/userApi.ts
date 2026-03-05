import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export interface User {
  id: number
  name: string
  email: string
  created_at?: string
  updated_at?: string
}

export interface CreateUserRequest {
  name: string
  email: string
}

export interface UpdateUserRequest {
  id: number
  name: string
  email: string
}

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3001/api' }),
  tagTypes: ['User'],
  endpoints: (builder) => ({
    // generates a Query Hook
    getUsers: builder.query<User[], void>({
      query: () => '/users',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'User' as const, id })),
              { type: 'User', id: 'LIST' },
            ]
          : [{ type: 'User', id: 'LIST' }],
    }),
    getUserById: builder.query<User, number>({
      query: (id) => `/users/${id}`,
      providesTags: (result, error, id) => [{ type: 'User', id }],
    }),
    // generates a Mutation Hook
    createUser: builder.mutation<User, CreateUserRequest>({
      query: (body) => ({
        url: '/users',
        method: 'POST',
        body,
      }),
      // A mutation (like createUser) "invalidates" that same tag.
      // As soon as the mutation succeeds, RTK Query sees that the 'User' tag is dirty and automatically 
      // triggers a refetch of all active queries providing that tag.

      // just want to refresh a list or cache that isn’t tied to a specific resource
      invalidatesTags: [{ type: 'User', id: 'LIST' }],
    }),
    deleteUser: builder.mutation<void, number>({
      query: (id) => ({
        url: `/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'User', id },
        { type: 'User', id: 'LIST' },
      ],
    }),
    updateUser: builder.mutation<User, UpdateUserRequest>({
      query: ({id, ...body}) => ({
        url: `/users/${id}`,
        method: 'PUT',
        body,
      }),
      // invalidate specific cache entries
      invalidatesTags: (result, error, {id}) => [
        { type: 'User', id },
        { type: 'User', id: 'LIST' },
      ],
    })
  }),
})

export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useCreateUserMutation,
  useDeleteUserMutation,
  useUpdateUserMutation
} = userApi
