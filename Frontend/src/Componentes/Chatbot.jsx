import React, { useState } from "react";
import "../Stylesheets/Chatbot.css";
import chatIcon from "../imagenes/chat.png";

function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);

  const options = [
    {
      question: "No encuentro un producto",
      answer: "Si le soy sincero, pa. Me viene valiendo 3/14 de mondá.",
    },
    {
      question: "Contacto de un supervisor",
      answer:
        "Nuestro supervisor: Edwin, en estos momentos se encuentra preso por ingreso ilegal a los EE.UU y delito carnal con una pelada de 17",
    },
  ];

  const handleOptionClick = (option) => {
    setMessages((prev) => [
      ...prev,
      { from: "user", text: option.question },
      { from: "bot", text: option.answer },
    ]);
  };

  // Función para cerrar el chat y limpiar mensajes
  const handleClose = () => {
    setOpen(false);
    setMessages([]); // Limpiar mensajes al cerrar
  };

  return (
    <>
      <div className="chatbot-toggle" onClick={() => setOpen(!open)}>
        <img src={chatIcon} alt="chat" />
      </div>

      {open && (
        <div className="chatbot-container">
          <div className="chatbot-header">
            Asistente Virtual
            <span className="chatbot-close" onClick={handleClose}>
              &#10005;
            </span>
          </div>
          <div className="chatbot-body">
            <div className="chatbot-messages">
              {messages.map((msg, index) => (
                <div key={index} className={`message ${msg.from}`}>
                  {msg.text}
                </div>
              ))}
            </div>
            <div className="chatbot-options">
              {options.map((opt, index) => (
                <button key={index} onClick={() => handleOptionClick(opt)}>
                  {opt.question}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ChatBot;
