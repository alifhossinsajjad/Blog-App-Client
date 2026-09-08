"use client";

import { useEffect, useState, useCallback } from "react";
import { useInView } from "react-intersection-observer";
import { PostCard } from "./PostCard";
import { Loader2 } from "lucide-react";

interface PostsFeedProps {
  useQueryHook: any; // e.g., useGetAllPostsQuery or useGetMyPostsQuery
}

export const PostsFeed = ({ useQueryHook }: PostsFeedProps) => {
  const [cursor, setCursor] = useState<string | null>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(true);

  const { data, isFetching, error, refetch } = useQueryHook(
    { cursor, limit: 10 },
    {
      // We don't skip the query, we want it to run when cursor changes
    }
  );

  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: "200px",
  });

  // Since RTK Query cache invalidation (like creating a new post) will trigger a refetch,
  // we might get the *same* cursor data again if we aren't careful, but since we want the feed
  // to update, it's often easier to let RTK Query merge the cache, OR just reset when refetching.
  // For this simple implementation, we append data.
  
  useEffect(() => {
    if (data?.data) {
      if (!cursor) {
        // First page or refetch
        setPosts(data.data);
      } else {
        // Appending new page
        setPosts((prev) => {
          // Prevent duplicates
          const newPosts = data.data.filter(
            (newPost: any) => !prev.some((p: any) => p.id === newPost.id)
          );
          return [...prev, ...newPosts];
        });
      }
      
      setHasMore(data.meta?.nextCursor !== null);
    }
  }, [data, cursor]);

  const loadMore = useCallback(() => {
    if (!isFetching && hasMore && data?.meta?.nextCursor) {
      setCursor(data.meta.nextCursor);
    }
  }, [isFetching, hasMore, data]);

  useEffect(() => {
    if (inView) {
      loadMore();
    }
  }, [inView, loadMore]);

  if (error) {
    return (
      <div className="text-center p-4 text-red-500">
        Failed to load posts.
        <button onClick={() => refetch()} className="ml-2 underline text-blue-500">
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto pb-20">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}

      {/* Infinite Scroll trigger element */}
      <div ref={ref} className="h-10 flex items-center justify-center mt-4">
        {isFetching && (
          <Loader2 className="w-6 h-6 animate-spin text-zinc-500" />
        )}
        {!isFetching && !hasMore && posts.length > 0 && (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            No more posts to show.
          </p>
        )}
        {!isFetching && posts.length === 0 && (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            No posts found.
          </p>
        )}
      </div>
    </div>
  );
};
