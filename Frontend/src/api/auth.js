import client from "./client.js";

export function login({ email, password }) {
  return client.post("/users/login", { email, password });
}
export function register(formData) {
  return client.post("/users/register", formData);
}
export function fetchCurrent() {
  return client.get("/users/current-user");
}
export function logout() {
  return client.post("/users/logout");
}
