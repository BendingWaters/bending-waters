import { sanityFetch } from "@/sanity/lib/live";
import { POSTS_QUERY } from "@/sanity/lib/queries";
import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/sanity/lib/image";
import { NewsGridProps, Post } from "@/types";
import LoadMoreNews from "./LoadMoreNews";

const NewsGrid = async ({ searchParams }: NewsGridProps) => {
  const { data: posts } = await sanityFetch({
    query: POSTS_QUERY,
    params: {
      search: searchParams?.search || null,
      category: searchParams?.category || null,
      tag: searchParams?.tag || null,
      start: 0,
      end: 12,
    } as any,
  });

  if (!posts || posts.length === 0) {
    return (
      <div className="mt-32 text-center py-24 border-t border-[#1a1a1a]">
        <span className="text-[#FF5500] text-xs tracking-[0.3em] uppercase font-bold">
          No Results
        </span>
        <h3 className="text-3xl font-black text-white mt-4 mb-3 uppercase tracking-tight">
          Nothing Found
        </h3>
        <p className="text-gray-500 max-w-sm mx-auto text-sm leading-relaxed">
          Try adjusting your search or filters to find what you&apos;re looking
          for.
        </p>
        <Link
          href="/news"
          className="inline-flex items-center gap-3 mt-8 px-6 py-3 bg-[#FF5500] text-white text-sm font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-colors duration-300"
        >
          Clear Filters
          <span className="text-base leading-none">→</span>
        </Link>
      </div>
    );
  }

  const [heroPost, ...restPosts] = posts;

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  return (
    <div className="space-y-4">
      {/* ─── HERO POST ─────────────────────────────────────── */}
      {heroPost &&
        (() => {
          const {
            _id,
            title,
            slug,
            thumbnail,
            mainImage,
            publishedAt,
            category,
            description,
          } = heroPost;
          const image = thumbnail || mainImage;
          return (
            <Link
              key={_id}
              href={`/blog/${slug?.current}`}
              className="group block border-b border-[#1a1a1a]"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2">
                {/* Image */}
                <div className="relative w-full aspect-4/3 lg:aspect-auto lg:min-h-130 overflow-hidden bg-[#111]">
                  {image && (
                    <Image
                      src={urlFor(image).width(900).height(700).url()}
                      alt={title || "News"}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      priority
                    />
                  )}
                  {/* Orange corner accent */}
                  <div className="absolute bottom-0 left-0 w-0 h-0 border-solid border-b-48 border-l-48 border-b-[#080808] border-l-transparent border-r-transparent border-t-transparent lg:block hidden" />
                </div>

                {/* Content */}
                <div className="flex flex-col justify-end px-8 md:px-12 py-12 bg-[#0d0d0d] group-hover:bg-[#0f0f0f] transition-colors duration-300">
                  {/* Label row */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-[2px] bg-[#FF5500]" />
                    {category && (
                      <span className="text-[#FF5500] text-xs font-bold tracking-[0.25em] uppercase">
                        {category}
                      </span>
                    )}
                    {publishedAt && (
                      <>
                        <span className="text-gray-600 text-xs">·</span>
                        <span className="text-gray-500 text-xs tracking-wider uppercase">
                          {formatDate(publishedAt)}
                        </span>
                      </>
                    )}
                  </div>

                  {/* Featured badge */}
                  <div className="mb-4">
                    <span className="inline-block bg-[#FF5500] text-black text-[10px] font-black tracking-[0.3em] uppercase px-3 py-1">
                      Featured
                    </span>
                  </div>

                  <h2 className="text-white font-black text-3xl md:text-4xl xl:text-5xl uppercase tracking-tight leading-[0.92] mb-6 group-hover:text-[#FF5500] transition-colors duration-300">
                    {title}
                  </h2>

                  {description && (
                    <p className="text-gray-500 text-sm md:text-base leading-relaxed mb-8 max-w-md line-clamp-3">
                      {description}
                    </p>
                  )}

                  <div className="flex items-center gap-3 text-[#FF5500] text-sm font-bold tracking-widest uppercase">
                    <span>Read Article</span>
                    <span className="transition-transform duration-300 group-hover:translate-x-2 inline-block">
                      →
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          );
        })()}

      {/* ─── REST POSTS GRID ───────────────────────────────── */}
      {restPosts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {restPosts.map((post: Post, index: number) => {
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
            const num = String(index + 2).padStart(2, "0");

            return (
              <Link
                key={_id}
                href={`/blog/${slug?.current}`}
                className="group flex flex-col border-b border-r border-[#1a1a1a] [&:nth-child(3n)]:border-r-0 hover:bg-[#0d0d0d] transition-colors duration-300"
              >
                {/* Image */}
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
                  {/* Number overlay */}
                  <div className="absolute top-4 left-4 text-white/10 font-black text-6xl leading-none select-none pointer-events-none">
                    {num}
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-col flex-1 p-6 md:p-8">
                  {/* Meta */}
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

                  {/* Title */}
                  <h3 className="text-white font-black text-xl md:text-2xl leading-tight uppercase tracking-tight mb-auto group-hover:text-[#FF5500] transition-colors duration-300 line-clamp-3">
                    {title}
                  </h3>

                  {/* Read more */}
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

      <LoadMoreNews searchParams={searchParams} initialOffset={12} />
    </div>
  );
};

export default NewsGrid;
