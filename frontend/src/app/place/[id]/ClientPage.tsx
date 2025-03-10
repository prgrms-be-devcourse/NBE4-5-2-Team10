"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";

interface Place {
  id: number;
  cityName: string;
  placeName: string;
  description: string;
  category: string;
  image: string;
}

export default function PlaceDetailPage() {
  const { id } = useParams(); // URL에서 id 가져오기
  const [place, setPlace] = useState<Place | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!id) return;

    fetch(`http://localhost:8080/place/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.data) {
          setPlace(data.data);
        }
      })
      .catch((error) => console.error("Error fetching place details:", error))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <p>여행지 정보를 불러오는 중...</p>;
  }

  if (!place) {
    return <p>해당 여행지를 찾을 수 없습니다.</p>;
  }

  return (
    <div className="container mx-auto p-6">
      <button className="mb-4 text-blue-500" onClick={() => router.back()}>
        뒤로가기
      </button>
      <h1 className="text-3xl font-bold mb-4">{place.placeName}</h1>
      <img
        src={place.image || "/default-placeholder.jpg"}
        alt={place.placeName}
        className="w-full h-64 object-cover rounded-md"
      />
      <p className="mt-4 text-gray-700">{place.description}</p>
      <p className="mt-2 text-sm text-gray-500">도시: {place.cityName}</p>
      <p className="mt-2 text-sm text-gray-500">카테고리: {place.category}</p>
    </div>
  );
}
