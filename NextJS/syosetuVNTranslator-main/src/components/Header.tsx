import React from 'react';

interface HeaderProps {
  initError?: string;
  onApiKeyClick: () => void;
  activeView?: 'dashboard' | 'editor' | 'reader';
  setActiveView?: (view: 'dashboard' | 'editor' | 'reader') => void;
  onToggleSidebar?: () => void;
  isSidebarCollapsed?: boolean;
}

const Header: React.FC<HeaderProps> = ({ 
  initError, 
  onApiKeyClick,
  activeView = 'dashboard',
  setActiveView,
  onToggleSidebar,
  isSidebarCollapsed = false
}) => {
  return (
    <header className="bg-white shadow-md sticky top-0 z-10 transition-all duration-300">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          {onToggleSidebar && activeView !== 'reader' && (
            <button 
              onClick={onToggleSidebar}
              className="mr-4 p-1 rounded-md hover:bg-gray-100 transition-colors duration-200"
              aria-label={isSidebarCollapsed ? "Mở rộng thanh bên" : "Thu gọn thanh bên"}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isSidebarCollapsed ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                )}
              </svg>
            </button>
          )}
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">SyosetuVNTranslator</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          {setActiveView && (
            <div className="flex border border-gray-300 rounded-lg overflow-hidden shadow-sm">
              <button
                onClick={() => setActiveView('dashboard')}
                className={`px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                  activeView === 'dashboard' 
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Quản lý
              </button>
              <button
                onClick={() => setActiveView('editor')}
                className={`px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                  activeView === 'editor' 
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Biên tập
              </button>
              <button
                onClick={() => setActiveView('reader')}
                className={`px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                  activeView === 'reader' 
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Đọc truyện
              </button>
            </div>
          )}
          
          <p className="text-gray-600 hidden lg:block text-sm">Công cụ quản lý và dịch tiểu thuyết từ Syosetu sang tiếng Việt</p>
          
          <button
            onClick={onApiKeyClick}
            className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              initError 
                ? 'bg-red-600 text-white hover:bg-red-700 shadow-md hover:shadow-lg' 
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-md'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
            </svg>
            {initError ? 'Cấu hình API Key' : 'Cài đặt API'}
          </button>
        </div>
      </div>
      
      {initError && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mt-2 rounded-r-md shadow-inner">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <p>{initError}</p>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header; 