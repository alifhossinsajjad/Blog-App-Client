"use client";

import { Video, Image as ImageIcon, Smile } from "lucide-react";

export function CreatePost() {
  return (
    <div className="w-full max-w-2xl bg-white/80 dark:bg-[#18191A]/80 backdrop-blur-xl rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-zinc-200/50 dark:border-zinc-800/50 p-5 mb-6 group relative overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      <div className="flex gap-3 items-center mb-5 relative z-10">
        {/* Avatar Placeholder with Gradient Ring */}
        <div className="relative">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/50 to-primary/30 rounded-full blur opacity-20 group-hover:opacity-40 transition duration-300"></div>
          <div className="h-11 w-11 rounded-full bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900 flex-shrink-0 flex items-center justify-center overflow-hidden relative ring-2 ring-background">
              <span className="text-zinc-500 dark:text-zinc-400 font-semibold text-sm">You</span>
          </div>
        </div>
        
        {/* Input Trigger */}
        <div className="flex-1">
          <button className="w-full bg-zinc-100/80 dark:bg-[#242526]/80 hover:bg-zinc-200/80 dark:hover:bg-[#3A3B3C]/80 transition-all duration-200 text-left text-zinc-500 dark:text-zinc-400 rounded-full px-5 py-3 text-[15px] ring-1 ring-inset ring-zinc-200/50 dark:ring-white/5 hover:ring-primary/20 dark:hover:ring-primary/30">
            What's on your mind?
          </button>
        </div>
      </div>
      
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-zinc-200 dark:via-zinc-800 to-transparent mb-4 relative z-10" />
      
      <div className="flex justify-between items-center px-2 relative z-10">
        <button className="flex-1 flex justify-center items-center gap-2.5 hover:bg-red-500/10 dark:hover:bg-red-500/10 rounded-xl py-2.5 transition-colors group/btn">
          <Video className="w-5 h-5 text-red-500 group-hover/btn:scale-110 transition-transform" />
          <span className="text-[15px] font-medium text-zinc-600 dark:text-zinc-300 group-hover/btn:text-red-600 dark:group-hover/btn:text-red-400 transition-colors">Live video</span>
        </button>
        
        <button className="flex-1 flex justify-center items-center gap-2.5 hover:bg-green-500/10 dark:hover:bg-green-500/10 rounded-xl py-2.5 transition-colors group/btn">
          <ImageIcon className="w-5 h-5 text-green-500 group-hover/btn:scale-110 transition-transform" />
          <span className="text-[15px] font-medium text-zinc-600 dark:text-zinc-300 group-hover/btn:text-green-600 dark:group-hover/btn:text-green-400 transition-colors">Photo/video</span>
        </button>
        
        <button className="flex-1 hidden sm:flex justify-center items-center gap-2.5 hover:bg-yellow-500/10 dark:hover:bg-yellow-500/10 rounded-xl py-2.5 transition-colors group/btn">
          <Smile className="w-5 h-5 text-yellow-500 group-hover/btn:scale-110 transition-transform" />
          <span className="text-[15px] font-medium text-zinc-600 dark:text-zinc-300 group-hover/btn:text-yellow-600 dark:group-hover/btn:text-yellow-400 transition-colors">Feeling/activity</span>
        </button>
      </div>
    </div>
  );
}
