"use client";
import { useEffect, useState, useRef, useCallback } from "react";
import { useParams } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Message {
  id: string;
  userInput: string;
  response: string;
  createdAt: string;
}

export default function ProjectPage() {
  const { id } = useParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [input, setInput] = useState("");
  const [project, setProject] = useState<{ id: string; name: string; repoUrl: string } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchMessages = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/projects/${id}/messages`);
      const data = await res.json();
      setMessages(data.messages || []);
      setProject(data.project || null);
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || sending) return;

    try {
      setSending(true);
      const res = await fetch('/api/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repoUrl: project?.repoUrl, query: input })
      });

      if (!res.ok) {
        throw new Error('Failed to send message');
      }

      const data = await res.json();
      
      // Add the new message to the messages list
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        userInput: input,
        response: data.answer,
        createdAt: new Date().toISOString()
      }]);
      
      setInput("");
      
      // Fetch updated messages
      fetchMessages();
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setSending(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchMessages();
    }
  }, [id, fetchMessages]);

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!project) {
    return <div className="flex items-center justify-center min-h-screen">Project not found</div>;
  }

  return (
    <div className="flex flex-col h-full">
      <div className="mb-4">
        <h1 className="text-2xl font-bold">{project.name}</h1>
        <p className="text-gray-500 text-sm">{project.repoUrl}</p>
      </div>

      <div className="flex-1 overflow-auto mb-4 border rounded-lg p-4 bg-gray-50 dark:bg-gray-900">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            No messages yet. Ask a question about this repository.
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id} className="space-y-2">
                <div className="flex items-start">
                  <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-lg max-w-[80%]">
                    <p className="text-sm font-semibold mb-1">You</p>
                    <p>{message.userInput}</p>
                  </div>
                </div>
                <div className="flex items-start justify-end">
                  <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg max-w-[80%]">
                    <p className="text-sm font-semibold mb-1">System</p>
                    <div className="markdown-content">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {message.response}
                      </ReactMarkdown>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <form onSubmit={sendMessage} className="flex gap-2 mt-auto">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question about this repository..."
          className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={sending}
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          disabled={sending}
        >
          {sending ? "Sending..." : "Send"}
        </button>
      </form>
    </div>
  );
}
