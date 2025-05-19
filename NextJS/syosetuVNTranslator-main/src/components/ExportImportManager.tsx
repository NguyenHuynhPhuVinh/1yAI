/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import React, { useState } from 'react';
import { useNovel } from '@/contexts/NovelContext';
import { Novel, Chapter, addNovel, addChapter, getAllNovels, getChaptersForNovel } from '@/lib/db';

const ExportImportManager: React.FC = () => {
  const { refreshData, currentNovel } = useNovel();
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importData, setImportData] = useState('');
  const [importError, setImportError] = useState('');
  const [importSuccess, setImportSuccess] = useState('');

  const handleExportAll = async () => {
    setIsExporting(true);
    try {
      const novels = await getAllNovels();
      const exportData: { novels: Novel[], chapters: Record<number, Chapter[]> } = {
        novels: novels,
        chapters: {}
      };

      // Lấy tất cả các chương cho mỗi truyện
      for (const novel of novels) {
        const chapters = await getChaptersForNovel(novel.id!);
        exportData.chapters[novel.id!] = chapters;
      }

      // Tạo file JSON để tải xuống
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `syosetu_vn_translator_backup_${new Date().toISOString().slice(0, 10)}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
    } catch (error) {
      console.error('Lỗi khi xuất dữ liệu:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportNovel = async () => {
    if (!currentNovel) return;
    
    setIsExporting(true);
    try {
      const chapters = await getChaptersForNovel(currentNovel.id!);
      const exportData = {
        novel: currentNovel,
        chapters: chapters
      };

      // Tạo file JSON để tải xuống
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `${currentNovel.title.replace(/\s+/g, '_')}_backup_${new Date().toISOString().slice(0, 10)}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
    } catch (error) {
      console.error('Lỗi khi xuất dữ liệu:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleImport = async () => {
    setImportError('');
    setImportSuccess('');
    
    if (!importData.trim()) {
      setImportError('Vui lòng nhập dữ liệu JSON hợp lệ');
      return;
    }

    try {
      const data = JSON.parse(importData);
      
      // Kiểm tra cấu trúc dữ liệu
      if (data.novels && data.chapters) {
        // Nhập nhiều truyện
        for (const novel of data.novels) {
          // Loại bỏ id để tạo mới
          const { id, ...novelData } = novel;
          
          // Thêm truyện mới
          const newNovelId = await addNovel({
            ...novelData,
            createdAt: new Date(novelData.createdAt),
            updatedAt: new Date(novelData.updatedAt)
          });
          
          // Thêm các chương
          if (data.chapters[id]) {
            for (const chapter of data.chapters[id]) {
              const { id: chapterId, ...chapterData } = chapter;
              await addChapter({
                ...chapterData,
                novelId: newNovelId,
                createdAt: new Date(chapterData.createdAt),
                updatedAt: new Date(chapterData.updatedAt)
              });
            }
          }
        }
        setImportSuccess(`Đã nhập ${data.novels.length} truyện thành công`);
      } else if (data.novel && data.chapters) {
        // Nhập một truyện
        const { id, ...novelData } = data.novel;
        
        // Thêm truyện mới
        const newNovelId = await addNovel({
          ...novelData,
          createdAt: new Date(novelData.createdAt),
          updatedAt: new Date(novelData.updatedAt)
        });
        
        // Thêm các chương
        for (const chapter of data.chapters) {
          const { id: chapterId, ...chapterData } = chapter;
          await addChapter({
            ...chapterData,
            novelId: newNovelId,
            createdAt: new Date(chapterData.createdAt),
            updatedAt: new Date(chapterData.updatedAt)
          });
        }
        setImportSuccess(`Đã nhập truyện "${data.novel.title}" thành công`);
      } else {
        setImportError('Định dạng dữ liệu không hợp lệ');
        return;
      }
      
      // Làm mới dữ liệu
      await refreshData();
      
      // Xóa dữ liệu nhập
      setImportData('');
      setIsImporting(false);
    } catch (error) {
      console.error('Lỗi khi nhập dữ liệu:', error);
      setImportError('Có lỗi xảy ra khi nhập dữ liệu. Vui lòng kiểm tra định dạng JSON.');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setImportData(content);
    };
    reader.readAsText(file);
  };

  return (
    <div className="p-6 bg-white shadow-sm rounded-lg">
      <h2 className="text-xl font-bold mb-4">Xuất/Nhập dữ liệu</h2>
      
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">Xuất dữ liệu</h3>
          <div className="flex space-x-3">
            <button
              onClick={handleExportAll}
              disabled={isExporting}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
            >
              {isExporting ? 'Đang xuất...' : 'Xuất tất cả truyện'}
            </button>
            
            <button
              onClick={handleExportNovel}
              disabled={isExporting || !currentNovel}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400"
            >
              {isExporting ? 'Đang xuất...' : 'Xuất truyện hiện tại'}
            </button>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-2">Nhập dữ liệu</h3>
          
          {!isImporting ? (
            <button
              onClick={() => setIsImporting(true)}
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
            >
              Nhập dữ liệu từ file
            </button>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Chọn file JSON
                </label>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileUpload}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hoặc dán dữ liệu JSON
                </label>
                <textarea
                  value={importData}
                  onChange={(e) => setImportData(e.target.value)}
                  className="w-full h-40 p-2 border border-gray-300 rounded-md"
                  placeholder="Dán dữ liệu JSON ở đây..."
                />
              </div>
              
              {importError && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-2">
                  <p>{importError}</p>
                </div>
              )}
              
              {importSuccess && (
                <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-2">
                  <p>{importSuccess}</p>
                </div>
              )}
              
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setIsImporting(false);
                    setImportData('');
                    setImportError('');
                    setImportSuccess('');
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                >
                  Hủy
                </button>
                <button
                  onClick={handleImport}
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                >
                  Nhập dữ liệu
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExportImportManager; 