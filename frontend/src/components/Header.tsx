"use client";
import Link from "next/link";

export default function Header() {
  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/">
            <h1 className="text-2xl font-bold text-blue-600 cursor-pointer">
              TripFriend
            </h1>
          </Link>
        </div>
        <div className="hidden md:flex space-x-6">
          <Link href="/trips" className="text-gray-700 hover:text-blue-600">
            여행 동행 찾기
          </Link>
          <Link href="/create" className="text-gray-700 hover:text-blue-600">
            동행 등록하기
          </Link>
          <Link href="/community" className="text-gray-700 hover:text-blue-600">
            커뮤니티
          </Link>
          <Link href="/about" className="text-gray-700 hover:text-blue-600">
            서비스 소개
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <Link
            href="/member/login"
            className="text-gray-700 hover:text-blue-600"
          >
            로그인
          </Link>
          <Link
            href="/member/signup"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            회원가입
          </Link>
        </div>
      </div>
    </nav>
  );
}
