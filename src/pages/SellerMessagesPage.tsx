import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Send,
  MoreVertical,
  Phone,
  Video,
  Paperclip,
  Smile,
  Check,
  CheckCheck,
  Image as ImageIcon,
  Menu,
} from "lucide-react";
import { SellerNavbar, SellerFooter } from "../components/sections/seller";

interface Message {
  id: string;
  text: string;
  timestamp: Date;
  isOwn: boolean;
  read?: boolean;
  imageUrl?: string;
}

interface Conversation {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  online: boolean;
  propertyName?: string;
}

const sampleConversations: Conversation[] = [
  {
    id: "1",
    name: "Maria Santos",
    avatar: "https://ui-avatars.com/api/?name=Maria+Santos&background=FFB800&color=000",
    lastMessage: "I'm interested in viewing the condo...",
    timestamp: "2m ago",
    unread: 2,
    online: true,
    propertyName: "Modern Condo in BGC",
  },
  {
    id: "2",
    name: "Juan Dela Cruz",
    avatar: "https://ui-avatars.com/api/?name=Juan+Dela+Cruz&background=1E3A8A&color=fff",
    lastMessage: "What's the best price you can offer?",
    timestamp: "1h ago",
    unread: 0,
    online: false,
    propertyName: "Luxury House in Makati",
  },
  {
    id: "3",
    name: "Sarah Kim",
    avatar: "https://ui-avatars.com/api/?name=Sarah+Kim&background=059669&color=fff",
    lastMessage: "Thank you for the virtual tour!",
    timestamp: "3h ago",
    unread: 0,
    online: true,
    propertyName: "Beach House in Batangas",
  },
  {
    id: "4",
    name: "Robert Chen",
    avatar: "https://ui-avatars.com/api/?name=Robert+Chen&background=DC2626&color=fff",
    lastMessage: "Can we schedule a visit tomorrow?",
    timestamp: "1d ago",
    unread: 1,
    online: false,
    propertyName: "Townhouse in QC",
  },
];

const sampleMessages: Record<string, Message[]> = {
  "1": [
    {
      id: "1",
      text: "Hi! I saw your listing for the Modern Condo in BGC.",
      timestamp: new Date(Date.now() - 3600000),
      isOwn: false,
    },
    {
      id: "2",
      text: "Hello! Yes, it's still available. Would you like to schedule a viewing?",
      timestamp: new Date(Date.now() - 3500000),
      isOwn: true,
      read: true,
    },
    {
      id: "3",
      text: "I'm interested in viewing the condo. What times are available this week?",
      timestamp: new Date(Date.now() - 120000),
      isOwn: false,
    },
  ],
  "2": [
    {
      id: "1",
      text: "Good day! I'm interested in your Luxury House in Makati.",
      timestamp: new Date(Date.now() - 7200000),
      isOwn: false,
    },
    {
      id: "2",
      text: "What's the best price you can offer?",
      timestamp: new Date(Date.now() - 3600000),
      isOwn: false,
    },
  ],
};

export default function SellerMessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState<string | null>("1");
  const [messageText, setMessageText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [conversations] = useState<Conversation[]>(sampleConversations);
  const [messages, setMessages] = useState<Record<string, Message[]>>(sampleMessages);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const selectedConvo = conversations.find((c) => c.id === selectedConversation);
  const currentMessages = selectedConversation ? messages[selectedConversation] || [] : [];

  const handleSendMessage = () => {
    if (!messageText.trim() || !selectedConversation) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      timestamp: new Date(),
      isOwn: true,
      read: false,
    };

    setMessages((prev) => ({
      ...prev,
      [selectedConversation]: [...(prev[selectedConversation] || []), newMessage],
    }));
    setMessageText("");
  };

  const filteredConversations = conversations.filter((conv) =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.propertyName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderConversationList = (onSelectClose?: () => void) => (
    <div className="border-vista-text/10 flex flex-col border-r bg-white">
      {/* Search */}
      <div className="border-vista-text/10 border-b p-4">
        <div className="bg-vista-bg relative">
          <Search className="text-vista-text/40 absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="text-vista-text placeholder:text-vista-text/40 w-full rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-vista-accent"
          />
        </div>
      </div>

      {/* Conversations */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.map((conv) => (
          <button
            key={conv.id}
            onClick={() => {
              setSelectedConversation(conv.id);
              onSelectClose?.();
            }}
            className={`w-full border-b border-vista-text/10 p-4 text-left transition-colors hover:bg-vista-bg/50 ${
              selectedConversation === conv.id ? "bg-vista-accent/10" : ""
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="relative">
                <img
                  src={conv.avatar}
                  alt={conv.name}
                  className="h-12 w-12 rounded-full"
                />
                {conv.online && (
                  <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green-500" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-vista-primary truncate font-semibold text-sm">
                    {conv.name}
                  </h3>
                  <span className="text-vista-text/40 text-xs">
                    {conv.timestamp}
                  </span>
                </div>
                {conv.propertyName && (
                  <p className="text-vista-accent truncate text-xs">
                    {conv.propertyName}
                  </p>
                )}
                <div className="mt-1 flex items-center justify-between">
                  <p className="text-vista-text/60 truncate text-sm">
                    {conv.lastMessage}
                  </p>
                  {conv.unread > 0 && (
                    <span className="bg-vista-accent ml-2 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold text-black">
                      {conv.unread}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="bg-vista-bg flex min-h-screen flex-col">
      <SellerNavbar />

      <div className="mx-auto w-full max-w-7xl flex-1 px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-vista-text/20 bg-white text-vista-text transition-colors hover:text-vista-primary md:hidden"
              aria-label="Open conversations"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-vista-primary text-3xl font-bold">Messages</h1>
              <p className="text-vista-text/60 mt-1 text-sm">
                Communicate with potential buyers
              </p>
            </div>
          </div>
        </motion.div>

        <AnimatePresence>
          {isSidebarOpen && (
            <>
              <motion.div
                className="fixed inset-0 z-40 bg-black/30"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsSidebarOpen(false)}
              />
              <motion.div
                className="fixed inset-y-0 left-0 z-50 w-80 max-w-[85%] p-4"
                initial={{ x: -320, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -320, opacity: 0 }}
                transition={{ type: "spring", stiffness: 320, damping: 30 }}
              >
                <div className="shadow-lg rounded-2xl overflow-hidden">
                  {renderConversationList(() => setIsSidebarOpen(false))}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="shadow-vista-primary/5 grid h-[calc(100vh-280px)] grid-cols-1 overflow-hidden rounded-2xl bg-white shadow-lg md:grid-cols-3"
        >
          {/* Conversations List */}
          <div className="hidden md:flex">
            {renderConversationList()}
          </div>

          {/* Chat Area */}
          <div className="col-span-2 flex flex-col">
            {selectedConvo ? (
              <>
                {/* Chat Header */}
                <div className="border-vista-text/10 flex items-center justify-between border-b p-4">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src={selectedConvo.avatar}
                        alt={selectedConvo.name}
                        className="h-10 w-10 rounded-full"
                      />
                      {selectedConvo.online && (
                        <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-green-500" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-vista-primary font-semibold">
                        {selectedConvo.name}
                      </h3>
                      {selectedConvo.propertyName && (
                        <p className="text-vista-text/60 text-xs">
                          Inquiry: {selectedConvo.propertyName}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="text-vista-text/60 hover:text-vista-primary rounded-lg p-2 transition-colors hover:bg-vista-bg/50">
                      <Phone className="h-5 w-5" />
                    </button>
                    <button className="text-vista-text/60 hover:text-vista-primary rounded-lg p-2 transition-colors hover:bg-vista-bg/50">
                      <Video className="h-5 w-5" />
                    </button>
                    <button className="text-vista-text/60 hover:text-vista-primary rounded-lg p-2 transition-colors hover:bg-vista-bg/50">
                      <MoreVertical className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  <AnimatePresence>
                    {currentMessages.map((msg) => (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className={`flex ${msg.isOwn ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                            msg.isOwn
                              ? "bg-vista-accent text-black"
                              : "bg-vista-bg text-vista-text"
                          }`}
                        >
                          {msg.imageUrl && (
                            <img
                              src={msg.imageUrl}
                              alt="Attachment"
                              className="mb-2 rounded-lg"
                            />
                          )}
                          <p className="text-sm">{msg.text}</p>
                          <div className={`mt-1 flex items-center justify-end gap-1 ${
                            msg.isOwn ? "text-black/60" : "text-vista-text/40"
                          }`}>
                            <span className="text-xs">
                              {msg.timestamp.toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                            {msg.isOwn && (
                              msg.read ? (
                                <CheckCheck className="h-3 w-3" />
                              ) : (
                                <Check className="h-3 w-3" />
                              )
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {/* Input Area */}
                <div className="border-vista-text/10 border-t p-4">
                  <div className="bg-vista-bg flex items-center gap-2 rounded-lg px-4 py-2">
                    <button className="text-vista-text/60 hover:text-vista-primary transition-colors">
                      <Paperclip className="h-5 w-5" />
                    </button>
                    <button className="text-vista-text/60 hover:text-vista-primary transition-colors">
                      <ImageIcon className="h-5 w-5" />
                    </button>
                    <input
                      type="text"
                      placeholder="Type a message..."
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      className="text-vista-text placeholder:text-vista-text/40 flex-1 bg-transparent text-sm focus:outline-none"
                    />
                    <button className="text-vista-text/60 hover:text-vista-primary transition-colors">
                      <Smile className="h-5 w-5" />
                    </button>
                    <button
                      onClick={handleSendMessage}
                      disabled={!messageText.trim()}
                      className="bg-vista-accent hover:bg-vista-accent/90 disabled:bg-vista-text/20 ml-2 rounded-lg p-2 transition-colors disabled:cursor-not-allowed"
                    >
                      <Send className="h-5 w-5 text-black" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex h-full items-center justify-center">
                <div className="text-center">
                  <div className="bg-vista-bg mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                    <Send className="text-vista-text/40 h-8 w-8" />
                  </div>
                  <h3 className="text-vista-primary mb-2 text-lg font-semibold">
                    Select a conversation
                  </h3>
                  <p className="text-vista-text/60 text-sm">
                    Choose a conversation from the list to start messaging
                  </p>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      <SellerFooter />
    </div>
  );
}
