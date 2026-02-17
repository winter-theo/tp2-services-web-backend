import { useState } from "react";
import { getMessagesByUserId, postMessageForUser } from "../api/messages";
import ApiStatus from "../components/ApiStatus";
import { useAuth } from "../context/AuthContext";

export default function MessagesPage() {
  const { user, token } = useAuth();
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const refreshMessages = async () => {
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const data = await getMessagesByUserId(user.id, token);
      setMessages(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!content.trim()) {
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");
    try {
      await postMessageForUser(user.id, content, token);
      setContent("");
      setSuccess("Message envoyé.");
      await refreshMessages();
    } catch (e) {
      setError(e.message);
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Messages</h1>
      <p className="hint">Route protégée self/admin: `/users/:id/messages`</p>
      <div className="row">
        <button onClick={refreshMessages} disabled={loading}>
          {loading ? "Chargement..." : "Rafraichir"}
        </button>
      </div>
      <div className="row">
        <input
          type="text"
          placeholder="Nouveau message"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button onClick={sendMessage} disabled={loading}>
          Envoyer
        </button>
      </div>
      <ApiStatus error={error} success={success} />
      <pre>{JSON.stringify(messages, null, 2)}</pre>
    </div>
  );
}
