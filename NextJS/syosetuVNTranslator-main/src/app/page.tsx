/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import { initGemini } from "@/lib/gemini";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import NovelDetails from "@/components/NovelDetails";
import TranslationEditor from "@/components/TranslationEditor";
import Dashboard from "@/components/Dashboard";
import Reader from "@/components/Reader";
import Footer from "@/components/Footer";
import ApiKeyModal from "@/components/ApiKeyModal";
import { NovelProvider } from "@/contexts/NovelContext";

export default function Home() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [initError, setInitError] = useState("");
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [activeView, setActiveView] = useState<'dashboard' | 'editor' | 'reader'>('dashboard');
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Khởi tạo Gemini khi trang được tải
  useEffect(() => {
    async function initialize() {
      try {
        const success = await initGemini();
        setIsInitialized(success);
        if (!success) {
          setInitError("Không thể khởi tạo dịch vụ. Vui lòng cung cấp API key.");
          setIsApiKeyModalOpen(true);
        }
      } catch (error) {
        console.error("Lỗi khi khởi tạo:", error);
        setInitError("Đã xảy ra lỗi khi khởi tạo dịch vụ. Vui lòng thử lại sau.");
        setIsApiKeyModalOpen(true);
      }
    }
    
    initialize();
  }, []);

  // Cuộn lên đầu trang khi chuyển đổi chế độ xem
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeView]);

  const handleApiKeySuccess = async () => {
    try {
      const success = await initGemini();
      setIsInitialized(success);
      if (success) {
        setInitError("");
      } else {
        setInitError("API key không hợp lệ. Vui lòng thử lại.");
      }
    } catch (error) {
      console.error("Lỗi khi khởi tạo với API key mới:", error);
      setInitError("Đã xảy ra lỗi khi khởi tạo với API key mới.");
    }
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <NovelProvider>
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header 
          initError={initError} 
          onApiKeyClick={() => setIsApiKeyModalOpen(true)}
          activeView={activeView}
          setActiveView={setActiveView}
          onToggleSidebar={toggleSidebar}
          isSidebarCollapsed={isSidebarCollapsed}
        />
        
        <div className="flex flex-1 overflow-hidden">
          {activeView !== 'reader' && (
            <div className={`transition-all duration-300 ease-in-out ${isSidebarCollapsed ? 'w-16' : 'w-64'}`}>
              <Sidebar isCollapsed={isSidebarCollapsed} />
            </div>
          )}
          
          <div 
            className={`flex-1 transition-all duration-300 ease-in-out ${
              activeView === 'reader' 
                ? 'overflow-y-auto px-4 md:px-8' 
                : 'flex flex-col overflow-hidden'
            } ${activeView !== 'reader' && !isSidebarCollapsed ? 'ml-0' : ''}`}
          >
            {activeView !== 'reader' && <NovelDetails />}
            
            <div className="p-4 transition-opacity duration-300 ease-in-out">
              {activeView === 'dashboard' && (
                <Dashboard />
              )}
              {activeView === 'editor' && (
                <TranslationEditor isInitialized={isInitialized} />
              )}
              {activeView === 'reader' && (
                <Reader />
              )}
            </div>
          </div>
        </div>
        
        <Footer />
        
        <ApiKeyModal 
          isOpen={isApiKeyModalOpen}
          onClose={() => setIsApiKeyModalOpen(false)}
          onSuccess={handleApiKeySuccess}
        />
      </div>
    </NovelProvider>
  );
}
