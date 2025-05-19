import React, { useEffect } from 'react';
import { Chapter } from '@/lib/db';

interface ChapterContentProps {
  chapter: Chapter;
  onPrevChapter: () => void;
  onNextChapter: () => void;
  onBackToList: () => void;
  hasPrev: boolean;
  hasNext: boolean;
  theme?: 'light' | 'sepia' | 'dark';
}

const ChapterContent: React.FC<ChapterContentProps> = ({ 
  chapter, 
  onPrevChapter, 
  onNextChapter, 
  onBackToList,
  hasPrev,
  hasNext,
  theme = 'light'
}) => {
  // Lưu vị trí đọc vào localStorage
  useEffect(() => {
    if (chapter && chapter.id) {
      localStorage.setItem('lastReadChapter', chapter.id.toString());
    }
  }, [chapter]);

  // Xác định lớp CSS cho theme
  const getThemeClasses = () => {
    switch (theme) {
      case 'sepia':
        return 'prose-amber prose-headings:text-amber-900 prose-p:text-amber-800';
      case 'dark':
        return 'prose-invert prose-headings:text-gray-100 prose-p:text-gray-300';
      default:
        return 'prose-slate prose-headings:text-gray-900 prose-p:text-gray-800';
    }
  };

  return (
    <div className="mb-16">
      <h1 className="text-3xl font-bold mb-6">{chapter.title}</h1>
      
      <div className={`prose prose-lg max-w-none ${getThemeClasses()} prose-p:mb-6`}>
        {chapter.translatedText ? (
          <div dangerouslySetInnerHTML={{ __html: formatText(chapter.translatedText) }} />
        ) : (
          <div dangerouslySetInnerHTML={{ __html: formatText(chapter.sourceText) }} />
        )}
      </div>
      
      <div className="mt-12 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
        <button
          onClick={onBackToList}
          className="flex items-center text-gray-600 hover:text-blue-600 transition-colors duration-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Danh sách chương
        </button>
        
        <div className="flex space-x-4">
          <button
            onClick={onPrevChapter}
            disabled={!hasPrev}
            className={`px-4 py-2 rounded-lg flex items-center ${
              hasPrev 
                ? 'bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Chương trước
          </button>
          
          <button
            onClick={onNextChapter}
            disabled={!hasNext}
            className={`px-4 py-2 rounded-lg flex items-center ${
              hasNext 
                ? 'bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Chương sau
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

// Hàm định dạng văn bản
const formatText = (text: string): string => {
  if (!text) return '';
  
  // Tách văn bản thành các đoạn dựa trên dòng trống
  const paragraphs = text.split(/\n\s*\n|\n{2,}/);
  
  // Bọc mỗi đoạn trong thẻ <p> với margin-bottom lớn hơn
  let formatted = paragraphs
    .map(paragraph => paragraph.trim())
    .filter(paragraph => paragraph.length > 0)
    .map(paragraph => `<p>${paragraph}</p>`)
    .join('\n\n');
  
  // Thay thế các dòng mới đơn lẻ trong mỗi đoạn bằng thẻ ngắt dòng
  formatted = formatted.replace(/\n(?!\n)/g, '<br>');
  
  return formatted;
};

export default ChapterContent; 