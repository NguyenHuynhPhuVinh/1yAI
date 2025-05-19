import React from 'react';
import { Novel } from '@/lib/db';

interface NovelSelectorProps {
  novels: Novel[];
  onSelectNovel: (novel: Novel) => void;
}

const NovelSelector: React.FC<NovelSelectorProps> = ({ novels, onSelectNovel }) => {
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">Chọn truyện để đọc</h1>
      
      {novels.length === 0 ? (
        <p className="text-center text-gray-500">Chưa có truyện nào. Hãy thêm và dịch truyện trước.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {novels.map(novel => (
            <div 
              key={novel.id} 
              className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 hover:shadow-md cursor-pointer transition-all"
              onClick={() => onSelectNovel(novel)}
            >
              <h2 className="text-xl font-semibold mb-2">{novel.title}</h2>
              <p className="text-gray-600 mb-2">Tác giả: {novel.author}</p>
              {novel.description && (
                <p className="text-gray-700 line-clamp-3">{novel.description}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NovelSelector; 