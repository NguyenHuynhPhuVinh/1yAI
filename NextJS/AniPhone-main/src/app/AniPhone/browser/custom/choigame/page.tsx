'use client'

import { useState, useEffect } from 'react';
import { FaCoins, FaPlay, FaRedoAlt, FaExchangeAlt } from 'react-icons/fa';

interface Game {
    id: number;
    title: string;
    reward: number;
    duration: number;
}

const ChoiGameKiemTien = () => {
    const [balance, setBalance] = useState(0);
    const [games, setGames] = useState<Game[]>([
        { id: 1, title: 'Xếp hình', reward: 30, duration: 30 },
        { id: 2, title: 'Đoán số', reward: 45, duration: 45 },
        { id: 3, title: 'Câu đố', reward: 60, duration: 60 },
        { id: 4, title: 'Trí nhớ', reward: 40, duration: 40 },
        { id: 5, title: 'Giải đố', reward: 35, duration: 35 },
        { id: 6, title: 'Sudoku', reward: 90, duration: 90 },
        { id: 7, title: 'Ghép từ', reward: 50, duration: 50 },
        { id: 8, title: 'Tìm điểm khác biệt', reward: 45, duration: 45 },
        { id: 9, title: 'Nối hình', reward: 40, duration: 40 },
        { id: 10, title: 'Đua xe', reward: 70, duration: 70 },
    ]);
    const [currentGame, setCurrentGame] = useState<Game | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [showExchange, setShowExchange] = useState(false);
    const [gameProgress, setGameProgress] = useState(0);
    const [showInsufficientCoinsModal, setShowInsufficientCoinsModal] = useState(false);

    useEffect(() => {
        const savedBalance = window.localStorage.getItem('balanceGame');
        if (savedBalance) {
            setBalance(parseInt(savedBalance));
        }
        const storedAchievementStatuses = JSON.parse(window.localStorage.getItem('achievementStatuses') || '[]');
        if (storedAchievementStatuses[15] === 0) {
            storedAchievementStatuses[15] = 1; // Đánh dấu thành tựu đầu tiên đã đạt được
            window.localStorage.setItem('achievementStatuses', JSON.stringify(storedAchievementStatuses));
            window.sessionStorage.setItem('AchievementNotification', 'Truy Cập Web 4');
        }
        // Mở khóa công việc 8
        const storedJobs = JSON.parse(localStorage.getItem('jobs') || '[]');
        if (storedJobs[7] === -1) {
            storedJobs[7] = 0;
            localStorage.setItem('jobs', JSON.stringify(storedJobs));
        }

    }, []);

    const startGame = (game: Game) => {
        setCurrentGame(game);
        setIsPlaying(true);
        setGameProgress(0);
        const interval = setInterval(() => {
            setGameProgress((prevProgress) => {
                if (prevProgress >= 100) {
                    clearInterval(interval);
                    completeGame(game);
                    return 100;
                }
                return prevProgress + (100 / (game.duration / 0.3));
            });
        }, 300);
    };

    const completeGame = (game: Game) => {
        const newBalance = balance + game.reward;
        setBalance(newBalance);
        window.localStorage.setItem('balanceGame', newBalance.toString());
        setIsPlaying(false);
        setCurrentGame(null);
        setGames(games.filter(g => g.id !== game.id));
        setGameProgress(0);
    };

    const refreshGames = () => {
        setGames([
            { id: 1, title: 'Xếp hình', reward: 30, duration: 30 },
            { id: 2, title: 'Đoán số', reward: 45, duration: 45 },
            { id: 3, title: 'Câu đố', reward: 60, duration: 60 },
            { id: 4, title: 'Trí nhớ', reward: 40, duration: 40 },
            { id: 5, title: 'Giải đố', reward: 35, duration: 35 },
            { id: 6, title: 'Sudoku', reward: 90, duration: 90 },
            { id: 7, title: 'Ghép từ', reward: 50, duration: 50 },
            { id: 8, title: 'Tìm điểm khác biệt', reward: 45, duration: 45 },
            { id: 9, title: 'Nối hình', reward: 40, duration: 40 },
            { id: 10, title: 'Đua xe', reward: 70, duration: 70 },
        ]);
    };

    const handleExchangeClick = () => {
        if (balance < 10) {
            setShowInsufficientCoinsModal(true);
        } else {
            setShowExchange(true);
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
            window.localStorage.setItem('balanceGame', newBalance.toString());

            window.sessionStorage.setItem('Notification', `Bạn đã nhận được ${exchangeAmount.toLocaleString()} đồng`);

            setShowExchange(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-4">
            <h1 className="text-3xl font-bold mb-6 text-center">Chơi Game Kiếm Tiền</h1>
            <div className="bg-gray-800 rounded-lg shadow-lg p-4 mb-6 flex justify-between items-center">
                <div className="flex items-center">
                    <FaCoins className="text-yellow-400 mr-2 text-xl" />
                    <span className="font-bold text-xl">{balance} xu</span>
                </div>
                <button
                    onClick={handleExchangeClick}
                    className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition duration-300 flex items-center"
                >
                    <FaExchangeAlt className="mr-2" />
                    Đổi xu
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {games.map(game => (
                    <div key={game.id} className="bg-gray-800 rounded-lg shadow-lg p-4">
                        <h2 className="text-xl font-semibold mb-2">{game.title}</h2>
                        <p className="text-gray-400 mb-2">Phần thưởng: {game.reward} xu</p>
                        <p className="text-gray-400 mb-4">Thời gian: {game.duration} giây</p>
                        <button
                            onClick={() => startGame(game)}
                            className="bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700 transition duration-300 w-full flex items-center justify-center"
                            disabled={isPlaying}
                        >
                            <FaPlay className="mr-2" />
                            Chơi ngay
                        </button>
                    </div>
                ))}
            </div>
            {games.length === 0 && (
                <div className="text-center mt-6">
                    <p className="text-gray-400 mb-4">Không còn game nào để chơi</p>
                    <button
                        onClick={refreshGames}
                        className="bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition duration-300 flex items-center justify-center mx-auto"
                    >
                        <FaRedoAlt className="mr-2" />
                        Làm mới danh sách game
                    </button>
                </div>
            )}
            {showExchange && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
                    <div className="bg-gray-800 p-6 rounded-lg max-w-sm w-full">
                        <h2 className="text-2xl font-bold mb-4">Đổi xu</h2>
                        <p className="mb-6">Bạn có muốn đổi {Math.floor(balance / 10) * 10} xu thành {(Math.floor(balance / 10) * 1000).toLocaleString()} đồng không?</p>
                        <div className="flex justify-end">
                            <button
                                onClick={() => setShowExchange(false)}
                                className="bg-gray-600 text-white px-4 py-2 rounded-full mr-4 hover:bg-gray-700 transition duration-300"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={exchangeCoins}
                                className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition duration-300"
                            >
                                Xác nhận
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {showInsufficientCoinsModal && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
                    <div className="bg-gray-800 p-6 rounded-lg max-w-sm w-full">
                        <h2 className="text-2xl font-bold mb-4">Xu không đủ</h2>
                        <p className="mb-6">Bạn cần tối thiểu 10 xu để đổi.</p>
                        <button
                            onClick={() => setShowInsufficientCoinsModal(false)}
                            className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition duration-300 w-full"
                        >
                            Đóng
                        </button>
                    </div>
                </div>
            )}
            {isPlaying && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
                    <div className="bg-gray-800 p-6 rounded-lg max-w-sm w-full text-center">
                        <h2 className="text-2xl font-bold mb-4">Đang chơi {currentGame?.title}</h2>
                        <div className="w-full bg-gray-700 rounded-full h-4 mb-4">
                            <div className="bg-blue-600 h-4 rounded-full transition-all duration-300 ease-out" style={{ width: `${gameProgress}%` }}></div>
                        </div>
                        <p className="text-xl">Tiến độ: {gameProgress}%</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChoiGameKiemTien;