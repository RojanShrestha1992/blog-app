import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_REACT_APP_BACKEND_BASEURL || "http://localhost:3000/api",
  withCredentials: true, // to send cookies with requests
});

export const getCurrentUser = async () => {
  try {
    const { data } = await axios.get(`${API.defaults.baseURL}/auth/me`, {
      withCredentials: true,
    });
    return data; // _id name emails
  } catch (err) {
    console.error("Failed to fetch current user", err);
    return null;
  }
};

export const fetchPosts = () => API.get("/posts");
export const fetchPostById = (id) => API.get(`/posts/${id}`);
export const createPost = (postData) => {
  if (postData instanceof FormData) {
    return API.post("/posts", postData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  }
  return API.post("/posts", postData);
};
export const updatePost = (id, postData) => {
  if (postData instanceof FormData) {
    return API.put(`/posts/${id}`, postData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  }
  return API.put(`/posts/${id}`, postData);
};
export const deletePost = (id) => API.delete(`/posts/${id}`);

export const toggleUpvote = (id) => API.put(`/posts/${id}/upvote`);

export const fetchProfile = (userId) => API.get(`/users/${userId}`)
export const uploadAvatar = (formData) =>
  API.put("/users/avatar", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export default API;
