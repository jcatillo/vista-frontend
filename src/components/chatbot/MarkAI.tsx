import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, MessageCircle } from "lucide-react";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

export function MarkAI() {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hi! I'm Mark AI. How can I help you find your perfect property today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = () => {
    if (inputValue.trim() === "") return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate bot response
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Thanks for your message! I'm here to help you find properties that match your needs. What are you looking for?",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="fixed right-3 bottom-3 z-50 sm:right-6 sm:bottom-6">
      <AnimatePresence mode="wait">
        {isOpen && (
          <motion.div
            key="chatbox"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed inset-0 z-50 m-0 flex h-screen w-screen flex-col overflow-hidden rounded-none border-0 bg-white shadow-none sm:static sm:mb-4 sm:h-auto sm:w-96 sm:rounded-2xl sm:border sm:border-gray-200 sm:shadow-2xl"
          >
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-vista-primary flex items-center justify-between px-4 py-4 text-white"
            >
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                  <MessageCircle className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold">Mark AI</h3>
                  <p className="text-vista-bg/80 text-xs">
                    Always here to help
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="cursor-pointer rounded-full p-1 transition-colors hover:bg-white/20"
              >
                <X className="h-5 w-5" />
              </button>
            </motion.div>

            {/* Messages Container */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15 }}
              className="h-[calc(100vh-200px)] overflow-y-auto bg-gray-50 px-3 py-3 sm:h-96 sm:px-4 sm:py-4"
            >
              <div className="flex flex-col gap-3">
                {messages.map((message, index) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`flex ${
                      message.sender === "user"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[85%] rounded-lg px-3 py-2 text-sm sm:max-w-xs sm:px-4 ${
                        message.sender === "user"
                          ? "bg-vista-primary rounded-br-none text-white"
                          : "rounded-bl-none bg-white text-gray-900 shadow-sm"
                      }`}
                    >
                      {message.text}
                    </div>
                  </motion.div>
                ))}

                {/* Typing Indicator */}
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-2"
                  >
                    <div className="rounded-lg bg-white px-4 py-2 shadow-sm">
                      <div className="flex gap-1">
                        {[0, 1, 2].map((index) => (
                          <motion.div
                            key={index}
                            animate={{ y: [0, -4, 0] }}
                            transition={{
                              duration: 0.6,
                              delay: index * 0.1,
                              repeat: Infinity,
                            }}
                            className="h-2 w-2 rounded-full bg-gray-400"
                          />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>

            {/* Input Area */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex gap-2 border-t border-gray-200 bg-white px-3 py-2 sm:px-4 sm:py-3"
            >
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="focus:border-vista-primary focus:ring-vista-primary/20 flex-1 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm transition-colors outline-none focus:bg-white focus:ring-1"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSendMessage}
                disabled={inputValue.trim() === "" || isTyping}
                className="bg-vista-primary hover:bg-opacity-90 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-white transition-colors disabled:opacity-50 sm:h-auto sm:w-auto sm:p-2"
              >
                <Send className="h-4 w-4" />
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <motion.div
        className="relative flex items-end justify-end"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <motion.button
          layout
          onClick={() => setIsOpen(!isOpen)}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
          className="bg-vista-primary flex h-12 w-12 cursor-pointer items-center justify-center rounded-full text-white shadow-lg transition-all hover:shadow-xl sm:h-14 sm:w-14"
        >
          <AnimatePresence mode="wait">
            {!isOpen ? (
              <motion.div
                key="icon"
                initial={{ rotate: -180, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 180, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6" />
              </motion.div>
            ) : (
              <motion.div
                key="close"
                initial={{ rotate: -180, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 180, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <X className="h-5 w-5 sm:h-6 sm:w-6" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>

        {/* Hover Tooltip - Hidden on mobile */}
        <AnimatePresence>
          {!isOpen && isHovered && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
              className="pointer-events-none absolute right-0 bottom-16 hidden rounded-lg bg-gray-900 px-3 py-2 text-sm whitespace-nowrap text-white shadow-lg sm:block"
            >
              Mark AI
              <motion.div className="absolute right-4 -bottom-1 h-2 w-2 rotate-45 bg-gray-900" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Pulse Animation */}
      {!isOpen && (
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="border-vista-primary pointer-events-none absolute right-0 bottom-0 h-12 w-12 rounded-full border-2 opacity-30 sm:h-14 sm:w-14"
        />
      )}
    </div>
  );
}
