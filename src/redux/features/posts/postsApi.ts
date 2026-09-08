import { baseApi } from "../../api/baseApi";

export const postsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createPost: builder.mutation({
      query: (formData) => ({
        url: "/posts",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Post"],
    }),
    getAllPosts: builder.query({
      query: (args) => {
        const params = new URLSearchParams();
        if (args?.cursor) params.append("cursor", args.cursor);
        if (args?.limit) params.append("limit", args.limit.toString());

        return {
          url: `/posts?${params.toString()}`,
          method: "GET",
        };
      },
      // Cache management will be handled by the infinite scroll component using `merge` or manual cache updates, 
      // but for simple cases we just provide the tag.
      providesTags: ["Post"],
    }),
    getMyPosts: builder.query({
      query: (args) => {
        const params = new URLSearchParams();
        if (args?.cursor) params.append("cursor", args.cursor);
        if (args?.limit) params.append("limit", args.limit.toString());

        return {
          url: `/posts/my-posts?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["Post"],
    }),
    updatePost: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/posts/${id}`,
        method: "PATCH",
        body: formData,
      }),
      invalidatesTags: ["Post"],
    }),
    deletePost: builder.mutation({
      query: (id) => ({
        url: `/posts/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Post"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useCreatePostMutation,
  useGetAllPostsQuery,
  useGetMyPostsQuery,
  useUpdatePostMutation,
  useDeletePostMutation,
} = postsApi;
