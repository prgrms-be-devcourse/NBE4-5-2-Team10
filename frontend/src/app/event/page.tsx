"use client";

import { useEffect, useState } from "react";
import axios from "@/lib/axios"; // 꼭 이걸로!

type Event = {
  id: number;
  title: string;
  description: string;
  eventDate: string;
  createdAt: string;
};

export default function PublicEventPage() {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const res = await axios.get("/admin/event");
        setEvents(res.data); // 또는 res.data.data 구조 확인 후 맞게!
      } catch (err) {
        console.error("이벤트 불러오기 실패", err);
      }
    };

    loadEvents();
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">🎉 TripFriend 이벤트</h1>

      {Array.isArray(events) && events.length > 0 ? (
        <ul className="space-y-4">
          {events.map((e) => (
            <li
              key={e.id}
              className="border rounded p-4 shadow-sm hover:shadow-md transition"
            >
              <h3 className="text-lg font-semibold">{e.title}</h3>
              <p className="mt-1 text-sm text-gray-700">{e.description}</p>
              <p className="text-sm text-blue-600 mt-1">
                📅 이벤트 날짜: {e.eventDate}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                등록일: {new Date(e.createdAt).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p>진행 중인 이벤트가 없습니다.</p>
      )}
    </div>
  );
}
