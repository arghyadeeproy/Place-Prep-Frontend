// services/dev2devService.js
import api from "./api";

// ── Posts ──────────────────────────────────────────────────────────────────
export async function fetchPosts(tag = "All", page = 1) {
  const params = { page };
  if (tag !== "All") params.tag = tag;
  const res = await api.get("/dev2dev/posts/", { params });
  return res.data.data; // { results[], count, page, has_next }
}

export async function createPost({ title, body, tags = [] }) {
  const res = await api.post("/dev2dev/posts/", { title, body, tags });
  return res.data.data;
}

export async function deletePost(postId) {
  await api.delete(`/dev2dev/posts/${postId}/`);
}

export async function togglePostLike(postId) {
  const res = await api.post(`/dev2dev/posts/${postId}/like/`);
  return res.data.data; // { liked: bool, like_count: int }
}
export async function fetchComments(postId) {
  const res = await api.get(`/dev2dev/posts/${postId}/comments/`);
  return res.data.data; // array of comment objects
}

export async function createComment(postId, body) {
  const res = await api.post(`/dev2dev/posts/${postId}/comments/`, { body });
  return res.data.data;
}

export async function deleteComment(postId, commentId) {
  await api.delete(`/dev2dev/posts/${postId}/comments/${commentId}/`);
}

export async function toggleCommentLike(postId, commentId) {
  const res = await api.post(`/dev2dev/posts/${postId}/comments/${commentId}/like/`);
  return res.data.data; // { liked: bool, like_count: int }
}

export async function toggleCommentUpvote(postId, commentId) {
  const res = await api.post(`/dev2dev/posts/${postId}/comments/${commentId}/upvote/`);
  return res.data.data; // { upvoted: bool, upvote_count: int }
}