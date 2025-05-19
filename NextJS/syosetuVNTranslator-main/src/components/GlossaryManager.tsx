/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import React, { useState, useEffect } from 'react';
import { useNovel } from '@/contexts/NovelContext';
import { Glossary, getGlossaryForNovel, addGlossaryTerm, updateGlossaryTerm, deleteGlossaryTerm } from '@/lib/db';

const GlossaryManager: React.FC = () => {
  const { currentNovel, refreshData } = useNovel();
  const [glossaryTerms, setGlossaryTerms] = useState<Glossary[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAddingTerm, setIsAddingTerm] = useState(false);
  const [editingTermId, setEditingTermId] = useState<number | null>(null);
  
  // Form state
  const [originalTerm, setOriginalTerm] = useState('');
  const [translatedTerm, setTranslatedTerm] = useState('');
  const [description, setDescription] = useState('');
  
  // Delete confirmation
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [termToDelete, setTermToDelete] = useState<Glossary | null>(null);

  useEffect(() => {
    if (currentNovel) {
      loadGlossary();
    } else {
      setGlossaryTerms([]);
    }
  }, [currentNovel]);

  const loadGlossary = async () => {
    if (!currentNovel) return;
    
    setIsLoading(true);
    try {
      const terms = await getGlossaryForNovel(currentNovel.id!);
      // Sắp xếp theo thứ tự bảng chữ cái
      terms.sort((a, b) => a.originalTerm.localeCompare(b.originalTerm));
      setGlossaryTerms(terms);
    } catch (error) {
      console.error('Lỗi khi tải thuật ngữ:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setOriginalTerm('');
    setTranslatedTerm('');
    setDescription('');
    setIsAddingTerm(false);
    setEditingTermId(null);
  };

  const handleAddTerm = async () => {
    if (!currentNovel) return;
    
    if (!originalTerm.trim() || !translatedTerm.trim()) {
      alert('Vui lòng nhập cả thuật ngữ gốc và bản dịch');
      return;
    }
    
    try {
      await addGlossaryTerm({
        novelId: currentNovel.id!,
        originalTerm: originalTerm.trim(),
        translatedTerm: translatedTerm.trim(),
        description: description.trim(),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      
      resetForm();
      await loadGlossary();
    } catch (error) {
      console.error('Lỗi khi thêm thuật ngữ:', error);
    }
  };

  const handleEditClick = (term: Glossary) => {
    setEditingTermId(term.id!);
    setOriginalTerm(term.originalTerm);
    setTranslatedTerm(term.translatedTerm);
    setDescription(term.description || '');
  };

  const handleUpdateTerm = async () => {
    if (!editingTermId) return;
    
    const termToUpdate = glossaryTerms.find(t => t.id === editingTermId);
    if (!termToUpdate) return;
    
    try {
      await updateGlossaryTerm({
        ...termToUpdate,
        originalTerm: originalTerm.trim(),
        translatedTerm: translatedTerm.trim(),
        description: description.trim(),
      });
      
      resetForm();
      await loadGlossary();
    } catch (error) {
      console.error('Lỗi khi cập nhật thuật ngữ:', error);
    }
  };

  const handleDeleteClick = (term: Glossary) => {
    setTermToDelete(term);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!termToDelete) return;
    
    try {
      await deleteGlossaryTerm(termToDelete.id!);
      setIsDeleteModalOpen(false);
      setTermToDelete(null);
      await loadGlossary();
    } catch (error) {
      console.error('Lỗi khi xóa thuật ngữ:', error);
    }
  };

  if (!currentNovel) {
    return (
      <div className="p-6 bg-white shadow-sm rounded-lg">
        <h2 className="text-xl font-bold mb-4">Quản lý thuật ngữ</h2>
        <p className="text-gray-500">Vui lòng chọn một truyện để quản lý thuật ngữ</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white shadow-sm rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Quản lý thuật ngữ</h2>
        
        {!isAddingTerm && !editingTermId && (
          <button
            onClick={() => setIsAddingTerm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Thêm thuật ngữ mới
          </button>
        )}
      </div>
      
      {isAddingTerm && (
        <div className="mb-6 p-4 border border-gray-200 rounded-lg">
          <h3 className="text-lg font-semibold mb-3">Thêm thuật ngữ mới</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Thuật ngữ gốc
              </label>
              <input
                type="text"
                value={originalTerm}
                onChange={(e) => setOriginalTerm(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Nhập thuật ngữ tiếng Nhật"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Thuật ngữ dịch
              </label>
              <input
                type="text"
                value={translatedTerm}
                onChange={(e) => setTranslatedTerm(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Nhập thuật ngữ tiếng Việt"
              />
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mô tả (tùy chọn)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              rows={3}
              placeholder="Thêm ghi chú hoặc giải thích về thuật ngữ này"
            />
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              onClick={resetForm}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
              Hủy
            </button>
            <button
              onClick={handleAddTerm}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Thêm
            </button>
          </div>
        </div>
      )}
      
      {editingTermId !== null && (
        <div className="mb-6 p-4 border border-gray-200 rounded-lg">
          <h3 className="text-lg font-semibold mb-3">Chỉnh sửa thuật ngữ</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Thuật ngữ gốc
              </label>
              <input
                type="text"
                value={originalTerm}
                onChange={(e) => setOriginalTerm(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Thuật ngữ dịch
              </label>
              <input
                type="text"
                value={translatedTerm}
                onChange={(e) => setTranslatedTerm(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mô tả (tùy chọn)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              rows={3}
            />
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              onClick={resetForm}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
              Hủy
            </button>
            <button
              onClick={handleUpdateTerm}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Cập nhật
            </button>
          </div>
        </div>
      )}
      
      {isLoading ? (
        <p className="text-gray-500">Đang tải thuật ngữ...</p>
      ) : glossaryTerms.length === 0 ? (
        <p className="text-gray-500">Chưa có thuật ngữ nào. Hãy thêm thuật ngữ mới để bắt đầu.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thuật ngữ gốc
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thuật ngữ dịch
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mô tả
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {glossaryTerms.map((term) => (
                <tr key={term.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{term.originalTerm}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{term.translatedTerm}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500">{term.description || '-'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEditClick(term)}
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDeleteClick(term)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {/* Modal xác nhận xóa */}
      {isDeleteModalOpen && termToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-semibold mb-4">Xác nhận xóa</h3>
            <p className="text-gray-700">
              Bạn có chắc chắn muốn xóa thuật ngữ &quot;{termToDelete.originalTerm}&quot; không? Hành động này không thể hoàn tác.
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

export default GlossaryManager; 