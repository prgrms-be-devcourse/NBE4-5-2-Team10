// src/app/notice/page.tsx
"use client";

import { useEffect, useState } from "react";
import { fetchAllNotices } from "@/api/notice";
import type { Notice } from "@/app/admin/notice/page"; // 혹은 Notice 타입 따로 빼도 좋음

export default function NoticePage() {
  const [notices, setNotices] = useState<Notice[]>([]);

  useEffect(() => {
    const loadNotices = async () => {
      try {
        const data = await fetchAllNotices();
        setNotices(data);
      } catch (err) {
        console.error("공지사항 조회 실패", err);
      }
    };
    loadNotices();
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">📢 공지사항</h1>

      {notices.length === 0 ? (
        <p className="text-gray-500">등록된 공지사항이 없습니다.</p>
      ) : (
        <ul className="space-y-4">
          {notices.map((notice) => (
            <li key={notice.id} className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded shadow">
              <h3 className="text-xl font-semibold">{notice.title}</h3>
              <p className="mt-2 text-gray-800">{notice.content}</p>
              <p className="mt-1 text-sm text-gray-500">
                작성일: {new Date(notice.createdAt).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
