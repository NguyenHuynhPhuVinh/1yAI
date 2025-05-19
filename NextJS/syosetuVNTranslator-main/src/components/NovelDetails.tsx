'use client';
import React, { useState } from 'react';
import { useNovel } from '@/contexts/NovelContext';
import { updateNovel, deleteNovel } from '@/lib/db';

const NovelDetails: React.FC = () => {
  const { currentNovel, setCurrentNovel, refreshData } = useNovel();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [description, setDescription] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  React.useEffect(() => {
    if (currentNovel) {
      setTitle(currentNovel.title);
      setAuthor(currentNovel.author);
      setDescription(currentNovel.description);
    }
  }, [currentNovel]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!currentNovel) return;

    await updateNovel({
      ...currentNovel,
      title,
      author,
      description,
    });

    await refreshData();
    setIsEditing(false);
  };

  const handleCancel = () => {
    if (currentNovel) {
      setTitle(currentNovel.title);
      setAuthor(currentNovel.author);
      setDescription(currentNovel.description);
    }
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (!currentNovel) return;

    await deleteNovel(currentNovel.id!);
    setCurrentNovel(null);
    await refreshData();
    setIsDeleteModalOpen(false);
  };

  if (!currentNovel) {
    return null;
  }

  return (
    <div className="p-6 bg-gray-50 border-b border-gray-200">
      {isEditing ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tên truyện</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tác giả</label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              rows={3}
            />
          </div>
          <div className="flex justify-end space-x-3">
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
              Hủy
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Lưu
            </button>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold">{currentNovel.title}</h2>
              <p className="text-gray-600 mt-1">Tác giả: {currentNovel.author}</p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={handleEdit}
                className="p-2 text-blue-600 hover:bg-blue-100 rounded-full"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
              </button>
              <button
                onClick={() => setIsDeleteModalOpen(true)}
                className="p-2 text-red-600 hover:bg-red-100 rounded-full"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
          {description && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Mô tả</h3>
              <p className="text-gray-700">{description}</p>
            </div>
          )}
        </div>
      )}

      {/* Modal xác nhận xóa */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-semibold mb-4">Xác nhận xóa</h3>
            <p className="text-gray-700">
              Bạn có chắc chắn muốn xóa truyện &quot;{currentNovel.title}&quot; không? Tất cả các chương sẽ bị xóa và không thể khôi phục.
            </p>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              >
                Hủy
              </button>
              <button
                onClick={handleDelete}
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

export default NovelDetails;