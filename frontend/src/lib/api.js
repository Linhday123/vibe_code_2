import axios from "axios";

const TOKEN_KEY = "unilib_token";
const USER_KEY = "unilib_user";

const api = axios.create({
  baseURL: "http://localhost:3000/api"
});

export function getStoredToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredUser() {
  const raw = localStorage.getItem(USER_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function saveSession(token, user) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

api.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearSession();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const apiClient = {
  login: (payload) => api.post("/auth/login", payload).then((res) => res.data),
  getDashboardStats: () => api.get("/dashboard/stats").then((res) => res.data),
  getUsers: () => api.get("/users").then((res) => res.data),
  createUser: (payload) => api.post("/users", payload).then((res) => res.data),
  updateUser: (id, payload) => api.put(`/users/${id}`, payload).then((res) => res.data),
  deleteUser: (id) => api.delete(`/users/${id}`).then((res) => res.data),
  getReaders: (params = {}) => api.get("/readers", { params }).then((res) => res.data),
  createReader: (payload) => api.post("/readers", payload).then((res) => res.data),
  updateReader: (id, payload) => api.put(`/readers/${id}`, payload).then((res) => res.data),
  deleteReader: (id) => api.delete(`/readers/${id}`).then((res) => res.data),
  getSpecializations: () => api.get("/specializations").then((res) => res.data),
  createSpecialization: (payload) => api.post("/specializations", payload).then((res) => res.data),
  updateSpecialization: (id, payload) => api.put(`/specializations/${id}`, payload).then((res) => res.data),
  deleteSpecialization: (id) => api.delete(`/specializations/${id}`).then((res) => res.data),
  getBookTitles: (params = {}) => api.get("/book-titles", { params }).then((res) => res.data),
  createBookTitle: (payload) => api.post("/book-titles", payload).then((res) => res.data),
  updateBookTitle: (id, payload) => api.put(`/book-titles/${id}`, payload).then((res) => res.data),
  deleteBookTitle: (id) => api.delete(`/book-titles/${id}`).then((res) => res.data),
  getBookCopies: (params = {}) => api.get("/book-copies", { params }).then((res) => res.data),
  createBookCopy: (payload) => api.post("/book-copies", payload).then((res) => res.data),
  updateBookCopy: (id, payload) => api.put(`/book-copies/${id}`, payload).then((res) => res.data),
  deleteBookCopy: (id) => api.delete(`/book-copies/${id}`).then((res) => res.data),
  getBorrows: (params = {}) => api.get("/borrows", { params }).then((res) => res.data),
  createBorrow: (payload) => api.post("/borrows", payload).then((res) => res.data),
  returnBorrow: (id) => api.put(`/borrows/${id}/return`).then((res) => res.data),
  getMostBorrowed: () => api.get("/reports/most-borrowed").then((res) => res.data),
  getUnreturned: () => api.get("/reports/unreturned").then((res) => res.data),
  exportMostBorrowedCsv: () => api.get("/reports/most-borrowed/csv", { responseType: "blob" }).then((res) => res.data),
  exportUnreturnedCsv: () => api.get("/reports/unreturned/csv", { responseType: "blob" }).then((res) => res.data)
};

export default api;
