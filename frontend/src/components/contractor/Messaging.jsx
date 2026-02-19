import { useEffect, useRef, useState } from "react";
import { Client } from "@stomp/stompjs";
import axios from "axios";
import { Send } from "lucide-react";

export default function ChatWindow({
    currentUserId = 2,
    otherUserId = 5,
    otherUserName = "User"
}) {
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");
    const [connected, setConnected] = useState(false);
    const clientRef = useRef(null);
    const messagesEndRef = useRef(null);
    const BASE_URL = import.meta.env.VITE_BACKEND_URL;

    // Auto scroll
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // Load previous messages
    const loadMessages = async () => {
        try {
            const res = await axios.get(
                `${BASE_URL}/api/chat?senderId=${currentUserId}&receiverId=${otherUserId}`
            );
            setMessages(res.data);
        } catch (error) {
            console.error("Error loading messages", error);
        }
    };

    // Connect WebSocket
    const connectWebSocket = () => {
        const stompClient = new Client({
            brokerURL: BASE_URL.replace(/^http/, "ws") + "/ws",
            reconnectDelay: 5000,
            debug: (str) => {
                console.log("STOMP DEBUG:", str);
            },
            onConnect: () => {
                console.log("✅ Connected");
                setConnected(true);
                stompClient.subscribe(
                    `/topic/messages/${currentUserId}`,
                    (message) => {
                        const receivedMessage = JSON.parse(message.body);

                        // Add received message to UI
                        setMessages((prev) => [...prev, receivedMessage]);
                    }
                );
            },
            onWebSocketError: (error) => {
                console.error("WebSocket error:", error);
            },
            onStompError: (frame) => {
                console.error("Broker error:", frame.headers["message"]);
            }
        });

        stompClient.activate();
        clientRef.current = stompClient;
    };

    // Send message
    const sendMessage = () => {
        if (!text.trim()) return;

        const client = clientRef.current;

        if (!client || !client.connected) {
            console.log("⏳ Still connecting...");
            return;
        }

        const message = {
            senderId: currentUserId,
            receiverId: otherUserId,
            content: text
        };

        client.publish({
            destination: "/app/chat.send",
            body: JSON.stringify(message)
        });

        // Optimistic UI update
        setMessages((prev) => [...prev, message]);
        setText("");
    };

    // Initial load
    useEffect(() => {
        loadMessages();
        connectWebSocket();

        return () => {
            if (clientRef.current) {
                clientRef.current.deactivate();
            }
        };
    }, [currentUserId, otherUserId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    return (
        <div className="card p-6 w-full max-w-2xl mx-auto animate-fade-in">
            {/* Header */}
            <div className="border-b pb-4 mb-4">
                <h2 className="text-xl font-bold">
                    Chat with {otherUserName}
                </h2>
            </div>

            {/* Messages */}
            <div className="h-96 overflow-y-auto space-y-3 mb-4 px-2">
                {messages.map((msg, index) => {
                    const isOwn = msg.senderId === currentUserId;

                    return (
                        <div
                            key={index}
                            className={`flex ${
                                isOwn ? "justify-end" : "justify-start"
                            }`}
                        >
                            <div
                                className={`max-w-xs md:max-w-sm px-4 py-2 rounded-2xl shadow-sm text-sm
                                ${
                                    isOwn
                                        ? "bg-primary-600 text-white rounded-br-none"
                                        : "bg-slate-100 text-slate-800 rounded-bl-none"
                                }`}
                            >
                                <div>{msg.content}</div>
                                <div className="text-xs mt-1 opacity-70 text-right">
                                    {msg.timestamp
                                        ? new Date(
                                              msg.timestamp
                                          ).toLocaleTimeString()
                                        : ""}
                                </div>
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="flex items-center space-x-2">
                <input
                    type="text"
                    className="input flex-1"
                    placeholder="Type your message..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={(e) =>
                        e.key === "Enter" && sendMessage()
                    }
                />
                <button
                    onClick={sendMessage}
                    disabled={!connected}
                    className="btn btn-primary flex items-center"
                >
                    <Send className="w-4 h-4 mr-1" />
                    Send
                </button>
            </div>
        </div>
    );
}