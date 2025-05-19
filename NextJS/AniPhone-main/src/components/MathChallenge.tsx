import React, { useState, useEffect, useRef } from 'react';
import { IoMdSend } from 'react-icons/io';

interface MathChallengeProps {
    onChallengeComplete: (reward: number) => void;
    onMessage: (message: { sender: string; content: string }) => void;
}

const MathChallenge: React.FC<MathChallengeProps> = ({ onChallengeComplete, onMessage }) => {
    const [problem, setProblem] = useState('');
    const [answer, setAnswer] = useState('');
    const [userAnswer, setUserAnswer] = useState('');
    const problemGeneratedRef = useRef(false);

    const generateMathProblem = () => {
        const operators = ['+', '-', '*', '/'];
        const num1 = Math.floor(Math.random() * 90) + 10;
        const num2 = Math.floor(Math.random() * 90) + 10;
        const operator = operators[Math.floor(Math.random() * operators.length)];

        let problemString = `${num1} ${operator} ${num2}`;
        let correctAnswer;

        switch (operator) {
            case '+': correctAnswer = num1 + num2; break;
            case '-': correctAnswer = num1 - num2; break;
            case '*': correctAnswer = num1 * num2; break;
            case '/':
                correctAnswer = num1;
                problemString = `${num1 * num2} ${operator} ${num2}`;
                break;
        }
        setProblem(problemString);
        setAnswer(correctAnswer?.toString() ?? '');
        return problemString;
    };

    useEffect(() => {
        if (!problemGeneratedRef.current) {
            const newProblem = generateMathProblem();
            setTimeout(() => {
                onMessage({ sender: 'Người lạ', content: `${newProblem} = ?` });
            }, 1000);
            problemGeneratedRef.current = true;
        }
    }, [onMessage]);

    const handleSubmit = () => {
        // Hiển thị câu trả lời của người dùng
        onMessage({ sender: 'Bạn', content: userAnswer });
        const storedAchievementStatuses = JSON.parse(window.localStorage.getItem('achievementStatuses') || '[]');
        if (storedAchievementStatuses[6] === 0) {
            storedAchievementStatuses[6] = 1; // Đánh dấu thành tựu đầu tiên đã đạt được
            window.localStorage.setItem('achievementStatuses', JSON.stringify(storedAchievementStatuses));
            window.sessionStorage.setItem('AchievementNotification', 'Trợ Thủ');
        }

        setTimeout(() => {
            if (userAnswer.trim() === answer) {
                const reward = ['+', '-'].includes(problem.split(' ')[1]) ? 5000 : 10000;
                onChallengeComplete(reward);
                const storedAchievementStatuses = JSON.parse(window.localStorage.getItem('achievementStatuses') || '[]');
                if (storedAchievementStatuses[7] === 0) {
                    storedAchievementStatuses[7] = 1; // Đánh dấu thành tựu đầu tiên đã đạt được
                    window.localStorage.setItem('achievementStatuses', JSON.stringify(storedAchievementStatuses));
                    window.sessionStorage.setItem('AchievementNotification', 'Toán Học');
                }
                // Mở khóa công việc 1
                const storedJobs = JSON.parse(localStorage.getItem('jobs') || '[]');
                if (storedJobs[0] === -1) {
                    storedJobs[0] = 0;
                    localStorage.setItem('jobs', JSON.stringify(storedJobs));
                }
                onMessage({ sender: 'Người lạ', content: `Chúa ơi! Bạn đã giải đúng bài toán rồi! Đây là ${reward.toLocaleString()} đ cho bạn.` });
            } else {
                onMessage({ sender: 'Người lạ', content: 'Rất tiếc, câu trả lời của bạn chưa chính xác. Hãy thử lại!' });
            }
        }, 1000);
        setUserAnswer(''); // Clear the input after submission
    };

    return (
        <div className="flex items-center">
            <input
                type="text"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Nhập câu trả lời..."
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

export default React.memo(MathChallenge);