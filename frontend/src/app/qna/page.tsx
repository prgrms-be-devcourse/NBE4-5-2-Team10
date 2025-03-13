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

export default function QnaPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

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

    fetchQuestions();
  }, []);

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
      ) : questions.length === 0 ? (
        <p>등록된 질문이 없습니다.</p>
      ) : (
        <ul className="space-y-4">
          {questions.map((q) => (
            <li key={q.id} className="border p-4 rounded shadow-sm">
              <Link href={`/qna/${q.id}`}>
                <h2 className="text-lg font-semibold text-blue-600 hover:underline">
                  {q.title}
                </h2>
              </Link>
              <p className="text-gray-700 mt-2">{q.content}</p>
              <div className="text-sm text-gray-500 mt-2">
                {q.memberUsername} · {new Date(q.createdAt).toLocaleDateString()}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
