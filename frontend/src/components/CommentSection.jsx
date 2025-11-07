import { useCallback, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { commentService } from "../services/commentService";
const COMMENT_LIMIT = 5;
export default function CommentSection({ postId, user }) {
    const [comments, setComments] = useState([]);
    const [content, setContent] = useState("");
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        const fetchInitialComments = async () => {
            if (!postId) return;
            setIsLoading(true);
            setComments([]);
            setPage(1);
            try {
                const data = await commentService.getComments(postId, {
                    page: 1,
                    limit: COMMENT_LIMIT
                });
                setComments(data.comments);
                setHasMore(data.hasMore);
            } catch (err) {
                console.error("Failed to fetch comments:", err);
            }
            setIsLoading(false);
        };
        fetchInitialComments();
    }, [postId]);
    const loadMoreComments = useCallback(async () => {
        if (isLoading || !hasMore) return;

        setIsLoading(true);
        const nextPage = page + 1;

        try {
            const response = await commentService.getComments(postId, {
                page: nextPage,
                limit: COMMENT_LIMIT
            });

            setComments(prev => [...prev, ...response.comments]);
            setHasMore(response.hasMore);
            setPage(nextPage);
        } catch (err) {
            console.error("Failed to load more comments:", err);
        }
        setIsLoading(false);
    }, [isLoading, hasMore, page, postId]);
    const observer = useRef();

    const lastCommentElementRef = useCallback(node => {
        if (isLoading) return;

        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                loadMoreComments();
            }
        });

        if (node) observer.current.observe(node);

    }, [isLoading, hasMore, loadMoreComments]);
    useEffect(() => {
        if (!postId || !user?.token) {
            return;
        }

        const socket = io(import.meta.env.VITE_API_URL.replace(/\/api\/?$/, "").replace(/\/$/, ""), {
            transports: ["polling", "websocket"],
            auth: {
                token: user.token,
                room: postId
            }
        });

        socket.on("connect", () => {
            console.log(`Socket connected to room: ${postId}`);
        });

        const handleNewComment = (cmt) => {
            if (cmt.post_id === postId) {
                setComments(prev => [...prev, cmt]);
            }
        };

        socket.on("new_comment", handleNewComment);

        socket.on("connect_error", (err) => {
            console.log("Socket connection error:", err.message);
        });

        return () => {
            console.log(`Disconnecting socket from room: ${postId}`);
            socket.off("new_comment", handleNewComment);
            socket.disconnect();
        };

    }, [postId, user?.token]);

    const sendComment = async () => {
        if (!content.trim()) return;

        const payload = {
            author_id: user.author_id,
            author_name: user.author_name,
            content: content,
        };

        try {
            await commentService.createComment(postId, payload);
            setContent("");
        } catch (err) {
            console.error("Failed to send comment:", err);
        }
    };

    return (
        <div >
            <div className="max-h-96 overflow-y-auto p-4 bg-gray-100 rounded-md">
            {comments?.map((c, index) => {
                if (comments?.length === index + 1) {
                    return (
                        <div ref={lastCommentElementRef} key={c._id || c.id} className="flex items-start gap-3 my-2 ">
                            <div className="w-8 h-8 rounded-full bg-gray-400 text-white flex items-center justify-center">
                                {c.author_name.charAt(0)}
                            </div>
                            <div>
                                <p className="font-semibold text-sm">{c.author_name}</p>
                                <p className="text-gray-800 text-sm">{c.content}</p>
                            </div>
                        </div>
                    );
                } else {
                    return (
                        <div key={c._id || c.id} className="flex items-start gap-3 my-2">
                            <div className="w-8 h-8 rounded-full bg-gray-400 text-white flex items-center justify-center">
                                {c.author_name.charAt(0)}
                            </div>
                            <div>
                                <p className="font-semibold text-sm">{c.author_name}</p>
                                <p className="text-gray-800 text-sm">{c.content}</p>
                            </div>
                        </div>
                    );
                }
            })}

            {isLoading && (
                <p className="text-center text-gray-500 text-sm py-2">Đang tải thêm...</p>
            )}

            {!hasMore && comments.length > 0 && (
                <p className="text-center text-gray-400 text-xs py-2">Đã hết bình luận</p>
            )}
        </div>
    <div className="flex items-center bg-white rounded-full border px-3 mt-3">
        <input
            className="flex-1 py-2 outline-none text-sm"
            placeholder="Nhập bình luận…"
            value={content}
            onChange={e => setContent(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') sendComment(); }}
        />
        <button onClick={sendComment} className="text-blue-600 text-lg font-bold" disabled={!content.trim()}>➤</button>
    </div>
        </div >
    );
}