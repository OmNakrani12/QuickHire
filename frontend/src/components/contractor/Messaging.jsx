import { useEffect, useRef, useState } from "react";
import { Client } from "@stomp/stompjs";
import axios from "axios";
import { Send, MessageSquare, Circle, ChevronLeft } from "lucide-react";

export default function ChatWindow({
    currentUserId: propsUserId,
    otherUserId: propsOtherUserId,
    otherUserName: propsOtherUserName,
}) {
    const defaultUid = Number(localStorage.getItem("uid"));
    const currentUserId = propsUserId || defaultUid;

    const [contacts, setContacts] = useState([]);
    const [activeContact, setActiveContact] = useState({
        id: propsOtherUserId || null,
        name: propsOtherUserName || "",
    });
    const activeContactRef = useRef(activeContact);

    useEffect(() => {
        activeContactRef.current = activeContact;
    }, [activeContact]);

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

            // Auto-select first contact if none active
            if (!activeContact.id && fetchedContacts.length > 0) {
                setActiveContact({ id: fetchedContacts[0].id, name: fetchedContacts[0].name });
                setShowContacts(false);
            }
        } catch (error) {
            console.error("Error loading contacts", error);
        }
    };

    const connectWebSocket = () => {
        if (!currentUserId) return;
        const stompClient = new Client({
            brokerURL: BASE_URL.replace(/^http/, "ws") + "/ws",
            reconnectDelay: 5000,
            onConnect: () => {
                setConnected(true);
                stompClient.subscribe(`/topic/messages/${currentUserId}`, (message) => {
                    const received = JSON.parse(message.body);
                    // Only append to messages if it belongs to the active conversation
                    const activeId = activeContactRef.current?.id;
                    if (activeId && (received.senderId === activeId || received.receiverId === activeId)) {
                        setMessages((prev) => [...prev, received]);
                    }
                    // Refresh contacts to update last message and unread count
                    loadContacts();
                });
            },
            onWebSocketError: (err) => console.error("WebSocket error:", err),
            onStompError: (frame) => console.error("Broker error:", frame.headers["message"]),
        });
        stompClient.activate();
        clientRef.current = stompClient;
    };

    const sendMessage = () => {
        if (!text.trim() || !activeContact.id) return;
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
        loadContacts();
    };

    // 1. Manage WebSocket connection and Contacts (depends on currentUserId only)
    useEffect(() => {
        if (!currentUserId) return;
        loadContacts();
        connectWebSocket();
        return () => clientRef.current?.deactivate();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentUserId]);

    // 2. Load messages when active contact changes
    useEffect(() => {
        if (!currentUserId || !activeContact.id) return;
        loadMessages();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentUserId, activeContact.id]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // ── Sent bubble: secondary-600 gradient (contractor theme)
    const sentBubbleCls = "bg-gradient-to-r from-secondary-600 to-secondary-700 text-white rounded-br-none";
    const receivedBubbleCls = "bg-secondary-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-none border border-secondary-100 dark:border-slate-700";

    return (
        <div
            className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 dark:border-slate-800 overflow-hidden animate-fade-in flex flex-col"
            style={{ height: "calc(100vh - 10rem)" }}
        >
            <div className="flex flex-1 min-h-0 h-full">

                {/* ── Contacts sidebar ─────────────────────────────────────────── */}
                <div
                    className={`${showContacts ? "flex" : "hidden md:flex"
                        } flex-col w-full md:w-72 border-r border-slate-100 dark:border-slate-800 shrink-0 h-full min-h-0`}
                >
                    {/* Sidebar header */}
                    <div className="bg-gradient-to-r from-secondary-600 to-secondary-700 px-5 py-4">
                        <h2 className="text-lg font-bold text-white flex items-center gap-2">
                            <MessageSquare className="w-5 h-5" />
                            Messages
                        </h2>
                        <p className="text-secondary-100 text-xs mt-0.5">
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
                                    className={`w-full text-left px-4 py-3.5 transition-all hover:bg-secondary-50 dark:hover:bg-slate-800/50 ${isActive
                                        ? "bg-secondary-50 dark:bg-slate-800 border-l-4 border-secondary-600"
                                        : "border-l-4 border-transparent"
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0 bg-gradient-to-br from-secondary-600 to-secondary-700">
                                            {contact.name.charAt(0)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between">
                                                <span className="font-semibold text-sm text-slate-700 dark:text-slate-200 truncate">
                                                    {contact.name}
                                                </span>
                                                {contact.unread > 0 && (
                                                    <span className="ml-2 shrink-0 bg-secondary-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
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
                    <div className="bg-gradient-to-r from-secondary-600 to-secondary-700 px-5 py-4 flex items-center gap-3">
                        <button
                            onClick={() => setShowContacts(true)}
                            className="md:hidden text-white/80 hover:text-white mr-1"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>

                        <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-sm">
                            {activeContact.name ? activeContact.name.charAt(0) : "?"}
                        </div>

                        <div>
                            <div className="font-bold text-white text-sm">{activeContact.name || "Select a contact"}</div>
                            <div className="text-secondary-100 text-xs flex items-center gap-1">
                                <Circle className="w-2 h-2 fill-green-300 text-green-300" />
                                {connected ? "Online" : "Connecting…"}
                            </div>
                        </div>
                    </div>

                    {/* Messages area */}
                    <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3 bg-slate-50/60 dark:bg-slate-900/40">
                        {messages.length === 0 && (
                            <div className="flex flex-col items-center justify-center h-full text-slate-400 dark:text-slate-500 text-sm py-16">
                                <MessageSquare className="w-10 h-10 mb-3 opacity-30 text-secondary-300 dark:text-slate-600" />
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
                    <div className="px-5 py-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3">
                        <input
                            type="text"
                            className="input flex-1 focus:border-secondary-500 focus:ring-secondary-500/20 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100"
                            placeholder="Type your message…"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                        />
                        <button
                            onClick={sendMessage}
                            disabled={!connected || !activeContact.id}
                            className="btn btn-secondary flex items-center gap-2"
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