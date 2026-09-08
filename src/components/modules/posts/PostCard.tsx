import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { EditPostModal } from "./EditPostModal";
import { useDeletePostMutation } from "@/redux/features/posts/postsApi";
import { toast } from "sonner";
import { useAppSelector } from "@/redux/hooks";

export const PostCard = ({ post }: { post: any }) => {
  const user = useAppSelector((state) => state.auth.user);
  const [deletePost] = useDeletePostMutation();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const isAuthor = user?.id === post.authorId || user?.email === post.author?.email;

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this post?")) {
      try {
        await deletePost(post.id).unwrap();
        toast.success("Post deleted successfully");
      } catch (error) {
        toast.error("Failed to delete post");
        console.error(error);
      }
    }
  };

  const formattedDate = new Date(post.createdAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
  });

  return (
    <>
      <Card className="w-full max-w-2xl mx-auto mb-4 dark:bg-[#242526] border-zinc-200 dark:border-none shadow-sm rounded-lg overflow-hidden">
        <CardHeader className="p-4 pb-2 flex flex-row items-start justify-between space-y-0">
          <div className="flex gap-3 items-center">
            <Avatar className="w-10 h-10 border border-zinc-200 dark:border-zinc-700">
              <AvatarImage src={post.author?.image || undefined} />
              <AvatarFallback>{post.author?.name?.charAt(0) || "U"}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-sm text-zinc-900 dark:text-zinc-100 hover:underline cursor-pointer">
                {post.author?.name}
              </p>
              <p className="text-xs text-zinc-500 dark:text-[#B0B3B8]">{formattedDate}</p>
            </div>
          </div>

          {isAuthor && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-zinc-500 hover:bg-zinc-100 dark:hover:bg-[#3A3B3C]">
                  <MoreHorizontal className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-32 dark:bg-[#242526] border-zinc-200 dark:border-zinc-700">
                <DropdownMenuItem
                  onClick={() => setIsEditModalOpen(true)}
                  className="cursor-pointer gap-2"
                >
                  <Pencil className="w-4 h-4" /> Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleDelete}
                  className="cursor-pointer text-red-500 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-500/10 gap-2"
                >
                  <Trash2 className="w-4 h-4" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </CardHeader>
        <CardContent className="p-4 pt-2 space-y-3">
          <h3 className="font-bold text-lg leading-tight text-zinc-900 dark:text-zinc-100">{post.title}</h3>
          <p className="text-sm text-zinc-800 dark:text-zinc-300 whitespace-pre-wrap">{post.content}</p>

          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {post.tags.map((tag: string) => (
                <span key={tag} className="text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 px-2 py-1 rounded-md">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </CardContent>

        {post.thumbnail && (
          <div className="w-full bg-zinc-100 dark:bg-[#18191A] flex justify-center border-t border-zinc-200 dark:border-zinc-800">
            <img
              src={post.thumbnail}
              alt="Post thumbnail"
              className="max-h-[500px] object-contain w-full"
            />
          </div>
        )}
      </Card>

      <EditPostModal
        post={post}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />
    </>
  );
};
