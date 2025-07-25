import React, { useState, useEffect } from "react";

export default function App() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState("");

  useEffect(() => {
    // Gera um session id único ao entrar na página
    const id = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2) + Date.now().toString(36);
    setSessionId(id);
  }, []);

  const sendMessage = async () => {
    if (!input.trim()) return;
    setMessages((msgs) => [...msgs, { from: "user", text: input }]);
    setLoading(true);

    try {
      const resp = await fetch("https://primary-production-0f9c.up.railway.app/webhook/mensagem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mensagem: input, session_id: sessionId }),
      });
      const data = await resp.json();
    
      setMessages((msgs) => [
        ...msgs,
        { from: "henrique", text: data.output || "Nenhuma resposta." }
      ]);
    } catch (err) {
      setMessages((msgs) => [
        ...msgs,
        { from: "henrique", text: "Erro ao conectar com o backend." }
      ]);
    }    
    setInput("");
    setLoading(false);
  };

  return (
    <div style={{
      background: "#ebe6e3",
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center"
    }}>
      <div style={{
        color: "#111176",
        fontWeight: "bold",
        fontSize: "2rem",
        margin: "2rem 0"
      }}>
        Henrique Ramos - Agência MuMu
      </div>
      <div style={{
        background: "#fff",
        borderRadius: "16px",
        boxShadow: "0 4px 12px #11117622",
        width: "100%",
        maxWidth: "500px",
        minHeight: "300px",
        padding: "1.5rem",
        marginBottom: "1rem",
        overflowY: "auto"
      }}>
        {messages.map((m, i) => (
          <div key={i} style={{
            textAlign: m.from === "henrique" ? "left" : "right",
            color: m.from === "henrique" ? "#111176" : "#444",
            marginBottom: "1rem"
          }}>
            <strong>{m.from === "henrique" ? "Henrique" : "Você"}:</strong> {m.text}
          </div>
        ))}
        {loading && <div style={{ color: "#111176", fontStyle: "italic" }}>Henrique está pensando...</div>}
      </div>
      <div style={{
        width: "100%",
        maxWidth: "500px",
        display: "flex",
        gap: "0.5rem",
        marginBottom: "2rem"
      }}>
        <input
          style={{
            flex: 1,
            border: "1px solid #ddd",
            borderRadius: "8px",
            padding: "0.8rem"
          }}
          value={input}
          placeholder="Digite sua solicitação para o Henrique..."
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && sendMessage()}
        />
        <button
          style={{
            background: "#f7b520",
            color: "#111176",
            borderRadius: "8px",
            padding: "0 1.2rem",
            fontWeight: "bold"
          }}
          onClick={sendMessage}
        >
          Enviar
        </button>
      </div>
    </div>
  );
}
