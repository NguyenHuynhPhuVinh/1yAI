/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import React, { useState } from 'react';
import { useNovel } from '@/contexts/NovelContext';
import { Novel, deleteNovel, updateNovel } from '@/lib/db';

const NovelManager: React.FC = () => {
  const { novels, setCurrentNovel, refreshData } = useNovel();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [novelToDelete, setNovelToDelete] = useState<Novel | null>(null);

  const handleDeleteClick = (novel: Novel) => {
    setNovelToDelete(novel);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!novelToDelete) return;

    await deleteNovel(novelToDelete.id!);
    await refreshData();
    setIsDeleteModalOpen(false);
    setNovelToDelete(null);
  };

  return (
    <div className="p-6 bg-white shadow-sm rounded-lg">
      <h2 className="text-xl font-bold mb-4">Quản lý truyện</h2>
      
      {novels.length === 0 ? (
        <p className="text-gray-500">Chưa có truyện nào. Hãy thêm truyện mới để bắt đầu.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tên truyện
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tác giả
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
              {novels.map((novel) => (
                <tr key={novel.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div 
                      className="text-sm font-medium text-gray-900 cursor-pointer hover:text-blue-600"
                      onClick={() => setCurrentNovel(novel)}
                    >
                      {novel.title}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {novel.author}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(novel.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setCurrentNovel(novel)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Chọn
                      </button>
                      <button
                        onClick={() => handleDeleteClick(novel)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal xác nhận xóa */}
      {isDeleteModalOpen && novelToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-semibold mb-4">Xác nhận xóa</h3>
            <p className="text-gray-700">
              Bạn có chắc chắn muốn xóa truyện &quot;{novelToDelete.title}&quot; không? Tất cả các chương sẽ bị xóa và không thể khôi phục.
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

export default NovelManager; 