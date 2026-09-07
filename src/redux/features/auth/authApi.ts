import { baseApi } from "../../api/baseApi";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    registerUser: builder.mutation({
      query: (userData) => ({
        url: "/auth/register",
        method: "POST",
        body: userData,
      }),
    }),
    signIn: builder.mutation({
      query: (credentials) => ({
        url: "/auth/sign-in/email",
        method: "POST",
        body: credentials,
      }),
    }),
    verifyEmail: builder.mutation({
      query: (token) => ({
        url: "/auth/verify-email", // Replace with your actual verify email backend endpoint
        method: "POST",
        body: { token },
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useRegisterUserMutation, useSignInMutation, useVerifyEmailMutation } = authApi;
