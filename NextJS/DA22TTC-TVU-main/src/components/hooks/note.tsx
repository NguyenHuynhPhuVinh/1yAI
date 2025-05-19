import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { ref, onValue, push, set, remove } from "firebase/database";
import { getDatabaseInstance } from "../../lib/firebaseConfig";
import toast from "react-hot-toast";

export function useNote() {
  const router = useRouter();

  const [notes, setNotes] = useState<
    { id: string; content: any; timestamp: number }[]
  >([]);
  const [newNote, setNewNote] = useState("");
  const [loading, setLoading] = useState(true);
  const [expandedNotes, setExpandedNotes] = useState<{
    [key: string]: boolean;
  }>({});
  const [deleteMode, setDeleteMode] = useState<string | null>(null);
  const [deleteCode, setDeleteCode] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const database = await getDatabaseInstance();
        const notesRef = ref(database, "notes");
        const unsubscribe = onValue(notesRef, (snapshot) => {
          const data = snapshot.val();
          if (data) {
            const notesList = Object.entries(data).map(
              ([id, note]: [string, any]) => ({
                id,
                content: note.content,
                timestamp: note.timestamp,
              })
            );
            notesList.sort((a, b) => b.timestamp - a.timestamp);
            setNotes(notesList);
          } else {
            setNotes([]);
          }
          setLoading(false);
        });
        return () => unsubscribe();
      } catch (error) {
        console.error("Firebase error:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddNote = async () => {
    if (newNote.trim()) {
      const database = await getDatabaseInstance();
      const notesRef = ref(database, "notes");
      const newNoteRef = push(notesRef);
      await set(newNoteRef, {
        content: newNote,
        timestamp: Date.now(),
      });
      setNewNote("");
    }
  };

  const handleDeleteNote = async (id: string) => {
    const confirmDelete = window.confirm(
      "Bạn có chắc chắn muốn xóa ghi chú này không?"
    );
    if (confirmDelete) {
      const database = await getDatabaseInstance();
      const noteRef = ref(database, `notes/${id}`);
      await remove(noteRef);
      toast.success("Đã xóa ghi chú!");
    }
    setDeleteMode(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAddNote();
    }
  };

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success("Đã sao chép ghi chú!", {
      duration: 2000,
      position: "bottom-right",
      style: {
        background: "#333",
        color: "#fff",
      },
    });
  };

  const handleGoBack = () => {
    router.push("/");
  };

  const toggleNoteExpansion = (id: string) => {
    setExpandedNotes((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const countLines = (text: string): number => {
    return text.split("\n").length;
  };

  const handleNoteClick = (content: string, id: string) => {
    if (deleteMode === id) {
      if (deleteCode.trim().toUpperCase() === "XOA") {
        handleDeleteNote(id);
      }
      setDeleteMode(null);
      setDeleteCode("");
    } else {
      navigator.clipboard.writeText(content);
      toast.success("Đã sao chép ghi chú!", {
        duration: 2000,
        position: "bottom-right",
        style: {
          background: "#333",
          color: "#fff",
        },
      });
    }
  };

  return {
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
  };
}
