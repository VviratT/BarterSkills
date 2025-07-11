import { useState, useContext, useEffect, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import { useConversation, useSendMessage } from "../hooks/message";

export default function ChatBox({ otherId }) {
  const { user } = useContext(AuthContext);
  const { data: messages } = useConversation(otherId);
  const sendMut = useSendMessage(otherId);
  const [text, setText] = useState("");
  const scrollRef = useRef();

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!messages) return null;
  return (
    <div className="chat-container">
      {messages.map((msg) => (
        <div
          key={msg._id}
          className={msg.sender._id === user._id ? "sent" : "received"}
        >
          <p>{msg.text}</p>
          <small>{new Date(msg.createdAt).toLocaleTimeString()}</small>
        </div>
      ))}
      <div ref={scrollRef} />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendMut.mutate(text);
          setText("");
        }}
      >
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
