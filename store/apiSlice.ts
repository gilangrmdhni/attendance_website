// // store/apiSlice.ts
// import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// export const apiSlice = createApi({
//   reducerPath: 'api',
//   baseQuery: fetchBaseQuery({ baseUrl: '/api/' }),
//   endpoints: (builder) => ({
//     fetchUser: builder.query<User, number>({
//       query: (id) => `user`,
//     }),
//   }),
// });

// export const { useFetchUserQuery } = apiSlice;



// tidak terpakai, projek ini menggunakan axiosinstance