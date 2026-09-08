import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL, // Used env file config
    credentials: "include", // Send cookies with requests to the backend
  }),
  tagTypes: ["User", "Post"], // Add tag types for cache invalidation here
  endpoints: () => ({}), // Endpoints will be injected from specific feature files
});
