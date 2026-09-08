"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, ImagePlus, X } from "lucide-react";
import { useUpdatePostMutation } from "@/redux/features/posts/postsApi";
import { toast } from "sonner";

interface EditPostFormValues {
  title: string;
  content: string;
  tags: string;
}

export const EditPostModal = ({
  post,
  isOpen,
  onClose,
}: {
  post: any;
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [updatePost, { isLoading }] = useUpdatePostMutation();
  const [imagePreview, setImagePreview] = useState<string | null>(post.thumbnail || null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<EditPostFormValues>();

  useEffect(() => {
    if (isOpen) {
      reset({
        title: post.title,
        content: post.content,
        tags: post.tags?.join(", ") || "",
      });
      setImagePreview(post.thumbnail || null);
      setImageFile(null);
    }
  }, [isOpen, post, reset]);

  const onSubmit = async (data: EditPostFormValues) => {
    try {
      const formData = new FormData();
      formData.append(
        "data",
        JSON.stringify({
          title: data.title,
          content: data.content,
          tags: data.tags ? data.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
        })
      );
      if (imageFile) {
        formData.append("file", imageFile);
      }

      await updatePost({ id: post.id, formData }).unwrap();
      toast.success("Post updated successfully!");
      onClose();
    } catch (error) {
      toast.error("Failed to update post.");
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
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg dark:bg-[#242526] border-none shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold dark:text-zinc-100">
            Edit Post
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <div>
            <Input
              placeholder="Title"
              className="bg-zinc-100 dark:bg-[#3A3B3C] border-none focus-visible:ring-1 focus-visible:ring-blue-500"
              {...register("title", { required: "Title is required" })}
            />
            {errors.title && <span className="text-red-500 text-xs">{errors.title.message}</span>}
          </div>

          <div>
            <Textarea
              placeholder="Content"
              className="bg-zinc-100 dark:bg-[#3A3B3C] border-none focus-visible:ring-1 focus-visible:ring-blue-500 min-h-[100px] resize-none"
              {...register("content", { required: "Content is required" })}
            />
            {errors.content && <span className="text-red-500 text-xs">{errors.content.message}</span>}
          </div>

          <div>
            <Input
              placeholder="Tags (comma separated)"
              className="bg-zinc-100 dark:bg-[#3A3B3C] border-none focus-visible:ring-1 focus-visible:ring-blue-500 text-sm"
              {...register("tags")}
            />
          </div>

          {imagePreview && (
            <div className="relative rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-700">
              <img src={imagePreview} alt="Preview" className="w-full max-h-60 object-cover" />
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

          <div className="flex items-center justify-between pt-2">
            <label className="flex items-center gap-2 px-3 py-2 hover:bg-zinc-100 dark:hover:bg-[#3A3B3C] rounded-md cursor-pointer transition-colors text-zinc-600 dark:text-[#B0B3B8]">
              <ImagePlus className="w-5 h-5 text-green-500" />
              <span className="text-sm font-medium">Add Photo</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>
            <Button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700 text-white px-8">
              {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              Save
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
