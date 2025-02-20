import React from "react";

interface Props {
  message: { role: "user" | "assistant"; content: string };
}

const MessageBubble: React.FC<Props> = ({ message }) => {
  return (
    <div
      className={`chat ${message.role === "user" ? "chat-end" : "chat-start"}`}
    >
      <div
        className={`chat-bubble ${
          message.role === "user" ? "bg-blue-500 text-white" : "bg-gray-300"
        }`}
      >
        {message.content}
      </div>
    </div>
  );
};

export default MessageBubble;
