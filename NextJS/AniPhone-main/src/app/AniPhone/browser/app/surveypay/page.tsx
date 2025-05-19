'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Nav from '@/components/nav';
import { FaArrowLeft, FaSearch, FaCoins } from 'react-icons/fa';

const SurveyPayPage = () => {
    const router = useRouter();
    const [balance, setBalance] = useState(0);
    const [currentUrl,] = useState('aniw://surveypay.ani');
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [showCardInput, setShowCardInput] = useState(false);
    const [cardNumberSurveyPay, setCardNumberSurveyPay] = useState('');
    const [cardInputMessage, setCardInputMessage] = useState('');
    const [cardInputMessageType, setCardInputMessageType] = useState<'success' | 'error' | ''>('');
    const [surveys,] = useState([
        { id: 1, title: 'Khảo sát về thói quen sử dụng mạng xã hội', reward: 50 },
        { id: 2, title: 'Đánh giá sản phẩm công nghệ mới', reward: 75 },
        { id: 3, title: 'Ý kiến về dịch vụ khách hàng', reward: 60 },
    ]);
    const [showSurveyForm, setShowSurveyForm] = useState(false);
    const [currentSurvey, setCurrentSurvey] = useState<{ id: number; title: string; reward: number } | null>(null);
    const [surveyAnswers, setSurveyAnswers] = useState<{ [key: string]: string }>({});
    const [notification, setNotification] = useState('');

    useEffect(() => {
        const storedBalance = localStorage.getItem('surveyPayBalance');
        if (storedBalance) {
            setBalance(parseFloat(storedBalance));
        }
        const savedCardNumber = window.sessionStorage.getItem('cardNumberSurveyPay');
        if (savedCardNumber) {
            setCardNumberSurveyPay(savedCardNumber);
        }
        // Mark the achievement for visiting SurveyPay
        const storedAchievementStatuses = JSON.parse(window.localStorage.getItem('achievementStatuses') || '[]');
        if (storedAchievementStatuses[23] === 0) {
            storedAchievementStatuses[23] = 1;
            window.localStorage.setItem('achievementStatuses', JSON.stringify(storedAchievementStatuses));
            window.sessionStorage.setItem('AchievementNotification', 'SurveyPay');
        }
        // Unlock job 14
        const storedJobs = JSON.parse(localStorage.getItem('jobs') || '[]');
        if (storedJobs[13] === -1) {
            storedJobs[13] = 0;
            localStorage.setItem('jobs', JSON.stringify(storedJobs));
        }
    }, []);

    const switchToWebApp = () => {
        router.push('/AniPhone/browser/app');
    };

    const showModalMessage = (message: string) => {
        setModalMessage(message);
        setShowModal(true);
        setTimeout(() => {
            setShowModal(false);
        }, 3000);
    };

    const startSurvey = (id: number) => {
        const survey = surveys.find(s => s.id === id);
        if (survey) {
            setCurrentSurvey(survey);
            setSurveyAnswers({});
            setShowSurveyForm(true);
        }
    };

    const handleSurveySubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (currentSurvey) {
            const allQuestionsAnswered = Object.keys(surveyAnswers).length === 3 &&
                Object.values(surveyAnswers).every(answer => answer.trim() !== '');

            if (allQuestionsAnswered) {
                const newBalance = balance + currentSurvey.reward;
                setBalance(newBalance);
                localStorage.setItem('surveyPayBalance', newBalance.toString());
                setNotification(`Bạn đã hoàn thành khảo sát và nhận được ${currentSurvey.reward} xu!`);
                setTimeout(() => setNotification(''), 3000);
                setShowSurveyForm(false);
            } else {
                setNotification('Vui lòng trả lời đầy đủ tất cả các câu hỏi.');
                setTimeout(() => setNotification(''), 3000);
            }
        }
    };

    const handleExchangeCoins = () => {
        if (typeof window !== 'undefined') {
            if (balance < 10) {
                showModalMessage('Số xu không đủ để đổi. Cần ít nhất 10 xu.');
                return;
            }

            if (!cardNumberSurveyPay) {
                setShowCardInput(true);
                return;
            }

            const exchangeAmount = Math.floor(balance / 10) * 1000;
            const newBalance = balance % 10;
            setBalance(newBalance);
            localStorage.setItem('surveyPayBalance', newBalance.toString());

            const currentBankBalance = parseInt(localStorage.getItem('balanceBank') || '0', 10);
            const updatedBankBalance = currentBankBalance + exchangeAmount;
            localStorage.setItem('balanceBank', updatedBankBalance.toString());

            sessionStorage.setItem('Notification', `Bạn đã đổi ${exchangeAmount.toLocaleString()} đồng từ SurveyPay và chuyển vào tài khoản ngân hàng!`);
            showModalMessage(`Đã đổi ${exchangeAmount.toLocaleString()} đồng thành công!`);
        }
    };

    const handleCardNumberSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (cardNumberSurveyPay.length === 16 && typeof window !== 'undefined') {
            window.sessionStorage.setItem('cardNumberSurveyPay', cardNumberSurveyPay);
            setShowCardInput(false);
            handleExchangeCoins();
        } else {
            setCardInputMessage('Số thẻ không hợp lệ. Vui lòng nhập 16 chữ số.');
            setCardInputMessageType('error');
        }
    };

    return (
        <div className="h-screen bg-black text-white flex flex-col">
            <Nav />
            <div className="p-4 flex-grow flex flex-col">
                <div className="flex items-center mb-4">
                    <FaArrowLeft className="text-xl cursor-pointer mr-4" onClick={switchToWebApp} />
                    <div className="flex-grow flex items-center bg-gray-800 rounded-lg p-2">
                        <FaSearch className="text-gray-400 mr-2" />
                        <input
                            type="text"
                            value={currentUrl}
                            className="bg-transparent flex-grow outline-none"
                            readOnly
                        />
                    </div>
                </div>
                {notification && (
                    <div className="fixed top-[15vh] left-1/2 transform -translate-x-1/2 z-50">
                        <div className="bg-gray-800 p-4 rounded-lg">
                            <p>{notification}</p>
                        </div>
                    </div>
                )}
                <div className="flex-grow bg-gray-900 rounded-lg p-4 mb-6 overflow-y-auto">
                    <h1 className="text-2xl text-center font-bold mb-4">SurveyPay</h1>
                    <div className="mb-4 flex items-center">
                        <FaCoins className="text-yellow-500 mr-2" />
                        <span>Số dư: {balance} xu</span>
                        <button
                            onClick={handleExchangeCoins}
                            className="ml-4 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                        >
                            Đổi xu
                        </button>
                    </div>
                    <h2 className="text-xl font-semibold mb-3">Danh sách khảo sát:</h2>
                    <div className="h-[55vh] overflow-y-auto">
                        {surveys.map(survey => (
                            <div key={survey.id} className="mb-3 p-3 border border-gray-700 rounded">
                                <h3 className="font-medium">{survey.title}</h3>
                                <p>Phần thưởng: {survey.reward} xu</p>
                                <button
                                    onClick={() => startSurvey(survey.id)}
                                    className="mt-2 px-3 py-1 rounded bg-green-500 text-white hover:bg-green-600"
                                >
                                    Làm khảo sát
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {showModal && (
                <div className="fixed top-[15vh] left-1/2 transform -translate-x-1/2 z-50">
                    <div className="bg-gray-800 p-4 rounded-lg">
                        <p>{modalMessage}</p>
                    </div>
                </div>
            )}
            {showCardInput && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-gray-800 p-4 rounded-lg">
                        <h2 className="text-lg font-bold mb-2">Nhập số thẻ ngân hàng</h2>
                        <form onSubmit={handleCardNumberSubmit}>
                            <input
                                type="text"
                                value={cardNumberSurveyPay}
                                onChange={(e) => setCardNumberSurveyPay(e.target.value)}
                                placeholder="Nhập 16 chữ số"
                                className="border p-2 rounded w-full mb-2 bg-gray-700 text-white"
                            />
                            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                                Xác nhận
                            </button>
                        </form>
                        {cardInputMessage && (
                            <p className={`mt-2 ${cardInputMessageType === 'error' ? 'text-red-500' : 'text-green-500'}`}>
                                {cardInputMessage}
                            </p>
                        )}
                    </div>
                </div>
            )}
            {showSurveyForm && currentSurvey && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-gray-800 p-4 rounded-lg w-3/4 max-h-3/4 overflow-y-auto">
                        <h2 className="text-lg font-bold mb-4">{currentSurvey.title}</h2>
                        <form onSubmit={handleSurveySubmit}>
                            {currentSurvey.id === 1 && (
                                <>
                                    <div className="mb-4">
                                        <label className="block mb-2">Bạn sử dụng mạng xã hội nào thường xuyên nhất?</label>
                                        <input
                                            type="text"
                                            className="w-full p-2 bg-gray-700 rounded"
                                            value={surveyAnswers.q1 || ''}
                                            onChange={(e) => setSurveyAnswers({ ...surveyAnswers, q1: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block mb-2">Bạn dành bao nhiêu giờ mỗi ngày cho mạng xã hội?</label>
                                        <input
                                            type="number"
                                            className="w-full p-2 bg-gray-700 rounded"
                                            value={surveyAnswers.q2 || ''}
                                            onChange={(e) => setSurveyAnswers({ ...surveyAnswers, q2: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block mb-2">Mục đích chính của bạn khi sử dụng mạng xã hội là gì?</label>
                                        <textarea
                                            className="w-full p-2 bg-gray-700 rounded"
                                            value={surveyAnswers.q3 || ''}
                                            onChange={(e) => setSurveyAnswers({ ...surveyAnswers, q3: e.target.value })}
                                            required
                                        ></textarea>
                                    </div>
                                </>
                            )}
                            {currentSurvey.id === 2 && (
                                <>
                                    <div className="mb-4">
                                        <label className="block mb-2">Bạn thường sử dụng những sản phẩm công nghệ nào?</label>
                                        <input
                                            type="text"
                                            className="w-full p-2 bg-gray-700 rounded"
                                            value={surveyAnswers.q1 || ''}
                                            onChange={(e) => setSurveyAnswers({ ...surveyAnswers, q1: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block mb-2">Bạn có thường xuyên cập nhật các sản phẩm công nghệ mới không?</label>
                                        <select
                                            className="w-full p-2 bg-gray-700 rounded"
                                            value={surveyAnswers.q2 || ''}
                                            onChange={(e) => setSurveyAnswers({ ...surveyAnswers, q2: e.target.value })}
                                            required
                                        >
                                            <option value="">Chọn câu trả lời</option>
                                            <option value="Rất thường xuyên">Rất thường xuyên</option>
                                            <option value="Thỉnh thoảng">Thỉnh thoảng</option>
                                            <option value="Hiếm khi">Hiếm khi</option>
                                            <option value="Không bao giờ">Không bao giờ</option>
                                        </select>
                                    </div>
                                    <div className="mb-4">
                                        <label className="block mb-2">Theo bạn, đâu là tính năng quan trọng nhất của một sản phẩm công nghệ?</label>
                                        <textarea
                                            className="w-full p-2 bg-gray-700 rounded"
                                            value={surveyAnswers.q3 || ''}
                                            onChange={(e) => setSurveyAnswers({ ...surveyAnswers, q3: e.target.value })}
                                            required
                                        ></textarea>
                                    </div>
                                </>
                            )}
                            {currentSurvey.id === 3 && (
                                <>
                                    <div className="mb-4">
                                        <label className="block mb-2">Bạn đánh giá thế nào về chất lượng dịch vụ khách hàng hiện nay?</label>
                                        <select
                                            className="w-full p-2 bg-gray-700 rounded"
                                            value={surveyAnswers.q1 || ''}
                                            onChange={(e) => setSurveyAnswers({ ...surveyAnswers, q1: e.target.value })}
                                            required
                                        >
                                            <option value="">Chọn đánh giá</option>
                                            <option value="Rất tốt">Rất tốt</option>
                                            <option value="Tốt">Tốt</option>
                                            <option value="Trung bình">Trung bình</option>
                                            <option value="Kém">Kém</option>
                                            <option value="Rất kém">Rất kém</option>
                                        </select>
                                    </div>
                                    <div className="mb-4">
                                        <label className="block mb-2">Bạn thường sử dụng phương thức nào để liên hệ với dịch vụ khách hàng?</label>
                                        <input
                                            type="text"
                                            className="w-full p-2 bg-gray-700 rounded"
                                            value={surveyAnswers.q2 || ''}
                                            onChange={(e) => setSurveyAnswers({ ...surveyAnswers, q2: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block mb-2">Bạn có đề xuất gì để cải thiện chất lượng dịch vụ khách hàng?</label>
                                        <textarea
                                            className="w-full p-2 bg-gray-700 rounded"
                                            value={surveyAnswers.q3 || ''}
                                            onChange={(e) => setSurveyAnswers({ ...surveyAnswers, q3: e.target.value })}
                                            required
                                        ></textarea>
                                    </div>
                                </>
                            )}
                            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                                Hoàn thành khảo sát
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SurveyPayPage;