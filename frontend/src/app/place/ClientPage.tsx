"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Place {
  id: number;
  cityName: string;
  placeName: string;
  description: string;
  category: string;
  imageUrl: string;
}

export default function ClientPage() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    fetch("http://localhost:8080/place")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.data) {
          const mappedPlaces: Place[] = data.data.map((place: any) => ({
            id: place.id,
            cityName: place.cityName,
            placeName: place.placeName,
            description: place.description,
            category: place.category,
            imageUrl: place.imageUrl,
          }));
          setPlaces(mappedPlaces);
        }
      })
      .catch((error) => console.error("Error fetching places:", error))
      .finally(() => setLoading(false));
  }, []);

  // 선택된 도시와 카테고리에 따라 필터링
  const filteredPlaces = places.filter(
    (place) =>
      (!selectedCity || place.cityName === selectedCity) &&
      (!selectedCategory || place.category === selectedCategory)
  );

  if (loading) {
    return <p>여행지 데이터를 불러오는 중...</p>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">전체 여행지</h2>

      {/* 여행지 필터링 UI */}
      <div className="flex gap-4 mb-4">
        <select
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          className="p-2 border rounded-md"
        >
          <option value="">모든 도시</option>
          {Array.from(new Set(places.map((place) => place.cityName))).map(
            (city) => (
              <option key={city} value={city}>
                {city}
              </option>
            )
          )}
        </select>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="p-2 border rounded-md"
        >
          <option value="">모든 카테고리</option>
          {Array.from(new Set(places.map((place) => place.category))).map(
            (category) => (
              <option key={category} value={category}>
                {category}
              </option>
            )
          )}
        </select>
      </div>

      {/* 여행지 리스트 */}
      {filteredPlaces.length === 0 ? (
        <p className="text-gray-500">해당 조건에 맞는 여행지가 없습니다.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlaces.map((place) => (
            <div
              key={place.id}
              className="bg-white rounded-lg shadow-md p-4 cursor-pointer"
            >
              <img
                src={
                  place.imageUrl
                    ? `http://localhost:8080${place.imageUrl}`
                    : "/default-placeholder.svg"
                }
                alt={place.cityName}
                className="w-full h-auto object-cover rounded-md cursor-pointer"
                onClick={() => router.push(`/place/${place.id}`)}
              />
              <h3
                className="text-xl font-semibold mt-2 text-blue-500 cursor-pointer"
                onClick={() => router.push(`/place/${place.id}`)}
              >
                {place.placeName}
              </h3>
              <p className="text-gray-600">{place.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
