import { useState, useRef, useEffect } from "react";
import { useChatAI } from "../hooks/ai";

export default function AIChat() {
  const [history, setHistory] = useState([]);
  const [input, setInput] = useState("");
  const chatMut = useChatAI();
  const scrollRef = useRef();

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const send = async () => {
    if (!input.trim()) return;
    const userMsg = { from: "user", text: input };
    setHistory((h) => [...h, userMsg]);
    setInput("");
    const { data } = await chatMut.mutateAsync(input);
    setHistory((h) => [...h, { from: "ai", text: data.response }]);
  };

  return (
    <div className="ai-chatbox">
      {history.map((m, i) => (
        <div key={i} className={m.from}>
          <p>{m.text}</p>
        </div>
      ))}
      <div ref={scrollRef} />
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask AI..."
      />
      <button onClick={send}>Send</button>
    </div>
  );
}
