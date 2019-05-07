export const baseUrl = process.env.NODE_ENV === "production" ? "http://localhost:8088" : "http://127.0.0.1:8088";
export const wsUrl = process.env.NODE_ENV === "production" ? "ws://127.0.0.1:8088/ws" : "ws://127.0.0.1:8088/ws";
