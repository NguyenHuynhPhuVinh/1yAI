import React, { useState } from 'react';
import Image from 'next/image';
import { IoMdClose } from "react-icons/io";
import CardDetail from './CardDetail';
import Card from "../types/cardList";
import cardList from './CardDB';

interface LifePopupProps {
    isOpen: boolean;
    onClose: () => void;
    numberCardLife: number[];
    setNumberCardLife: React.Dispatch<React.SetStateAction<number[]>>;
    numberEnerCard: number[];
    setNumberEnerCard: React.Dispatch<React.SetStateAction<number[]>>;
    numberTrashCard: number[];
    setNumberTrashCard: React.Dispatch<React.SetStateAction<number[]>>;
}

const LifePopup: React.FC<LifePopupProps> = ({ isOpen, onClose, numberCardLife, setNumberCardLife, numberEnerCard, setNumberEnerCard, numberTrashCard, setNumberTrashCard }) => {
    const [selectedCard, setSelectedCard] = useState<Card | null>(null);
    const [isPopupAction, setPopupAction] = useState<Card | null>(null);

    const handleCardClick = (card: Card) => {
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
                            <p className="font-bold text-lg">Life Cloth</p>
                            <IoMdClose
                                onClick={onClose}
                                className="font-bold text-2xl cursor-pointer"
                            />
                        </div>
                        <div className="mt-4 grid grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto">
                            {filterCardsByNumberCard(cardList, numberCardLife).map((card, index) => (
                                <div key={`${card.id}-${index}`} className="flex flex-col items-center cursor-pointer">
                                    <Image
                                        src={'/backside/MAIN.jpg'}
                                        alt={'backside'}
                                        width={750}
                                        height={1047}
                                        className="w-full h-auto mb-2"
                                        onClick={() => { handleCardClick(card) }}
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
                                    const cardLife = [...numberCardLife];
                                    const cardEner = [...numberEnerCard];
                                    const cardPut = cardLife.splice(0, 1)[0];
                                    cardEner.push(cardPut);
                                    setNumberEnerCard(cardEner);
                                    setNumberCardLife(cardLife);
                                    const cardShow = cardList.find(card => card.id === cardPut);
                                    if (cardShow) setSelectedCard(cardShow);
                                    setPopupAction(null);
                                }}
                            >
                                Nghiền Nát
                            </button>
                            <button
                                className="px-4 py-2 mt-4 bg-blue-500 text-white rounded hover:bg-blue-600"
                                onClick={() => {
                                    const cardLife = [...numberCardLife];
                                    const cardTrash = [...numberTrashCard];
                                    const cardPut = cardLife.splice(0, 1)[0];
                                    cardTrash.push(cardPut);
                                    setNumberTrashCard(cardTrash);
                                    setNumberCardLife(cardLife);
                                    setPopupAction(null);
                                }}
                            >
                                Loại Bỏ
                            </button>
                        </div>
                    </div>
                </div >
            )}
            {selectedCard && <CardDetail card={selectedCard} onClose={handleCloseDetail} />}
        </>
    );
};

export default LifePopup;
