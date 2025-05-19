'use client';
import React, { useState } from 'react';
import { useNovel } from '@/contexts/NovelContext';
import { Novel, Chapter, addNovel, addChapter } from '@/lib/db';

interface SidebarProps {
  isCollapsed?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed = false }) => {
  const { novels, currentNovel, chapters, setCurrentNovel, setCurrentChapter, refreshData } = useNovel();
  const [isAddNovelModalOpen, setIsAddNovelModalOpen] = useState(false);
  const [isAddChapterModalOpen, setIsAddChapterModalOpen] = useState(false);
  const [newNovelTitle, setNewNovelTitle] = useState('');
  const [newNovelAuthor, setNewNovelAuthor] = useState('');
  const [newNovelDescription, setNewNovelDescription] = useState('');
  const [newChapterTitle, setNewChapterTitle] = useState('');

  const handleAddNovel = async () => {
    if (!newNovelTitle.trim()) return;

    const novel: Novel = {
      title: newNovelTitle,
      author: newNovelAuthor,
      description: newNovelDescription,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await addNovel(novel);
    await refreshData();
    setIsAddNovelModalOpen(false);
    setNewNovelTitle('');
    setNewNovelAuthor('');
    setNewNovelDescription('');
  };

  const handleAddChapter = async () => {
    if (!newChapterTitle.trim() || !currentNovel) return;

    const chapter: Chapter = {
      novelId: currentNovel.id!,
      title: newChapterTitle,
      sourceText: '',
      translatedText: '',
      createdAt: new Date(),
      updatedAt: new Date(),
      order: chapters.length + 1,
    };

    await addChapter(chapter);
    await refreshData();
    setIsAddChapterModalOpen(false);
    setNewChapterTitle('');
  };

  // Hiển thị sidebar thu gọn
  if (isCollapsed) {
    return (
      <aside className="h-full bg-white shadow-md flex flex-col overflow-hidden transition-all duration-300">
        <div className="p-2 border-b border-gray-200">
          <button
            onClick={() => setIsAddNovelModalOpen(true)}
            className="w-full p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md flex justify-center transition-colors duration-200"
            title="Thêm tiểu thuyết mới"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto py-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          {novels.map((novel) => (
            <div 
              key={novel.id} 
              className={`p-2 cursor-pointer transition-colors duration-200 ${
                currentNovel?.id === novel.id ? 'bg-blue-100' : 'hover:bg-gray-100'
              }`}
              onClick={() => setCurrentNovel(novel)}
              title={novel.title}
            >
              <div className="flex justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </aside>
    );
  }

  // Hiển thị sidebar đầy đủ
  return (
    <aside className="h-full bg-white shadow-md flex flex-col overflow-hidden transition-all duration-300">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">Tiểu thuyết của bạn</h2>
        <button
          onClick={() => setIsAddNovelModalOpen(true)}
          className="w-full py-2 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg flex items-center justify-center transition-all duration-200 shadow-sm hover:shadow"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Thêm tiểu thuyết mới
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto py-2 px-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {novels.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <p>Chưa có tiểu thuyết nào</p>
            <p className="text-sm mt-1">Nhấn &quot;Thêm tiểu thuyết mới&quot; để bắt đầu</p>
          </div>
        ) : (
          novels.map((novel) => (
            <div 
              key={novel.id} 
              className={`p-3 mb-2 rounded-lg cursor-pointer transition-all duration-200 ${
                currentNovel?.id === novel.id 
                  ? 'bg-blue-50 border-l-4 border-blue-600 shadow-sm' 
                  : 'hover:bg-gray-50 border-l-4 border-transparent'
              }`}
              onClick={() => setCurrentNovel(novel)}
            >
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 mr-2 ${currentNovel?.id === novel.id ? 'text-blue-600' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <div className="truncate">
                  <h3 className="font-medium text-gray-800 truncate">{novel.title}</h3>
                  {novel.author && <p className="text-xs text-gray-500 truncate">Tác giả: {novel.author}</p>}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      
      {currentNovel && (
        <div className="p-4 border-t border-gray-200">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium text-gray-800">Chương</h3>
            <button
              onClick={() => setIsAddChapterModalOpen(true)}
              className="p-1 rounded-md hover:bg-gray-100 transition-colors duration-200"
              title="Thêm chương mới"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          
          <div className="max-h-40 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {chapters.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-2">Chưa có chương nào</p>
            ) : (
              chapters.map((chapter) => (
                <div 
                  key={chapter.id} 
                  className="py-1 px-2 text-sm rounded cursor-pointer hover:bg-gray-50 transition-colors duration-200"
                  onClick={() => setCurrentChapter(chapter)}
                >
                  <span className="font-medium text-gray-700">#{chapter.order}</span> {chapter.title}
                </div>
              ))
            )}
          </div>
        </div>
      )}
      
      {/* Modal thêm tiểu thuyết */}
      {isAddNovelModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4 transform transition-all duration-300 scale-100">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Thêm tiểu thuyết mới</h2>
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-1">Tiêu đề</label>
              <input
                type="text"
                value={newNovelTitle}
                onChange={(e) => setNewNovelTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Nhập tiêu đề tiểu thuyết"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-1">Tác giả</label>
              <input
                type="text"
                value={newNovelAuthor}
                onChange={(e) => setNewNovelAuthor(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Nhập tên tác giả"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-1">Mô tả</label>
              <textarea
                value={newNovelDescription}
                onChange={(e) => setNewNovelDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Nhập mô tả tiểu thuyết"
                rows={3}
              />
            </div>
            
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsAddNovelModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors duration-200"
              >
                Hủy
              </button>
              <button
                onClick={handleAddNovel}
                className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-md transition-colors duration-200"
              >
                Thêm
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal thêm chương */}
      {isAddChapterModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4 transform transition-all duration-300 scale-100">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Thêm chương mới</h2>
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-1">Tiêu đề chương</label>
              <input
                type="text"
                value={newChapterTitle}
                onChange={(e) => setNewChapterTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Nhập tiêu đề chương"
              />
            </div>
            
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsAddChapterModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors duration-200"
              >
                Hủy
              </button>
              <button
                onClick={handleAddChapter}
                className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-md transition-colors duration-200"
              >
                Thêm
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar; 