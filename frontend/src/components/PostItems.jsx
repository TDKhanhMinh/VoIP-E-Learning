import CommentSection from "./CommentSection";

export default function PostItem({ post, user }) {
    return (
        <div className="bg-[#F5F7FB] p-4 rounded-xl border shadow-sm mb-5">

            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center text-lg font-semibold">
                    {post.author_name.charAt(0)}
                </div>
                <div>
                    <p className="font-semibold">{post.author_name}</p>
                    <p className="text-sm text-gray-500">{new Date(post.createdAt).toLocaleDateString()}</p>
                </div>
            </div>

            <p className="mt-4 whitespace-pre-line leading-relaxed">
                {post.content}
            </p>

            <hr className="my-4" />

            <CommentSection postId={post._id} user={user} />
        </div>
    );
}
