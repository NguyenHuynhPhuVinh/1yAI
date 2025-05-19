'use client'

import Nav from '@/components/nav';
import { FaArrowLeftLong } from "react-icons/fa6";
import { useRouter } from 'next/navigation';
import { IoIosArrowForward } from "react-icons/io";

const AniStarPage = () => {
    const router = useRouter();

    const handleNavigation = (path: string) => {
        router.push(`/AniPhone/setting/user-center/anistar/${path}`);
    };

    return (
        <div className="h-screen bg-black text-white">
            <Nav />
            <div className="p-4 mx-4">
                <div className="flex items-center mb-6">
                    <FaArrowLeftLong
                        className="text-xl cursor-pointer"
                        onClick={() => router.push('/AniPhone/setting/user-center')}
                    />
                    <h1 className="text-xl font-[800] mx-4 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-transparent bg-clip-text animate-gradient-x">AniStar</h1>
                </div>
                <div className="space-y-4">
                    <div
                        className="p-4 bg-[#1a1a1a] rounded-lg hover:bg-gray-800 transition-all duration-300 cursor-pointer"
                        onClick={() => handleNavigation('work')}
                    >
                        <div className="flex justify-between items-center">
                            <span className="text-lg">Làm việc</span>
                            <IoIosArrowForward className="text-lg" />
                        </div>
                    </div>
                    <div
                        className="p-4 bg-[#1a1a1a] rounded-lg hover:bg-gray-800 transition-all duration-300 cursor-pointer"
                        onClick={() => handleNavigation('characters')}
                    >
                        <div className="flex justify-between items-center">
                            <span className="text-lg">Nhân vật</span>
                            <IoIosArrowForward className="text-lg" />
                        </div>
                    </div>
                    <div
                        className="p-4 bg-[#1a1a1a] rounded-lg hover:bg-gray-800 transition-all duration-300 cursor-pointer"
                        onClick={() => handleNavigation('gacha')}
                    >
                        <div className="flex justify-between items-center">
                            <span className="text-lg">Gacha</span>
                            <IoIosArrowForward className="text-lg" />
                        </div>
                    </div>
                    <div
                        className="p-4 bg-[#1a1a1a] rounded-lg hover:bg-gray-800 transition-all duration-300 cursor-pointer"
                        onClick={() => handleNavigation('missions')}
                    >
                        <div className="flex justify-between items-center">
                            <span className="text-lg">Nhiệm vụ</span>
                            <IoIosArrowForward className="text-lg" />
                        </div>
                    </div>
                    <div
                        className="p-4 bg-[#1a1a1a] rounded-lg hover:bg-gray-800 transition-all duration-300 cursor-pointer"
                        onClick={() => handleNavigation('events')}
                    >
                        <div className="flex justify-between items-center">
                            <span className="text-lg">Sự kiện</span>
                            <IoIosArrowForward className="text-lg" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AniStarPage;
