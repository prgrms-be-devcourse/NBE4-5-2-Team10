"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

interface Answer {
  answerId: number;
  content: string;
  createdAt: string;
  memberUsername: string;
}

export default function AnswerSection({ questionId }: { questionId: number }) {
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [newAnswer, setNewAnswer] = useState("");
  const [currentUsername, setCurrentUsername] = useState("");

  // 답변 목록 + 현재 로그인 사용자 정보 가져오기
  useEffect(() => {
    const fetchAnswers = async () => {
      try {
        const res = await api.get(`/qna/${questionId}/answers`);
        console.log("✅ 답변 데이터 구조:", res.data); // 👈 꼭 확인!
        setAnswers(res.data);
      } catch (err) {
        console.error("답변 조회 실패", err);
      }
    };

    const fetchCurrentUser = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        console.log("accessToken:", token); // ✅ 이거도 찍어보기
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

    fetchAnswers();
    fetchCurrentUser();
  }, [questionId]);

  // 답변 등록 핸들러
  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      await api.post(
        `/qna/${questionId}/answer`,
        { content: newAnswer },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setNewAnswer("");

      const res = await api.get(`/qna/${questionId}/answers`);
      setAnswers(res.data);
    } catch (err) {
      console.error("답변 등록 실패", err);
    }
  };

  // 답변 삭제 핸들러
  const handleDelete = async (answerId: number) => {
    console.log("넘어온 answerId:", answerId); // ✅ 이거 꼭 찍어보기!
    try {
      const token = localStorage.getItem("accessToken");
      await api.delete(`/qna/answer/${answerId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const res = await api.get(`/qna/${questionId}/answers`);
      console.log("답변 목록:", res.data); // ✅ id인지 answerId인지 확인!
      setAnswers(res.data);
    } catch (err) {
      console.error("답변 삭제 실패", err);
    }
  };

  return (
    <div className="mt-10">
      <h2 className="text-xl font-semibold mb-4">💬 답변</h2>

      <div className="space-y-4">
        {answers.map((a) => (
          <div
            key={a.answerId}
            className="border p-4 rounded-lg shadow-sm bg-gray-50 relative"
          >
            <p className="text-gray-800">{a.content}</p>
            <div className="text-sm text-gray-500 mt-2">
              {a.memberUsername} | {new Date(a.createdAt).toLocaleDateString()}
            </div>

            {a.memberUsername === currentUsername && (
              <button
              onClick={() => {
                console.log("삭제 요청 id:", a.answerId);
                handleDelete(a.answerId);
              }}                className="absolute top-2 right-2 text-sm text-red-500 hover:underline"
              >
                삭제
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6">
        <textarea
          className="w-full border p-3 rounded-lg"
          rows={4}
          placeholder="답변을 입력하세요..."
          value={newAnswer}
          onChange={(e) => setNewAnswer(e.target.value)}
        />
        <button
          className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={handleSubmit}
        >
          답변 등록
        </button>
      </div>
    </div>
  );
}
