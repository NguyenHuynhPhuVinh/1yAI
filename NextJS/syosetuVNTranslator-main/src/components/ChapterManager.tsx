'use client';
import React, { useState } from 'react';
import { useNovel } from '@/contexts/NovelContext';
import { Chapter, deleteChapter, updateChapter } from '@/lib/db';

const ChapterManager: React.FC = () => {
  const { currentNovel, chapters, setCurrentChapter, refreshData } = useNovel();
  const [editingChapterId, setEditingChapterId] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [chapterToDelete, setChapterToDelete] = useState<Chapter | null>(null);

  if (!currentNovel) return null;

  const handleEditClick = (chapter: Chapter) => {
    setEditingChapterId(chapter.id!);
    setEditingTitle(chapter.title);
  };

  const handleSaveEdit = async () => {
    if (!editingChapterId) return;

    const chapterToUpdate = chapters.find(c => c.id === editingChapterId);
    if (!chapterToUpdate) return;

    await updateChapter({
      ...chapterToUpdate,
      title: editingTitle,
    });

    await refreshData();
    setEditingChapterId(null);
  };

  const handleCancelEdit = () => {
    setEditingChapterId(null);
  };

  const handleDeleteClick = (chapter: Chapter) => {
    setChapterToDelete(chapter);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!chapterToDelete) return;

    await deleteChapter(chapterToDelete.id!);
    await refreshData();
    setIsDeleteModalOpen(false);
    setChapterToDelete(null);
  };

  const handleMoveUp = async (chapter: Chapter, index: number) => {
    if (index === 0) return;

    const prevChapter = chapters[index - 1];
    
    await updateChapter({
      ...chapter,
      order: prevChapter.order,
    });
    
    await updateChapter({
      ...prevChapter,
      order: chapter.order,
    });
    
    await refreshData();
  };

  const handleMoveDown = async (chapter: Chapter, index: number) => {
    if (index === chapters.length - 1) return;

    const nextChapter = chapters[index + 1];
    
    await updateChapter({
      ...chapter,
      order: nextChapter.order,
    });
    
    await updateChapter({
      ...nextChapter,
      order: chapter.order,
    });
    
    await refreshData();
  };

  return (
    <div className="p-6 bg-white shadow-sm rounded-lg">
      <h2 className="text-xl font-bold mb-4">Quản lý chương</h2>
      
      {chapters.length === 0 ? (
        <p className="text-gray-500">Chưa có chương nào. Hãy thêm chương mới để bắt đầu.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  STT
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tên chương
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày tạo
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {chapters.map((chapter, index) => (
                <tr key={chapter.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {chapter.order}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingChapterId === chapter.id ? (
                      <input
                        type="text"
                        value={editingTitle}
                        onChange={(e) => setEditingTitle(e.target.value)}
                        className="w-full p-1 border border-gray-300 rounded"
                      />
                    ) : (
                      <div 
                        className="text-sm font-medium text-gray-900 cursor-pointer hover:text-blue-600"
                        onClick={() => setCurrentChapter(chapter)}
                      >
                        {chapter.title}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(chapter.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {editingChapterId === chapter.id ? (
                      <div className="flex space-x-2">
                        <button
                          onClick={handleSaveEdit}
                          className="text-green-600 hover:text-green-900"
                        >
                          Lưu
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          Hủy
                        </button>
                      </div>
                    ) : (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditClick(chapter)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Sửa
                        </button>
                        <button
                          onClick={() => handleDeleteClick(chapter)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Xóa
                        </button>
                        <button
                          onClick={() => handleMoveUp(chapter, index)}
                          disabled={index === 0}
                          className={`${index === 0 ? 'text-gray-400' : 'text-gray-600 hover:text-gray-900'}`}
                        >
                          ↑
                        </button>
                        <button
                          onClick={() => handleMoveDown(chapter, index)}
                          disabled={index === chapters.length - 1}
                          className={`${index === chapters.length - 1 ? 'text-gray-400' : 'text-gray-600 hover:text-gray-900'}`}
                        >
                          ↓
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal xác nhận xóa */}
      {isDeleteModalOpen && chapterToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-semibold mb-4">Xác nhận xóa</h3>
            <p className="text-gray-700">
              Bạn có chắc chắn muốn xóa chương &quot;{chapterToDelete.title}&quot; không? Hành động này không thể hoàn tác.
            </p>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              >
                Hủy
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChapterManager; 