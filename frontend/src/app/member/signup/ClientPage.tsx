"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function ClientPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    username: "",
    nickname: "",
    profileImage: "",
    gender: "",
    ageRange: "",
    travelStyle: "",
    aboutMe: "",
    agreeTerms: false,
    agreePrivacy: false,
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    username: "",
    nickname: "",
    gender: "",
    ageRange: "",
    travelStyle: "",
    terms: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    // Clear the error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...errors };

    // Email validation
    if (!formData.email) {
      newErrors.email = "이메일을 입력해주세요";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "유효한 이메일 형식이 아닙니다";
      isValid = false;
    }

    // Username validation
    if (!formData.username) {
      newErrors.username = "아이디를 입력해주세요";
      isValid = false;
    } else if (formData.username.length < 4 || formData.username.length > 20) {
      newErrors.username = "아이디는 4자 이상 20자 이하여야 합니다";
      isValid = false;
    }

    // Nickname validation
    if (!formData.nickname) {
      newErrors.nickname = "닉네임을 입력해주세요";
      isValid = false;
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "비밀번호를 입력해주세요";
      isValid = false;
    } else if (formData.password.length < 8) {
      newErrors.password = "비밀번호는 최소 8자 이상이어야 합니다";
      isValid = false;
    }

    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "비밀번호가 일치하지 않습니다";
      isValid = false;
    }

    // Terms validation
    if (!formData.agreeTerms || !formData.agreePrivacy) {
      newErrors.terms = "서비스 이용약관과 개인정보 처리방침에 동의해주세요";
      isValid = false;
    }

    // Gender validation
    if (!formData.gender) {
      newErrors.gender = "성별을 선택해주세요";
      isValid = false;
    }

    // Age Range validation
    if (!formData.ageRange) {
      newErrors.ageRange = "나이대를 선택해주세요";
      isValid = false;
    }

    // Travel Style validation
    if (!formData.travelStyle) {
      newErrors.travelStyle = "여행 스타일을 선택해주세요";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Mock API call - replace with actual signup API
      console.log("회원가입 데이터:", formData);

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Redirect to login page after successful signup
      router.push("/member/login?registered=true");
    } catch (error) {
      console.error("회원가입 오류:", error);
      alert("회원가입 중 오류가 발생했습니다. 다시 시도해주세요.");
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
            트래블메이트 회원가입
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-gray-700 font-medium mb-2"
              >
                이메일
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="example@email.com"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.email
                    ? "border-red-500 focus:ring-red-200"
                    : "border-gray-300 focus:ring-blue-200"
                }`}
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            <div className="mb-4">
              <label
                htmlFor="username"
                className="block text-gray-700 font-medium mb-2"
              >
                아이디
              </label>
              <input
                type="text"
                id="username"
                name="username"
                placeholder="아이디 (4~20자)"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.username
                    ? "border-red-500 focus:ring-red-200"
                    : "border-gray-300 focus:ring-blue-200"
                }`}
                value={formData.username}
                onChange={handleChange}
              />
              {errors.username && (
                <p className="text-red-500 text-sm mt-1">{errors.username}</p>
              )}
            </div>

            <div className="mb-4">
              <label
                htmlFor="nickname"
                className="block text-gray-700 font-medium mb-2"
              >
                닉네임
              </label>
              <input
                type="text"
                id="nickname"
                name="nickname"
                placeholder="닉네임"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.nickname
                    ? "border-red-500 focus:ring-red-200"
                    : "border-gray-300 focus:ring-blue-200"
                }`}
                value={formData.nickname}
                onChange={handleChange}
              />
              {errors.nickname && (
                <p className="text-red-500 text-sm mt-1">{errors.nickname}</p>
              )}
            </div>

            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-gray-700 font-medium mb-2"
              >
                비밀번호
              </label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="비밀번호 (8자 이상)"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.password
                    ? "border-red-500 focus:ring-red-200"
                    : "border-gray-300 focus:ring-blue-200"
                }`}
                value={formData.password}
                onChange={handleChange}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            <div className="mb-6">
              <label
                htmlFor="confirmPassword"
                className="block text-gray-700 font-medium mb-2"
              >
                비밀번호 확인
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="비밀번호 확인"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.confirmPassword
                    ? "border-red-500 focus:ring-red-200"
                    : "border-gray-300 focus:ring-blue-200"
                }`}
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <div className="mb-6">
              <label
                htmlFor="gender"
                className="block text-gray-700 font-medium mb-2"
              >
                성별
              </label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.gender
                    ? "border-red-500 focus:ring-red-200"
                    : "border-gray-300 focus:ring-blue-200"
                }`}
              >
                <option value="">성별을 선택하세요</option>
                <option value="MALE">남성</option>
                <option value="FEMALE">여성</option>
              </select>
              {errors.gender && (
                <p className="text-red-500 text-sm mt-1">{errors.gender}</p>
              )}
            </div>

            <div className="mb-6">
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
                <option value="">나이대를 선택하세요</option>
                <option value="TEEN">10대</option>
                <option value="TWENTIES">20대</option>
                <option value="THIRTIES">30대</option>
                <option value="FORTIES_OR_MORE">40대 이상</option>
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
                <option value="">여행 스타일을 선택하세요</option>
                <option value="TOUR">관광</option>
                <option value="RELAXATION">휴양</option>
                <option value="SHOPPING">쇼핑</option>
              </select>
              {errors.travelStyle && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.travelStyle}
                </p>
              )}
            </div>

            <div className="mb-6">
              <label
                htmlFor="aboutMe"
                className="block text-gray-700 font-medium mb-2"
              >
                자기소개
              </label>
              <textarea
                id="aboutMe"
                name="aboutMe"
                value={formData.aboutMe}
                onChange={handleChange}
                rows="4"
                placeholder="자기소개"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.aboutMe
                    ? "border-red-500 focus:ring-red-200"
                    : "border-gray-300 focus:ring-blue-200"
                }`}
              />
            </div>

            <div className="mb-4 flex items-center">
              <input
                type="checkbox"
                id="agreeTerms"
                name="agreeTerms"
                checked={formData.agreeTerms}
                onChange={handleChange}
              />
              <label
                htmlFor="agreeTerms"
                className="ml-2 text-sm text-gray-600"
              >
                서비스 이용약관에 동의합니다.
              </label>
            </div>

            <div className="mb-6 flex items-center">
              <input
                type="checkbox"
                id="agreePrivacy"
                name="agreePrivacy"
                checked={formData.agreePrivacy}
                onChange={handleChange}
              />
              <label
                htmlFor="agreePrivacy"
                className="ml-2 text-sm text-gray-600"
              >
                개인정보 처리방침에 동의합니다.
              </label>
            </div>

            {errors.terms && (
              <p className="text-red-500 text-sm mb-4">{errors.terms}</p>
            )}

            <div className="flex justify-center">
              <button
                type="submit"
                className={`w-full py-2 px-4 bg-blue-600 text-white rounded-lg ${
                  isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={isLoading}
              >
                {isLoading ? "가입 중..." : "회원가입"}
              </button>
            </div>
          </form>

          <div className="text-center mt-6">
            <p className="text-sm text-gray-600">
              이미 계정이 있으신가요?{" "}
              <Link href="/member/login" className="text-blue-600">
                로그인
              </Link>
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
