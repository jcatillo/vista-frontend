import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, MessageCircle } from "lucide-react";
import axios from "axios";
import { useMarkAI } from "../../hooks/useMarkAI";
import env from "../../utils/env";

// Parse markdown-like formatting in messages
function parseMessageContent(text: string): React.ReactNode[] {
  // First, split by newlines (handle both \n and actual newlines)
  const lines = text.split(/\\n|\n/);

  const parseInlineFormatting = (
    line: string,
    lineIndex: number
  ): React.ReactNode[] => {
    const result: React.ReactNode[] = [];
    // Regex to match **bold**, *italic*, `code`, and plain text
    const regex = /(\*\*(.+?)\*\*|\*(.+?)\*|`(.+?)`)/g;
    let lastIndex = 0;
    let match;
    let keyIndex = 0;

    while ((match = regex.exec(line)) !== null) {
      // Add text before the match
      if (match.index > lastIndex) {
        result.push(line.slice(lastIndex, match.index));
      }

      if (match[2]) {
        // **bold**
        result.push(
          <strong key={`${lineIndex}-${keyIndex++}`}>{match[2]}</strong>
        );
      } else if (match[3]) {
        // *italic*
        result.push(<em key={`${lineIndex}-${keyIndex++}`}>{match[3]}</em>);
      } else if (match[4]) {
        // `code`
        result.push(
          <code
            key={`${lineIndex}-${keyIndex++}`}
            className="rounded bg-gray-200 px-1 py-0.5 font-mono text-xs"
          >
            {match[4]}
          </code>
        );
      }

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < line.length) {
      result.push(line.slice(lastIndex));
    }

    return result.length > 0 ? result : [line];
  };

  // Group consecutive list items together
  const elements: React.ReactNode[] = [];
  let currentList: { type: "ul" | "ol"; items: React.ReactNode[] } | null =
    null;

  // Helper to close and push the current list
  const closeCurrentList = (keyIndex: number | string) => {
    if (!currentList) return;
    const { type, items } = currentList;
    if (type === "ul") {
      elements.push(
        <ul key={`ul-${keyIndex}`} className="my-1 ml-4 list-disc space-y-0.5">
          {items}
        </ul>
      );
    } else {
      elements.push(
        <ol
          key={`ol-${keyIndex}`}
          className="my-1 ml-4 list-decimal space-y-0.5"
        >
          {items}
        </ol>
      );
    }
    currentList = null;
  };

  lines.forEach((line, index) => {
    const trimmedLine = line.trim();

    // Check for numbered list: 1. item, 2. item, etc.
    const numberedMatch = trimmedLine.match(/^(\d+)\.\s+(.+)$/);
    // Check for bullet list: - item or * item (at start of line)
    const bulletMatch = trimmedLine.match(/^[-*]\s+(.+)$/);

    if (numberedMatch) {
      const content = parseInlineFormatting(numberedMatch[2], index);
      if (currentList?.type === "ol") {
        currentList.items.push(<li key={`li-${index}`}>{content}</li>);
      } else {
        closeCurrentList(index);
        currentList = {
          type: "ol",
          items: [<li key={`li-${index}`}>{content}</li>],
        };
      }
    } else if (bulletMatch) {
      const content = parseInlineFormatting(bulletMatch[1], index);
      if (currentList?.type === "ul") {
        currentList.items.push(<li key={`li-${index}`}>{content}</li>);
      } else {
        closeCurrentList(index);
        currentList = {
          type: "ul",
          items: [<li key={`li-${index}`}>{content}</li>],
        };
      }
    } else {
      // Not a list item - close any open list
      closeCurrentList(index);

      // Add regular line with inline formatting
      const parsedLine = parseInlineFormatting(line, index);
      elements.push(...parsedLine);

      // Add line break after each line except the last (and not after lists)
      if (index < lines.length - 1) {
        elements.push(<br key={`br-${index}`} />);
      }
    }
  });

  // Close any remaining open list
  closeCurrentList("final");

  return elements;
}

export function MarkAI() {
  const { messages, isOpen, setIsOpen, addMessage } = useMarkAI();
  const [isHovered, setIsHovered] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change or typing state updates
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  /* // Function commentedfor now
  const handleClearHistory = () => {
    if (window.confirm("Are you sure you want to clear your chat history?")) {
      localStorage.removeItem("vista_chat_history");
      // import this from useMarkAI
      setMessages([
        {
          id: "1",
          text: "Hi! I'm Mark AI. How can I help you find your perfect property today?",
          sender: "bot",
          timestamp: new Date(),
        },
      ]);
    }
  };
  */

  const handleSendMessage = async () => {
    if (inputValue.trim() === "" || isTyping) return;

    const userText = inputValue;
    addMessage(userText, "user");
    setInputValue("");
    setIsTyping(true);

    // Format history for Gemini API (Mapping "bot" to "model")
    const formattedHistory = messages.slice(-20).map((msg) => ({
      role: msg.sender === "user" ? "user" : "model",
      parts: [{ text: msg.text }],
    }));

    try {
      const response = await axios.post(`${env.BASE_URL}/mark/chat`, {
        message: userText,
        history: formattedHistory,
      });

      if (response.data && response.data.reply) {
        addMessage(response.data.reply, "bot");
      }
    } catch (error) {
      console.error("Chat Error:", error);
      addMessage(
        "I'm having trouble reaching the server. Please check your connection.",
        "bot"
      );
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="fixed right-3 bottom-3 z-40 sm:right-6 sm:bottom-6">
      <AnimatePresence mode="wait">
        {isOpen && (
          <motion.div
            key="chatbox"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed inset-0 z-40 m-0 flex h-screen w-screen flex-col overflow-hidden rounded-none border-0 bg-white shadow-none sm:static sm:mb-4 sm:h-auto sm:w-96 sm:rounded-2xl sm:border sm:border-gray-200 sm:shadow-2xl"
          >
            {/* Header - Reverted to Original Design */}
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
              ref={scrollRef}
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
                      {message.sender === "bot"
                        ? parseMessageContent(message.text)
                        : message.text.split("\n").map((line, i, arr) => (
                            <span key={i}>
                              {line}
                              {i < arr.length - 1 && <br />}
                            </span>
                          ))}
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
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Send message..."
                rows={1}
                className="focus:border-vista-primary focus:ring-vista-primary/20 max-h-24 min-h-9 flex-1 resize-none rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm transition-colors outline-none focus:bg-white focus:ring-1"
                style={{ height: "auto", overflow: "hidden" }}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = "auto";
                  target.style.height =
                    Math.min(target.scrollHeight, 96) + "px";
                }}
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

      {/* Floating Button - Reverted to Original Color */}
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
