'use client';
import React, { useState } from 'react';
import { useNovel } from '@/contexts/NovelContext';
import { getChaptersForNovel } from '@/lib/db';

const ExportToPDF: React.FC = () => {
  const { currentNovel } = useNovel();
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

  const handleExportToPDF = async () => {
    if (!currentNovel) return;
    
    setIsExporting(true);
    setExportProgress(0);
    
    try {
      // Lấy tất cả các chương của truyện
      const chapters = await getChaptersForNovel(currentNovel.id!);
      
      // Sắp xếp theo thứ tự
      chapters.sort((a, b) => a.order - b.order);
      
      // Lọc các chương đã dịch
      const translatedChapters = chapters.filter(chapter => chapter.translatedText.trim() !== '');
      
      // Tạo một cửa sổ mới để hiển thị nội dung
      const printWindow = window.open('', '_blank');
      
      if (!printWindow) {
        alert('Vui lòng cho phép trình duyệt mở cửa sổ pop-up để xuất PDF.');
        return;
      }
      
      // Tạo nội dung HTML
      let html = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>${currentNovel.title}</title>
          <meta charset="utf-8">
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 20mm;
              font-size: 12pt;
            }
            h1 {
              text-align: center;
              font-size: 24pt;
            }
            h2 {
              text-align: center;
              font-size: 18pt;
              margin-top: 30pt;
              page-break-before: always;
            }
            .author {
              text-align: center;
              font-size: 14pt;
              margin-bottom: 30pt;
            }
            .toc {
              margin-top: 30pt;
              page-break-before: always;
            }
            .toc h2 {
              page-break-before: avoid;
            }
            .toc ul {
              list-style-type: none;
            }
            .toc li {
              margin-bottom: 8pt;
            }
            .chapter {
              page-break-before: always;
            }
            p {
              text-align: justify;
              line-height: 1.5;
            }
            @media print {
              body {
                margin: 0;
                padding: 20mm;
              }
            }
          </style>
        </head>
        <body>
          <h1>${currentNovel.title}</h1>
          <p class="author">Tác giả: ${currentNovel.author}</p>
      `;
      
      if (currentNovel.description) {
        html += `<p>${currentNovel.description}</p>`;
      }
      
      // Thêm mục lục
      html += `
        <div class="toc">
          <h2>Mục lục</h2>
          <ul>
      `;
      
      for (let i = 0; i < translatedChapters.length; i++) {
        html += `<li>${i + 1}. ${translatedChapters[i].title}</li>`;
      }
      
      html += `</ul></div>`;
      
      // Thêm từng chương
      for (let i = 0; i < translatedChapters.length; i++) {
        const chapter = translatedChapters[i];
        
        // Cập nhật tiến độ
        setExportProgress(Math.round((i / translatedChapters.length) * 100));
        
        html += `
          <div class="chapter">
            <h2>${chapter.title}</h2>
            <div>
        `;
        
        // Xử lý văn bản để đảm bảo hiển thị đúng
        const paragraphs = chapter.translatedText.split('\n');
        
        for (const paragraph of paragraphs) {
          if (paragraph.trim() === '') {
            html += '<br>';
          } else {
            html += `<p>${paragraph}</p>`;
          }
        }
        
        html += `</div></div>`;
      }
      
      html += `
          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
              }, 1000);
            }
          </script>
        </body>
        </html>
      `;
      
      // Ghi nội dung vào cửa sổ mới
      printWindow.document.write(html);
      printWindow.document.close();
      
    } catch (error) {
      console.error('Lỗi khi xuất PDF:', error);
      alert('Có lỗi xảy ra khi xuất PDF. Vui lòng thử lại sau.');
    } finally {
      setIsExporting(false);
      setExportProgress(0);
    }
  };

  return (
    <div className="p-6 bg-white shadow-sm rounded-lg mt-6">
      <h2 className="text-xl font-bold mb-4">Xuất truyện sang PDF</h2>
      
      <p className="text-gray-600 mb-4">
        Xuất bản dịch tiếng Việt của truyện sang định dạng PDF để đọc offline hoặc chia sẻ.
      </p>
      
      <div className="flex flex-col space-y-4">
        <button
          onClick={handleExportToPDF}
          disabled={isExporting || !currentNovel}
          className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-gray-400 flex items-center w-fit"
        >
          {isExporting ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Đang xuất... {exportProgress}%
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd" />
              </svg>
              Xuất truyện sang PDF
            </>
          )}
        </button>
        
        {isExporting && (
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-purple-600 h-2.5 rounded-full" 
              style={{ width: `${exportProgress}%` }}
            ></div>
          </div>
        )}
      </div>
      
      <div className="mt-4 text-sm text-gray-500">
        <p>Lưu ý: Quá trình xuất sẽ mở cửa sổ in của trình duyệt. Bạn có thể chọn &quot;Lưu dưới dạng PDF&quot; trong hộp thoại in.</p>
        <p>Đảm bảo trình duyệt của bạn không chặn cửa sổ pop-up.</p>
      </div>
    </div>
  );
};

export default ExportToPDF; 