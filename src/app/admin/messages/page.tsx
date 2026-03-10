"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ContactMessage } from "@/types";
import { Trash2, Mail, MailOpen, ChevronDown, ChevronUp, Reply, Clock, User } from "lucide-react";
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
      toast.success(read ? "Marked as unread" : "Marked as read");
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
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="h-8 w-48 rounded-lg bg-slate-100 dark:bg-slate-800 animate-pulse" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
        ))}
      </div>
    );
  }

  const unreadCount = messages.filter((m) => !m.read).length;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-5xl mx-auto space-y-8 pb-10"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Messages</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {unreadCount > 0 ? (
              <>
                You have <span className="text-indigo-600 dark:text-indigo-400 font-bold">{unreadCount} unread</span> inquiries.
              </>
            ) : (
              "All caught up! No unread messages."
            )}
          </p>
        </div>
        <div className="px-4 py-2 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 text-xs font-bold text-slate-500 uppercase tracking-widest">
          Total: {messages.length}
        </div>
      </div>

      {/* Messages List */}
      {messages.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-[#16191f] rounded-2xl border-2 border-dashed border-slate-200 dark:border-white/5">
          <Mail size={40} className="mx-auto mb-4 text-slate-300 opacity-50" />
          <p className="text-sm font-medium text-slate-400 uppercase tracking-widest">No messages yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map((message) => (
            <motion.div
              key={message.id}
              layout
              className={`group rounded-2xl border transition-all duration-300 bg-white dark:bg-[#16191f] overflow-hidden ${
                !message.read
                  ? "border-indigo-200 dark:border-indigo-500/30 shadow-md shadow-indigo-500/5"
                  : "border-slate-200 dark:border-white/5 shadow-sm"
              }`}
            >
              {/* Message Header (Clickable) */}
              <div
                className="flex flex-wrap items-center gap-4 p-4 md:p-5 cursor-pointer hover:bg-slate-50/50 dark:hover:bg-white/[0.02]"
                onClick={() => setExpandedId(expandedId === message.id ? null : message.id)}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 border transition-colors ${
                  !message.read 
                    ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 border-indigo-100 dark:border-indigo-500/20" 
                    : "bg-slate-50 dark:bg-white/5 text-slate-400 border-slate-100 dark:border-white/5"
                }`}>
                  {message.read ? <MailOpen size={18} /> : <Mail size={18} />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className={`text-sm font-bold truncate ${!message.read ? "text-slate-900 dark:text-white" : "text-slate-600 dark:text-slate-400"}`}>
                      {message.name}
                    </h3>
                    {!message.read && (
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <span className="truncate max-w-[150px] sm:max-w-none">{message.email}</span>
                    <span className="text-slate-200 dark:text-slate-800">•</span>
                    <span className="flex items-center gap-1"><Clock size={10} /> {new Date(message.created_at).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => { e.stopPropagation(); handleMarkRead(message.id, message.read); }}
                    className={`p-2 rounded-lg transition-all ${
                      message.read 
                        ? "text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-500/10" 
                        : "text-indigo-600 bg-indigo-50 dark:bg-indigo-500/10 hover:bg-indigo-100 dark:hover:bg-indigo-500/20"
                    }`}
                    title={message.read ? "Mark unread" : "Mark read"}
                  >
                    {message.read ? <Mail size={15} /> : <MailOpen size={15} />}
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDelete(message.id); }}
                    className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all"
                  >
                    <Trash2 size={15} />
                  </button>
                  <div className={`transition-transform duration-300 text-slate-300 ${expandedId === message.id ? "rotate-180" : ""}`}>
                    <ChevronDown size={18} />
                  </div>
                </div>
              </div>

              {/* Message Body (Hidden until expanded) */}
              <AnimatePresence>
                {expandedId === message.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-slate-100 dark:border-white/5"
                  >
                    <div className="p-5 md:p-8">
                      <div className="bg-slate-50 dark:bg-white/[0.02] p-5 md:p-6 rounded-2xl border border-slate-100 dark:border-white/5">
                        <div className="flex items-center gap-2 mb-4 text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.2em]">
                          <User size={12} /> Message Content
                        </div>
                        <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                          {message.message}
                        </p>
                      </div>
                      
                      <div className="mt-6 flex justify-end">
                        <a
                          href={`mailto:${message.email}`}
                          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20 active:scale-95"
                        >
                          <Reply size={14} />
                          Reply via Email
                        </a>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}