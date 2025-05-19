'use client';
import React, { useState, useEffect } from 'react';
import { useNovel } from '@/contexts/NovelContext';
import NovelSelector from './reader/NovelSelector';
import ChapterList from './reader/ChapterList';
import ChapterContent from './reader/ChapterContent';

const Reader: React.FC = () => {
  const { novels, currentNovel, setCurrentNovel, currentChapter, setCurrentChapter, chapters } = useNovel();
  const [view, setView] = useState<'list' | 'chapter'>(currentChapter ? 'chapter' : 'list');
  const [chapterId, setChapterId] = useState<number | null>(currentChapter?.id || null);
  const [fontSize, setFontSize] = useState<number>(18);
  const [theme, setTheme] = useState<'light' | 'sepia' | 'dark'>('light');
  const [showControls, setShowControls] = useState<boolean>(true);
  const [lineSpacing, setLineSpacing] = useState<number>(1.8); // Khoảng cách dòng mặc định

  // Chuyển về danh sách chương khi thay đổi truyện
  useEffect(() => {
    if (!currentChapter) {
      setView('list');
    }
  }, [currentChapter]);

  // Chuyển sang chế độ đọc chương khi chọn chương
  useEffect(() => {
    if (currentChapter && currentChapter.id !== undefined) {
      setView('chapter');
      setChapterId(currentChapter.id);
    }
  }, [currentChapter]);

  // Cuộn lên đầu trang khi chapterId thay đổi
  useEffect(() => {
    if (chapterId) {
      // Sử dụng nhiều cách khác nhau để đảm bảo cuộn hoạt động
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      // Thêm một lần cuộn nữa sau một khoảng thời gian
      const timer = setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 50);
      
      return () => clearTimeout(timer);
    }
  }, [chapterId]);

  // Lưu cài đặt đọc vào localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('readerSettings');
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      setFontSize(settings.fontSize || 18);
      setTheme(settings.theme || 'light');
      setLineSpacing(settings.lineSpacing || 1.8);
    }
  }, []);

  // Lưu cài đặt khi thay đổi
  useEffect(() => {
    localStorage.setItem('readerSettings', JSON.stringify({ fontSize, theme, lineSpacing }));
  }, [fontSize, theme, lineSpacing]);

  // Tìm chương trước và chương sau
  const currentIndex = currentChapter ? chapters.findIndex(c => c.id === currentChapter.id) : -1;
  const prevChapter = currentIndex > 0 ? chapters[currentIndex - 1] : null;
  const nextChapter = currentIndex >= 0 && currentIndex < chapters.length - 1 ? chapters[currentIndex + 1] : null;

  // Hàm điều hướng
  const goToPrevChapter = () => {
    if (prevChapter) {
      setCurrentChapter(prevChapter);
      setChapterId(prevChapter.id!); // Kích hoạt useEffect cuộn trang
    }
  };

  const goToNextChapter = () => {
    if (nextChapter) {
      setCurrentChapter(nextChapter);
      setChapterId(nextChapter.id!); // Kích hoạt useEffect cuộn trang
    }
  };

  const goToChapterList = () => {
    setView('list');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Thay đổi kích thước font
  const increaseFontSize = () => {
    if (fontSize < 28) {
      setFontSize(fontSize + 1);
    }
  };

  const decreaseFontSize = () => {
    if (fontSize > 14) {
      setFontSize(fontSize - 1);
    }
  };

  // Thay đổi khoảng cách dòng
  const increaseLineSpacing = () => {
    if (lineSpacing < 3) {
      setLineSpacing(parseFloat((lineSpacing + 0.2).toFixed(1)));
    }
  };

  const decreaseLineSpacing = () => {
    if (lineSpacing > 1) {
      setLineSpacing(parseFloat((lineSpacing - 0.2).toFixed(1)));
    }
  };

  // Xác định lớp CSS cho theme
  const getThemeClasses = () => {
    switch (theme) {
      case 'sepia':
        return 'bg-amber-50 text-amber-900';
      case 'dark':
        return 'bg-gray-900 text-gray-100';
      default:
        return 'bg-white text-gray-900';
    }
  };

  return (
    <div 
      className={`flex-1 transition-colors duration-300 ease-in-out ${getThemeClasses()}`} 
      id="reader-container"
    >
      {!currentNovel ? (
        <div className="max-w-4xl mx-auto px-4 py-8">
          <NovelSelector novels={novels} onSelectNovel={setCurrentNovel} />
        </div>
      ) : (
        <>
          <div className={`sticky top-0 z-10 ${getThemeClasses()} shadow-sm transition-all duration-300 ${showControls ? 'opacity-100' : 'opacity-0 hover:opacity-100'}`}>
            <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
              <div>
                <button 
                  onClick={goToChapterList}
                  className="flex items-center text-sm font-medium hover:underline transition-colors duration-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Danh sách chương
                </button>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={decreaseFontSize}
                    className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
                    title="Giảm cỡ chữ"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <span className="text-sm">{fontSize}px</span>
                  <button 
                    onClick={increaseFontSize}
                    className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
                    title="Tăng cỡ chữ"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>

                <div className="flex items-center space-x-2">
                  <button 
                    onClick={decreaseLineSpacing}
                    className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
                    title="Giảm khoảng cách dòng"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2 6h16v2H2V6z" />
                      <path d="M2 12h16v2H2v-2z" />
                    </svg>
                  </button>
                  <span className="text-sm">{lineSpacing}x</span>
                  <button 
                    onClick={increaseLineSpacing}
                    className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
                    title="Tăng khoảng cách dòng"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2 4h16v2H2V4z" />
                      <path d="M2 14h16v2H2v-2z" />
                    </svg>
                  </button>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => setTheme('light')}
                    className={`p-1 rounded-full transition-colors duration-200 ${theme === 'light' ? 'bg-gray-200 dark:bg-gray-700' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                    title="Chế độ sáng"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <button 
                    onClick={() => setTheme('sepia')}
                    className={`p-1 rounded-full transition-colors duration-200 ${theme === 'sepia' ? 'bg-gray-200 dark:bg-gray-700' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                    title="Chế độ sepia"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                    </svg>
                  </button>
                  <button 
                    onClick={() => setTheme('dark')}
                    className={`p-1 rounded-full transition-colors duration-200 ${theme === 'dark' ? 'bg-gray-200 dark:bg-gray-700' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                    title="Chế độ tối"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                    </svg>
                  </button>
                </div>
                
                <button 
                  onClick={() => setShowControls(!showControls)}
                  className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
                  title={showControls ? "Ẩn điều khiển" : "Hiện điều khiển"}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    {showControls ? (
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    ) : (
                      <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                    )}
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div className="max-w-4xl mx-auto px-4 py-8">
            {view === 'list' ? (
              <>
                <div className="mb-8">
                  <h1 className="text-3xl font-bold mb-2">{currentNovel.title}</h1>
                  <p className="text-lg text-gray-600 dark:text-gray-400">Tác giả: {currentNovel.author}</p>
                  {currentNovel.description && (
                    <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <p className="text-gray-700 dark:text-gray-300">{currentNovel.description}</p>
                    </div>
                  )}
                </div>
                <ChapterList 
                  chapters={chapters} 
                  onSelectChapter={(chapter) => {
                    setCurrentChapter(chapter);
                    setChapterId(chapter.id!); // Kích hoạt useEffect cuộn trang
                  }} 
                />
              </>
            ) : (
              <div style={{ fontSize: `${fontSize}px`, lineHeight: `${lineSpacing}` }}>
                <ChapterContent 
                  key={`chapter-${chapterId}`} // Thêm key để buộc React re-render
                  chapter={currentChapter!}
                  onPrevChapter={goToPrevChapter}
                  onNextChapter={goToNextChapter}
                  onBackToList={goToChapterList}
                  hasPrev={!!prevChapter}
                  hasNext={!!nextChapter}
                  theme={theme}
                />
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Reader; 