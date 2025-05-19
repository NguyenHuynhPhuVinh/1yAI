"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Novel, Chapter, getAllNovels, getChaptersForNovel, getNovel } from '@/lib/db';

interface NovelContextType {
  novels: Novel[];
  currentNovel: Novel | null;
  currentChapter: Chapter | null;
  chapters: Chapter[];
  loadNovels: () => Promise<void>;
  loadChapters: (novelId: number) => Promise<void>;
  setCurrentNovel: (novel: Novel | null) => void;
  setCurrentChapter: (chapter: Chapter | null) => void;
  refreshData: () => Promise<void>;
}

const NovelContext = createContext<NovelContextType | undefined>(undefined);

export function NovelProvider({ children }: { children: ReactNode }) {
  const [novels, setNovels] = useState<Novel[]>([]);
  const [currentNovel, setCurrentNovelState] = useState<Novel | null>(null);
  const [currentChapter, setCurrentChapterState] = useState<Chapter | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);

  const loadNovels = async () => {
    const allNovels = await getAllNovels();
    setNovels(allNovels);
  };

  const loadChapters = async (novelId: number) => {
    const novelChapters = await getChaptersForNovel(novelId);
    // Sắp xếp chương theo thứ tự
    novelChapters.sort((a, b) => a.order - b.order);
    setChapters(novelChapters);
  };

  const refreshData = async () => {
    await loadNovels();
    if (currentNovel) {
      await loadChapters(currentNovel.id!);
      
      // Cập nhật lại thông tin currentNovel từ database
      const updatedNovel = await getNovel(currentNovel.id!);
      if (updatedNovel) {
        setCurrentNovelState(updatedNovel);
      }
    }
  };

  // Wrapper cho setCurrentNovel để lưu vào localStorage
  const setCurrentNovel = (novel: Novel | null) => {
    setCurrentNovelState(novel);
    setCurrentChapterState(null);
    
    if (novel) {
      localStorage.setItem('currentNovelId', novel.id!.toString());
    } else {
      localStorage.removeItem('currentNovelId');
      localStorage.removeItem('currentChapterId');
    }
  };

  // Wrapper cho setCurrentChapter để lưu vào localStorage
  const setCurrentChapter = (chapter: Chapter | null) => {
    setCurrentChapterState(chapter);
    
    if (chapter) {
      localStorage.setItem('currentChapterId', chapter.id!.toString());
    } else {
      localStorage.removeItem('currentChapterId');
    }
  };

  // Tải danh sách truyện khi component được mount
  useEffect(() => {
    loadNovels();
    
    // Khôi phục trạng thái từ localStorage
    const restoreState = async () => {
      const savedNovelId = localStorage.getItem('currentNovelId');
      if (savedNovelId) {
        const novelId = parseInt(savedNovelId);
        const novel = await getNovel(novelId);
        
        if (novel) {
          setCurrentNovelState(novel);
          
          // Tải danh sách chương
          await loadChapters(novelId);
          
          // Khôi phục chương hiện tại
          const savedChapterId = localStorage.getItem('currentChapterId');
          if (savedChapterId) {
            const chapterId = parseInt(savedChapterId);
            const chapters = await getChaptersForNovel(novelId);
            const chapter = chapters.find(c => c.id === chapterId);
            
            if (chapter) {
              setCurrentChapterState(chapter);
            }
          }
        }
      }
    };
    
    restoreState();
  }, []);

  // Tải danh sách chương khi truyện hiện tại thay đổi
  useEffect(() => {
    if (currentNovel) {
      loadChapters(currentNovel.id!);
    } else {
      setChapters([]);
    }
  }, [currentNovel]);

  return (
    <NovelContext.Provider
      value={{
        novels,
        currentNovel,
        currentChapter,
        chapters,
        loadNovels,
        loadChapters,
        setCurrentNovel,
        setCurrentChapter,
        refreshData,
      }}
    >
      {children}
    </NovelContext.Provider>
  );
}

export function useNovel() {
  const context = useContext(NovelContext);
  if (context === undefined) {
    throw new Error('useNovel must be used within a NovelProvider');
  }
  return context;
} 