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
import { useNavigate } from "react-router-dom";

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
  agent?: boolean;
}

const sampleConversations: Conversation[] = [
  {
    id: "1",
    name: "Agent Maria",
    avatar: "https://ui-avatars.com/api/?name=Agent+Maria&background=1E3A8A&color=fff",
    lastMessage: "We can do a 4 PM viewing tomorrow.",
    timestamp: "5m ago",
    unread: 1,
    online: true,
    propertyName: "Modern Condo in BGC",
    agent: true,
  },
  {
    id: "2",
    name: "Developer Support",
    avatar: "https://ui-avatars.com/api/?name=Developer+Support&background=059669&color=fff",
    lastMessage: "Promo ends Friday. Want details?",
    timestamp: "1h ago",
    unread: 0,
    online: false,
  },
  {
    id: "3",
    name: "Agent Luis",
    avatar: "https://ui-avatars.com/api/?name=Agent+Luis&background=F97316&color=fff",
    lastMessage: "Got it. I'll email the brochure.",
    timestamp: "3h ago",
    unread: 0,
    online: true,
    propertyName: "Mountain View Lot",
    agent: true,
  },
];

const sampleMessages: Record<string, Message[]> = {
  "1": [
    {
      id: "1",
      text: "Hi, I'm interested in a tour for the BGC condo.",
      timestamp: new Date(Date.now() - 3600000),
      isOwn: true,
      read: true,
    },
    {
      id: "2",
      text: "Sure! I can do tomorrow at 4 PM or Saturday morning.",
      timestamp: new Date(Date.now() - 3300000),
      isOwn: false,
    },
    {
      id: "3",
      text: "4 PM tomorrow works. Please confirm the address.",
      timestamp: new Date(Date.now() - 1200000),
      isOwn: true,
      read: false,
    },
  ],
  "2": [
    {
      id: "1",
      text: "Can I still avail of the promo pricing?",
      timestamp: new Date(Date.now() - 7200000),
      isOwn: true,
    },
    {
      id: "2",
      text: "Yes! It runs until Friday. Want me to send the sheet?",
      timestamp: new Date(Date.now() - 7000000),
      isOwn: false,
    },
  ],
};

export default function BuyerMessages() {
  const navigate = useNavigate();
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
    <div className="shadow-vista-primary/5 flex h-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white">
      {/* Search */}
      <div className="border-b border-gray-100 p-3">
        <div className="relative">
          <Search className="text-vista-text/40 absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="text-vista-text placeholder:text-vista-text/40 w-full rounded-lg border border-gray-200 py-2 pl-9 pr-3 text-sm focus:border-vista-accent focus:outline-none"
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
            className={`w-full border-b border-gray-100 p-3 text-left transition-colors hover:bg-vista-accent/5 ${
              selectedConversation === conv.id ? "bg-vista-accent/10" : ""
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="relative">
                <img
                  src={conv.avatar}
                  alt={conv.name}
                  className="h-10 w-10 rounded-full"
                />
                {conv.online && (
                  <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-green-500" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-vista-primary truncate text-sm font-semibold">
                    {conv.name}
                  </h3>
                  <span className="text-vista-text/40 text-xs">{conv.timestamp}</span>
                </div>
                {conv.propertyName && (
                  <p className="text-vista-accent truncate text-xs">{conv.propertyName}</p>
                )}
                <div className="mt-1 flex items-center justify-between">
                  <p className="text-vista-text/60 truncate text-xs">{conv.lastMessage}</p>
                  {conv.unread > 0 && (
                    <span className="bg-vista-accent ml-2 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-black">
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
    <div className="bg-white min-h-screen">
      {/* Top bar */}
      <div className="sticky top-0 z-30 border-b border-gray-100 bg-white/95 backdrop-blur px-4 py-3 shadow-sm md:px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="text-vista-text/80 hover:text-vista-primary flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white transition-colors md:hidden"
              aria-label="Open conversations"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-vista-primary text-xl font-bold">Messages</h1>
              <p className="text-vista-text/60 text-sm">Chat with agents and support</p>
            </div>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="text-vista-text/60 hover:text-vista-primary rounded-full border border-gray-200 px-3 py-1 text-sm transition-colors"
          >
            Back
          </button>
        </div>
      </div>

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
              {renderConversationList(() => setIsSidebarOpen(false))}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="mx-auto flex h-[calc(100vh-120px)] max-w-6xl flex-col px-4 py-4 md:flex-row md:gap-4 md:px-6">
        {/* Conversations List */}
        <div className="mb-4 hidden h-full w-72 flex-shrink-0 md:mb-0 md:block">
          {renderConversationList()}
        </div>

        {/* Chat Area */}
        <div className="shadow-vista-primary/5 flex h-full flex-1 flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white">
          {selectedConvo ? (
            <>
              {/* Chat Header */}
              <div className="border-b border-gray-100 p-4 flex items-center justify-between">
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
                  <button className="text-vista-text/60 hover:text-vista-primary rounded-lg p-2 transition-colors hover:bg-vista-accent/5">
                    <Phone className="h-5 w-5" />
                  </button>
                  <button className="text-vista-text/60 hover:text-vista-primary rounded-lg p-2 transition-colors hover:bg-vista-accent/5">
                    <Video className="h-5 w-5" />
                  </button>
                  <button className="text-vista-text/60 hover:text-vista-primary rounded-lg p-2 transition-colors hover:bg-vista-accent/5">
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
                          msg.isOwn ? "bg-vista-accent text-black" : "bg-gray-50 text-gray-800"
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
                          msg.isOwn ? "text-black/60" : "text-gray-500"
                        }`}>
                          <span className="text-xs">
                            {msg.timestamp.toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                          {msg.isOwn && (msg.read ? <CheckCheck className="h-3 w-3" /> : <Check className="h-3 w-3" />)}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Input Area */}
              <div className="border-t border-gray-100 p-4">
                <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
                  <button className="text-gray-500 hover:text-vista-primary transition-colors">
                    <Paperclip className="h-5 w-5" />
                  </button>
                  <button className="text-gray-500 hover:text-vista-primary transition-colors">
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
                    className="text-gray-800 placeholder:text-gray-500 flex-1 bg-transparent text-sm focus:outline-none"
                  />
                  <button className="text-gray-500 hover:text-vista-primary transition-colors">
                    <Smile className="h-5 w-5" />
                  </button>
                  <button
                    onClick={handleSendMessage}
                    disabled={!messageText.trim()}
                    className="bg-vista-accent hover:bg-vista-accent/90 disabled:bg-gray-300 ml-2 rounded-lg px-3 py-2 text-sm font-semibold text-black transition-colors disabled:cursor-not-allowed"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-50">
                  <Send className="text-gray-400 h-8 w-8" />
                </div>
                <h3 className="text-vista-primary mb-2 text-lg font-semibold">Select a conversation</h3>
                <p className="text-gray-500 text-sm">Choose a chat to start messaging with an agent</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
