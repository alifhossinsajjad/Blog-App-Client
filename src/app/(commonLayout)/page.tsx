"use client";

import { CreatePost } from "@/components/modules/posts/CreatePost";
import { PostsFeed } from "@/components/modules/posts/PostsFeed";
import { useGetAllPostsQuery } from "@/redux/features/posts/postsApi";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center bg-zinc-100 font-sans dark:bg-zinc-950 min-h-screen pt-6 px-4">
      <div className="w-full max-w-2xl mx-auto">
        <CreatePost />
        <PostsFeed useQueryHook={useGetAllPostsQuery} />
      </div>
    </div>
  );
}
