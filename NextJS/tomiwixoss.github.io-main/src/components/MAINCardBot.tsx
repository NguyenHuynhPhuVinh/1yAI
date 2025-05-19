import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { IoMdClose } from "react-icons/io";
import CardDetail from './CardDetail';
import Card from "../types/cardList";
import cardList from './CardDB';
import { FaCheck } from "react-icons/fa6";
import { FaEye } from "react-icons/fa";

interface MAINPopupProps {
    isOpen: boolean;
    onClose: () => void;
    numberCardMAIN: number[];
    setNumberCardMAIN: React.Dispatch<React.SetStateAction<number[]>>;
    numberCardHand: number[];
    setNumberCardHand: React.Dispatch<React.SetStateAction<number[]>>;
    numberEnerCard: number[];
    setNumberEnerCard: React.Dispatch<React.SetStateAction<number[]>>;
    numberTrashCard: number[];
    setNumberTrashCard: React.Dispatch<React.SetStateAction<number[]>>;
    numberLifeCard: number[];
    setNumberLifeCard: React.Dispatch<React.SetStateAction<number[]>>;
}

const MAINPopup: React.FC<MAINPopupProps> = ({ isOpen, onClose, numberCardMAIN, setNumberCardMAIN, numberCardHand, setNumberCardHand, numberEnerCard, setNumberEnerCard, numberTrashCard, setNumberTrashCard, numberLifeCard, setNumberLifeCard }) => {
    const [selectedCard, setSelectedCard] = useState<Card | null>(null);
    const [isPopupAction, setPopupAction] = useState(false);
    const [isPopupRefresh, setPopupRefresh] = useState(false);
    const [currentCardIndex, setCurrentCardIndex] = useState<number>(0);
    const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set());
    const [temporarySelectedCards, setTemporarySelectedCards] = useState<number[]>([]);
    const [flippedCardList, setFlippedCardList] = useState<number[]>([]);

    useEffect(() => {
        if (isOpen === true) {
            if (numberCardMAIN.length === 0) {
                setPopupRefresh(true);
            }
        }
    }, [numberCardMAIN, isOpen]);

    // Hàm xáo trộn mảng
    const shuffleArray = (array: number[]) => {
        let shuffledArray = array.slice(); // Tạo bản sao của mảng
        for (let i = shuffledArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]]; // Hoán đổi các phần tử
        }
        return shuffledArray;
    };

    const handleCardClick = () => {
        setPopupAction(true);
    };

    const handleCardClickChoose = (index: number) => {
        setTemporarySelectedCards(prev => {
            if (prev.includes(index)) {
                // Nếu thẻ đã được chọn, bỏ chọn
                return prev.filter(item => item !== index);
            } else {
                // Nếu thẻ chưa được chọn, chọn
                return [...prev, index];
            }
        });
    };

    const handleCardFlip = () => {
        setFlippedCards(prev => {
            const updatedFlippedCards = new Set(prev);
            updatedFlippedCards.add(currentCardIndex);
            return updatedFlippedCards;
        });

        setFlippedCardList(prev => [...prev, currentCardIndex]);

        setCurrentCardIndex(prev => prev + 1);
    };

    const handleCloseDetail = () => {
        setSelectedCard(null);
    };

    return (
        <>
            {isOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-5 m-5 rounded-lg shadow-lg text-center relative overflow-auto max-h-[80vh]">
                        <div className="flex justify-between items-center mb-4">
                            <div className='flex justify-center items-center'>
                                <p className="font-bold text-lg">
                                    Bộ Bài Chính ({numberCardMAIN.length})
                                </p>
                                <FaEye
                                    className="font-bold text-2xl cursor-pointer ml-2"
                                    onClick={handleCardFlip}
                                />
                            </div>
                            <div className='flex justify-center items-center'>
                                {temporarySelectedCards.length > 0 &&
                                    <FaCheck className="font-bold text-2xl cursor-pointer mr-2"
                                        onClick={() => {
                                            // Sao chép danh sách thẻ
                                            const cardHand = [...numberCardHand];
                                            const cardMAIN = [...numberCardMAIN];

                                            // Thêm các thẻ được chọn vào cardHand và loại bỏ khỏi cardMAIN
                                            temporarySelectedCards.forEach(index => {
                                                const cardPut = cardMAIN[index];
                                                if (cardPut) cardHand.push(cardPut);
                                            });

                                            // Xác định các thẻ trong flippedCardList không nằm trong temporarySelectedCards
                                            const remainingFlippedCards = flippedCardList.filter(cardIndex =>
                                                !temporarySelectedCards.includes(cardIndex)
                                            );

                                            const cardPutMAIN: number[] = [];
                                            remainingFlippedCards.forEach(index => {
                                                const cardPut = cardMAIN[index];
                                                if (cardPut) cardPutMAIN.push(cardPut);
                                            });

                                            // Xáo trộn danh sách cardMAIN
                                            const shuffledCardMAIN = shuffleArray(cardPutMAIN);

                                            // Thêm các thẻ không nằm trong temporarySelectedCards vào cardMAIN ở cuối danh sách
                                            const updatedCardMAIN = [...cardMAIN, ...shuffledCardMAIN];

                                            // Cập nhật trạng thái
                                            setNumberCardHand(cardHand);
                                            setNumberCardMAIN(updatedCardMAIN.splice(flippedCardList.length));
                                            setTemporarySelectedCards([]);
                                            setFlippedCards(new Set());
                                            setCurrentCardIndex(0);
                                            setFlippedCardList([]);
                                            onClose();
                                        }}
                                    />
                                }
                                <IoMdClose
                                    onClick={() => {
                                        setFlippedCards(new Set());
                                        setCurrentCardIndex(0);
                                        setTemporarySelectedCards([]);
                                        setFlippedCardList([]);
                                        onClose();
                                    }}
                                    className="font-bold text-2xl cursor-pointer"
                                />
                            </div>
                        </div>
                        <div className="mt-4 grid grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto">
                            {numberCardMAIN.map((index, i) => {
                                const isFlipped = flippedCards.has(i);
                                const isSelected = temporarySelectedCards.includes(i);
                                return (
                                    <div key={`${index}-${i}`} className={`flex flex-col items-center cursor-pointer`}>
                                        <Image
                                            src={isFlipped ? (cardList.find(card => card.id === index)?.imageUrl ?? '/backside/MAIN.jpg') : '/backside/MAIN.jpg'}
                                            alt={'card'}
                                            width={750}
                                            height={1047}
                                            className={`w-full h-auto mb-2 ${temporarySelectedCards.includes(i) ? 'border-[3px] rounded-md border-red-500' : ''}`}
                                            onClick={handleCardClick}
                                        />
                                        {isFlipped && (
                                            <button
                                                className="px-2 py-1 bg-blue-500 text-white text-xs rounded-xl hover:bg-blue-600"
                                                onClick={() => {
                                                    if (!isSelected) {
                                                        const cardShow = (cardList.find(card => card.id === index));
                                                        if (cardShow) setSelectedCard(cardShow);
                                                    }
                                                    handleCardClickChoose(i);

                                                }}
                                            >
                                                {isSelected ? 'Bỏ Chọn' : 'Chọn'}
                                            </button>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
            {isPopupAction && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-5 mx-5 rounded-lg shadow-lg text-center">
                        <div className="flex justify-between items-center mb-4">
                            <p className="font-bold text-xl mr-4">Hành Động</p>
                            <IoMdClose
                                onClick={() => { setPopupAction(false) }}
                                className="font-bold text-2xl cursor-pointer"
                            />
                        </div>
                        <div className='flex flex-col'>
                            <button
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                onClick={() => {
                                    const cardMAIN = [...numberCardMAIN];
                                    const cardHand = [...numberCardHand];
                                    const cardPut = cardMAIN.shift();
                                    if (cardPut) cardHand.push(cardPut);
                                    setNumberCardHand(cardHand);
                                    setNumberCardMAIN(cardMAIN);
                                    setPopupAction(false);
                                }}
                            >
                                Rút Bài
                            </button>
                            <button
                                className="px-4 py-2 mt-4 bg-blue-500 text-white rounded hover:bg-blue-600"
                                onClick={() => {
                                    const cardMAIN = [...numberCardMAIN];
                                    const shuffleArrayMAIN = shuffleArray(cardMAIN);
                                    setNumberCardMAIN(shuffleArrayMAIN);
                                    setPopupAction(false);
                                }}
                            >
                                Xáo Bài
                            </button>
                            <button
                                className="px-4 py-2 mt-4 bg-blue-500 text-white rounded hover:bg-blue-600"
                                onClick={() => {
                                    const cardMAIN = [...numberCardMAIN];
                                    const cardEner = [...numberEnerCard];
                                    const cardPut = cardMAIN.shift();
                                    if (cardPut) cardEner.push(cardPut);
                                    setNumberEnerCard(cardEner);
                                    setNumberCardMAIN(cardMAIN);
                                    setPopupAction(false);
                                }}
                            >
                                Nhập Bài
                            </button>
                            <button
                                className="px-4 py-2 mt-4 bg-blue-500 text-white rounded hover:bg-blue-600"
                                onClick={() => {
                                    const cardMAIN = [...numberCardMAIN];
                                    const cardTrash = [...numberTrashCard];
                                    const cardPut = cardMAIN.shift();
                                    if (cardPut) cardTrash.push(cardPut);
                                    setNumberTrashCard(cardTrash);
                                    setNumberCardMAIN(cardMAIN);
                                    setPopupAction(false);
                                }}
                            >
                                Bỏ Bài
                            </button>
                            <button
                                className="px-4 py-2 mt-4 bg-blue-500 text-white rounded hover:bg-blue-600"
                                onClick={() => {
                                    const cardMAIN = [...numberCardMAIN];
                                    const cardLife = [...numberLifeCard];
                                    const cardPut = cardMAIN.shift();
                                    if (cardPut) cardLife.push(cardPut);
                                    setNumberLifeCard(cardLife);
                                    setNumberCardMAIN(cardMAIN);
                                    setPopupAction(false);
                                }}
                            >
                                Life Cloth
                            </button>
                        </div>
                    </div>
                </div >
            )}
            {isPopupRefresh && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-5 mx-5 rounded-lg shadow-lg text-center">
                        <div className="flex justify-between items-center mb-4">
                            <p className="font-bold text-xl mr-4">Làm Mới</p>
                            <IoMdClose
                                onClick={() => { setPopupRefresh(false) }}
                                className="font-bold text-2xl cursor-pointer"
                            />
                        </div>
                        <div className='flex flex-col'>
                            <button
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                onClick={() => {
                                    let cardMAIN = [...numberCardMAIN];
                                    let cardTrash = [...numberTrashCard];

                                    cardTrash.forEach(value => {
                                        const card = cardList.find(card => card.id === value);
                                        if (card) {
                                            cardMAIN.push(card.id);
                                        }
                                    });

                                    setNumberTrashCard([]);
                                    setNumberCardMAIN(cardMAIN);

                                    cardTrash = [];
                                    const cardLife = [...numberLifeCard];
                                    const cardPut = cardLife.shift();
                                    if (cardPut) cardTrash.push(cardPut);
                                    setNumberLifeCard(cardLife);
                                    setNumberTrashCard(cardTrash);
                                    setPopupRefresh(false);
                                }}
                            >
                                Làm Mới Bộ Bài Chính
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {selectedCard && <CardDetail card={selectedCard} onClose={handleCloseDetail} />}
        </>
    );
};

export default MAINPopup;
