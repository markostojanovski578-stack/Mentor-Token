import { useState } from "react";
import styles from "./ChatBox.module.css";

const ChatBox = ({ endpoint, title, placeholder }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async (e) => {
    e.preventDefault();

    const prompt = input.trim();

    if (!prompt || loading) return;

    setMessages((prev) => [
      ...prev,
      { role: "user", text: prompt },
    ]);

    setInput("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:10000${endpoint}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ prompt }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: data.answer },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: error.message,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>{title}</h3>

      <div className={styles.chatArea}>
        {messages.map((message, index) => (
          <div
            key={index}
            className={
              message.role === "user"
                ? styles.userMessage
                : styles.aiMessage
            }
          >
            {message.text}
          </div>
        ))}

        {loading && (
          <div className={styles.aiMessage}>
            Thinking...
          </div>
        )}
      </div>

      <form className={styles.inputArea} onSubmit={sendMessage}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={placeholder}
          disabled={loading}
        />

        <button type="submit" disabled={loading || !input.trim()}>
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatBox;