"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function QuestionCreatePage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async () => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      setError("로그인이 필요합니다.");
      return;
    }

    try {
      await api.post(
        "/qna/question", // ✅ 정확한 백엔드 엔드포인트 확인
        { title, content },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      router.push("/qna");
    } catch (err) {
      console.error("질문 등록 실패", err);
      setError("질문 등록에 실패했습니다.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow max-w-2xl mx-auto p-8">
        <h1 className="text-2xl font-bold mb-6">질문 작성</h1>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-300 rounded">
            {error}
          </div>
        )}

        <input
          className="w-full border p-3 rounded mb-4"
          placeholder="제목을 입력하세요"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          className="w-full border p-3 rounded mb-4"
          rows={6}
          placeholder="내용을 입력하세요"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          질문 등록
        </button>
      </main>
      <Footer />
    </div>
  );
}
