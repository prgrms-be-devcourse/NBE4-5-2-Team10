"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface ProfileFormData {
  gender: string;
  ageRange: string;
  travelStyle: string;
}

export default function CompleteProfilePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");
  const provider = searchParams.get("provider");

  const [formData, setFormData] = useState<ProfileFormData>({
    gender: "",
    ageRange: "",
    travelStyle: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // 사용자 ID가 없으면 로그인 페이지로 리다이렉션
    if (!userId) {
      router.push("/member/login");
    }
  }, [userId, router]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // 오류 메시지 제거
    if (name in errors) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors: Record<string, string> = {};

    if (!formData.gender) {
      newErrors.gender = "성별은 필수 입력값입니다.";
      isValid = false;
    }

    if (!formData.ageRange) {
      newErrors.ageRange = "나이대는 필수 입력값입니다.";
      isValid = false;
    }

    if (!formData.travelStyle) {
      newErrors.travelStyle = "여행 스타일은 필수 입력값입니다.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
      const completeProfileUrl = `${apiUrl}/member/complete-profile/${userId}`;

      console.log("프로필 정보 제출:", {
        userId,
        provider,
        ...formData,
      });

      // API 요청으로 추가 정보 저장
      const response = await fetch(completeProfileUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({
          gender: formData.gender,
          ageRange: formData.ageRange,
          travelStyle: formData.travelStyle,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "프로필 정보 저장에 실패했습니다."
        );
      }

      // 성공 시 홈페이지로 이동
      window.dispatchEvent(new Event("login"));
      router.push("/");
    } catch (error) {
      console.error("프로필 정보 저장 오류:", error);
      setErrors({
        ...errors,
        general:
          error instanceof Error
            ? error.message
            : "프로필 정보 저장 중 오류가 발생했습니다.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
            프로필 정보 입력
          </h2>

          <p className="text-gray-600 mb-6 text-center">
            TripFriend 서비스 이용을 위해 아래 정보를 입력해주세요.
          </p>

          {errors.general && (
            <div className="mb-6 bg-red-100 text-red-700 p-3 rounded-lg">
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="gender"
                className="block text-gray-700 font-medium mb-2"
              >
                성별
              </label>
              <div className="flex space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="gender"
                    value="MALE"
                    checked={formData.gender === "MALE"}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <span>남성</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="gender"
                    value="FEMALE"
                    checked={formData.gender === "FEMALE"}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <span>여성</span>
                </label>
              </div>
              {errors.gender && (
                <p className="text-red-500 text-sm mt-1">{errors.gender}</p>
              )}
            </div>

            <div className="mb-4">
              <label
                htmlFor="ageRange"
                className="block text-gray-700 font-medium mb-2"
              >
                나이대
              </label>
              <select
                id="ageRange"
                name="ageRange"
                value={formData.ageRange}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.ageRange
                    ? "border-red-500 focus:ring-red-200"
                    : "border-gray-300 focus:ring-blue-200"
                }`}
              >
                <option value="">나이대 선택</option>
                <option value="TEENS">10대</option>
                <option value="TWENTIES">20대</option>
                <option value="THIRTIES">30대</option>
                <option value="FORTIES_PLUS">40대 이상</option>
              </select>
              {errors.ageRange && (
                <p className="text-red-500 text-sm mt-1">{errors.ageRange}</p>
              )}
            </div>

            <div className="mb-6">
              <label
                htmlFor="travelStyle"
                className="block text-gray-700 font-medium mb-2"
              >
                여행 스타일
              </label>
              <select
                id="travelStyle"
                name="travelStyle"
                value={formData.travelStyle}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.travelStyle
                    ? "border-red-500 focus:ring-red-200"
                    : "border-gray-300 focus:ring-blue-200"
                }`}
              >
                <option value="">여행 스타일 선택</option>
                <option value="SIGHTSEEING">관광</option>
                <option value="RELAXATION">휴양</option>
                <option value="SHOPPING">쇼핑</option>
              </select>
              {errors.travelStyle && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.travelStyle}
                </p>
              )}
            </div>

            <button
              type="submit"
              className={`w-full bg-blue-600 text-white py-2 rounded-lg font-medium transition duration-300 ${
                isLoading
                  ? "opacity-70 cursor-not-allowed"
                  : "hover:bg-blue-700"
              }`}
              disabled={isLoading}
            >
              {isLoading ? "처리 중..." : "프로필 완료하기"}
            </button>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
}
