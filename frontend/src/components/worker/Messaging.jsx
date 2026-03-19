import { useEffect, useRef, useState } from "react";
import { Client } from "@stomp/stompjs";
import axios from "axios";
import { Send, MessageSquare, Circle, ChevronLeft } from "lucide-react";


export default function ChatWindow({
    currentUserId: propsUserId,
    otherUserId: propsOtherUserId,
    otherUserName: propsOtherUserName,
    contact = null,
    theme = "worker",
}) {
    const defaultUid = Number(localStorage.getItem("uid"));
    const currentUserId = propsUserId || defaultUid;

    const [contacts, setContacts] = useState(contact ? [contact] : []);
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
    const [searchTerm, setSearchTerm] = useState("");

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

    // ── Sent bubble: primary-600 gradient for worker, flat primary-600 for contractor
    const sentBubbleCls = "bg-primary-600 text-white rounded-br-sm shadow-sm";
    const receivedBubbleCls = "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-sm border border-slate-100 dark:border-slate-700 shadow-sm";

    return (
        <div className="bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 overflow-hidden animate-fade-in flex h-full w-full">
            {/* ── Contacts sidebar ─────────────────────────────────────────── */}
            <div
                className={`${showContacts ? "flex" : "hidden md:flex"} flex-col w-full md:w-80 border-r border-slate-100 dark:border-slate-800 shrink-0 h-full bg-slate-50/50 dark:bg-slate-800/20`}
            >
                {/* Sidebar header */}
                <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            Messages
                            <span className="bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-xs px-2 py-0.5 rounded-full font-semibold">
                                {contacts.length}
                            </span>
                        </h2>
                        <div className="flex items-center gap-1.5 mt-1 text-xs font-medium text-slate-500">
                            <div className={`w-2 h-2 rounded-full ${connected ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                            {connected ? "Connected" : "Reconnecting..."}
                        </div>
                    </div>
                </div>

                {/* Search Bar (Visual) */}
                <div className="p-4 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            placeholder="Search messages..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-transparent focus:bg-white dark:focus:bg-slate-900 border focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 rounded-xl text-sm transition-all"
                        />
                    </div>
                </div>

                {/* Contact list */}
                <div className="flex-1 overflow-y-auto w-full style-scrollbar px-2 py-2 space-y-1">
                    {contacts
                        .filter(contact => contact.name.toLowerCase().includes(searchTerm.toLowerCase()))
                        .map((contact) => {
                        const isActive = activeContact.id === contact.id;
                        return (
                            <button
                                key={contact.id}
                                onClick={() => {
                                    setActiveContact({ id: contact.id, name: contact.name });
                                    setShowContacts(false);
                                }}
                                className={`w-full text-left p-3 rounded-2xl transition-all duration-200 group flex items-center gap-3 relative ${
                                    isActive
                                        ? "bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700"
                                        : "hover:bg-slate-100 dark:hover:bg-slate-800/50 border border-transparent"
                                }`}
                            >
                                <div className="relative shrink-0">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-sm bg-gradient-to-br ${isActive ? 'from-primary-500 to-primary-600' : 'from-slate-400 to-slate-500'}`}>
                                        {contact.name.charAt(0)}
                                    </div>
                                    <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full"></div>
                                </div>
                                <div className="flex-1 min-w-0 pr-1">
                                    <div className="flex items-center justify-between mb-0.5">
                                        <span className={`font-bold text-sm truncate ${isActive ? 'text-primary-700 dark:text-primary-400' : 'text-slate-800 dark:text-slate-200'}`}>
                                            {contact.name}
                                        </span>
                                        <span className="text-[10px] font-medium text-slate-400 whitespace-nowrap ml-2">Just now</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <p className={`text-xs truncate ${contact.unread > 0 ? 'font-semibold text-slate-800 dark:text-slate-200' : 'text-slate-500 dark:text-slate-400'}`}>
                                            {contact.lastMessage || "No messages yet"}
                                        </p>
                                        {contact.unread > 0 && (
                                            <span className="ml-2 shrink-0 bg-primary-600 outline outline-2 outline-white dark:outline-slate-800 text-white text-[10px] font-bold min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center">
                                                {contact.unread}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* ── Chat pane ───────────────────────────────────────────────── */}
            <div
                className={`${showContacts ? "hidden md:flex" : "flex"} flex-col flex-1 min-w-0 bg-slate-50 dark:bg-slate-900 h-full relative`}
            >
                {/* Chat header */}
                <div className="px-6 py-4 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0 z-10 shadow-sm">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setShowContacts(true)}
                            className="md:hidden w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-700 mr-1"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>

                        {activeContact.id ? (
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                                        {activeContact.name ? activeContact.name.charAt(0) : "?"}
                                    </div>
                                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full"></div>
                                </div>
                                <div className="flex flex-col">
                                    <div className="font-extrabold text-slate-900 dark:text-white text-sm tracking-tight">{activeContact.name}</div>
                                    <div className="text-emerald-500 font-medium text-xs flex items-center gap-1">
                                        Online
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="font-bold text-slate-400">Select a contact</div>
                        )}
                    </div>
                </div>

                {/* Messages area */}
                <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4 bg-slate-50/50 dark:bg-slate-900/40 relative">
                    <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23000000\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}></div>
                    
                    {messages.length === 0 && (
                        <div className="flex flex-col items-center justify-center h-full text-slate-400 dark:text-slate-500 py-10 relative z-10">
                            <div className="w-20 h-20 bg-primary-50 dark:bg-primary-900/20 rounded-full flex items-center justify-center mb-4">
                                <MessageSquare className="w-8 h-8 text-primary-400 dark:text-primary-500" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300 mb-1">No messages yet</h3>
                            <p className="text-sm">Send a message to start the conversation.</p>
                        </div>
                    )}
                    {messages.map((msg, index) => {
                        const isOwn = msg.senderId === currentUserId;
                        // grouped messages logic for border radius could go here if we had detailed timestamps
                        return (
                            <div key={index} className={`flex ${isOwn ? "justify-end" : "justify-start"} relative z-10 animate-[fadeIn_0.3s_ease-out]`}>
                                <div
                                    className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-[15px] leading-relaxed relative ${isOwn ? sentBubbleCls : receivedBubbleCls}`}
                                >
                                    <div>{msg.content}</div>
                                    {msg.timestamp && (
                                        <div className={`text-[10px] font-medium mt-1 text-right flex items-center justify-end gap-1 ${isOwn ? 'text-primary-100' : 'text-slate-400'}`}>
                                            {new Date(msg.timestamp).toLocaleTimeString([], {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                            {isOwn && (
                                                <svg className="w-3 h-3 text-primary-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                    <div ref={messagesEndRef} className="h-4" />
                </div>

                {/* Input bar */}
                <div className="px-6 py-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 shrink-0 z-10">
                    <div className="flex items-center gap-3 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl border border-transparent focus-within:border-primary-200 dark:focus-within:border-primary-800 focus-within:bg-white dark:focus-within:bg-slate-900 transition-all shadow-inner relative">
                        <button className="p-2.5 text-slate-400 hover:text-primary-500 dark:text-slate-500 dark:hover:text-primary-400 transition-colors rounded-xl hover:bg-primary-50 dark:hover:bg-slate-800 shrink-0">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                            </svg>
                        </button>
                        <input
                            type="text"
                            className="flex-1 bg-transparent border-none focus:ring-0 text-[15px] dark:text-slate-100 placeholder-slate-400 font-medium !outline-none px-2"
                            placeholder="Write a message..."
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                        />
                        <button
                            onClick={sendMessage}
                            disabled={!connected || !activeContact.id || !text.trim()}
                            className="bg-primary-600 hover:bg-primary-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white p-2.5 rounded-xl transition-colors shadow-sm disabled:shadow-none flex items-center justify-center shrink-0"
                        >
                            <Send className="w-4 h-4 ml-0.5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}