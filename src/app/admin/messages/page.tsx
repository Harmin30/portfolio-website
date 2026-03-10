"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ContactMessage } from "@/types";
import { Trash2, Loader, Mail } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminMessages() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await fetch("/api/messages");
      if (!response.ok) throw new Error("Failed to fetch messages");
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast.error("Failed to load messages");
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkRead = async (id: string, read: boolean) => {
    try {
      const response = await fetch(`/api/messages/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ read: !read }),
      });

      if (!response.ok) throw new Error("Failed to update message");
      toast.success("Message updated!");
      fetchMessages();
    } catch (error) {
      console.error("Error updating message:", error);
      toast.error("Failed to update message");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;

    try {
      const response = await fetch(`/api/messages/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete message");
      toast.success("Message deleted!");
      fetchMessages();
    } catch (error) {
      console.error("Error deleting message:", error);
      toast.error("Failed to delete message");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader className="animate-spin mr-2" />
        <span>Loading messages...</span>
      </div>
    );
  }

  const unreadCount = messages.filter((m) => !m.read).length;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Contact Messages</h1>
        <p className="text-gray-600 dark:text-gray-400">
          {unreadCount > 0 ? (
            <>
              You have{" "}
              <span className="font-bold text-blue-600">{unreadCount}</span>{" "}
              unread message{unreadCount !== 1 ? "s" : ""}
            </>
          ) : (
            "No unread messages"
          )}
        </p>
      </div>

      {/* Messages List */}
      {messages.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Mail className="mx-auto mb-4 text-gray-400" size={48} />
            <p className="text-gray-600 dark:text-gray-400">No messages yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Card className={!message.read ? "border-blue-500 border-2" : ""}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-bold">{message.name}</h3>
                        {!message.read && (
                          <span className="px-2 py-1 rounded-full text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                            Unread
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">
                        <a
                          href={`mailto:${message.email}`}
                          className="hover:text-blue-600"
                        >
                          {message.email}
                        </a>
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mb-4">
                        {new Date(message.created_at).toLocaleString()}
                      </p>

                      {expandedId === message.id && (
                        <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg mb-4 border border-gray-200 dark:border-gray-800">
                          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                            {message.message}
                          </p>
                        </div>
                      )}

                      {expandedId !== message.id && (
                        <p className="text-gray-600 dark:text-gray-400 line-clamp-2">
                          {message.message}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col gap-2 ml-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          setExpandedId(
                            expandedId === message.id ? null : message.id,
                          )
                        }
                      >
                        {expandedId === message.id ? "Show less" : "View"}
                      </Button>
                      <Button
                        size="sm"
                        variant={message.read ? "outline" : "default"}
                        onClick={() => handleMarkRead(message.id, message.read)}
                      >
                        {message.read ? "Mark unread" : "Mark read"}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(message.id)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
