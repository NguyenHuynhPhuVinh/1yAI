'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Nav from '@/components/nav';
import { FaCoins, FaArrowLeft, FaExchangeAlt, FaSearch, FaCreditCard, FaPlus, FaMinus } from 'react-icons/fa';

const TicTacToe = () => {
    const router = useRouter();
    const [board, setBoard] = useState<(string | null)[]>(Array(9).fill(null));
    const [isPlayerTurn, setIsPlayerTurn] = useState(true);
    const [winner, setWinner] = useState<string | null>(null);
    const [balance, setBalance] = useState(0);
    const [betAmount, setBetAmount] = useState(10);
    const [gameStarted, setGameStarted] = useState(false);
    const [message, setMessage] = useState('');
    const [displayUrl] = useState('aniw://tictactoe.ani');
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [cardNumberTicTacToe, setCardNumberTicTacToe] = useState('');
    const [showCardInput, setShowCardInput] = useState(false);
    const [cardInputMessage, setCardInputMessage] = useState('');
    const [cardInputMessageType, setCardInputMessageType] = useState<'success' | 'error' | ''>('');
    const [isTopUp, setIsTopUp] = useState(false);
    const [topUpAmount, setTopUpAmount] = useState('');
    const [showTopUpInput, setShowTopUpInput] = useState(false);

    useEffect(() => {
        const savedBalance = window.localStorage.getItem('balanceTicTacToe');
        if (savedBalance) {
            setBalance(parseInt(savedBalance));
        }
        // Mark achievement for visiting TicTacToe
        const storedAchievementStatuses = JSON.parse(window.localStorage.getItem('achievementStatuses') || '[]');
        if (storedAchievementStatuses[21] === 0) {
            storedAchievementStatuses[21] = 1;
            window.localStorage.setItem('achievementStatuses', JSON.stringify(storedAchievementStatuses));
            window.sessionStorage.setItem('AchievementNotification', 'TicTacToe');
        }
        const storedJobs = JSON.parse(localStorage.getItem('jobs') || '[]');
        if (storedJobs[11] === -1) {
            storedJobs[11] = 0;
            localStorage.setItem('jobs', JSON.stringify(storedJobs));
        }
        const savedCardNumber = window.sessionStorage.getItem('cardNumberTicTacToe');
        if (savedCardNumber) {
            setCardNumberTicTacToe(savedCardNumber);
        }
    }, []);

    const calculateWinner = (squares: (string | null)[]): string | null => {
        const lines = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6] // Diagonals
        ];
        for (let i = 0; i < lines.length; i++) {
            const [a, b, c] = lines[i];
            if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
                return squares[a];
            }
        }
        return null;
    };

    const handleClick = (i: number) => {
        if (!gameStarted || winner || board[i] || !isPlayerTurn) return;

        const newBoard = [...board];
        newBoard[i] = 'X';
        setBoard(newBoard);
        setIsPlayerTurn(false);

        const gameWinner = calculateWinner(newBoard);
        if (gameWinner) {
            endGame(gameWinner);
        } else if (!newBoard.includes(null)) {
            endGame('draw');
        } else {
            setTimeout(() => computerMove(newBoard), 500);
        }
    };

    const computerMove = (currentBoard: (string | null)[]) => {
        const newBoard = [...currentBoard];
        let move: number;
        // Try to win
        move = findWinningMove(newBoard, 'O');
        if (move === -1) {
            // Block player's winning move
            move = findWinningMove(newBoard, 'X');
            if (move === -1) {
                // Make a random move
                do {
                    move = Math.floor(Math.random() * 9);
                } while (newBoard[move]);
            }
        }
        newBoard[move] = 'O';
        setBoard(newBoard);
        setIsPlayerTurn(true);

        const gameWinner = calculateWinner(newBoard);
        if (gameWinner) {
            endGame(gameWinner);
        } else if (!newBoard.includes(null)) {
            endGame('draw');
        }
    };

    const findWinningMove = (board: (string | null)[], player: string): number => {
        for (let i = 0; i < 9; i++) {
            if (!board[i]) {
                board[i] = player;
                if (calculateWinner(board)) {
                    board[i] = null;
                    return i;
                }
                board[i] = null;
            }
        }
        return -1;
    };

    const endGame = (result: string) => {
        setWinner(result);
        if (result === 'X') {
            const winAmount = betAmount * 2;
            const newBalance = balance + winAmount;
            setBalance(newBalance);
            window.localStorage.setItem('balanceTicTacToe', newBalance.toString());
            setMessage(`Bạn thắng! +${winAmount} xu`);
        } else if (result === 'O') {
            setMessage('Bạn thua!');
        } else {
            setMessage('Hòa!');
            // Return the bet amount in case of a draw
            const newBalance = balance + betAmount;
            setBalance(newBalance);
            window.localStorage.setItem('balanceTicTacToe', newBalance.toString());
        }
    };

    const startGame = () => {
        if (balance < betAmount) {
            setMessage('Không đủ xu để đặt cược!');
            return;
        }
        setBoard(Array(9).fill(null));
        setIsPlayerTurn(true);
        setWinner(null);
        setGameStarted(true);
        setMessage('');
        const newBalance = balance - betAmount;
        setBalance(newBalance);
        window.localStorage.setItem('balanceTicTacToe', newBalance.toString());
    };

    const renderSquare = (i: number) => (
        <button className="w-20 h-20 bg-gray-700 text-4xl font-bold" onClick={() => handleClick(i)}>
            {board[i]}
        </button>
    );

    const handleExchangeCoins = () => {
        if (balance < 10) {
            showModalMessage('Số xu không đủ để đổi. Cần ít nhất 10 xu.');
            return;
        }

        if (!cardNumberTicTacToe) {
            setIsTopUp(false);
            setShowCardInput(true);
            return;
        }

        const exchangeAmount = Math.floor(balance / 10) * 1000;
        const newBalance = balance % 10;
        setBalance(newBalance);
        window.localStorage.setItem('balanceTicTacToe', newBalance.toString());

        const currentBankBalance = parseInt(window.localStorage.getItem('balanceBank') || '0', 10);
        const updatedBankBalance = currentBankBalance + exchangeAmount;
        window.localStorage.setItem('balanceBank', updatedBankBalance.toString());

        window.sessionStorage.setItem('Notification', `Bạn đã đổi ${exchangeAmount.toLocaleString()} đồng từ TicTacToe và chuyển vào tài khoản ngân hàng!`);
        showModalMessage(`Đã đổi thành công ${exchangeAmount.toLocaleString()} đồng!`);
    };

    const handleTopUp = () => {
        if (!cardNumberTicTacToe) {
            setIsTopUp(true);
            setShowCardInput(true);
            return;
        }
        setShowTopUpInput(!showTopUpInput);
        setCardInputMessage('');
    };

    const handleCardNumberSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (cardNumberTicTacToe.length === 16) {
            const storedCardNumber = window.localStorage.getItem('cardNumber');
            if (cardNumberTicTacToe === storedCardNumber) {
                window.sessionStorage.setItem('cardNumberTicTacToe', cardNumberTicTacToe);
                setCardInputMessage('Mã thẻ ngân hàng hợp lệ.');
                setCardInputMessageType('success');
                setShowCardInput(false);
                if (isTopUp) {
                    setShowTopUpInput(true);
                } else {
                    handleExchangeCoins();
                }
            } else {
                setCardInputMessage('Mã thẻ ngân hàng không khớp với thông tin đã lưu.');
                setCardInputMessageType('error');
            }
        } else {
            setCardInputMessage('Mã thẻ ngân hàng không hợp lệ. Vui lòng nhập 16 số.');
            setCardInputMessageType('error');
        }
    };

    const handleTopUpSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const amount = parseInt(topUpAmount);
        if (isNaN(amount) || amount < 1000) {
            setCardInputMessage('Số tiền không hợp lệ. Vui lòng nhập số tiền từ 1.000 đồng trở lên.');
            setCardInputMessageType('error');
            return;
        }

        const currentBankBalance = parseInt(window.localStorage.getItem('balanceBank') || '0', 10);
        if (currentBankBalance < amount) {
            setCardInputMessage('Số dư tài khoản ngân hàng không đủ để thực hiện giao dịch này.');
            setCardInputMessageType('error');
            return;
        }

        const coinsToAdd = Math.floor(amount / 1000) * 10;
        const newBalance = balance + coinsToAdd;
        setBalance(newBalance);
        window.localStorage.setItem('balanceTicTacToe', newBalance.toString());

        const updatedBankBalance = currentBankBalance - amount;
        window.localStorage.setItem('balanceBank', updatedBankBalance.toString());

        setCardInputMessage(`Nạp thành công ${coinsToAdd} xu vào tài khoản.`);
        setCardInputMessageType('success');
        setTopUpAmount('');
        setShowTopUpInput(false);
        showModalMessage(`Bạn đã nạp thành công ${coinsToAdd} xu vào tài khoản!`);
    };

    const showModalMessage = (message: string) => {
        setModalMessage(message);
        setShowModal(true);
        setTimeout(() => {
            setShowModal(false);
        }, 3000);
    };

    const handleIncreaseBet = () => {
        setBetAmount(prevAmount => prevAmount + 10);
    };

    const handleDecreaseBet = () => {
        setBetAmount(prevAmount => Math.max(10, prevAmount - 10));
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col">
            <Nav />
            <div className="p-4 flex-grow flex flex-col">
                <div className="flex items-center mb-4">
                    <FaArrowLeft className="text-xl cursor-pointer mr-4" onClick={() => router.push('/AniPhone/browser/app')} />
                    <div className="flex-grow flex items-center bg-gray-800 rounded-lg p-2">
                        <FaSearch className="text-gray-400 mr-2" />
                        <input
                            type="text"
                            value={displayUrl}
                            className="bg-transparent flex-grow outline-none"
                            readOnly
                        />
                    </div>
                </div>
                <div className='h-[78vh] overflow-y-auto pb-4'>
                    <h1 className="text-2xl font-bold pb-4 text-center">Tic-Tac-Toe Online</h1>
                    <div className="flex-grow flex flex-col items-center justify-center">
                        <div className="mb-4 flex items-center">
                            <FaCoins className="mr-2 text-yellow-500" />
                            <span>{balance} xu</span>
                        </div>
                        <div className="mb-4 flex space-x-2">
                            <button
                                onClick={handleExchangeCoins}
                                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition duration-300 flex items-center"
                            >
                                <FaExchangeAlt className="mr-2" />
                                Đổi xu
                            </button>
                            <button
                                onClick={handleTopUp}
                                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300 flex items-center"
                            >
                                <FaCreditCard className="mr-2" />
                                Nạp xu
                            </button>
                        </div>
                        {showCardInput && (
                            <form onSubmit={handleCardNumberSubmit} className="mb-4 bg-gray-800 p-4 rounded-lg">
                                <input
                                    type="text"
                                    value={cardNumberTicTacToe}
                                    onChange={(e) => setCardNumberTicTacToe(e.target.value)}
                                    placeholder="Nhập mã thẻ ngân hàng (16 số)"
                                    className="w-full p-2 bg-gray-700 rounded-md mb-2"
                                    maxLength={16}
                                />
                                {cardInputMessage && (
                                    <p className={`my-2 ${cardInputMessageType === 'success' ? 'text-green-500' : 'text-red-500'}`}>
                                        {cardInputMessage}
                                    </p>
                                )}
                                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md">
                                    Xác nhận
                                </button>
                            </form>
                        )}
                        {showTopUpInput && (
                            <form onSubmit={handleTopUpSubmit} className="mb-4 bg-gray-800 p-4 rounded-lg mx-4">
                                <input
                                    type="number"
                                    value={topUpAmount}
                                    onChange={(e) => setTopUpAmount(e.target.value)}
                                    placeholder="Nhập số tiền nạp (VNĐ)"
                                    className="w-full p-2 bg-gray-700 rounded-md mb-2"
                                    min="1000"
                                    step="1000"
                                />
                                <p className="text-sm text-gray-400 mb-2">1.000 đồng = 10 xu</p>
                                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md">
                                    Nạp xu
                                </button>
                                {cardInputMessage && (
                                    <p className={`my-2 ${cardInputMessageType === 'success' ? 'text-green-500' : 'text-red-500'}`}>
                                        {cardInputMessage}
                                    </p>
                                )}
                            </form>
                        )}
                        <div className="grid grid-cols-3 gap-2 mb-4">
                            {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => renderSquare(i))}
                        </div>
                        {!gameStarted && (
                            <div className="flex flex-col items-center">
                                <div className="flex items-center mb-2">
                                    <button
                                        onClick={handleDecreaseBet}
                                        className="bg-red-500 hover:bg-red-600 px-2 py-1 rounded-full"
                                    >
                                        <FaMinus />
                                    </button>
                                    <span className="px-4 py-1 bg-gray-700 mx-4 rounded-lg">{betAmount} xu</span>
                                    <button
                                        onClick={handleIncreaseBet}
                                        className="bg-green-500 hover:bg-green-600 px-2 py-1 rounded-full"
                                    >
                                        <FaPlus />
                                    </button>
                                </div>
                                <button
                                    onClick={startGame}
                                    className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded"
                                >
                                    Bắt đầu trò chơi (Cược {betAmount} xu)
                                </button>
                            </div>
                        )}
                        {message && <p className="mt-4 text-lg">{message}</p>}
                        {winner && (
                            <button
                                onClick={() => {
                                    setGameStarted(false);
                                    setBoard(Array(9).fill(null));
                                    setWinner(null);
                                    setIsPlayerTurn(true);
                                }}
                                className="mt-4 bg-green-500 hover:bg-green-600 px-4 py-2 rounded"
                            >
                                Chơi lại
                            </button>
                        )}
                    </div>
                </div>
            </div>
            {showModal && (
                <div className="fixed top-[15vh] left-1/2 transform -translate-x-1/2 z-50">
                    <div className="bg-green-500 text-white px-4 py-2 rounded-md shadow-md transition-all duration-300 ease-in-out transform hover:scale-105 inline-block">
                        <p className="text-sm font-semibold whitespace-nowrap">{modalMessage}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TicTacToe;