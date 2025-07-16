import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import useAuth from "../auth/useAuth.js";

const SocketContext = createContext(null);
export const useSocket = () => useContext(SocketContext);

export function SocketProvider({ children }) {
  const { accessToken } = useAuth();
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!accessToken) return; 
    const s = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:8000", {
      auth: { token: accessToken },
      transports: ["websocket"],
    });
    s.on("connect", () => console.log("🔗 Socket connected", s.id));
    s.on("connect_error", (err) =>
      console.error("Socket failed:", err.message)
    );
    setSocket(s);

    return () => {
      s.disconnect();
      setSocket(null);
    };
  }, [accessToken]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
}
