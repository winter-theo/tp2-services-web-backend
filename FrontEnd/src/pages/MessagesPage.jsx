import { useEffect, useMemo, useState } from "react";
import { getAdminConversations, getMessagesByUserId, postMessageForUser } from "../api/messages";
import ApiStatus from "../components/ApiStatus";
import { useAuth } from "../context/AuthContext";

export default function MessagesPage() {
  const { user, token } = useAuth();
  const isAdmin = user?.role === "ADMIN";
  const [messages, setMessages] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const targetUserId = isAdmin ? selectedUserId : user?.id;

  useEffect(() => {
    if (!isAdmin) {
      return;
    }

    const run = async () => {
      setLoading(true);
      setError("");
      setSuccess("");
      try {
        const data = await getAdminConversations(token);
        const list = Array.isArray(data) ? data : [];
        setConversations(list);

        if (list.length > 0) {
          const hasSelected = list.some((item) => item.userId === selectedUserId);
          if (!hasSelected) {
            setSelectedUserId(list[0].userId);
          }
        } else {
          setSelectedUserId(null);
        }
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    void run();
  }, [isAdmin, token]);

  const selectedConversation = useMemo(() => {
    if (!isAdmin || !selectedUserId) {
      return null;
    }
    return conversations.find((item) => item.userId === selectedUserId) || null;
  }, [isAdmin, conversations, selectedUserId]);

  const refreshMessages = async () => {
    if (!targetUserId) {
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const data = await getMessagesByUserId(targetUserId, token);
      setMessages(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    const cleanedContent = content.trim();
    if (!cleanedContent || !targetUserId) {
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");
    try {
      await postMessageForUser(targetUserId, cleanedContent, token);
      setContent("");
      setSuccess("Message envoyé.");
      await refreshMessages();

      if (isAdmin) {
        const updated = await getAdminConversations(token);
        const list = Array.isArray(updated) ? updated : [];
        setConversations(list);
      }
    } catch (e) {
      setError(e.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!targetUserId) {
      setMessages([]);
      return;
    }
    void refreshMessages();
  }, [targetUserId]);

  const bubbleClass = (message) => {
    const isMine = isAdmin ? message.senderRole === "ADMIN" : message.senderRole === "USER";
    return `chat-bubble ${isMine ? "chat-bubble-outgoing" : "chat-bubble-incoming"}`;
  };

  const senderLabel = (senderRole) => {
    if (isAdmin) {
      return senderRole;
    }
    if (senderRole === "USER") {
      return "VOUS";
    }
    return "ADMIN";
  };

  const renderContent = (value) => {
    if (typeof value !== "string") {
      return "";
    }
    return value.trim();
  };

  return (
    <div>
      <h1>{isAdmin ? "Admin - Messages" : "Mes Messages"}</h1>
      {isAdmin ? (
        <p className="hint">Conversations utilisateurs avec indicateur "en attente" (dernier message USER).</p>
      ) : null}
      {isAdmin ? (
        <div className="messages-admin-layout">
          <aside className="messages-conversations">
            <h2>Conversations</h2>
            {conversations.length === 0 ? <p className="hint">Aucune conversation.</p> : null}
            <ul className="simple-list">
              {conversations.map((conversation) => (
                <li key={conversation.userId}>
                  <button
                    type="button"
                    className={`conversation-btn ${
                      selectedUserId === conversation.userId ? "conversation-btn-active" : ""
                    }`}
                    onClick={() => setSelectedUserId(conversation.userId)}
                  >
                    <strong>{conversation.email}</strong>
                    <span>Total: {conversation.totalMessages}</span>
                    <span className={conversation.pending ? "pending-badge" : "resolved-badge"}>
                      {conversation.pending ? "En attente" : "Répondu"}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </aside>
          <section className="messages-chat">
            <h2>
              {selectedConversation
                ? `Conversation avec ${selectedConversation.email}`
                : "Sélectionner une conversation"}
            </h2>
            {selectedConversation ? null : <p className="hint">Choisis un utilisateur pour répondre.</p>}
            <ApiStatus error={error} success={success} />
            <section className="chat-thread">
              {messages.length === 0 ? <p className="hint">Pas encore de messages.</p> : null}
              {messages.map((message) => (
                <article key={message.id} className={bubbleClass(message)}>
                  <p>{renderContent(message.content)}</p>
                  <small>
                    {senderLabel(message.senderRole)} - {new Date(message.createdAt).toLocaleString()}
                  </small>
                </article>
              ))}
            </section>
            <div className="row">
              <input
                type="text"
                placeholder="Répondre à l'utilisateur..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                disabled={!targetUserId}
              />
              <button onClick={sendMessage} disabled={loading || !targetUserId}>
                Envoyer
              </button>
            </div>
          </section>
        </div>
      ) : null}
      {!isAdmin ? (
        <>
          <ApiStatus error={error} success={success} />
          <section className="chat-thread">
            {messages.length === 0 ? <p className="hint">Pas encore de messages.</p> : null}
            {messages.map((message) => (
              <article key={message.id} className={bubbleClass(message)}>
                <p>{renderContent(message.content)}</p>
                <small>
                  {senderLabel(message.senderRole)} - {new Date(message.createdAt).toLocaleString()}
                </small>
              </article>
            ))}
          </section>
          <div className="row">
            <input
              type="text"
              placeholder="Nouveau message"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={!targetUserId}
            />
            <button onClick={sendMessage} disabled={loading || !targetUserId}>
              Envoyer
            </button>
          </div>
        </>
      ) : null}
    </div>
  );
}
