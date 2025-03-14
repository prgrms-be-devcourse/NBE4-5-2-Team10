"use client";

import { useEffect, useState } from "react";
import { fetchAllMembers, Member } from "@/api/member";

export default function AdminUserPage() {
  const [members, setMembers] = useState<Member[]>([]);

  useEffect(() => {
    const loadMembers = async () => {
      try {
        const data = await fetchAllMembers();
        setMembers(data);
      } catch (err) {
        console.error("회원 목록 불러오기 실패", err);
      }
    };

    loadMembers();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">👥 회원 목록</h1>
      {members.length === 0 ? (
        <p>등록된 회원이 없습니다.</p>
      ) : (
        <table className="w-full border-collapse border text-left">
          <thead>
            <tr className="border-b bg-gray-100">
              <th className="p-2">ID</th>
              <th className="p-2">아이디</th>
              <th className="p-2">이메일</th>
              <th className="p-2">닉네임</th>
            </tr>
          </thead>
          <tbody>
            {members.map((m) => (
              <tr key={m.id} className="border-b hover:bg-gray-50">
                <td className="p-2">{m.id}</td>
                <td className="p-2">{m.username}</td>
                <td className="p-2">{m.email}</td>
                <td className="p-2">{m.nickname}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
