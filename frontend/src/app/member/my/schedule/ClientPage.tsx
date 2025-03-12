"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // useRouter 추가

interface TripSchedule {
  id: number;
  title: string;
  cityName: string;
  startDate: string;
  endDate: string;
}

const ClientPage = () => {
  const [schedules, setSchedules] = useState<TripSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter(); // useRouter 사용

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const response = await fetch("http://localhost:8080/trip/schedule");
        if (!response.ok) {
          throw new Error("Failed to fetch trip schedules");
        }
        const data = await response.json();
        setSchedules(
          data.data.sort(
            (a: TripSchedule, b: TripSchedule) =>
              new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
          )
        );
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedules();
  }, []);

  if (loading) return <p>Loading schedules...</p>;
  if (error) return <p>Error: {error}</p>;
  if (schedules.length === 0) return <p>No registered schedules available.</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">내가 만든 여행</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {schedules.map((schedule) => (
          <div
            key={schedule.id}
            className="bg-white shadow-lg rounded-lg p-6 w-full"
          >
            <h3 className="text-xl font-bold">{schedule.title}</h3>
            <p className="text-md text-gray-600">여행지: {schedule.cityName}</p>
            <p className="text-md text-gray-600">
              날짜 : {schedule.startDate} ~ {schedule.endDate}
            </p>
            <div className="mt-4">
              <button
                className="bg-blue-500 text-white px-3 py-2 rounded mr-3"
                onClick={() =>
                  router.push(`/member/my/schedule/${schedule.id}`)
                }
              >
                상세 보기
              </button>
              <button className="bg-gray-500 text-white px-3 py-2 rounded">
                일정 수정
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClientPage;
