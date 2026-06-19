"use client";

import { useState, useTransition } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

interface LikeButtonProps {
    postId: string;
    initialLikes: number;
    isInitiallyLiked: boolean;
}

export default function LikeButton({ postId, initialLikes, isInitiallyLiked }: LikeButtonProps) {
    const toggleLikeMutation = useMutation(api.posts.toggleLike);

    const [likesCount, setLikesCount] = useState(initialLikes);
    const [isLiked, setIsLiked] = useState(isInitiallyLiked);
    const [isPending, startTransition] = useTransition();

    const handleLike = () => {
        setIsLiked(!isLiked);
        setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));

        startTransition(async () => {
            try {
                await toggleLikeMutation({
                    postId: postId as Id<"posts">
                });
            } catch (error) {
                setIsLiked(isLiked);
                setLikesCount(initialLikes);
                console.error("حدث خطأ أثناء تحديث الإعجاب:", error);
            }
        });
    };

    return (
        <button
            onClick={handleLike}
            disabled={isPending}
            className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition-all active:scale-95 ${isLiked
                ? "bg-red-50 text-red-500 border-red-200"
                : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
                }`}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill={isLiked ? "currentColor" : "none"}
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className={`w-5 h-5 transition-transform ${isLiked ? "scale-110" : ""}`}
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                />
            </svg>

            <span>{likesCount}</span>
        </button>
    );
}