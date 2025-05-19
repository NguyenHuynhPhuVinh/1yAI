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
    numberMAINCard: number[];
    setNumberMAINCard: React.Dispatch<React.SetStateAction<number[]>>;
    numberHandCard: number[];
    setNumberHandCard: React.Dispatch<React.SetStateAction<number[]>>;
    numberEnerCard: number[];
    setNumberEnerCard: React.Dispatch<React.SetStateAction<number[]>>;
}

const TrashPopup: React.FC<TrashPopupProps> = ({ isOpen, onClose, numberCard, setNumberCard, numberMAINCard, setNumberMAINCard, numberHandCard, setNumberHandCard, numberEnerCard, setNumberEnerCard }) => {
    const [selectedCard, setSelectedCard] = useState<Card | null>(null);
    const [isPopupAction, setPopupAction] = useState<Card | null>(null);
    const [isChangePopupAction, setChangePopupAction] = useState<Card | null>(null);
    const [isPositionCard, setIsPositionCard] = useState(0);

    const removeCardByIndex = (cardList: number[], indexToRemove: number): number[] => {
        return cardList.filter((_, index) => index !== indexToRemove);
    };

    const handleCardClick = (card: Card, index: number) => {
        setIsPositionCard(index);
        setPopupAction(card);
    };

    const handleCloseDetail = () => {
        setSelectedCard(null);
    };

    // Hàm lọc phần tử dựa trên numberCard
    const filterCardsByNumberCard = (cardList: Card[], numberCard: number[]): Card[] => {
        const result: Card[] = [];

        for (const number of numberCard) {
            // Tìm card trong cardList với id khớp với số trong numberCard
            const matchingCard = cardList.find(card => card.id === number);
            if (matchingCard) {
                result.push(matchingCard); // Thêm card vào mảng kết quả
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
                            <p className="font-bold text-lg">Thùng Rác ({numberCard.length})</p>
                            <IoMdClose
                                onClick={onClose}
                                className="font-bold text-2xl cursor-pointer"
                            />
                        </div>
                        <div className="mt-4 grid grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto">
                            {filterCardsByNumberCard(cardList, numberCard).map((card, index) => (
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
                                    setChangePopupAction(isPopupAction);
                                }}
                            >
                                Di Chuyển
                            </button>
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
                                    const cardPut = [...numberHandCard];
                                    cardPut.push(isChangePopupAction.id);
                                    setNumberHandCard(cardPut);
                                    setNumberCard(removeCardByIndex(numberCard, isPositionCard));
                                    setChangePopupAction(null);
                                    setPopupAction(null);
                                }}
                            >
                                Bài Trên Tay
                            </button>
                            <button
                                className="px-4 py-2 mt-4 bg-blue-500 text-white rounded hover:bg-blue-600"
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

export default TrashPopup;
