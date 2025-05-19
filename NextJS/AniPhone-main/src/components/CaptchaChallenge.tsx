import React, { useState, useEffect, useRef } from 'react';
import { IoMdSend } from 'react-icons/io';

const generateRandomString = (length: number, characters: string) => {
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
};

interface CaptchaChallengeProps {
    onChallengeComplete: (reward: number) => void;
    onMessage: (message: { sender: string; content: string }) => void;
}

interface CaptchaType {
    type: string;
    generate: () => { question: string; answer: string };
    reward: number;
}

const captchaTypes: CaptchaType[] = [
    {
        type: 'CAPTCHA thường',
        generate: () => {
            const str = generateRandomString(6, 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz');
            return { question: `${str}`, answer: str };
        },
        reward: 5000
    },
    {
        type: 'Sắp xếp chữ cái',
        generate: () => {
            const str = generateRandomString(6, 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz');
            return {
                question: `${str}`,
                answer: str.split('').sort((a, b) => a.localeCompare(b, 'en', { sensitivity: 'base' })).join('')
            };
        },
        reward: 15000
    },
    {
        type: 'Mã hóa Caesar',
        generate: () => {
            const str = generateRandomString(6, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ');
            const shift = Math.floor(Math.random() * 25) + 1;
            const encoded = str.split('').map(char =>
                String.fromCharCode(((char.charCodeAt(0) - 65 + shift) % 26) + 65)
            ).join('');
            return {
                question: `CAPTCHA Caesar Cipher (dịch ${shift} vị trí): ${encoded}`,
                answer: str
            };
        },
        reward: 25000
    }
];

const CaptchaChallenge: React.FC<CaptchaChallengeProps> = ({ onChallengeComplete, onMessage }) => {
    const [captcha, setCaptcha] = useState<CaptchaType | null>(null);
    const [currentChallenge, setCurrentChallenge] = useState<{ question: string; answer: string } | null>(null);
    const [userInput, setUserInput] = useState('');
    const captchaGeneratedRef = useRef(false);

    useEffect(() => {
        if (!captchaGeneratedRef.current) {
            const newCaptcha = captchaTypes[Math.floor(Math.random() * captchaTypes.length)];
            setCaptcha(newCaptcha);
            const challenge = newCaptcha.generate();
            setCurrentChallenge(challenge);
            setTimeout(() => {
                onMessage({ sender: 'Người lạ', content: `${newCaptcha.type}: ${challenge.question}` });
            }, 1000);
            captchaGeneratedRef.current = true;
        }
    }, [onMessage]);

    const handleSubmit = () => {
        onMessage({ sender: 'Bạn', content: userInput });
        const storedAchievementStatuses = JSON.parse(window.localStorage.getItem('achievementStatuses') || '[]');
        if (storedAchievementStatuses[6] === 0) {
            storedAchievementStatuses[6] = 1; // Đánh dấu thành tựu đầu tiên đã đạt được
            window.localStorage.setItem('achievementStatuses', JSON.stringify(storedAchievementStatuses));
            window.sessionStorage.setItem('AchievementNotification', 'Trợ Thủ');
        }

        setTimeout(() => {
            if (captcha && currentChallenge && userInput.trim().toUpperCase() === currentChallenge.answer.toUpperCase()) {
                onChallengeComplete(captcha.reward);
                const storedAchievementStatuses = JSON.parse(window.localStorage.getItem('achievementStatuses') || '[]');
                if (storedAchievementStatuses[9] === 0) {
                    storedAchievementStatuses[9] = 1; // Đánh dấu thành tựu đầu tiên đã đạt được
                    window.localStorage.setItem('achievementStatuses', JSON.stringify(storedAchievementStatuses));
                    window.sessionStorage.setItem('AchievementNotification', 'CAPTCHA');
                }
                // Mở khóa công việc 3
                const storedJobs = JSON.parse(localStorage.getItem('jobs') || '[]');
                if (storedJobs[2] === -1) {
                    storedJobs[2] = 0;
                    localStorage.setItem('jobs', JSON.stringify(storedJobs));
                }
                onMessage({ sender: 'Người lạ', content: `Tuyệt vời! Bạn đã ghi đúng mã CAPTCHA. Đây là ${captcha.reward.toLocaleString()} đ cho bạn.` });
            } else {
                onMessage({ sender: 'Người lạ', content: 'Rất tiếc, câu trả lời của bạn chưa chính xác. Hãy thử lại!' });
            }
        }, 1000);
        setUserInput('');
    };

    return (
        <div className="flex items-center">
            <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Nhập mã CAPTCHA..."
                className="flex-grow bg-gray-800 text-white p-2 rounded-lg focus:outline-none"
            />
            <button
                onClick={handleSubmit}
                className="bg-blue-500 text-white p-2 rounded-lg ml-2"
            >
                <IoMdSend className='text-2xl' />
            </button>
        </div>
    );
};

export default React.memo(CaptchaChallenge);