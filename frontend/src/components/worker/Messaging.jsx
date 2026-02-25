import { useEffect, useRef, useState } from "react";
import { Client } from "@stomp/stompjs";
import axios from "axios";
import { Send, MessageSquare, Circle, ChevronLeft } from "lucide-react";

// Mock contacts — replace with API when ready
const mockContacts = [
    { id: 1, name: "BuildCo Inc.", lastMessage: "Looking forward to having you!", unread: 2 },
    { id: 2, name: "HomeWorks LLC", lastMessage: "Can you start Monday?", unread: 0 },
    { id: 3, name: "Quick Fix Solutions", lastMessage: "Interview tomorrow at 10am", unread: 1 },
];

export default function ChatWindow({
    currentUserId = 4,
    otherUserId: initialOtherUserId = 1,
    otherUserName: initialOtherUserName = "User",
    theme = "worker",
}) {
    const [contacts, setContacts] = useState(mockContacts);
    const [activeContact, setActiveContact] = useState({
        id: initialOtherUserId,
        name: initialOtherUserName,
    });
    const [showContacts, setShowContacts] = useState(true);
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");
    const [connected, setConnected] = useState(false);
    const clientRef = useRef(null);
    const messagesEndRef = useRef(null);
    const BASE_URL = import.meta.env.VITE_BACKEND_URL;

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const loadMessages = async () => {
        try {
            const res = await axios.get(
                `${BASE_URL}/api/chat?senderId=${currentUserId}&receiverId=${activeContact.id}`
            );
            setMessages(res.data);
        } catch (error) {
            console.error("Error loading messages", error);
        }
    };
    const loadContacts = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/api/chat/${currentUserId}/contacts`);
            const fetchedContacts = res.data.map((c) => ({
                id: c.user.id,
                name: c.user.name,
                lastMessage: c.lastMessage,
                unread: c.unreadCount,
            }));
            setContacts(fetchedContacts);
        } catch (error) {
            console.error("Error loading contacts", error);
        }
    };
    const connectWebSocket = () => {
        const stompClient = new Client({
            brokerURL: BASE_URL.replace(/^http/, "ws") + "/ws",
            reconnectDelay: 5000,
            onConnect: () => {
                setConnected(true);
                stompClient.subscribe(`/topic/messages/${currentUserId}`, (message) => {
                    const received = JSON.parse(message.body);
                    setMessages((prev) => [...prev, received]);
                });
            },
            onWebSocketError: (err) => console.error("WebSocket error:", err),
            onStompError: (frame) => console.error("Broker error:", frame.headers["message"]),
        });
        stompClient.activate();
        clientRef.current = stompClient;
    };

    const sendMessage = () => {
        if (!text.trim()) return;
        const client = clientRef.current;
        if (!client?.connected) return;

        const message = {
            senderId: currentUserId,
            receiverId: activeContact.id,
            content: text,
        };
        client.publish({ destination: "/app/chat.send", body: JSON.stringify(message) });
        setMessages((prev) => [...prev, message]);
        setText("");
    };

    useEffect(() => {
        loadContacts();
        loadMessages();
        connectWebSocket();
        return () => clientRef.current?.deactivate();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentUserId, activeContact.id]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // ── Sent bubble: primary-600 gradient for worker, flat primary-600 for contractor
    const sentBubbleCls =
        theme === "worker"
            ? "bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-br-none"
            : "bg-primary-600 text-white rounded-br-none";

    const receivedBubbleCls =
        theme === "worker"
            ? "bg-primary-50 text-slate-800 rounded-bl-none border border-primary-100"
            : "bg-slate-100 text-slate-800 rounded-bl-none";

    return (
        <div
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden animate-fade-in flex flex-col"
            style={{ height: "calc(100vh - 10rem)" }}
        >
            <div className="flex flex-1 min-h-0 h-full">

                {/* ── Contacts sidebar ─────────────────────────────────────────── */}
                <div
                    className={`${showContacts ? "flex" : "hidden md:flex"
                        } flex-col w-full md:w-72 border-r border-slate-100 shrink-0 h-full min-h-0`}
                >
                    {/* Sidebar header */}
                    <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-5 py-4">
                        <h2 className="text-lg font-bold text-white flex items-center gap-2">
                            <MessageSquare className="w-5 h-5" />
                            Messages
                        </h2>
                        <p className="text-primary-100 text-xs mt-0.5">
                            {connected ? "● Connected" : "○ Connecting…"}
                        </p>
                    </div>

                    {/* Contact list */}
                    <div className="flex-1 overflow-y-auto divide-y divide-slate-50">
                        {contacts.map((contact) => {
                            const isActive = activeContact.id === contact.id;
                            return (
                                <button
                                    key={contact.id}
                                    onClick={() => {
                                        setActiveContact({ id: contact.id, name: contact.name });
                                        setShowContacts(false);
                                    }}
                                    className={`w-full text-left px-4 py-3.5 transition-all hover:bg-primary-50 ${isActive
                                        ? "bg-primary-50 border-l-4 border-primary-600"
                                        : "border-l-4 border-transparent"
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0 bg-gradient-to-br from-primary-600 to-primary-700">
                                            {contact.name.charAt(0)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between">
                                                <span className="font-semibold text-sm text-slate-700 truncate">
                                                    {contact.name}
                                                </span>
                                                {contact.unread > 0 && (
                                                    <span className="ml-2 shrink-0 bg-primary-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                                                        {contact.unread}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-xs text-slate-400 truncate mt-0.5">
                                                {contact.lastMessage}
                                            </p>
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* ── Chat pane ───────────────────────────────────────────────── */}
                <div
                    className={`${showContacts ? "hidden md:flex" : "flex"} flex-col flex-1 min-h-0`}
                >
                    {/* Chat header */}
                    <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-5 py-4 flex items-center gap-3">
                        <button
                            onClick={() => setShowContacts(true)}
                            className="md:hidden text-white/80 hover:text-white mr-1"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>

                        <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-sm">
                            {activeContact.name.charAt(0)}
                        </div>

                        <div>
                            <div className="font-bold text-white text-sm">{activeContact.name}</div>
                            <div className="text-primary-100 text-xs flex items-center gap-1">
                                <Circle className="w-2 h-2 fill-green-300 text-green-300" />
                                {connected ? "Online" : "Connecting…"}
                            </div>
                        </div>
                    </div>

                    {/* Messages area */}
                    <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3 bg-slate-50/60">
                        {messages.length === 0 && (
                            <div className="flex flex-col items-center justify-center h-full text-slate-400 text-sm py-16">
                                <MessageSquare className="w-10 h-10 mb-3 opacity-30" />
                                No messages yet. Say hello!
                            </div>
                        )}
                        {messages.map((msg, index) => {
                            const isOwn = msg.senderId === currentUserId;
                            return (
                                <div key={index} className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
                                    <div
                                        className={`max-w-xs md:max-w-sm px-4 py-2.5 rounded-2xl shadow-sm text-sm ${isOwn ? sentBubbleCls : receivedBubbleCls
                                            }`}
                                    >
                                        <div>{msg.content}</div>
                                        {msg.timestamp && (
                                            <div className="text-xs mt-1 opacity-60 text-right">
                                                {new Date(msg.timestamp).toLocaleTimeString([], {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input bar */}
                    <div className="px-5 py-4 bg-white border-t border-slate-100 flex items-center gap-3">
                        <input
                            type="text"
                            className="input flex-1"
                            placeholder="Type your message…"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                        />
                        <button
                            onClick={sendMessage}
                            disabled={!connected}
                            className="btn btn-primary flex items-center gap-2"
                        >
                            <Send className="w-4 h-4" />
                            Send
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}