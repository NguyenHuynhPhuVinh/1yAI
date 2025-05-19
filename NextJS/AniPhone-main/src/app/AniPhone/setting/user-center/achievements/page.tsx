'use client'

import { useState, useEffect } from 'react';
import Nav from '@/components/nav';
import { FaArrowLeftLong } from "react-icons/fa6";
import { useRouter } from 'next/navigation';
import { FaTrophy, FaCheck, FaGift, FaTimes } from "react-icons/fa";

interface Achievement {
    id: number;
    title: string;
    description: string;
    rewardPoints: number;
}

const AchievementsPage = () => {
    const router = useRouter();
    const [achievements] = useState<Achievement[]>([
        { id: 1, title: "Người Mới", description: "Đăng ký sim", rewardPoints: 10 },
        { id: 2, title: "Khởi Đầu", description: "Mở thẻ ngân hàng", rewardPoints: 10 },
        { id: 3, title: "Hệ Điều Hành 1.1", description: "Nâng cấp AniOS lên 1.1", rewardPoints: 10 },
        { id: 4, title: "Hệ Điều Hành 1.2", description: "Nâng cấp AniOS lên 1.2", rewardPoints: 25 },
        { id: 5, title: "Hệ Điều Hành 1.3", description: "Nâng cấp AniOS lên 1.3", rewardPoints: 50 },
        { id: 6, title: "Người Lạ", description: "Lần đầu chat với người lạ", rewardPoints: 5 },
        { id: 7, title: "Trợ Thủ", description: "Trả lời 1 câu hỏi của người lạ", rewardPoints: 10 },
        { id: 8, title: "Toán Học", description: "Trả lời đúng 1 câu hỏi toán học", rewardPoints: 15 },
        { id: 9, title: "Mật Khẩu", description: "Trả lời đúng 1 câu hỏi mật khẩu", rewardPoints: 15 },
        { id: 10, title: "CAPTCHA", description: "Trả lời đúng 1 câu hỏi CAPTCHA", rewardPoints: 15 },
        { id: 11, title: "Giải Mã", description: "Trả lời đúng 1 câu hỏi giải mã", rewardPoints: 15 },
        { id: 12, title: "Admin?", description: "Xem tin nhắn của admin", rewardPoints: 5 },
        { id: 13, title: "Truy Cập Web 1", description: "Truy cập trang web thứ 1", rewardPoints: 5 },
        { id: 14, title: "Truy Cập Web 2", description: "Truy cập trang web thứ 2", rewardPoints: 10 },
        { id: 15, title: "Truy Cập Web 3", description: "Truy cập trang web thứ 3", rewardPoints: 15 },
        { id: 16, title: "Truy Cập Web 4", description: "Truy cập trang web thứ 4", rewardPoints: 20 },
        { id: 17, title: "Truy Cập Web 5", description: "Truy cập trang web thứ 5", rewardPoints: 25 },
        { id: 18, title: "Truy Cập Web App", description: "Chuyển đổi thành công sang trang web app", rewardPoints: 5 },
        { id: 19, title: "LinkGO", description: "Lần đầu vào LinkGO", rewardPoints: 10 },
        { id: 20, title: "Wifi Khởi Đầu", description: "Mua gói wifi khởi đầu", rewardPoints: 10 },
        { id: 21, title: "CrazyNumber", description: "Lần đầu vào CrazyNumber", rewardPoints: 10 },
        { id: 22, title: "TicTacToe", description: "Lần đầu vào Tic-Tac-Toe Online", rewardPoints: 10 },
        { id: 23, title: "AdClicker", description: "Lần đầu vào AdClicker", rewardPoints: 10 },
        { id: 24, title: "SurveyPay", description: "Lần đầu vào SurveyPay", rewardPoints: 10 },

    ]);
    const [achievementStatuses, setAchievementStatuses] = useState<number[]>([]);
    const [currentPoints, setCurrentPoints] = useState(0);

    useEffect(() => {
        const storedStatuses = JSON.parse(localStorage.getItem('achievementStatuses') || '[]');
        setAchievementStatuses(storedStatuses);

        const updatePoints = () => {
            const points = parseInt(localStorage.getItem('point') || '0');
            setCurrentPoints(points);
        };

        updatePoints();
        const intervalId = setInterval(updatePoints, 1000);

        return () => clearInterval(intervalId);
    }, []);

    const claimReward = (index: number) => {
        const updatedStatuses = [...achievementStatuses];
        updatedStatuses[index] = 2; // Đánh dấu phần thưởng đã được nhận
        setAchievementStatuses(updatedStatuses);
        localStorage.setItem('achievementStatuses', JSON.stringify(updatedStatuses));

        // Cộng điểm thưởng
        const rewardPoints = achievements[index].rewardPoints;
        const newPoints = currentPoints + rewardPoints;
        setCurrentPoints(newPoints);
        localStorage.setItem('point', newPoints.toString());
    };

    return (
        <div className="h-screen bg-black text-white">
            <Nav />
            <div className="p-4 mx-4">
                <div className="flex items-center mb-6">
                    <FaArrowLeftLong
                        className='text-xl cursor-pointer'
                        onClick={() => router.push('/AniPhone/setting/user-center')}
                    />
                    <h1 className="text-xl font-[600] mx-4">Thành tựu</h1>
                </div>
                <div className="mb-4">
                    <p className="text-xl font-semibold">Điểm: <span className="text-yellow-300">{currentPoints}</span></p>
                </div>
                <div className='h-[70vh] overflow-y-auto'>
                    <div className="space-y-4">
                        {achievements.map((achievement, index) => (
                            <div key={index} className="p-4 bg-[#1a1a1a] rounded-lg hover:bg-gray-800 transition-all duration-300">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div>
                                            <div className='flex items-center gap-2'>
                                                <FaTrophy className="text-yellow-500" />
                                                <h2 className="text-lg font-semibold">{achievement.title}</h2>
                                            </div>
                                            <p className="text-sm text-gray-400">{achievement.description}</p>
                                        </div>
                                    </div>
                                    {achievementStatuses[index] === 0 && (
                                        <span className="text-gray-500 flex items-center gap-2 mx-2">
                                            <FaTimes className='text-red-500' />
                                        </span>
                                    )}
                                    {achievementStatuses[index] === 1 && (
                                        <button
                                            onClick={() => claimReward(index)}
                                            className="bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-2 rounded flex items-center gap-1 text-sm mx-2"
                                        >
                                            <FaGift /> {achievement.rewardPoints}P
                                        </button>
                                    )}
                                    {achievementStatuses[index] === 2 && (
                                        <span className="text-green-500 flex items-center gap-2 mx-2">
                                            <FaCheck />
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AchievementsPage;
