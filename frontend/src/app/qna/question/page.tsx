// src/app/qna/question/page.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

export default function QuestionWritePage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const router = useRouter();

  const handleSubmit = async () => {
    try {
      await api.post("/qna/question", {
        title,
        content,
      });

      alert("질문이 성공적으로 등록되었습니다.");
      router.push("/qna"); // 목록 페이지로 이동
    } catch (err) {
      console.error("질문 등록 실패", err);
      alert("질문 등록에 실패했습니다.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">질문 작성</h1>
      <input
        type="text"
        className="w-full border px-4 py-2 mb-4 rounded"
        placeholder="질문 제목"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        className="w-full border px-4 py-2 h-40 rounded"
        placeholder="질문 내용을 입력하세요"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <button
        className="bg-blue-600 text-white px-6 py-2 rounded mt-4 hover:bg-blue-700"
        onClick={handleSubmit}
      >
        질문 등록
      </button>
    </div>
  );
}
