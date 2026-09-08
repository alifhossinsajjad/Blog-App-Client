"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { ImagePlus, Loader2, X } from "lucide-react";
import { useCreatePostMutation } from "@/redux/features/posts/postsApi";
import { toast } from "sonner";
import { useAppSelector } from "@/redux/hooks";

interface CreatePostFormValues {
  title: string;
  content: string;
  tags: string;
}

export const CreatePost = () => {
  const user = useAppSelector((state) => state.auth.user);
  const [createPost, { isLoading }] = useCreatePostMutation();
  const [isExpanded, setIsExpanded] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CreatePostFormValues>();

  const onSubmit = async (data: CreatePostFormValues) => {
    try {
      const formData = new FormData();
      formData.append("data", JSON.stringify({
        title: data.title,
        content: data.content,
        tags: data.tags ? data.tags.split(",").map(t => t.trim()).filter(Boolean) : [],
      }));
      if (imageFile) {
        formData.append("file", imageFile);
      }

      await createPost(formData).unwrap();
      toast.success("Post created successfully!");
      reset();
      setImagePreview(null);
      setImageFile(null);
      setIsExpanded(false);
    } catch (error) {
      toast.error("Failed to create post.");
      console.error(error);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto mb-6 dark:bg-[#242526] border-zinc-200 dark:border-none shadow-sm">
      <CardContent className="p-4">
        <div className="flex gap-3">
          <Avatar className="w-10 h-10">
            <AvatarImage src={user?.image || undefined} />
            <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            {!isExpanded ? (
              <div
                onClick={() => setIsExpanded(true)}
                className="w-full bg-zinc-100 dark:bg-[#3A3B3C] hover:bg-zinc-200 dark:hover:bg-[#4E4F50] transition-colors rounded-full px-4 py-2.5 text-zinc-500 dark:text-[#B0B3B8] cursor-text text-sm"
              >
                What's on your mind, {user?.name?.split(' ')[0] || "User"}?
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Input
                  placeholder="Post Title"
                  className="w-full border-none shadow-none focus-visible:ring-0 px-0 text-lg font-semibold bg-transparent"
                  {...register("title", { required: "Title is required" })}
                />
                {errors.title && <span className="text-red-500 text-xs">{errors.title.message}</span>}
                
                <Textarea
                  placeholder={`What's on your mind, ${user?.name?.split(' ')[0] || "User"}?`}
                  className="w-full border-none shadow-none focus-visible:ring-0 resize-none min-h-[100px] px-0 bg-transparent text-lg"
                  {...register("content", { required: "Content is required" })}
                />
                {errors.content && <span className="text-red-500 text-xs">{errors.content.message}</span>}

                <Input
                  placeholder="Tags (comma separated)"
                  className="w-full border-none shadow-none focus-visible:ring-0 px-0 bg-transparent text-sm text-zinc-500"
                  {...register("tags")}
                />

                {imagePreview && (
                  <div className="relative rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-700">
                    <img src={imagePreview} alt="Preview" className="w-full max-h-96 object-cover" />
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview(null);
                        setImageFile(null);
                      }}
                      className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 backdrop-blur-sm"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                )}

                <div className="flex items-center justify-between border-t border-zinc-200 dark:border-[#3E4042] pt-3">
                  <div className="flex gap-2">
                    <label className="flex items-center gap-2 px-3 py-2 hover:bg-zinc-100 dark:hover:bg-[#3A3B3C] rounded-md cursor-pointer transition-colors text-zinc-600 dark:text-[#B0B3B8]">
                      <ImagePlus className="w-5 h-5 text-green-500" />
                      <span className="text-sm font-medium">Photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                      />
                    </label>
                  </div>
                  <div className="flex gap-2">
                    <Button type="button" variant="ghost" onClick={() => setIsExpanded(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700 text-white">
                      {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                      Post
                    </Button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
