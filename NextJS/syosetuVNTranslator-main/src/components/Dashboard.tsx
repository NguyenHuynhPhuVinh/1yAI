'use client';
import React, { useState } from 'react';
import { useNovel } from '@/contexts/NovelContext';
import NovelManager from './NovelManager';
import ChapterManager from './ChapterManager';
import ExportImportManager from './ExportImportManager';
import NovelStatistics from './NovelStatistics';
import GlossaryManager from './GlossaryManager';
import ExportToPDF from './ExportToPDF';

const Dashboard: React.FC = () => {
  const { currentNovel } = useNovel();
  const [activeTab, setActiveTab] = useState<'overview' | 'glossary'>('overview');

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Bảng điều khiển</h1>
            <p className="text-sm text-gray-600">Quản lý và theo dõi tiến trình dịch tiểu thuyết của bạn</p>
          </div>
          
          {currentNovel && (
            <div className="mt-4 md:mt-0 flex items-center space-x-2">
              <span className="text-sm text-gray-500">Đang làm việc với:</span>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                {currentNovel.title}
              </span>
            </div>
          )}
        </div>
        
        {currentNovel && (
          <div className="mb-8">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                    activeTab === 'overview'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
                      <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
                    </svg>
                    Tổng quan
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('glossary')}
                  className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                    activeTab === 'glossary'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z" />
                    </svg>
                    Thuật ngữ
                  </div>
                </button>
              </nav>
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-1 gap-8">
          {!currentNovel && (
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <NovelManager />
            </div>
          )}
          
          {currentNovel && activeTab === 'overview' && (
            <>
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <NovelStatistics />
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <ChapterManager />
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <ExportToPDF />
              </div>
            </>
          )}
          
          {currentNovel && activeTab === 'glossary' && (
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <GlossaryManager />
            </div>
          )}
          
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <ExportImportManager />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 