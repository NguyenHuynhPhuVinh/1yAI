'use client'
import React, { useEffect, useState, useRef, ChangeEvent, FormEvent } from "react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { db } from "../../libs/firebase";
import {
    collection,
    query,
    orderBy,
    onSnapshot,
    addDoc,
    serverTimestamp,
} from "firebase/firestore";
import axios from "axios";
import { CiSearch } from "react-icons/ci";
import { IoMdDoneAll } from "react-icons/io";
import { IoSend } from "react-icons/io5";
import { IoSettings } from "react-icons/io5";
import { IoMdClose } from "react-icons/io";
import { IoChatbubbleEllipsesSharp } from "react-icons/io5";
import { motion } from "framer-motion";

interface Message {
    id: string;
    text: string;
    userName: string;
    userIcon: string;
    timestamp: {
        seconds: number;
        nanoseconds: number;
    };
}

interface Character {
    mal_id: number;
    name: string;
    images: {
        jpg: {
            image_url: string;
        };
    };
}

const ChatBox: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState<string>("");
    const [userName, setUserName] = useState<string | null>(null);
    const [userIcon, setUserIcon] = useState<string | null>(null);
    const [isNameModalOpen, setIsNameModalOpen] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [searchResults, setSearchResults] = useState<Character[]>([]);
    const [selectedCharacterId, setSelectedCharacterId] = useState<number | null>(null);
    const [isTypeNameModalOpen, setIsTypeNameModalOpen] = useState<boolean>(false);
    const router = useRouter();

    // Ref for the messages container
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const storedName = localStorage.getItem("userName");
        const storedIcon = localStorage.getItem("userIcon");
        if (!storedName || !storedIcon) {
            setIsNameModalOpen(true);
        } else {
            setUserName(storedName);
            setUserIcon(storedIcon);
        }

        const q = query(collection(db, "messages"), orderBy("timestamp"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const messagesData: Message[] = [];
            snapshot.forEach((doc) => {
                messagesData.push({ id: doc.id, ...doc.data() } as Message);
            });
            setMessages(messagesData);
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        // Scroll to the bottom of the messages container whenever messages change
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = async () => {
        if (newMessage.trim() && userName && userIcon) {
            await addDoc(collection(db, "messages"), {
                text: newMessage,
                userName: userName,
                userIcon: userIcon,
                timestamp: serverTimestamp(),
            });
            setNewMessage("");
        }
    };

    const handleNameSubmit = () => {
        if (userName && userIcon && searchResults.length > 0 && searchQuery !== '' && selectedCharacterId !== null) {
            localStorage.setItem("userName", userName);
            localStorage.setItem("userIcon", userIcon);
            setIsNameModalOpen(false);
            setSearchResults([]);
            setSearchQuery('');
            setSelectedCharacterId(null);
        }
    };

    const handleSearch = async (e: FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            try {
                const response = await axios.get(`https://api.jikan.moe/v4/characters`, {
                    params: {
                        q: searchQuery,
                        limit: 10,
                    },
                });
                setSearchResults(response.data.data);
            } catch (error) {
                console.error("Error fetching character data:", error);
            }
        }
    };

    const selectCharacter = (character: Character) => {
        setUserIcon(character.images.jpg.image_url);
        setUserName(character.name.split(" ").reverse().join(" "));
        setSearchQuery(character.name.split(" ").reverse().join(" "));
        setSelectedCharacterId(character.mal_id); // Update the selected character ID
    };

    const handleChangeCharacter = () => {
        setIsNameModalOpen(true);
        setIsTypeNameModalOpen(true);
    }

    return (
        <div className="flex flex-col h-screen bg-gray-900 py-12">
            <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="fixed top-0 left-0 p-4 bg-gray-800 w-screen"
            >
                <div className="flex text-purple-400 font-bold items-center">
                    <p>Phòng Chat Anime</p>
                </div>
            </motion.div>
            {isNameModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className="bg-gray-800 text-white rounded-lg shadow-2xl w-11/12 max-w-md"
                    >
                        {isTypeNameModalOpen && (
                            <div className="flex justify-end">
                                <IoMdClose
                                    className="mt-3 mx-3 text-purple-400 text-2xl cursor-pointer hover:text-purple-300 transition-colors"
                                    onClick={() => {
                                        setIsNameModalOpen(false);
                                        setSearchResults([]);
                                        setSearchQuery('');
                                        setSelectedCharacterId(null);
                                    }}
                                />
                            </div>
                        )}
                        <div className={`px-6 pb-6 ${isTypeNameModalOpen ? "pt-2" : "pt-6"}`}>
                            <h2 className="text-xl font-bold mb-4 text-purple-400">Chọn nhân vật Anime của bạn!</h2>
                            <form onSubmit={handleSearch} className="flex mb-4">
                                <input
                                    type="text"
                                    className="flex-1 p-2 outline-none border rounded bg-gray-700 text-white focus:ring-2 focus:ring-purple-400"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Nhập tên nhân vật..."
                                />
                                <button
                                    type="submit"
                                    className="ml-2 text-3xl text-purple-400 hover:text-purple-300 transition-colors"
                                >
                                    <CiSearch />
                                </button>
                            </form>
                            <div className="grid grid-cols-1 gap-4 max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-purple-400 scrollbar-track-gray-700">
                                {searchResults.map((character) => (
                                    <motion.div
                                        key={character.mal_id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className={`flex items-center p-2 border rounded cursor-pointer transition-colors ${character.mal_id === selectedCharacterId
                                                ? 'border-purple-400 bg-gray-700'
                                                : 'border-gray-600 hover:bg-gray-700'
                                            }`}
                                        onClick={() => selectCharacter(character)}
                                    >
                                        <div className="image-container mr-2 w-16 h-16 overflow-hidden rounded-full">
                                            <Image
                                                src={character.images.jpg.image_url}
                                                alt={character.name}
                                                width={64}
                                                height={64}
                                                className="object-cover w-full h-full"
                                            />
                                        </div>
                                        <p className="text-gray-200">{character.name.split(" ").reverse().join(" ")}</p>
                                    </motion.div>
                                ))}
                            </div>
                            <button
                                onClick={handleNameSubmit}
                                className="mt-4 bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded transition-colors"
                            >
                                Xác nhận
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
            <div className="flex-1 p-4 overflow-y-auto">
                {messages.map((message, index) => (
                    <motion.div
                        key={message.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="flex my-4"
                    >
                        <div className="image-container mr-2">
                            <Image
                                src={message.userIcon}
                                alt={message.userName}
                                width={225}  // Chiều rộng cố định của ảnh
                                height={350} // Chiều cao cố định của ảnh
                                quality={100}
                                className="flex-shrink-0 rounded-lg shadow-lg"
                            />
                        </div>
                        <div className="flex-1">
                            <p className="font-bold text-pink-400">{message.userName}</p>
                            <div className="my-2 p-3 bg-gray-800 rounded-lg text-gray-200 flex items-center shadow-md">
                                <p>{message.text}</p>
                            </div>
                        </div>
                    </motion.div>
                ))}
                {/* This div is used as a reference point to scroll to */}
                <div ref={messagesEndRef} />
            </div>
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex items-center p-4 bg-gray-800"
            >
                <IoSettings
                    className="mr-2 text-purple-400 text-2xl cursor-pointer hover:text-purple-300 transition-colors"
                    onClick={handleChangeCharacter}
                />
                <input
                    type="text"
                    className="flex-1 p-2 outline-none text-gray-200 rounded bg-gray-700 focus:ring-2 focus:ring-purple-400"
                    value={newMessage}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setNewMessage(e.target.value)
                    }
                    placeholder="Nhập tin nhắn..."
                />
                {newMessage ?
                    (
                        <button
                            onClick={handleSend}
                            className="ml-2 text-purple-400 text-2xl cursor-pointer hover:text-purple-300 transition-colors"
                        >
                            <IoSend />
                        </button>
                    ) : (
                        <IoChatbubbleEllipsesSharp
                            onClick={() => {
                                router.push("/chat");
                                window.sessionStorage.setItem('reload', 'true');
                            }}
                            className="ml-2 text-purple-400 text-2xl cursor-pointer hover:text-purple-300 transition-colors"
                        />
                    )
                }
            </motion.div>
        </div>
    );
};

export default ChatBox;
