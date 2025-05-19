import React from 'react';
import { Chapter } from '@/lib/db';

interface ChapterListProps {
  chapters: Chapter[];
  onSelectChapter: (chapter: Chapter) => void;
}

const ChapterList: React.FC<ChapterListProps> = ({ chapters, onSelectChapter }) => {
  // Lọc ra các chương đã có bản dịch
  const translatedChapters = chapters.filter(chapter => chapter.translatedText.trim() !== '');
  
  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Danh sách chương</h2>
      
      {translatedChapters.length === 0 ? (
        <p className="text-center text-gray-500 py-8">Chưa có chương nào được dịch. Hãy dịch truyện trước.</p>
      ) : (
        <div className="border border-gray-200 rounded-lg divide-y">
          {translatedChapters.map((chapter, index) => (
            <div 
              key={chapter.id}
              className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={() => onSelectChapter(chapter)}
            >
              <div className="flex items-center">
                <span className="text-gray-500 mr-3">{index + 1}.</span>
                <span className="font-medium">{chapter.title}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChapterList; 