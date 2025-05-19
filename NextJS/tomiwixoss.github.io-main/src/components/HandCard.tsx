import React, { useState } from 'react';
import Image from 'next/image';
import { IoMdClose } from "react-icons/io";
import CardDetail from './CardDetail';
import Card from "../types/cardList";
import cardList from './CardDB';

interface HandPopupProps {
    isOpen: boolean;
    onClose: () => void;
    numberCard: number[];
    type: number;
    MAINSpace: number[];
    MAINUseSpace: Card[];
    LRIGUseSpace: Card[];
    setNumberCard: React.Dispatch<React.SetStateAction<number[]>>;
    position: number;
    numberMAINCard: number[];
    setNumberMAINCard: React.Dispatch<React.SetStateAction<number[]>>;
    numberEnerCard: number[];
    setNumberEnerCard: React.Dispatch<React.SetStateAction<number[]>>;
    numberTrashCard: number[];
    setNumberTrashCard: React.Dispatch<React.SetStateAction<number[]>>;
}

const HandPopup: React.FC<HandPopupProps> = ({ isOpen, onClose, numberCard, type, MAINSpace, MAINUseSpace, LRIGUseSpace, setNumberCard, position, numberMAINCard, setNumberMAINCard, numberEnerCard, setNumberEnerCard, numberTrashCard, setNumberTrashCard }) => {
    const [selectedCard, setSelectedCard] = useState<Card | null>(null);
    const [isPopupAction, setPopupAction] = useState<Card | null>(null);
    const [isChangePopupAction, setChangePopupAction] = useState<Card | null>(null);
    const [isPositionCard, setIsPositionCard] = useState(0);

    const removeCardByIndex = (cardList: number[], indexToRemove: number): number[] => {
        return cardList.filter((_, index) => index !== indexToRemove);
    };

    const handleCardClick = (card: Card, index: number) => {
        if (type === 1) {
            MAINSpace[position] = card.id;
            MAINUseSpace[position] = card;
            setNumberCard(removeCardByIndex(numberCard, index));
            onClose();
            if (card.cardEffect.includes("Enter")) {
                setSelectedCard(card);
            }
        }
        else {
            setIsPositionCard(index);
            setPopupAction(card);
        }
    };

    const handleCloseDetail = () => {
        setSelectedCard(null);
    };

    // Hàm lọc phần tử dựa trên numberCard và type
    const filterCardsByNumberCard = (
        cardList: Card[],
        numberCard: number[],
        type: number
    ): Card[] => {
        const result: Card[] = [];

        // Tính tổng cardLevel của các MAINUseSpace đã có
        const totalMainUseSpaceLevel = MAINUseSpace.reduce((total, mainUseSpace) => total + mainUseSpace.cardLevel, 0);

        for (const number of numberCard) {
            const matchingCard = cardList.find(card => card.id === number);
            if (matchingCard) {
                // Nếu type === 1, kiểm tra điều kiện cardLevel
                if (
                    (type !== 1 || ((matchingCard.cardType === "SIGNI" || matchingCard.cardType === "Guard") && matchingCard.cardLevel <= LRIGUseSpace[1].cardLevel &&
                        totalMainUseSpaceLevel + matchingCard.cardLevel <= LRIGUseSpace.reduce((total, lrigUseSpace) => total + lrigUseSpace.cardLimit, 0)))
                ) {
                    result.push(matchingCard); // Thêm card vào mảng kết quả
                }
            }
        }

        return result;
    };

    return (
        <>
            {isOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-5 m-5 rounded-lg shadow-lg text-center relative overflow-auto max-h-[80vh]">
                        <div className="flex justify-between items-center mb-4">
                            {type === 0 &&
                                <p className="font-bold text-lg">Bài Trên Tay ({numberCard.length})</p>
                            }
                            {type === 1 &&
                                <p className="font-bold text-lg mr-2">Chọn Bài Ra Sân</p>
                            }
                            <IoMdClose
                                onClick={onClose}
                                className="font-bold text-2xl cursor-pointer"
                            />
                        </div>
                        <div className="mt-4 grid grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto">
                            {filterCardsByNumberCard(cardList, numberCard, type).map((card, index) => (
                                <div key={`${card.id}-${index}`} className="flex flex-col items-center cursor-pointer">
                                    <Image
                                        src={card.imageUrl}
                                        alt={card.name}
                                        width={750}
                                        height={1047}
                                        className="w-full h-auto mb-2"
                                        onClick={() => handleCardClick(card, index)}
                                    />
                                </div>
                            ))}
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
                                onClick={() => { setPopupAction(null) }}
                                className="font-bold text-2xl cursor-pointer"
                            />
                        </div>
                        <div className='flex flex-col'>
                            <button
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                onClick={() => {
                                    setSelectedCard(isPopupAction);
                                }}
                            >
                                Xem Thẻ
                            </button>
                            <button
                                className="px-4 py-2 mt-4 bg-blue-500 text-white rounded hover:bg-blue-600"
                                onClick={() => {
                                    setChangePopupAction(isPopupAction);
                                }}
                            >
                                Di Chuyển
                            </button>
                            {isPopupAction.cardType === "SPELL" &&
                                <button
                                    className="px-4 py-2 mt-4 bg-blue-500 text-white rounded hover:bg-blue-600"
                                    onClick={() => {
                                        const cardPut = [...numberTrashCard];
                                        cardPut.push(isPopupAction.id);
                                        setNumberTrashCard(cardPut);
                                        setNumberCard(removeCardByIndex(numberCard, isPositionCard));
                                        setPopupAction(null);
                                        setSelectedCard(isPopupAction);
                                    }}
                                >
                                    Sử Dụng
                                </button>
                            }
                        </div>
                    </div>
                </div >
            )}
            {isChangePopupAction && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-5 mx-5 rounded-lg shadow-lg text-center">
                        <div className="flex justify-between items-center mb-4">
                            <p className="font-bold text-xl mr-4">Di Chuyển</p>
                            <IoMdClose
                                onClick={() => { setChangePopupAction(null) }}
                                className="font-bold text-2xl cursor-pointer"
                            />
                        </div>
                        <div className='flex flex-col'>
                            <button
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                onClick={() => {
                                    const cardPut = [...numberEnerCard];
                                    cardPut.push(isChangePopupAction.id);
                                    setNumberEnerCard(cardPut);
                                    setNumberCard(removeCardByIndex(numberCard, isPositionCard));
                                    setChangePopupAction(null);
                                    setPopupAction(null);
                                }}
                            >
                                Vùng Nguyên Liệu
                            </button>
                            <button
                                className="px-4 py-2 mt-4 bg-blue-500 text-white rounded hover:bg-blue-600"
                                onClick={() => {
                                    const cardPut = [...numberTrashCard];
                                    cardPut.push(isChangePopupAction.id);
                                    setNumberTrashCard(cardPut);
                                    setNumberCard(removeCardByIndex(numberCard, isPositionCard));
                                    setChangePopupAction(null);
                                    setPopupAction(null);
                                }}
                            >
                                Thùng Rác
                            </button>
                            <button
                                className="px-4 py-2 mt-4 bg-blue-500 text-white rounded hover:bg-blue-600"
                                onClick={() => {
                                    const cardPut = [...numberMAINCard];
                                    cardPut.push(isChangePopupAction.id);
                                    setNumberMAINCard(cardPut);
                                    setNumberCard(removeCardByIndex(numberCard, isPositionCard));
                                    setChangePopupAction(null);
                                    setPopupAction(null);
                                }}
                            >
                                Bộ Bài Chính
                            </button>
                        </div>
                    </div>
                </div >
            )}
            {selectedCard && <CardDetail card={selectedCard} onClose={handleCloseDetail} />}
        </>
    );
};

export default HandPopup;
