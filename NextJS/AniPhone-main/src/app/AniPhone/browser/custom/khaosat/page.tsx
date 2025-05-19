'use client'

import { useState, useEffect, useCallback } from 'react';
import { FaCoins, FaExchangeAlt, FaClipboardList, FaCheckCircle, FaRedoAlt } from 'react-icons/fa';

interface Survey {
    id: number;
    title: string;
    questions: number;
    reward: number;
}

const KhaoSatKiemTien = () => {
    const [balance, setBalance] = useState(0);
    const [surveys, setSurveys] = useState<Survey[]>([
        { id: 1, title: "Khảo sát thói quen mua sắm", questions: 10, reward: 5 },
        { id: 2, title: "Đánh giá sản phẩm công nghệ", questions: 15, reward: 8 },
        { id: 3, title: "Khảo sát xu hướng du lịch", questions: 20, reward: 10 },
        { id: 4, title: "Đánh giá dịch vụ khách hàng", questions: 12, reward: 6 },
        { id: 5, title: "Khảo sát thói quen ăn uống", questions: 18, reward: 9 },
        { id: 6, title: "Đánh giá ứng dụng di động", questions: 14, reward: 7 },
        { id: 7, title: "Khảo sát về sức khỏe và thể thao", questions: 16, reward: 8 },
        { id: 8, title: "Đánh giá trải nghiệm mua sắm trực tuyến", questions: 13, reward: 7 },
        { id: 9, title: "Khảo sát về thói quen đọc sách", questions: 11, reward: 6 },
        { id: 10, title: "Đánh giá dịch vụ streaming", questions: 17, reward: 9 },
    ]);
    const [currentSurvey, setCurrentSurvey] = useState<Survey | null>(null);
    const [currentQuestion, setCurrentQuestion] = useState(1);
    const [showExchange, setShowExchange] = useState(false);
    const [, setCustomTime] = useState(() => {
        if (typeof window !== 'undefined') {
            const savedTime = window.localStorage.getItem('customTime');
            return savedTime ? new Date(JSON.parse(savedTime)) : new Date();
        }
        return new Date();
    });

    useEffect(() => {
        const savedBalance = window.localStorage.getItem('balanceSurvey');
        if (savedBalance) {
            setBalance(parseInt(savedBalance));
        }
        const storedAchievementStatuses = JSON.parse(window.localStorage.getItem('achievementStatuses') || '[]');
        if (storedAchievementStatuses[13] === 0) {
            storedAchievementStatuses[13] = 1; // Đánh dấu thành tựu đầu tiên đã đạt được
            window.localStorage.setItem('achievementStatuses', JSON.stringify(storedAchievementStatuses));
            window.sessionStorage.setItem('AchievementNotification', 'Truy Cập Web 2');
        }
        // Mở khóa công việc 6
        const storedJobs = JSON.parse(localStorage.getItem('jobs') || '[]');
        if (storedJobs[5] === -1) {
            storedJobs[5] = 0;
            localStorage.setItem('jobs', JSON.stringify(storedJobs));
        }
    }, []);

    const startSurvey = (survey: Survey) => {
        setCurrentSurvey(survey);
        setCurrentQuestion(1);
    };

    const answerQuestion = () => {
        if (currentSurvey && currentQuestion < currentSurvey.questions) {
            setCurrentQuestion(currentQuestion + 1);
        } else if (currentSurvey) {
            const newBalance = balance + currentSurvey.reward;
            setBalance(newBalance);
            window.localStorage.setItem('balanceSurvey', newBalance.toString());
            setSurveys(surveys.filter(s => s.id !== currentSurvey.id));
            setCurrentSurvey(null);

            // Update custom time
            updateCustomTime(currentSurvey.reward * 2); // Increase 2 minutes for each coin earned
        }
    };

    const exchangeCoins = () => {
        if (typeof window !== 'undefined') {
            const exchangeAmount = Math.floor(balance / 10) * 1000;
            const newBalance = balance - Math.floor(balance / 10) * 10;
            setBalance(newBalance);
            const currentBalance = parseInt(window.localStorage.getItem('balance') || '0', 10);
            const updatedBalance = currentBalance + exchangeAmount;
            window.localStorage.setItem('balance', updatedBalance.toString());
            window.localStorage.setItem('balanceSurvey', newBalance.toString());

            // Show notification
            window.sessionStorage.setItem('Notification', `Bạn đã nhận được ${exchangeAmount.toLocaleString()} đồng`);

            setShowExchange(false);
        }
    };

    const refreshSurveys = () => {
        setSurveys([
            { id: 1, title: "Khảo sát thói quen mua sắm", questions: 10, reward: 5 },
            { id: 2, title: "Đánh giá sản phẩm công nghệ", questions: 15, reward: 8 },
            { id: 3, title: "Khảo sát xu hướng du lịch", questions: 20, reward: 10 },
            { id: 4, title: "Đánh giá dịch vụ khách hàng", questions: 12, reward: 6 },
            { id: 5, title: "Khảo sát thói quen ăn uống", questions: 18, reward: 9 },
            { id: 6, title: "Đánh giá ứng dụng di động", questions: 14, reward: 7 },
            { id: 7, title: "Khảo sát về sức khỏe và thể thao", questions: 16, reward: 8 },
            { id: 8, title: "Đánh giá trải nghiệm mua sắm trực tuyến", questions: 13, reward: 7 },
            { id: 9, title: "Khảo sát về thói quen đọc sách", questions: 11, reward: 6 },
            { id: 10, title: "Đánh giá dịch vụ streaming", questions: 17, reward: 9 },
        ]);
    };

    const updateCustomTime = useCallback((minutes: number) => {
        setCustomTime(prevTime => {
            const newTime = new Date(prevTime.getTime() + minutes * 60000);
            if (typeof window !== 'undefined') {
                window.localStorage.setItem('customTime', JSON.stringify(newTime));
            }
            return newTime;
        });
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-200 text-gray-800 p-2">
            <div className="max-w-sm mx-auto">
                <div className="flex justify-between items-center mb-4 bg-white rounded-lg p-2 shadow-md">
                    <h1 className="text-xl font-bold text-blue-600">Khảo Sát Kiếm Tiền</h1>
                    <div className="flex items-center bg-yellow-100 px-2 py-1 rounded-full cursor-pointer" onClick={() => setShowExchange(true)}>
                        <FaCoins className="text-yellow-500 mr-1 text-sm" />
                        <span className="text-sm font-semibold">{balance}</span>
                    </div>
                </div>

                {showExchange && (
                    <div className="bg-white rounded-lg shadow-lg p-4 mb-4">
                        <h2 className="text-lg font-semibold mb-2 text-blue-700">Đổi xu lấy tiền</h2>
                        <p className="mb-2">Số xu hiện tại: <span className="font-bold">{balance}</span></p>
                        <p className="mb-3">Tỉ lệ đổi: 10 xu = 1000 đồng</p>
                        {balance >= 10 ? (
                            <button
                                onClick={exchangeCoins}
                                className="bg-green-500 text-white px-3 py-2 rounded-full hover:bg-green-600 transition duration-300 flex items-center justify-center text-sm"
                            >
                                <FaExchangeAlt className="mr-1" /> Đổi xu
                            </button>
                        ) : (
                            <p className="text-red-500 text-sm">Bạn cần ít nhất 10 xu để đổi.</p>
                        )}
                    </div>
                )}

                {!currentSurvey ? (
                    <div>
                        <h2 className="text-lg font-semibold mb-3 text-center text-blue-800">Danh sách khảo sát</h2>
                        <div className="space-y-2">
                            {surveys.map(survey => (
                                <div key={survey.id} className="bg-white p-3 rounded-lg shadow-md hover:shadow-lg transition duration-300">
                                    <h3 className="font-semibold text-sm mb-1 text-blue-700">{survey.title}</h3>
                                    <div className="flex justify-between items-center text-gray-600 text-xs mb-2">
                                        <p><FaClipboardList className="inline mr-1" /> Câu hỏi: {survey.questions}</p>
                                        <p><FaCoins className="inline mr-1 text-yellow-500" /> Thưởng: {survey.reward} xu</p>
                                    </div>
                                    <button
                                        onClick={() => startSurvey(survey)}
                                        className="w-full bg-blue-500 text-white px-2 py-1 rounded-full hover:bg-blue-600 transition duration-300 flex items-center justify-center text-sm"
                                    >
                                        <FaCheckCircle className="mr-1" /> Bắt đầu
                                    </button>
                                </div>
                            ))}
                        </div>
                        {surveys.length === 0 && (
                            <div className="text-center mt-4">
                                <p className="text-gray-600 mb-2">Không còn khảo sát nào!</p>
                                <button
                                    onClick={refreshSurveys}
                                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300 flex items-center justify-center mx-auto"
                                >
                                    <FaRedoAlt className="mr-2" /> Làm mới
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="bg-white p-3 rounded-lg shadow-md">
                        <h2 className="text-lg font-semibold mb-2 text-blue-700">{currentSurvey.title}</h2>
                        <div className="mb-3 bg-blue-100 rounded-full h-2">
                            <div
                                className="bg-blue-500 h-2 rounded-full transition-all duration-500 ease-out"
                                style={{ width: `${(currentQuestion / currentSurvey.questions) * 100}%` }}
                            ></div>
                        </div>
                        <p className="text-center mb-3 text-sm">Câu hỏi {currentQuestion}/{currentSurvey.questions}</p>
                        <button
                            onClick={answerQuestion}
                            className="w-full bg-green-500 text-white px-3 py-2 rounded-full hover:bg-green-600 transition duration-300 text-sm font-semibold"
                        >
                            {currentQuestion < currentSurvey.questions ? 'Câu tiếp theo' : 'Hoàn thành'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default KhaoSatKiemTien;