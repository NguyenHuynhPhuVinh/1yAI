import React, { useState } from 'react';
import { updateApiKey } from '@/lib/gemini';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [apiKey, setApiKey] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!apiKey.trim()) {
      setError('Vui lòng nhập API key');
      return;
    }

    try {
      updateApiKey(apiKey);
      onSuccess();
      onClose();
    } catch (error) {
      setError('Có lỗi xảy ra khi cập nhật API key');
      console.error(error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h3 className="text-xl font-semibold mb-4">Nhập Google Gemini API Key</h3>
        <p className="text-gray-700 mb-4">
          Để sử dụng tính năng dịch, bạn cần cung cấp Google Gemini API Key. 
          API key sẽ được lưu trữ cục bộ trên trình duyệt của bạn.
        </p>
        <div className="mb-4">
          <input
            type="text"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Nhập API key của bạn"
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          {error && <p className="text-red-500 mt-1 text-sm">{error}</p>}
        </div>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApiKeyModal; 