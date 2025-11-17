import { useState } from "react";
import { postService } from "../services/postService";

export default function CreatePostModal({ open, onClose, classId, user }) {
    const [content, setContent] = useState("");
    const submitPost = async () => {
        if (!content.trim()) return;
        const payload = {
            author_id: user.author_id,
            author_name: user.author_name,
            content: content.trim(),
        }
        await postService.createPost(classId, payload);
        setContent("");
        onClose();
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-5 relative">

                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-500 hover:text-black text-xl"
                >
                    ✕
                </button>

                <h2 className="text-lg font-semibold mb-4">
                    Tạo thảo luận mới
                </h2>

                <textarea
                    rows="4"
                    className="w-full border rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Viết thảo luận của bạn..."
                    value={content}
                    onChange={e => setContent(e.target.value)}
                />

                <div className="text-right mt-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-1 rounded-md border mr-2 hover:bg-gray-100 transition"
                    >
                        Hủy
                    </button>
                    <button
                        onClick={submitPost}
                        className="px-4 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                    >
                        Đăng
                    </button>
                </div>
            </div>
        </div>
    );
}
