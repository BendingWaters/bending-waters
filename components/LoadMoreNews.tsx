"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { fetchMorePosts } from "@/app/actions";
import { Post } from "@/types";
import { Loader2 } from "lucide-react";

interface LoadMoreNewsProps {
    searchParams?: {
        search?: string;
        category?: string;
        tag?: string;
    };
    initialOffset: number;
}

const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

export default function LoadMoreNews({
    searchParams,
    initialOffset,
}: LoadMoreNewsProps) {
    const [posts, setPosts] = useState<Post[]>([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const observerRef = useRef<IntersectionObserver | null>(null);
    const [buttonRefState, setButtonRefState] = useState<HTMLButtonElement | null>(null);

    const loadMorePosts = useCallback(async () => {
        if (loading || !hasMore) return;
        setLoading(true);

        // items to fetch per request
        const limit = 12;
        const start = initialOffset + (page - 1) * limit;
        const end = start + limit;

        try {
            const data = await fetchMorePosts(start, end, searchParams);
            if (data && data.length > 0) {
                setPosts((prev) => [...prev, ...data]);
                setPage((prev) => prev + 1);
                if (data.length < limit) {
                    setHasMore(false);
                }
            } else {
                setHasMore(false);
            }
        } catch (error) {
            console.error("Error fetching more posts:", error);
        } finally {
            setLoading(false);
        }
    }, [loading, hasMore, initialOffset, page, searchParams]);

    useEffect(() => {
        if (loading || !hasMore) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    loadMorePosts();
                }
            },
            { threshold: 0.1, rootMargin: "200px" }
        );

        if (buttonRefState) {
            observer.observe(buttonRefState);
        }

        observerRef.current = observer;

        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, [buttonRefState, loadMorePosts, loading, hasMore]);

    return (
        <>
            {posts.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {posts.map((post, index) => {
                        const {
                            _id,
                            title,
                            slug,
                            thumbnail,
                            mainImage,
                            publishedAt,
                            category,
                        } = post;
                        const image = thumbnail || mainImage;
                        const num = String(initialOffset + index + 1).padStart(2, "0");

                        return (
                            <Link
                                key={_id + index}
                                href={`/blog/${slug?.current}`}
                                className="group flex flex-col border-b border-r border-[#1a1a1a] [&:nth-child(3n)]:border-r-0 hover:bg-[#0d0d0d] transition-colors duration-300"
                            >
                                <div className="relative w-full aspect-[16/10] overflow-hidden bg-[#111]">
                                    {image && (
                                        <Image
                                            src={urlFor(image).width(600).height(375).url()}
                                            alt={title || "News"}
                                            fill
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                                        />
                                    )}
                                    <div className="absolute top-4 left-4 text-white/10 font-black text-6xl leading-none select-none pointer-events-none">
                                        {num}
                                    </div>
                                </div>

                                <div className="flex flex-col flex-1 p-6 md:p-8">
                                    <div className="flex items-center gap-3 mb-4">
                                        {category && (
                                            <span className="text-[#FF5500] text-[10px] font-bold tracking-[0.25em] uppercase">
                                                {category}
                                            </span>
                                        )}
                                        {publishedAt && category && (
                                            <div className="w-3 h-px bg-gray-700" />
                                        )}
                                        {publishedAt && (
                                            <span className="text-gray-600 text-[10px] tracking-widest uppercase">
                                                {formatDate(publishedAt)}
                                            </span>
                                        )}
                                    </div>

                                    <h3 className="text-white font-black text-xl md:text-2xl leading-tight uppercase tracking-tight mb-auto group-hover:text-[#FF5500] transition-colors duration-300 line-clamp-3">
                                        {title}
                                    </h3>

                                    <div className="flex items-center gap-2 mt-6 pt-5 border-t border-[#1a1a1a]">
                                        <span className="text-gray-500 text-xs font-bold tracking-widest uppercase group-hover:text-[#FF5500] transition-colors duration-300">
                                            Read More
                                        </span>
                                        <span className="text-gray-500 group-hover:text-[#FF5500] group-hover:translate-x-1 transition-all duration-300 text-sm">
                                            →
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}

            {hasMore && (
                <div className="w-full flex justify-center py-4">
                    <button
                        ref={setButtonRefState}
                        onClick={loadMorePosts}
                        disabled={loading}
                        className="opacity-0 w-full h-10 focus:opacity-100"
                        aria-label="Load more posts"
                    >
                        {loading ? "Loading..." : "Load More"}
                    </button>
                </div>
            )}

            {loading && (
                <div className="flex justify-center items-center py-12">
                    <Loader2 className="w-8 h-8 text-[#FF5500] animate-spin" />
                </div>
            )}
        </>
    );
}
