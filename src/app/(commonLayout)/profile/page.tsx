"use client";

import { CreatePost } from "@/components/modules/posts/CreatePost";
import { PostsFeed } from "@/components/modules/posts/PostsFeed";
import { useGetMyPostsQuery } from "@/redux/features/posts/postsApi";
import { useAppSelector } from "@/redux/hooks";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

export default function Profile() {
  const user = useAppSelector((state) => state.auth.user);

  return (
    <div className="flex flex-col flex-1 items-center bg-zinc-100 font-sans dark:bg-zinc-950 min-h-screen pt-6 px-4">
      <div className="w-full max-w-2xl mx-auto">
        <Card className="mb-6 border-zinc-200 shadow-sm dark:border-none dark:bg-[#242526]">
          <CardContent className="p-6 flex flex-col items-center">
            <Avatar className="w-24 h-24 mb-4 border-2 border-white shadow-md">
              <AvatarImage src={user?.image || undefined} />
              <AvatarFallback className="text-2xl">{user?.name?.charAt(0) || "U"}</AvatarFallback>
            </Avatar>
            <h2 className="text-2xl font-bold dark:text-zinc-100">{user?.name}</h2>
            <p className="text-zinc-500 dark:text-[#B0B3B8]">{user?.email}</p>
          </CardContent>
        </Card>

        <CreatePost />
        <PostsFeed useQueryHook={useGetMyPostsQuery} />
      </div>
    </div>
  );
}
