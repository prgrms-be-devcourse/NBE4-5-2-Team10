"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/api";

type Question = {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  memberUsername: string;
};

const ITEMS_PER_PAGE = 5;

export default function QnaPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUsername, setCurrentUsername] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await api.get("/qna");
        setQuestions(res.data);
      } catch (err) {
        console.error("질문 목록을 불러오지 못했습니다.", err);
      } finally {
        setLoading(false);
      }
    };

    const fetchCurrentUser = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) return;

        const res = await api.get("/member/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setCurrentUsername(res.data.username);
      } catch (err) {
        console.error("현재 사용자 정보 조회 실패", err);
      }
    };

    fetchQuestions();
    fetchCurrentUser();
  }, []);

  const totalPages = Math.ceil(questions.length / ITEMS_PER_PAGE);
  const paginatedQuestions = questions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleDelete = async (questionId: number) => {
    const confirm = window.confirm("정말 이 질문을 삭제하시겠습니까?");
    if (!confirm) return;

    try {
      const token = localStorage.getItem("accessToken");
      await api.delete(`/qna/${questionId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const res = await api.get("/qna");
      setQuestions(res.data);
    } catch (err) {
      console.error("질문 삭제 실패", err);
      alert("질문 삭제에 실패했습니다.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Q&A</h1>
        <Link
          href="/qna/question"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          질문하기
        </Link>
      </div>

      {loading ? (
        <p>불러오는 중...</p>
      ) : paginatedQuestions.length === 0 ? (
        <p>등록된 질문이 없습니다.</p>
      ) : (
        <ul className="space-y-4">
          {paginatedQuestions.map((q) => (
            <li key={q.id} className="border p-4 rounded shadow-sm relative">
              <Link href={`/qna/${q.id}`}>
                <h2 className="text-lg font-semibold text-blue-600 hover:underline">
                  {q.title}
                </h2>
              </Link>
              <p className="text-gray-700 mt-2">{q.content}</p>
              <div className="text-sm text-gray-500 mt-2">
                {q.memberUsername} · {new Date(q.createdAt).toLocaleDateString()}
              </div>
              {q.memberUsername === currentUsername && (
                <button
                  onClick={() => handleDelete(q.id)}
                  className="absolute top-2 right-2 text-red-500 text-sm hover:underline"
                >
                  삭제
                </button>
              )}
            </li>
          ))}
        </ul>
      )}

      {/* 페이지네이션 버튼 */}
      {!loading && totalPages > 1 && (
        <div className="flex justify-center mt-6 space-x-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-1 rounded ${
                page === currentPage
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
