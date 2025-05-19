import React, { useState } from 'react';
import Image from 'next/image';
import { IoMdClose } from "react-icons/io";
import CardDetail from './CardDetail';
import Card from "../types/cardList";
import cardList from './CardDB';

interface EnerPopupProps {
    isOpen: boolean;
    onClose: () => void;
    numberCard: number[];
    setNumberCard: React.Dispatch<React.SetStateAction<number[]>>;
    numberMAINCard: number[];
    setNumberMAINCard: React.Dispatch<React.SetStateAction<number[]>>;
    numberHandCard: number[];
    setNumberHandCard: React.Dispatch<React.SetStateAction<number[]>>;
    numberTrashCard: number[];
    setNumberTrashCard: React.Dispatch<React.SetStateAction<number[]>>;
    isDiscardEner: boolean;
    setIsDiscardEner: React.Dispatch<React.SetStateAction<boolean>>;
    numberDiscardEner: number;
    setNumberDiscardEner: React.Dispatch<React.SetStateAction<number>>;
    colorDiscardEner: string[];
    setColorDiscardEner: React.Dispatch<React.SetStateAction<string[]>>;
}

const EnerPopup: React.FC<EnerPopupProps> = ({ isOpen, onClose, numberCard, setNumberCard, numberMAINCard, setNumberMAINCard, numberHandCard, setNumberHandCard, numberTrashCard, setNumberTrashCard, isDiscardEner, setIsDiscardEner, numberDiscardEner, setNumberDiscardEner, colorDiscardEner, setColorDiscardEner }) => {
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

    const filteredCardsColor = colorDiscardEner.length > 0
        ? filterCardsByNumberCard(cardList, numberCard).filter(card =>
            card.cardColor.some(color => color === colorDiscardEner[0])
        )
        : filterCardsByNumberCard(cardList, numberCard);

    return (
        <>
            {isOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-5 m-5 rounded-lg shadow-lg text-center relative overflow-auto max-h-[80vh]">
                        <div className="flex justify-between items-center mb-4">
                            {numberDiscardEner === 0 &&
                                <p className="font-bold text-lg">Bài Nguyên Liệu ({numberCard.length})</p>
                            }
                            {numberDiscardEner > 0 &&
                                <p className="font-bold text-lg">Loại Bỏ Nguyên Liệu</p>
                            }
                            <IoMdClose
                                onClick={onClose}
                                className="font-bold text-2xl cursor-pointer"
                            />
                        </div>
                        <div className="mt-4 grid grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto">
                            {filteredCardsColor.map((card, index) => (
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
                            {!isDiscardEner &&
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
                            }
                            <button
                                className="px-4 py-2 mt-4 bg-blue-500 text-white rounded hover:bg-blue-600"
                                onClick={() => {
                                    const cardPut = [...numberTrashCard];
                                    cardPut.push(isChangePopupAction.id);
                                    setNumberTrashCard(cardPut);
                                    const indexRemove = numberCard.indexOf(isChangePopupAction.id);
                                    setNumberCard(removeCardByIndex(numberCard, indexRemove));
                                    if (isDiscardEner && numberDiscardEner > 0) {
                                        const colorDiscard = [...colorDiscardEner];
                                        if (colorDiscardEner.length > 0) {
                                            // Lấy giá trị đầu tiên mà không thay đổi mảng gốc
                                            const [firstColor] = colorDiscard.slice(0, 1);
                                            setColorDiscardEner(colorDiscard.slice(1)); // Cập nhật trạng thái với mảng còn lại
                                        }
                                        const numberDiscard = numberDiscardEner - 1;
                                        setNumberDiscardEner(numberDiscard);
                                        if (numberDiscard === 0) setIsDiscardEner(false);
                                    }
                                    setChangePopupAction(null);
                                    setPopupAction(null);
                                }}
                            >
                                Thùng Rác
                            </button>
                            {!isDiscardEner &&
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
                            }
                        </div>
                    </div>
                </div >
            )}
            {selectedCard && <CardDetail card={selectedCard} onClose={handleCloseDetail} />}
        </>
    );
};

export default EnerPopup;
