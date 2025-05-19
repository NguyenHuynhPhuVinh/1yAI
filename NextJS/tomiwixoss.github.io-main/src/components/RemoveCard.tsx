// components/TrashPopup.tsx
import React, { useState } from 'react';
import Image from 'next/image';
import { IoMdClose } from "react-icons/io";
import CardDetail from './CardDetail';
import Card from "../types/cardList";
import cardList from './CardDB';

interface TrashPopupProps {
    isOpen: boolean;
    onClose: () => void;
    numberCard: number[];
    setNumberCard: React.Dispatch<React.SetStateAction<number[]>>;
    numberLRIGCard: number[];
    setNumberLRIGCard: React.Dispatch<React.SetStateAction<number[]>>;
}

const TrashPopup: React.FC<TrashPopupProps> = ({ isOpen, onClose, numberCard, setNumberCard, numberLRIGCard, setNumberLRIGCard }) => {
    const [selectedCard, setSelectedCard] = useState<Card | null>(null);
    const [isPopupAction, setPopupAction] = useState<Card | null>(null);

    const removeCardById = (cardList: number[], idToRemove: number) => {
        return cardList.map(card => ({ id: card } as { id: number }))
            .filter(card => card.id !== idToRemove)
            .map(card => card.id);
    };

    const handleCardClick = (card: Card) => {
        setPopupAction(card);
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
                            <p className="font-bold text-lg">Trục Xuất LRIG ({numberCard.length})</p>
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
                                    >
                                        <Image
                                            src={card.imageUrl}
                                            alt={card.name}
                                            width={750}
                                            height={1047}
                                            className="w-full h-auto mb-2"
                                            onClick={() => handleCardClick(card)}
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
                                    const cardRemove = [...numberCard];
                                    const cardLRIG = [...numberLRIGCard];
                                    cardLRIG.push(isPopupAction.id);
                                    setNumberCard(removeCardById(cardRemove, isPopupAction.id));
                                    setNumberLRIGCard(cardLRIG);
                                    setPopupAction(null);
                                }}
                            >
                                Quay Lại
                            </button>
                        </div>
                    </div>
                </div >
            )}
            {selectedCard && <CardDetail card={selectedCard} onClose={handleCloseDetail} />}
        </>
    );
};

export default TrashPopup;
