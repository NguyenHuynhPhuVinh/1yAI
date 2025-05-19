// components/LRIGPopup.tsx
import React, { useState } from 'react';
import Image from 'next/image';
import { IoMdClose } from "react-icons/io";
import CardDetail from './CardDetail';
import Card from "../types/cardList";
import cardList from './CardDB';

interface LRIGPopupProps {
    isOpen: boolean;
    onClose: () => void;
    numberCard: number[];
    type: number;
    LRIGSpace: number[];
    LRIGUseSpace: Card[];
    setNumberCard: React.Dispatch<React.SetStateAction<number[]>>;
    position: number;
    numberRemoveCard: number[];
    setNumberRemoveCard: React.Dispatch<React.SetStateAction<number[]>>;
}

const LRIGPopup: React.FC<LRIGPopupProps> = ({ isOpen, onClose, numberCard, type, LRIGSpace, LRIGUseSpace, setNumberCard, position, numberRemoveCard, setNumberRemoveCard }) => {
    const [selectedCard, setSelectedCard] = useState<Card | null>(null);
    const [isPopupAction, setPopupAction] = useState<Card | null>(null);
    const [isPopupAction2, setPopupAction2] = useState<Card | null>(null);

    const removeCardById = (cardList: number[], idToRemove: number) => {
        return cardList.map(card => ({ id: card } as { id: number }))
            .filter(card => card.id !== idToRemove)
            .map(card => card.id);
    };

    const handleCardClick = (card: Card) => {
        if (type === 1) {
            LRIGSpace[position] = card.id;
            LRIGUseSpace[position] = card;
            setNumberCard(removeCardById(numberCard, card.id));
            onClose();
            if (card.cardEffect.includes("Enter")) {
                setSelectedCard(card);
            }
        }
        else {
            setPopupAction(card);
        }
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
                            <p className="font-bold text-lg">Bộ Bài LRIG ({numberCard.length})</p>
                            <IoMdClose
                                onClick={onClose}
                                className="font-bold text-2xl cursor-pointer"
                            />
                        </div>
                        <div className="mt-4 grid grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto">
                            {cardList
                                .filter(card => numberCard.includes(card.id)) // Lọc các card có id trùng với giá trị trong numberMain
                                .map(card => (
                                    <div
                                        key={card.id}
                                        className="flex flex-col items-center cursor-pointer"
                                        onClick={() => handleCardClick(card)}
                                    >
                                        <Image
                                            src={card.imageUrl}
                                            alt={card.name}
                                            width={750}
                                            height={1047}
                                            className="w-full h-auto mb-2"
                                        />
                                    </div>
                                ))}
                        </div>
                    </div>
                </div >
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
                                    setPopupAction2(isPopupAction);
                                }}
                            >
                                Trục Xuất
                            </button>
                            {isPopupAction.cardType === "PIECE" &&
                                <button
                                    className="px-4 py-2 mt-4 bg-blue-500 text-white rounded hover:bg-blue-600"
                                    onClick={() => {
                                        const cardLRIG = [...numberCard];
                                        const cardRemove = [...numberRemoveCard];
                                        cardRemove.push(isPopupAction.id);
                                        setNumberCard(removeCardById(cardLRIG, isPopupAction.id));
                                        setNumberRemoveCard(cardRemove);
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
            {isPopupAction2 && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-5 mx-5 rounded-lg shadow-lg text-center">
                        <div className="flex justify-between items-center mb-4">
                            <p className="font-bold text-xl mr-4">Trục Xuất</p>
                            <IoMdClose
                                onClick={() => { setPopupAction2(null) }}
                                className="font-bold text-2xl cursor-pointer"
                            />
                        </div>
                        <div className='flex flex-col'>
                            <button
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                onClick={() => {
                                    const cardLRIG = [...numberCard];
                                    const cardRemove = [...numberRemoveCard];
                                    cardRemove.push(isPopupAction2.id);
                                    setNumberCard(removeCardById(cardLRIG, isPopupAction2.id));
                                    setNumberRemoveCard(cardRemove);
                                    setPopupAction(null);
                                    setPopupAction2(null);
                                }}
                            >
                                Trục Xuất
                            </button>
                        </div>
                    </div>
                </div >
            )}
            {selectedCard && <CardDetail card={selectedCard} onClose={handleCloseDetail} />}
        </>
    );
};

export default LRIGPopup;
