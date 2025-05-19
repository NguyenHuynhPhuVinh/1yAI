import React, { useState, useEffect, useRef } from 'react';
import { IoMdSend } from 'react-icons/io';

interface PasswordChallenge {
    description: string;
    validator: (password: string) => boolean;
    reward: number;
}

const passwordChallenges: PasswordChallenge[] = [
    {
        description: 'Mật khẩu phải có ít nhất 8 ký tự.',
        validator: (password) => password.length >= 8,
        reward: 5000
    },
    {
        description: 'Mật khẩu phải có ít nhất một chữ hoa.',
        validator: (password) => /[A-Z]/.test(password),
        reward: 5000
    },
    {
        description: 'Mật khẩu phải có ít nhất một ký tự đặc biệt.',
        validator: (password) => /[!@#$%^&*(),.?":{}|<>]/.test(password),
        reward: 5000
    },
    {
        description: 'Mật khẩu phải có ít nhất 8 ký tự, có ít nhất một chữ hoa và một ký tự đặc biệt.',
        validator: (password) => password.length >= 8 && /[A-Z]/.test(password) && /[!@#$%^&*(),.?":{}|<>]/.test(password),
        reward: 10000
    },
    {
        description: 'Mật khẩu phải có ít nhất 12 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt.',
        validator: (password) =>
            password.length >= 12 &&
            /[A-Z]/.test(password) &&
            /[a-z]/.test(password) &&
            /[0-9]/.test(password) &&
            /[!@#$%^&*(),.?":{}|<>]/.test(password),
        reward: 15000
    },
    {
        description: 'Mật khẩu phải có ít nhất 16 ký tự, bao gồm ít nhất 2 chữ hoa, 2 chữ thường, 2 số và 2 ký tự đặc biệt.',
        validator: (password) =>
            password.length >= 16 &&
            (password.match(/[A-Z]/g) || []).length >= 2 &&
            (password.match(/[a-z]/g) || []).length >= 2 &&
            (password.match(/[0-9]/g) || []).length >= 2 &&
            (password.match(/[!@#$%^&*(),.?":{}|<>]/g) || []).length >= 2,
        reward: 15000
    },
];

export interface PasswordChallengeProps {
    onChallengeComplete: (reward: number) => void;
    onMessage: (message: { sender: string; content: string }) => void;
    onInitialChallenge: (challenge: PasswordChallenge) => void;
}

const PasswordChallengeComponent: React.FC<PasswordChallengeProps> = ({ onChallengeComplete, onMessage }) => {
    const [currentChallenge, setCurrentChallenge] = useState<PasswordChallenge | null>(null);
    const [password, setPassword] = useState('');
    const isInitialized = useRef(false);

    useEffect(() => {
        if (!isInitialized.current) {
            const randomChallenge = passwordChallenges[Math.floor(Math.random() * passwordChallenges.length)];
            setCurrentChallenge(randomChallenge);
            setTimeout(() => {
                onMessage({ sender: 'Người lạ', content: randomChallenge.description });
            }, 1000);
            isInitialized.current = true;
        }
    }, [onMessage]);

    const handleSubmit = () => {
        if (!currentChallenge) return;

        onMessage({ sender: 'Bạn', content: password });
        const storedAchievementStatuses = JSON.parse(window.localStorage.getItem('achievementStatuses') || '[]');
        if (storedAchievementStatuses[6] === 0) {
            storedAchievementStatuses[6] = 1; // Đánh dấu thành tựu đầu tiên đã đạt được
            window.localStorage.setItem('achievementStatuses', JSON.stringify(storedAchievementStatuses));
            window.sessionStorage.setItem('AchievementNotification', 'Trợ Thủ');
        }
        setTimeout(() => {
            if (currentChallenge.validator(password.trim())) {
                onChallengeComplete(currentChallenge.reward);
                const storedAchievementStatuses = JSON.parse(window.localStorage.getItem('achievementStatuses') || '[]');
                if (storedAchievementStatuses[8] === 0) {
                    storedAchievementStatuses[8] = 1; // Đánh dấu thành tựu đầu tiên đã đạt được
                    window.localStorage.setItem('achievementStatuses', JSON.stringify(storedAchievementStatuses));
                    window.sessionStorage.setItem('AchievementNotification', 'Mật Khẩu');
                }
                // Mở khóa công việc 2
                const storedJobs = JSON.parse(localStorage.getItem('jobs') || '[]');
                if (storedJobs[1] === -1) {
                    storedJobs[1] = 0;
                    localStorage.setItem('jobs', JSON.stringify(storedJobs));
                }
                onMessage({ sender: 'Người lạ', content: `Tuyệt vời! Mật khẩu của bạn đáp ứng yêu cầu. Đây là ${currentChallenge.reward.toLocaleString()} đ cho bạn.` });
                setCurrentChallenge(null); // Đặt currentChallenge về null để ẩn input
            } else {
                onMessage({ sender: 'Người lạ', content: 'Mật khẩu chưa đáp ứng yêu cầu. Hãy thử lại!' });
            }
        }, 1000);
        setPassword('');
    };

    if (!currentChallenge) {
        return null; // Không hiển thị gì nếu không có thử thách hiện tại
    }

    return (
        <div className="flex items-center">
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nhập mật khẩu..."
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

export default PasswordChallengeComponent;