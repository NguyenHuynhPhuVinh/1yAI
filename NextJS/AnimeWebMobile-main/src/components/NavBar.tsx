// components/NavBar.tsx
import React from "react";
import { useRouter, usePathname } from "next/navigation";
import Image from 'next/image';
import Lottie from 'lottie-react';
import HomeData from '../icon/home.json';
import GamesData from '../icon/games.json';
import ChatData from '../icon/chat.json';
import Live2dData from '../icon/live2d.json';
import InfoData from '../icon/info.json';
import { useViewport } from "../hooks/useViewport"; // Import the useViewport hook

const homeStyle = {
    width: 35,
    height: 35,
};

const gamesStyle = {
    width: 50,
    height: 50,
};

const chatStyle = {
    width: 40,
    height: 40,
};

const live2dStyle = {
    width: 30,
    height: 30,
};

const infoStyle = {
    width: 30,
    height: 30,
};

const NavBar: React.FC = () => {
    const router = useRouter();
    const pathname = usePathname();
    const { width } = useViewport(); // Use the useViewport hook to get viewport width

    // Determine margin classes based on viewport width
    let chatMargin = "mx-5";
    let diceMargin = "mx-5";

    if (width < 340) {
        chatMargin = "mx-3";
        diceMargin = "mx-3";
    } else if (width > 400) {
        chatMargin = "mx-7";
        diceMargin = "mx-7";
    }

    return (
        <nav className="fixed bottom-0 left-0 w-screen bg-zinc-800 text-white">
            <div className="mx-auto px-2">
                <div className="relative flex items-center h-12">
                    <div className="flex items-center justify-center flex-1 items-stretch justify-start">
                        <button
                            onClick={() => router.push("/tomisakae")}
                            className={`hover:bg-gray-700 px-2 py-2 rounded-md ${pathname === "/tomisakae" ? "bg-gray-700" : "hover:bg-gray-700"}`}
                        >
                            <Lottie
                                animationData={InfoData}
                                style={infoStyle}
                            />
                        </button>
                        <button
                            onClick={() => router.push("/games")}
                            className={`hover:bg-gray-700 ${diceMargin} py-2 rounded-md ${pathname === "/games" ? "bg-gray-700" : "hover:bg-gray-700"}`}
                        >
                            <Lottie
                                animationData={GamesData}
                                style={gamesStyle}
                            />
                        </button>
                        <button
                            onClick={() => router.push("/")}
                            className={`hover:bg-gray-700 px-2 py-2 rounded-md ${pathname === "/" ? "bg-gray-700" : "hover:bg-gray-700"}`}
                        >
                            <Lottie
                                animationData={HomeData}
                                style={homeStyle}
                            />
                        </button>
                        <button
                            onClick={() => { router.push("/group") }}
                            className={`hover:bg-gray-700 ${chatMargin} px-1 py-2 rounded-md ${pathname === "/group" || pathname === "/chat" ? "bg-gray-700" : "hover:bg-gray-700"}`}
                        >
                            <Lottie
                                animationData={ChatData}
                                style={chatStyle}
                            />
                        </button>
                        <button
                            onClick={() => router.push("/live2d")}
                            className={`hover:bg-gray-700 px-2 py-2 rounded-md ${pathname === "/live2d" ? "bg-gray-700" : "hover:bg-gray-700"}`}
                        >
                            <Lottie
                                animationData={Live2dData}
                                style={live2dStyle}
                            />
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default NavBar;
