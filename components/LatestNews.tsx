import { sanityFetch } from "@/sanity/lib/live";
import { LATEST_NEWS_QUERY } from "@/sanity/lib/queries";
import Link from "next/link";

interface NewsItem {
    title: string;
    slug?: { current: string };
    author?: { name: string };
    publishedAt?: string;
    commentsCount?: number;
}

const LatestNews = async () => {
    const { data: newsItems } = await sanityFetch({ query: LATEST_NEWS_QUERY });

    if (!newsItems || newsItems.length === 0) return null;

    return (
        <div className="mt-12 mb-12">
            <h3 className="text-2xl font-bold text-white mb-8">Latest News more Information</h3>

            <ul className="space-y-4 mb-8">
                {newsItems.map((item: NewsItem, index: number) => (
                    <li key={index}>
                        <Link href={`/blog/${item.slug?.current}`} className="flex items-start gap-3 text-gray-400 hover:text-np-orange transition-colors group cursor-pointer">
                            <div className="mt-1 min-w-5">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-np-orange">
                                    <path d="M12 3L20 7.5V16.5L12 21L4 16.5V7.5L12 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M12 12L20 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M12 12V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M12 12L4 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <span className="text-lg leading-relaxed">{item.title}</span>
                        </Link>
                    </li>
                ))}
            </ul>

            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400 uppercase font-medium tracking-wider">
                <div className="flex items-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-np-orange">
                        <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span>By {newsItems[0]?.author?.name || "Unknown"}</span>
                </div>

                <div className="flex items-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-np-orange">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span>{newsItems[0]?.publishedAt ? new Date(newsItems[0].publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : "Recent"}</span>
                </div>

                <div className="flex items-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-np-orange">
                        <path d="M21 11.5C21.0039 12.8199 20.6951 14.1219 20.1 15.3C19.3944 16.7118 18.3098 17.8992 16.9674 18.7293C15.6251 19.5594 14.0782 19.9994 12.5 20C11.1801 20.0035 9.8727 19.6955 8.7 19.1L3 21L4.9 15.3C4.3045 14.1273 3.99651 12.8199 4 11.5C4.00061 9.92179 4.44061 8.37488 5.27072 7.03258C6.10083 5.69028 7.28825 4.6056 8.7 3.90003C9.87812 3.30496 11.1801 2.99697 12.5 3.00003H13C15.0843 3.11502 17.053 3.99479 18.5291 5.47089C20.0052 6.94699 20.885 8.91568 21 11V11.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span>{newsItems[0]?.commentsCount || 0} Comments</span>
                </div>
            </div>
        </div>
    );
};

export default LatestNews;
