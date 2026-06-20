export function MessageList({ messages }: { messages: string[] }) {
  if (messages.length === 0) {
    return <p className="text-gray-400 text-sm">No messages yet.</p>;
  }

  return (
    <ul className="flex flex-col gap-1">
      {messages.map((msg, i) => (
        <li key={i} className="bg-gray-800 rounded px-3 py-1.5 text-sm">
          {msg}
        </li>
      ))}
    </ul>
  );
}
