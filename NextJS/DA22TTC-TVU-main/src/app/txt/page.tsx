"use client";
import React, { useEffect } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCopy,
  faTrash,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import hljs from "highlight.js";
import "highlight.js/styles/atom-one-dark.css";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Toaster, toast } from "react-hot-toast";
import { useTheme } from "next-themes";
import { useNote } from "../../components/hooks/note";

const NotePage = () => {
  const {
    notes,
    setNotes,
    newNote,
    setNewNote,
    loading,
    expandedNotes,
    setExpandedNotes,
    deleteMode,
    setDeleteMode,
    deleteCode,
    setDeleteCode,
    handleAddNote,
    handleDeleteNote,
    handleKeyDown,
    handleCopy,
    handleGoBack,
    toggleNoteExpansion,
    countLines,
  } = useNote();
  const { theme } = useTheme();

  useEffect(() => {
    if (deleteMode) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [deleteMode]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={handleGoBack}
            className="group flex items-center gap-2 px-4 py-2 
                        text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white
                        bg-white dark:bg-gray-800 rounded-xl 
                        border border-gray-200 dark:border-gray-700 
                        shadow-sm hover:shadow transition-all duration-200"
          >
            <FontAwesomeIcon
              icon={faArrowLeft}
              className="group-hover:-translate-x-1 transition-transform"
            />
            <span className="font-medium">Quay lại trang chủ</span>
          </button>

          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
            Ghi chú
          </h1>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-4">
          <TextareaAutosize
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Nhập ghi chú mới..."
            className="w-full p-4 bg-gray-50 dark:bg-gray-700 rounded-xl 
                        font-mono text-gray-700 dark:text-gray-200 
                        placeholder-gray-400 dark:placeholder-gray-500
                        border-0 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 
                        resize-none transition-all duration-200"
            minRows={3}
          />
          <button
            onClick={handleAddNote}
            className="w-full mt-3 px-4 py-3 
                        bg-gradient-to-r from-blue-500 to-indigo-500 dark:from-blue-600 dark:to-indigo-600
                        text-white font-medium rounded-xl 
                        hover:from-blue-600 hover:to-indigo-600 dark:hover:from-blue-700 dark:hover:to-indigo-700
                        transform active:scale-[0.98] transition-all duration-200"
          >
            Thêm ghi chú
          </button>
        </div>

        <div className="space-y-4">
          {loading ? (
            <Skeleton
              count={3}
              height={150}
              className="rounded-xl"
              baseColor={theme === "dark" ? "#374151" : "#f3f4f6"}
              highlightColor={theme === "dark" ? "#4B5563" : "#e5e7eb"}
            />
          ) : (
            notes.map((note) => (
              <div
                key={note.id}
                className={`group bg-white dark:bg-gray-800 rounded-2xl 
                                border border-gray-100 dark:border-gray-700 
                                shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden
                                ${
                                  deleteMode === note.id
                                    ? "ring-2 ring-red-100 dark:ring-red-900"
                                    : ""
                                }`}
              >
                <div className="p-4">
                  <div className="relative">
                    <pre
                      className={`overflow-x-auto ${
                        !expandedNotes[note.id]
                          ? "max-h-[150px] overflow-y-hidden"
                          : ""
                      }`}
                    >
                      <code
                        className="hljs block rounded-xl p-4 bg-gray-900"
                        dangerouslySetInnerHTML={{
                          __html: hljs.highlightAuto(note.content).value,
                        }}
                      />
                    </pre>

                    {countLines(note.content) > 5 &&
                      !expandedNotes[note.id] && (
                        <div
                          className="absolute bottom-0 left-0 right-0 h-20 
                                                bg-gradient-to-t from-gray-900 to-transparent"
                        >
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleNoteExpansion(note.id);
                            }}
                            className="absolute bottom-2 left-1/2 -translate-x-1/2
                                                    bg-gray-800 text-gray-300 hover:text-white 
                                                    px-4 py-1 rounded-full text-sm font-medium 
                                                    transition-all duration-200"
                          >
                            Xem thêm
                          </button>
                        </div>
                      )}
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(note.timestamp).toLocaleString()}
                    </span>

                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleCopy(note.content)}
                        className="p-2 text-gray-500 dark:text-gray-400 
                                                hover:text-gray-700 dark:hover:text-gray-200 
                                                hover:bg-gray-100 dark:hover:bg-gray-700
                                                rounded-lg transition-colors"
                      >
                        <FontAwesomeIcon icon={faCopy} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteMode(note.id);
                          setDeleteCode("");
                        }}
                        className="p-2 text-gray-500 dark:text-gray-400 
                                                hover:text-red-500 dark:hover:text-red-400 
                                                hover:bg-red-50 dark:hover:bg-red-900/30
                                                rounded-lg transition-colors"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  </div>
                </div>

                {deleteMode === note.id && (
                  <div
                    className="fixed inset-0 bg-white/80 dark:bg-gray-900/80 
                                        backdrop-blur-sm flex items-center justify-center p-4 z-50"
                  >
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg max-w-sm w-full">
                      <p className="text-red-500 dark:text-red-400 font-medium mb-4">
                        Nhập &quot;XOA&quot; để xác nhận xóa ghi chú
                      </p>
                      <input
                        type="text"
                        value={deleteCode}
                        onChange={(e) => setDeleteCode(e.target.value)}
                        className="w-full px-4 py-2 
                                                border border-gray-200 dark:border-gray-700 rounded-xl 
                                                bg-white dark:bg-gray-700
                                                text-gray-900 dark:text-gray-100
                                                focus:ring-2 focus:ring-red-100 dark:focus:ring-red-900 
                                                focus:border-red-300 dark:focus:border-red-700"
                        autoFocus
                      />
                      <div className="flex gap-3 mt-4">
                        <button
                          onClick={() => handleDeleteNote(note.id)}
                          className="flex-1 px-4 py-2 
                                                    bg-red-500 dark:bg-red-600 text-white rounded-xl
                                                    hover:bg-red-600 dark:hover:bg-red-700 transition-colors"
                        >
                          Xóa
                        </button>
                        <button
                          onClick={() => {
                            setDeleteMode(null);
                            setDeleteCode("");
                          }}
                          className="flex-1 px-4 py-2 
                                                    bg-gray-100 dark:bg-gray-700 
                                                    text-gray-700 dark:text-gray-200 rounded-xl
                                                    hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        >
                          Hủy
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
      <Toaster />
    </div>
  );
};

export default NotePage;
