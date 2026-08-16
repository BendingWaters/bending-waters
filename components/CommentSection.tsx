"use client";

import { useState } from "react";

interface Comment {
    name: string;
    comment: string;
    _createdAt: string;
}

interface CommentSectionProps {
    comments?: Comment[];
    postId?: string;
}

const CommentSection = ({ comments = [], postId }: CommentSectionProps) => {
    return (
        <div className="mt-16">
            <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-bold text-white">
                    {comments.length} Comment{comments.length !== 1 ? 's' : ''}
                </h3>
            </div>

            {/* Comments List */}
            {comments.length > 0 && (
                <div className="space-y-8 mb-12">
                    {comments.map((comment, index) => (
                        <div key={index} className="bg-[#1a1a1a] p-6 rounded-lg border border-[#262626]">
                            <div className="flex justify-between items-center mb-4">
                                <h4 className="text-white font-bold">{comment.name}</h4>
                                <span className="text-sm text-gray-500">
                                    {new Date(comment._createdAt).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </span>
                            </div>
                            <p className="text-gray-300 leading-relaxed">{comment.comment}</p>
                        </div>
                    ))}
                </div>
            )}

            <h3 className="text-2xl font-bold text-white mb-8">Leave A Comment</h3>
            <p className="text-gray-400 mb-8 text-sm">Your email address will not be published. Required fields are marked *</p>

            <form className="flex flex-col gap-6">
                <div className="relative">
                    <textarea
                        placeholder="Write your comment here..."
                        rows={6}
                        className="w-full bg-[#1a1a1a] border border-[#262626] rounded-lg p-6 text-gray-300 focus:outline-none focus:border-np-orange resize-none placeholder-gray-500"
                    />
                    <div className="absolute bottom-4 right-4 w-3 h-3 border-r border-b border-gray-600"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <input
                        type="text"
                        placeholder="Name"
                        className="w-full bg-[#1a1a1a] border border-[#262626] rounded-lg p-4 text-gray-300 focus:outline-none focus:border-np-orange placeholder-gray-500"
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        className="w-full bg-[#1a1a1a] border border-[#262626] rounded-lg p-4 text-gray-300 focus:outline-none focus:border-np-orange placeholder-gray-500"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <input
                        type="text"
                        placeholder="Website"
                        className="w-full bg-[#1a1a1a] border border-[#262626] rounded-lg p-4 text-gray-300 focus:outline-none focus:border-np-orange placeholder-gray-500"
                    />
                </div>

                <div className="flex items-center gap-3">
                    <input type="checkbox" id="save-info" className="w-4 h-4 accent-np-orange bg-[#1a1a1a] border-[#262626] rounded" />
                    <label htmlFor="save-info" className="text-gray-400 text-sm">Save my name, email, and website in this browser for the next time I comment</label>
                </div>

                <button
                    type="submit"
                    className="w-fit px-8 py-4 bg-np-orange text-white font-bold uppercase tracking-wider hover:bg-black transition-colors mt-4"
                >
                    Post Comment
                </button>
            </form>
        </div>
    );
};

export default CommentSection;
