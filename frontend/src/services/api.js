import axios from "axios";

// Definiamo l'url di base'
const API_URL = "http://localhost:3001/api";

// Configura un'istanza di axios con l'URL di base
const api = axios.create({
  baseURL: API_URL,
});

// Funzioni per le operazioni CRUD
export const getPosts = () => api.get("/blogPosts");
export const getPost = (id) => api.get(`/blogPosts/${id}`)
  .then((response) => response.data);
export const createPost = (postData) => api.post("/blogPosts", postData, {
  headers: {
    "Content-Type": "multipart/form-data"
  }
});
export const updatePost = (id, postData) => api.put(`/blogPosts/${id}`, postData);
export const deletePost = (id) => api.delete(`/blogPosts/${id}`);
export const getComments = (postId) => api.get(`/blogPosts/${postId}/comments`)
  .then((response) => response.data);
export const getComment = (postId, commentId) => api.get(`/blogPosts/${postId}/comments/${commentId}`)
  .then((response => response.data));
export const createComment = (postId, commentData) => api.post(`/blogPosts/${postId}/comments`, commentData)
  .then((response) => response.data);
export const updateComment = (postId, commentId, commentData) => api.put(`/blogPosts/${postId}/comments/${commentId}`, commentData)
  .then((response) => response.data);
export const deleteComment = (postId, commentId) => api.delete(`/blogPosts/${postId}/comments/${commentId}`)
  .then((response) => response.data);

// Se un domani aggiungiamo le operazioni per gli autori, possiamo definirle qua

// Infine, esportiamo api
export default api;
