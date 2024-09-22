"use client";

import { useChat } from "ai/react";
import { Messages } from "./Messages";

export const ChatWrapper = ({ sessionId }: { sessionId: string }) => {
  const { messages, handleInputChange, input, handleSubmit } = useChat({
    api: "/api/chat-stream",
    body: { sessionId },
  });

  return (
    <div className="relative min-h-full bg-zinc-900 flex divide-zinc-700 divide-y flex-col justify-between gap-2">
      <div className="flex-1 etxt-balck bg-zinc-800 flex flex-col justify-between">
        {/* {JSON.stringify(messages)} */}
        <Messages messages={messages} />
      </div>

      <form onSubmit={handleSubmit}>
        <input onChange={handleInputChange} type="text" value={input} />

        <button type="submit">Send</button>
      </form>
    </div>
  );
};
