/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import React, { useState, useEffect } from 'react';
import { useNovel } from '@/contexts/NovelContext';
import { translateTextStream, analyzeGrammarStream } from '@/lib/gemini';
import { updateChapter, getChaptersForNovel, getGlossaryForNovel } from '@/lib/db';
import { toast, Toaster } from 'sonner';

interface TranslationEditorProps {
  isInitialized: boolean;
}

interface TranslationLine {
  sourceText: string;
  translatedText: string;
  isTranslating: boolean;
  isAccepted: boolean;
  grammarStructure: string; // Cấu trúc ngữ pháp
  explanation: string; // Giải thích dịch
  showGrammar: boolean; // Hiển thị cấu trúc ngữ pháp
  showExplanation: boolean; // Hiển thị giải thích
  isAnalyzing: boolean; // Đang phân tích
}

const TranslationEditor: React.FC<TranslationEditorProps> = ({ isInitialized }) => {
  const { currentChapter, refreshData, chapters, currentNovel } = useNovel();
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [useContext, setUseContext] = useState(true);
  const [useGlossary, setUseGlossary] = useState(true);
  const [isTranslatingAll, setIsTranslatingAll] = useState(false);
  const [isAnalyzingAll, setIsAnalyzingAll] = useState(false);
  const [hasTranslatedAll, setHasTranslatedAll] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  // Trạng thái cho phiên bản mới với dịch từng dòng
  const [lines, setLines] = useState<TranslationLine[]>([]);
  const [currentTranslatingIndex, setCurrentTranslatingIndex] = useState<number | null>(null);

  useEffect(() => {
    if (currentChapter) {
      setSourceText(currentChapter.sourceText);
      setTranslatedText(currentChapter.translatedText);
      
      // Khởi tạo từng dòng từ bản gốc
      const sourceLines = currentChapter.sourceText.split('\n').filter(line => line.trim() !== '');
      const translatedLines = currentChapter.translatedText.split('\n').filter(line => line.trim() !== '');
      
      const newLines: TranslationLine[] = sourceLines.map((source, index) => ({
        sourceText: source,
        translatedText: translatedLines[index] || '',
        isTranslating: false,
        isAccepted: !!translatedLines[index], // Nếu đã có bản dịch, coi như đã được chấp nhận
        grammarStructure: '',
        explanation: '',
        showGrammar: false,
        showExplanation: false,
        isAnalyzing: false
      }));
      
      setLines(newLines);
      setHasUnsavedChanges(false);
    } else {
      setSourceText('');
      setTranslatedText('');
      setLines([]);
      setHasUnsavedChanges(false);
    }
  }, [currentChapter]);

  const handleSourceTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setSourceText(newText);
    setHasUnsavedChanges(true);
    
    // Cập nhật lines
    const sourceLines = newText.split('\n').filter(line => line.trim() !== '');
    const newLines: TranslationLine[] = sourceLines.map((source, index) => {
      // Giữ nguyên dữ liệu dịch và trạng thái của các dòng hiện có nếu có
      if (index < lines.length) {
        return {
          ...lines[index],
          sourceText: source,
        };
      }
      // Tạo mới nếu là dòng mới
      return {
        sourceText: source,
        translatedText: '',
        isTranslating: false,
        isAccepted: false,
        grammarStructure: '',
        explanation: '',
        showGrammar: false,
        showExplanation: false,
        isAnalyzing: false
      };
    });
    
    setLines(newLines);
  };

  const handleSave = async () => {
    if (!currentChapter) return;

    // Tạo bản dịch từ các dòng đã được chấp nhận
    const acceptedTranslation = lines
      .filter(line => line.isAccepted)
      .map(line => line.translatedText)
      .join('\n');

    try {
      await updateChapter({
        ...currentChapter,
        sourceText,
        translatedText: acceptedTranslation,
      });

      await refreshData();
      setHasUnsavedChanges(false);
      toast.success('Đã lưu thành công!');
    } catch (error) {
      console.error("Lỗi khi lưu:", error);
      toast.error('Lỗi khi lưu. Vui lòng thử lại!');
    }
  };

  const getPreviousChapters = async () => {
    if (!currentChapter || !currentNovel) return [];
    
    // Lấy tất cả các chương của truyện
    const allChapters = await getChaptersForNovel(currentNovel.id!);
    
    // Sắp xếp theo thứ tự
    allChapters.sort((a, b) => a.order - b.order);
    
    // Tìm vị trí của chương hiện tại
    const currentIndex = allChapters.findIndex(c => c.id === currentChapter.id);
    
    if (currentIndex <= 0) return []; // Không có chương trước
    
    // Lấy tối đa 2 chương trước đó
    const previousChapters = allChapters
      .slice(Math.max(0, currentIndex - 2), currentIndex)
      .filter(chapter => chapter.translatedText.trim() !== '')
      .map(chapter => ({
        title: chapter.title,
        content: chapter.translatedText
      }));
    
    return previousChapters;
  };

  const getGlossaryTerms = async () => {
    if (!currentNovel) return [];
    
    const glossary = await getGlossaryForNovel(currentNovel.id!);
    return glossary.map(term => ({
      original: term.originalTerm,
      translated: term.translatedTerm,
      description: term.description
    }));
  };

  // Hàm dịch một dòng cụ thể
  const translateLine = async (index: number) => {
    if (lines[index].isTranslating || !isInitialized || !currentChapter) return;
    
    // Cập nhật trạng thái dòng đang dịch
    setLines(prevLines => {
      const newLines = [...prevLines];
      newLines[index] = {
        ...newLines[index],
        isTranslating: true
      };
      return newLines;
    });
    
    try {
      // Lấy các chương trước đó và thuật ngữ
      const previousChapters = useContext ? await getPreviousChapters() : [];
      const glossaryTerms = useGlossary ? await getGlossaryTerms() : [];
      
      // Tạo prompt để yêu cầu AI dịch chính xác dòng này
      const prompt = `Dịch dòng văn bản sau sang tiếng Việt. Hãy dịch CHÍNH XÁC, KHÔNG thêm nội dung mới:

[1] ${lines[index].sourceText}

Yêu cầu:
1. Chỉ dịch dòng này
2. KHÔNG thêm nội dung mới
3. KHÔNG thay đổi cấu trúc
4. Trả về kết quả theo định dạng:
[1] <bản dịch>`;
      
      // Dịch dòng văn bản
      const streamResult = await translateTextStream(prompt, previousChapters, glossaryTerms);
      
      let translation = '';
      for await (const chunk of streamResult.stream) {
        const chunkText = chunk.text();
        translation += chunkText;
        
        // Cập nhật bản dịch trong quá trình stream
        const match = translation.match(/^\[\d+\]\s*(.+)$/);
        if (match) {
          setLines(prevLines => {
            const newLines = [...prevLines];
            newLines[index] = {
              ...newLines[index],
              translatedText: match[1].trim()
            };
            return newLines;
          });
        }
      }
      
      // Hoàn thành dịch
      setLines(prevLines => {
        const newLines = [...prevLines];
        const match = translation.match(/^\[\d+\]\s*(.+)$/);
        newLines[index] = {
          ...newLines[index],
          isTranslating: false,
          translatedText: match ? match[1].trim() : translation.trim()
        };
        
        // Cập nhật bản dịch toàn bộ
        const acceptedTranslation = newLines
          .filter(line => line.isAccepted || line.translatedText.trim() !== '')
          .map(line => line.translatedText)
          .join('\n');
        
        setTranslatedText(acceptedTranslation);
        setHasUnsavedChanges(true);
        return newLines;
      });
      
    } catch (error) {
      console.error("Lỗi khi dịch dòng:", error);
      
      // Cập nhật trạng thái lỗi
      setLines(prevLines => {
        const newLines = [...prevLines];
        newLines[index] = {
          ...newLines[index],
          isTranslating: false,
          translatedText: "Đã xảy ra lỗi khi dịch. Vui lòng thử lại."
        };
        return newLines;
      });
    }
  };

  // Hàm phân tích cấu trúc ngữ pháp cho một dòng
  const analyzeGrammar = async (index: number) => {
    if (lines[index].isAnalyzing || !isInitialized || !currentChapter) return;
    
    // Cập nhật trạng thái dòng đang phân tích
    setLines(prevLines => {
      const newLines = [...prevLines];
      newLines[index] = {
        ...newLines[index],
        isAnalyzing: true
      };
      return newLines;
    });
    
    try {
      // Sử dụng hàm analyzeGrammarStream từ gemini.ts
      const streamResult = await analyzeGrammarStream(lines[index].sourceText);
      
      let fullAnalysis = '';
      for await (const chunk of streamResult.stream) {
        const chunkText = chunk.text();
        fullAnalysis += chunkText;
      }
      
      // Xử lý kết quả
      let grammarStructure = '';
      let explanation = '';
      
      // Thay thế biểu thức chính quy không sử dụng flag 's'
      const grammarMatch = fullAnalysis.match(/GRAMMAR:([\s\S]*?)(?=EXPLANATION:|$)/);
      const explanationMatch = fullAnalysis.match(/EXPLANATION:([\s\S]*?)$/);
      
      if (grammarMatch && grammarMatch[1]) {
        grammarStructure = grammarMatch[1].trim();
      }
      
      if (explanationMatch && explanationMatch[1]) {
        explanation = explanationMatch[1].trim();
      }
      
      // Cập nhật thông tin cấu trúc ngữ pháp và giải thích
      setLines(prevLines => {
        const newLines = [...prevLines];
        newLines[index] = {
          ...newLines[index],
          grammarStructure,
          explanation,
          isAnalyzing: false,
          showGrammar: true,
          showExplanation: true
        };
        return newLines;
      });
    } catch (error) {
      console.error("Lỗi khi phân tích cấu trúc ngữ pháp:", error);
      
      // Cập nhật trạng thái lỗi
      setLines(prevLines => {
        const newLines = [...prevLines];
        newLines[index] = {
          ...newLines[index],
          isAnalyzing: false,
          grammarStructure: "Đã xảy ra lỗi khi phân tích. Vui lòng thử lại.",
          explanation: ""
        };
        return newLines;
      });
    }
  };

  // Hàm phân tích cấu trúc ngữ pháp cho tất cả các dòng
  const analyzeAllGrammar = async () => {
    if (isAnalyzingAll || !isInitialized || !currentChapter) return;
    
    setIsAnalyzingAll(true);
    
    try {
      // Duyệt qua từng dòng
      for (let i = 0; i < lines.length; i++) {
        // Bỏ qua nếu dòng đã có thông tin cấu trúc ngữ pháp
        if (lines[i].grammarStructure && lines[i].explanation) continue;
        
        // Cập nhật trạng thái dòng đang phân tích
        setLines(prevLines => {
          const newLines = [...prevLines];
          newLines[i] = {
            ...newLines[i],
            isAnalyzing: true
          };
          return newLines;
        });
        
        try {
          // Sử dụng hàm analyzeGrammarStream từ gemini.ts
          const streamResult = await analyzeGrammarStream(lines[i].sourceText);
          
          let fullAnalysis = '';
          for await (const chunk of streamResult.stream) {
            const chunkText = chunk.text();
            fullAnalysis += chunkText;
          }
          
          // Xử lý kết quả
          let grammarStructure = '';
          let explanation = '';
          
          // Thay thế biểu thức chính quy không sử dụng flag 's'
          const grammarMatch = fullAnalysis.match(/GRAMMAR:([\s\S]*?)(?=EXPLANATION:|$)/);
          const explanationMatch = fullAnalysis.match(/EXPLANATION:([\s\S]*?)$/);
          
          if (grammarMatch && grammarMatch[1]) {
            grammarStructure = grammarMatch[1].trim();
          }
          
          if (explanationMatch && explanationMatch[1]) {
            explanation = explanationMatch[1].trim();
          }
          
          // Cập nhật thông tin cấu trúc ngữ pháp và giải thích
          setLines(prevLines => {
            const newLines = [...prevLines];
            newLines[i] = {
              ...newLines[i],
              grammarStructure,
              explanation,
              isAnalyzing: false,
              showGrammar: true,
              showExplanation: true
            };
            return newLines;
          });
          
          // Đợi một chút để tránh rate limit
          await new Promise(resolve => setTimeout(resolve, 500));
        } catch (error) {
          console.error(`Lỗi khi phân tích cấu trúc ngữ pháp dòng ${i}:`, error);
          
          // Cập nhật trạng thái lỗi
          setLines(prevLines => {
            const newLines = [...prevLines];
            newLines[i] = {
              ...newLines[i],
              isAnalyzing: false,
              grammarStructure: "Đã xảy ra lỗi khi phân tích. Vui lòng thử lại.",
              explanation: ""
            };
            return newLines;
          });
        }
      }
    } catch (error) {
      console.error("Lỗi khi phân tích tất cả các dòng:", error);
    } finally {
      setIsAnalyzingAll(false);
    }
  };

  // Hàm để chấp nhận một dòng đã dịch
  const acceptLine = (index: number) => {
    setLines(prevLines => {
      const newLines = [...prevLines];
      newLines[index] = {
        ...newLines[index],
        isAccepted: true
      };
      return newLines;
    });
    
    // Cập nhật bản dịch toàn bộ
    setLines(prevLines => {
      const acceptedTranslation = prevLines
        .filter(line => line.isAccepted || line.translatedText.trim() !== '')
        .map(line => line.translatedText)
        .join('\n');
      
      setTranslatedText(acceptedTranslation);
      return prevLines;
    });
  };

  // Hàm để chấp nhận tất cả các dòng đã dịch
  const acceptAllLines = () => {
    setLines(prevLines => {
      const newLines = prevLines.map(line => ({
        ...line,
        isAccepted: line.translatedText.trim() !== ''
      }));
      
      // Cập nhật bản dịch toàn bộ
      const acceptedTranslation = newLines
        .filter(line => line.translatedText.trim() !== '')
        .map(line => line.translatedText)
        .join('\n');
      
      setTranslatedText(acceptedTranslation);
      return newLines;
    });
  };

  // Hàm dịch tất cả các dòng chưa được dịch
  const translateAllLines = async () => {
    if (isTranslatingAll || !isInitialized || !currentChapter) return;
    
    setIsTranslatingAll(true);
    setHasTranslatedAll(false);
    
    try {
      // Lấy các chương trước đó và thuật ngữ
      const previousChapters = useContext ? await getPreviousChapters() : [];
      const glossaryTerms = useGlossary ? await getGlossaryTerms() : [];
      
      // Đánh dấu tất cả các dòng là đang dịch
      setLines(prevLines => 
        prevLines.map(line => ({
          ...line,
          isTranslating: true
        }))
      );

      // Tạo prompt để yêu cầu AI dịch chính xác từng dòng
      const prompt = `Dịch các dòng văn bản sau sang tiếng Việt. Hãy dịch CHÍNH XÁC từng dòng một, KHÔNG thêm dòng mới, KHÔNG thay đổi cấu trúc đoạn văn:

${lines.map((line, index) => `[${index + 1}] ${line.sourceText}`).join('\n')}

Yêu cầu:
1. Dịch theo thứ tự từng dòng
2. Giữ nguyên số lượng dòng
3. KHÔNG thêm dòng mới
4. KHÔNG thay đổi cấu trúc đoạn văn
5. Trả về kết quả theo định dạng:
[1] <bản dịch dòng 1>
[2] <bản dịch dòng 2>
...`;
      
      // Dịch toàn bộ văn bản
      const streamResult = await translateTextStream(prompt, previousChapters, glossaryTerms);
      
      let fullTranslation = '';
      for await (const chunk of streamResult.stream) {
        const chunkText = chunk.text();
        fullTranslation += chunkText;
      }
      
      // Xử lý kết quả dịch để lấy ra từng dòng
      const translatedLines = fullTranslation
        .split('\n')
        .filter(line => line.trim() !== '')
        .map(line => {
          // Loại bỏ số thứ tự [n] ở đầu dòng
          const match = line.match(/^\[\d+\]\s*(.+)$/);
          return match ? match[1].trim() : line.trim();
        });
      
      // Cập nhật các dòng với kết quả dịch, đảm bảo không thêm dòng mới
      setLines(prevLines => {
        const newLines = prevLines.map((line, index) => ({
          ...line,
          translatedText: index < translatedLines.length ? translatedLines[index] : line.translatedText,
          isTranslating: false,
          isAccepted: index < translatedLines.length && !!translatedLines[index]
        }));
        
        // Cập nhật bản dịch toàn bộ
        const acceptedTranslation = newLines
          .filter(line => line.isAccepted || line.translatedText.trim() !== '')
          .map(line => line.translatedText)
          .join('\n');
        
        setTranslatedText(acceptedTranslation);
        return newLines;
      });
      
      // Đánh dấu là đã dịch toàn bộ
      setHasTranslatedAll(true);
      
    } catch (error) {
      console.error("Lỗi khi dịch tất cả các dòng:", error);
      
      // Đánh dấu tất cả các dòng không còn trong trạng thái đang dịch
      setLines(prevLines => 
        prevLines.map(line => ({
          ...line,
          isTranslating: false
        }))
      );
    } finally {
      setIsTranslatingAll(false);
      setCurrentTranslatingIndex(null);
    }
  };

  // Hàm để ẩn/hiện cấu trúc ngữ pháp cho một dòng
  const toggleGrammar = (index: number) => {
    setLines(prevLines => {
      const newLines = [...prevLines];
      newLines[index] = {
        ...newLines[index],
        showGrammar: !newLines[index].showGrammar
      };
      return newLines;
    });
  };

  // Hàm để ẩn/hiện giải thích cho một dòng
  const toggleExplanation = (index: number) => {
    setLines(prevLines => {
      const newLines = [...prevLines];
      newLines[index] = {
        ...newLines[index],
        showExplanation: !newLines[index].showExplanation
      };
      return newLines;
    });
  };

  // Thêm cảnh báo khi có thay đổi chưa lưu
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        const message = "Bạn có thay đổi chưa được lưu. Bạn có chắc chắn muốn rời đi?";
        e.returnValue = message;
        return message;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [hasUnsavedChanges]);

  if (!currentChapter) {
    return (
      <div className="flex-1 p-6 flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">Vui lòng chọn một chương để bắt đầu dịch</p>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 overflow-y-auto">
      <Toaster richColors position="top-right" />
      <div className="mb-4">
        <h2 className="text-xl font-bold">{currentChapter.title}</h2>
        
        <div className="flex justify-between items-center mt-2">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="useContext"
                checked={useContext}
                onChange={(e) => setUseContext(e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="useContext" className="text-sm text-gray-600">
                Sử dụng ngữ cảnh từ các chương trước
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="useGlossary"
                checked={useGlossary}
                onChange={(e) => setUseGlossary(e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="useGlossary" className="text-sm text-gray-600">
                Sử dụng thuật ngữ đã định nghĩa
              </label>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3">
            {hasUnsavedChanges && (
              <div className="px-3 py-2 bg-yellow-100 text-yellow-800 rounded-md flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Có thay đổi chưa lưu
              </div>
            )}
            <button
              onClick={handleSave}
              className={`px-4 py-2 ${hasUnsavedChanges ? 'bg-green-600 animate-pulse' : 'bg-green-600'} text-white rounded-md hover:bg-green-700 disabled:bg-gray-400`}
              disabled={isTranslatingAll || isAnalyzingAll}
            >
              Lưu
            </button>
            <button
              onClick={translateAllLines}
              className={`px-4 py-2 ${isTranslatingAll ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} text-white rounded-md`}
              disabled={isTranslatingAll || isAnalyzingAll || !isInitialized}
            >
              {isTranslatingAll ? "Đang dịch..." : "Dịch toàn bộ"}
            </button>
            <button
              onClick={analyzeAllGrammar}
              className={`px-4 py-2 ${isAnalyzingAll ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'} text-white rounded-md`}
              disabled={isAnalyzingAll || isTranslatingAll || !isInitialized}
            >
              {isAnalyzingAll ? "Đang phân tích..." : "Phân tích tất cả"}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Phần nhập văn bản gốc */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Văn bản gốc</h3>
          <textarea
            className="w-full h-[calc(100vh-300px)] p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            placeholder="Dán đoạn tiểu thuyết cần dịch vào đây..."
            value={sourceText}
            onChange={handleSourceTextChange}
            disabled={isTranslatingAll || isAnalyzingAll}
          />
        </div>
        
        {/* Phần biên tập dịch */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Bản dịch</h3>
          
          {isTranslatingAll ? (
            <div className="relative w-full h-[calc(100vh-300px)]">
              <textarea
                className="w-full h-full p-4 border border-gray-300 rounded-lg resize-none"
                value={translatedText}
                disabled
                style={{ fontFamily: "'Noto Serif', 'Source Serif Pro', 'Palatino', serif" }}
              />
              <div className="absolute inset-0 flex items-center justify-center bg-white/80">
                <div className="flex flex-col items-center">
                  <div className="flex space-x-2 mb-3">
                    <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                  <p className="text-blue-600">Đang dịch toàn bộ văn bản...</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full h-[calc(100vh-300px)] overflow-y-auto border border-gray-300 rounded-lg">
              {lines.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500">Nhập văn bản gốc và nhấn &quot;Dịch toàn bộ&quot; để bắt đầu</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {lines.map((line, index) => (
                    <div key={index} className="p-4">
                      <div className="mb-2 font-medium text-sm bg-gray-50 p-2 rounded">
                        {line.sourceText}
                      </div>
                      
                      <div className="relative mb-2">
                        <textarea
                          className={`w-full p-2 border rounded ${line.isAccepted ? 'bg-green-50 border-green-200' : 'bg-white border-gray-300'}`}
                          value={line.translatedText}
                          onChange={(e) => {
                            const newLines = [...lines];
                            newLines[index].translatedText = e.target.value;
                            setLines(newLines);
                            
                            // Cập nhật kết quả cuối cùng
                            const acceptedTranslation = newLines
                              .filter(l => l.isAccepted || l.translatedText.trim() !== '')
                              .map(l => l.translatedText)
                              .join('\n');
                            setTranslatedText(acceptedTranslation);
                          }}
                          rows={2}
                          disabled={line.isTranslating || line.isAnalyzing}
                          style={{ fontFamily: "'Noto Serif', 'Source Serif Pro', 'Palatino', serif" }}
                        />
                        {/* Hiệu ứng loading cho từng vùng */}
                        {(line.isTranslating || line.isAnalyzing) && (
                          <div className="absolute inset-0 flex items-center justify-center bg-white/80">
                            <div className="flex flex-col items-center">
                              <div className="flex space-x-2 mb-2">
                                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                              </div>
                              <p className="text-blue-600 text-xs">
                                {line.isTranslating ? "Đang dịch..." : "Đang phân tích..."}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* Phần hiển thị cấu trúc ngữ pháp và giải thích */}
                      {line.grammarStructure && (
                        <div className="mb-2">
                          <button 
                            onClick={() => toggleGrammar(index)}
                            className="flex items-center text-xs text-indigo-600 hover:text-indigo-800 mb-1 focus:outline-none"
                          >
                            <span className="mr-1">{line.showGrammar ? '▼' : '►'}</span> Cấu trúc ngữ pháp
                          </button>
                          {line.showGrammar && (
                            <div className="text-xs bg-indigo-50 p-2 rounded border border-indigo-100 mb-2 whitespace-pre-line">
                              {line.grammarStructure}
                            </div>
                          )}
                        </div>
                      )}
                      
                      {line.explanation && (
                        <div className="mb-2">
                          <button 
                            onClick={() => toggleExplanation(index)}
                            className="flex items-center text-xs text-amber-600 hover:text-amber-800 mb-1 focus:outline-none"
                          >
                            <span className="mr-1">{line.showExplanation ? '▼' : '►'}</span> Giải thích dịch
                          </button>
                          {line.showExplanation && (
                            <div className="text-xs bg-amber-50 p-2 rounded border border-amber-100 mb-2 whitespace-pre-line">
                              {line.explanation}
                            </div>
                          )}
                        </div>
                      )}
                      
                      <div className="flex flex-wrap justify-end space-x-2">
                        <button
                          onClick={() => analyzeGrammar(index)}
                          className="px-3 py-1 text-xs bg-indigo-500 text-white rounded hover:bg-indigo-600 disabled:bg-gray-300 mb-1"
                          disabled={line.isAnalyzing || isAnalyzingAll || isTranslatingAll}
                        >
                          {line.isAnalyzing ? "Đang phân tích..." : (line.grammarStructure ? "Phân tích lại" : "Phân tích")}
                        </button>
                        
                        <button
                          onClick={() => translateLine(index)}
                          className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 mb-1"
                          disabled={line.isTranslating || isTranslatingAll}
                        >
                          {line.isTranslating ? "Đang dịch..." : (line.translatedText ? "Dịch lại" : "Dịch")}
                        </button>

                        <button
                          onClick={() => acceptLine(index)}
                          className={`px-3 py-1 text-xs ${line.isAccepted ? 'bg-green-500' : 'bg-gray-500'} text-white rounded hover:bg-green-600 disabled:bg-gray-300 mb-1`}
                          disabled={!line.translatedText || line.isTranslating || isTranslatingAll}
                        >
                          {line.isAccepted ? "Đã chấp nhận" : "Chấp nhận"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Phần hiển thị kết quả đã được chấp nhận */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Kết quả bản dịch</h3>
        <div className="p-4 border border-gray-300 rounded-lg bg-white">
          <div className="prose max-w-none" style={{ fontFamily: "'Noto Serif', 'Source Serif Pro', 'Palatino', serif" }}>
            {translatedText ? (
              <div>
                {translatedText.split('\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">Chưa có bản dịch, hãy nhấn &quot;Dịch toàn bộ&quot; để bắt đầu</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TranslationEditor; 