'use client';
import React, { useEffect, useState } from 'react';
import { useNovel } from '@/contexts/NovelContext';

interface Statistics {
  totalChapters: number;
  totalSourceWords: number;
  totalTranslatedWords: number;
  completedChapters: number;
  inProgressChapters: number;
  notStartedChapters: number;
}

const NovelStatistics: React.FC = () => {
  const { currentNovel, chapters } = useNovel();
  const [stats, setStats] = useState<Statistics>({
    totalChapters: 0,
    totalSourceWords: 0,
    totalTranslatedWords: 0,
    completedChapters: 0,
    inProgressChapters: 0,
    notStartedChapters: 0,
  });

  useEffect(() => {
    if (!currentNovel || chapters.length === 0) return;

    const totalChapters = chapters.length;
    let totalSourceWords = 0;
    let totalTranslatedWords = 0;
    let completedChapters = 0;
    let inProgressChapters = 0;
    let notStartedChapters = 0;

    chapters.forEach(chapter => {
      const sourceWords = chapter.sourceText.trim().split(/\s+/).length;
      const translatedWords = chapter.translatedText.trim().split(/\s+/).length;
      
      totalSourceWords += sourceWords;
      totalTranslatedWords += translatedWords;
      
      if (translatedWords === 0) {
        notStartedChapters++;
      } else if (translatedWords > 0 && sourceWords > translatedWords) {
        inProgressChapters++;
      } else {
        completedChapters++;
      }
    });

    setStats({
      totalChapters,
      totalSourceWords,
      totalTranslatedWords,
      completedChapters,
      inProgressChapters,
      notStartedChapters,
    });
  }, [currentNovel, chapters]);

  if (!currentNovel) return null;

  return (
    <div className="p-6 bg-white shadow-sm rounded-lg">
      <h2 className="text-xl font-bold mb-4">Thống kê truyện</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-700 mb-2">Tổng quan</h3>
          <ul className="space-y-2">
            <li className="flex justify-between">
              <span>Tổng số chương:</span>
              <span className="font-semibold">{stats.totalChapters}</span>
            </li>
            <li className="flex justify-between">
              <span>Tổng số từ gốc:</span>
              <span className="font-semibold">{stats.totalSourceWords.toLocaleString()}</span>
            </li>
            <li className="flex justify-between">
              <span>Tổng số từ đã dịch:</span>
              <span className="font-semibold">{stats.totalTranslatedWords.toLocaleString()}</span>
            </li>
          </ul>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-green-700 mb-2">Tiến độ</h3>
          <ul className="space-y-2">
            <li className="flex justify-between">
              <span>Chương đã hoàn thành:</span>
              <span className="font-semibold">{stats.completedChapters}</span>
            </li>
            <li className="flex justify-between">
              <span>Chương đang dịch:</span>
              <span className="font-semibold">{stats.inProgressChapters}</span>
            </li>
            <li className="flex justify-between">
              <span>Chương chưa bắt đầu:</span>
              <span className="font-semibold">{stats.notStartedChapters}</span>
            </li>
          </ul>
        </div>
        
        <div className="bg-purple-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-purple-700 mb-2">Tỷ lệ hoàn thành</h3>
          <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-green-500" 
              style={{ 
                width: `${stats.totalChapters ? (stats.completedChapters / stats.totalChapters) * 100 : 0}%` 
              }}
            ></div>
          </div>
          <p className="mt-2 text-center font-semibold">
            {stats.totalChapters 
              ? Math.round((stats.completedChapters / stats.totalChapters) * 100) 
              : 0}% hoàn thành
          </p>
        </div>
      </div>
    </div>
  );
};

export default NovelStatistics; 