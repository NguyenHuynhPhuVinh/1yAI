'use client'
import Image from 'next/image';
import React from 'react';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { IoMdClose } from "react-icons/io";
import CardDetail from '../../components/CardDetail';
import Card from "../../types/cardList";
import cardList from '../../components/CardDB';

const DeckWixoss: React.FC = () => {
    const [selectedCard, setSelectedCard] = useState<Card | null>(null);
    const [isPopupViewDeck, setPopupViewDeck] = useState(false);
    const [deck1MAIN, setDeck1MAIN] = useState<number[]>([
        12, 12, 12, 12, 13, 13, 13, 13, 14, 14, 14, 14,
        15, 15, 15, 15, 16, 16, 16, 16, 17, 17, 17, 17,
        18, 18, 18, 18, 19, 19, 19, 19, 20, 20, 20, 20,
        21, 21, 21, 21
    ]);
    const [deck1LRIG, setDeck1LRIG] = useState<number[]>([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
    // Hàm lọc phần tử dựa trên numberCard
    const [deckView, setDeckView] = useState<number[]>([]);
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
    const [isPopupChangeDeck, setPopupChangeDeck] = useState(false);
    const router = useRouter();
    return (
        <>
            <div className="bg-black py-4">
                <h1 className="text-white font-bold text-xl text-center mb-4 cursor-pointer"
                    onClick={() => router.push("/play")}
                >TomiWixoss</h1>
                <h1 className="text-white font-bold text-xl text-center mb-4">Danh Sách Constructed Deck</h1>
                <div className="bg-white flex flex-col justify-center items-center rounded-xl mx-4 py-4">
                    <h1 className="text-red-500 text-xl font-[800] text-center">Constructed Deck D01 [DIVA DEBUT DECK ANCIENT SURPRISE]</h1>
                    <Image
                        src={'/WXDi-D01/deck.png'}
                        alt='Deck'
                        width={310}
                        height={266}
                        className='mt-4'
                    />
                    <p className='text-md font-bold mt-4'>Số Lượng Thẻ: 51</p>
                    <button className="px-4 py-2 bg-blue-500 mt-4 text-white rounded hover:bg-blue-600"
                        onClick={() => {
                            const newDeckView = [...deck1MAIN, ...deck1LRIG];
                            setDeckView(newDeckView);
                            setPopupViewDeck(true);
                        }}
                    >Danh Sách</button>
                    <button className="px-4 py-2 bg-blue-500 mt-4 text-white rounded hover:bg-blue-600"
                        onClick={() => {
                            setPopupChangeDeck(true)
                        }}
                    >Chọn</button>
                </div>
            </div>
            {isPopupChangeDeck && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-5 mx-5 rounded-lg shadow-lg text-center">
                        <div className="flex justify-between items-center mb-4">
                            <p className="font-bold text-xl mr-4">Đổi Deck</p>
                            <IoMdClose
                                onClick={() => { setPopupChangeDeck(false) }}
                                className="font-bold text-2xl cursor-pointer"
                            />
                        </div>
                        <div className='flex flex-col'>
                            <button
                                className={`px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 rounded`}
                                onClick={() => {
                                    if (typeof window !== "undefined") {
                                        window.localStorage.setItem('MAINDeckPlayer', JSON.stringify(deck1MAIN));
                                        window.localStorage.setItem('LRIGDeckPlayer', JSON.stringify(deck1LRIG));
                                    }
                                    setPopupChangeDeck(false);
                                }}
                            >
                                Deck Người Chơi
                            </button>
                            <button
                                className={`px-4 py-2 mt-4 bg-blue-500 text-white hover:bg-blue-600 rounded`}
                                onClick={() => {
                                    if (typeof window !== "undefined") {
                                        window.localStorage.setItem('MAINDeckTarget', JSON.stringify(deck1MAIN));
                                        window.localStorage.setItem('LRIGDeckTarget', JSON.stringify(deck1LRIG));
                                    }
                                    setPopupChangeDeck(false);
                                }}
                            >
                                Deck Đối Thủ
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {isPopupViewDeck && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-5 m-5 rounded-lg shadow-lg text-center relative overflow-auto max-h-[80vh]">
                        <div className="flex justify-between items-center mb-4">
                            <p className="font-bold text-lg">Xem Deck</p>
                            <IoMdClose
                                onClick={() => setPopupViewDeck(false)}
                                className="font-bold text-2xl cursor-pointer"
                            />
                        </div>
                        <div className="mt-4 grid grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto">
                            {filterCardsByNumberCard(cardList, deckView).map((card, index) => (
                                <div key={`${card.id}-${index}`} className="flex flex-col items-center cursor-pointer">
                                    <Image
                                        src={card.imageUrl}
                                        alt={card.name}
                                        width={750}
                                        height={1047}
                                        className="w-full h-auto mb-2"
                                        onClick={() => setSelectedCard(card)}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
            {selectedCard && <CardDetail card={selectedCard} onClose={() => setSelectedCard(null)} />}
        </>
    );
}

export default DeckWixoss;