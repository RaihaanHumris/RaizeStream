"use client";

import React, { useState } from "react";
import { ThumbsUp, MessageSquare, Send, User } from "lucide-react";

interface Comment {
  id: string;
  author: string;
  avatar?: string;
  timeAgo: string;
  content: string;
  likes: number;
  isLiked?: boolean;
}

export default function CommentSection() {
  const [comments, setComments] = useState<Comment[]>([
    {
      id: "c1",
      author: "ShadowMonarch_99",
      timeAgo: "2 hours ago",
      content:
        "The animation in this episode is genuinely peak fiction! The transition from the sound effects to the visual climax gave me goosebumps.",
      likes: 42,
    },
    {
      id: "c2",
      author: "AkiraStudio",
      timeAgo: "5 hours ago",
      content:
        "Raize Stream's video player is so smooth and responsive! Can't wait for next week's continuation.",
      likes: 19,
    },
    {
      id: "c3",
      author: "Hana_Otaku",
      timeAgo: "1 day ago",
      content:
        "Did anyone else catch the easter egg at 14:20? Such great attention to the original source material!",
      likes: 8,
    },
  ]);

  const [newComment, setNewComment] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const added: Comment = {
      id: `c-${Date.now()}`,
      author: "You (Raihaan)",
      timeAgo: "Just now",
      content: newComment.trim(),
      likes: 0,
    };

    setComments([added, ...comments]);
    setNewComment("");
  };

  const toggleLike = (id: string) => {
    setComments((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const isLiked = !c.isLiked;
          return {
            ...c,
            isLiked,
            likes: isLiked ? c.likes + 1 : c.likes - 1,
          };
        }
        return c;
      })
    );
  };

  return (
    <div className="w-full space-y-6 pt-8 border-t border-outline/60">
      <div className="flex items-center justify-between">
        <h3 className="font-outfit font-bold text-xl text-white">
          Comments ({comments.length})
        </h3>
        <span className="text-xs text-soft-gray">Be respectful and spoiler-free</span>
      </div>

      {/* New Comment Input */}
      <form onSubmit={handleSubmit} className="flex gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-brand flex items-center justify-center shrink-0 shadow-glow-purple">
          <User className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Share your thoughts about this episode..."
            className="flex-1 h-11 px-4 rounded-md bg-slate-night/80 border border-outline text-sm text-white placeholder-muted focus:outline-none focus:border-electric-purple focus:ring-1 focus:ring-electric-purple transition-all"
          />
          <button
            type="submit"
            disabled={!newComment.trim()}
            className="h-11 px-5 rounded-md bg-gradient-brand text-white font-poppins font-semibold text-xs flex items-center gap-1.5 shadow-glow-purple disabled:opacity-40 disabled:cursor-not-allowed hover:scale-102 active:scale-95 transition-all"
          >
            <Send className="w-3.5 h-3.5" /> Post
          </button>
        </div>
      </form>

      {/* Comment List */}
      <div className="space-y-4">
        {comments.map((comment) => (
          <div
            key={comment.id}
            className="p-4 rounded-md bg-deep-navy/40 border border-outline/50 space-y-2.5 transition-colors hover:border-outline"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-slate-night border border-electric-purple/40 flex items-center justify-center text-xs font-bold text-electric-purple">
                  {comment.author.charAt(0)}
                </div>
                <div>
                  <span className="font-poppins font-semibold text-sm text-white block">
                    {comment.author}
                  </span>
                  <span className="text-[11px] text-muted">{comment.timeAgo}</span>
                </div>
              </div>
            </div>

            <p className="font-inter text-sm text-soft-gray leading-relaxed pl-10">
              {comment.content}
            </p>

            <div className="flex items-center gap-4 pl-10 pt-1 text-xs text-soft-gray">
              <button
                onClick={() => toggleLike(comment.id)}
                className={`flex items-center gap-1.5 transition-colors ${
                  comment.isLiked ? "text-neon-pink font-semibold" : "hover:text-white"
                }`}
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                <span>{comment.likes}</span>
              </button>

              <button className="flex items-center gap-1.5 hover:text-electric-purple transition-colors">
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Reply</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
