"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// 사용자 정보 타입 정의
interface UserProfile {
  id: number;
  name: string;
  email: string;
  profileImage: string;
  bio: string;
  joinDate: string;
}

// 사용자 여행 정보 타입 정의
interface TripInfo {
  id: number;
  title: string;
  destination: string;
  date: string;
  status: "준비중" | "여행중" | "완료";
  companions: number;
}

export default function ClientPage() {
  // 사용자 프로필 상태
  const [userProfile, setUserProfile] = useState<UserProfile>({
    id: 1,
    name: "홍길동",
    email: "user@example.com",
    profileImage: "/placeholder.jpg",
    bio: "여행을 좋아하는 20대 직장인입니다. 맛집 탐방과 현지 문화 체험을 즐겨요!",
    joinDate: "2024-01-15",
  });

  // 내가 만든 여행 목록
  const [myTrips, setMyTrips] = useState<TripInfo[]>([
    {
      id: 201,
      title: "제주도 4박 5일 힐링 여행",
      destination: "제주도",
      date: "2025-05-10 ~ 2025-05-14",
      status: "준비중",
      companions: 2,
    },
    {
      id: 202,
      title: "오사카 벚꽃 여행",
      destination: "오사카",
      date: "2025-04-03 ~ 2025-04-06",
      status: "준비중",
      companions: 1,
    },
  ]);

  // 참여 중인 여행 목록
  const [participatingTrips, setParticipatingTrips] = useState<TripInfo[]>([
    {
      id: 301,
      title: "방콕 3박 4일 맛집 투어",
      destination: "방콕",
      date: "2025-06-20 ~ 2025-06-23",
      status: "준비중",
      companions: 3,
    },
  ]);

  // 완료된 여행 목록
  const [completedTrips, setCompletedTrips] = useState<TripInfo[]>([
    {
      id: 401,
      title: "파리 일주일 여행",
      destination: "파리",
      date: "2024-12-23 ~ 2024-12-29",
      status: "완료",
      companions: 2,
    },
    {
      id: 402,
      title: "부산 주말 여행",
      destination: "부산",
      date: "2024-11-09 ~ 2024-11-10",
      status: "완료",
      companions: 4,
    },
  ]);

  // 프로필 수정 모드 상태
  const [isEditing, setIsEditing] = useState(false);
  // 프로필 수정용 임시 상태
  const [editedProfile, setEditedProfile] = useState({ ...userProfile });

  // 탭 상태 관리
  const [activeTab, setActiveTab] = useState("profile");

  // 프로필 수정 저장 핸들러
  const handleSaveProfile = () => {
    setUserProfile(editedProfile);
    setIsEditing(false);
  };

  // 프로필 수정 취소 핸들러
  const handleCancelEdit = () => {
    setEditedProfile({ ...userProfile });
    setIsEditing(false);
  };

  // 프로필 입력 변경 핸들러
  const handleProfileChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditedProfile({
      ...editedProfile,
      [name]: value,
    });
  };

  // 실제 API 호출은 useEffect에서 처리할 수 있음
  useEffect(() => {
    // API에서 사용자 정보 로드
    // 예시: fetchUserProfile().then(data => setUserProfile(data));
    // API에서 여행 정보 로드
    // 예시: fetchUserTrips().then(data => {
    //   setMyTrips(data.myTrips);
    //   setParticipatingTrips(data.participatingTrips);
    //   setCompletedTrips(data.completedTrips);
    // });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-8">마이페이지</h2>

        {/* 탭 메뉴 */}
        <div className="flex border-b mb-8">
          <button
            className={`py-2 px-4 font-medium ${
              activeTab === "profile"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-blue-500"
            }`}
            onClick={() => setActiveTab("profile")}
          >
            프로필
          </button>
          <button
            className={`py-2 px-4 font-medium ${
              activeTab === "myTrips"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-blue-500"
            }`}
            onClick={() => setActiveTab("myTrips")}
          >
            내가 만든 여행
          </button>
          <button
            className={`py-2 px-4 font-medium ${
              activeTab === "participating"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-blue-500"
            }`}
            onClick={() => setActiveTab("participating")}
          >
            참여 중인 여행
          </button>
          <button
            className={`py-2 px-4 font-medium ${
              activeTab === "completed"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-blue-500"
            }`}
            onClick={() => setActiveTab("completed")}
          >
            완료된 여행
          </button>
        </div>

        {/* 프로필 섹션 */}
        {activeTab === "profile" && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex flex-col md:flex-row">
              {/* 프로필 이미지 */}
              <div className="md:w-1/3 mb-6 md:mb-0 flex flex-col items-center">
                <img
                  src={userProfile.profileImage}
                  alt="프로필 이미지"
                  className="w-48 h-48 rounded-full object-cover mb-4"
                />
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 w-full max-w-xs"
                  >
                    프로필 수정
                  </button>
                )}
              </div>

              {/* 프로필 정보 */}
              <div className="md:w-2/3 md:pl-8">
                {isEditing ? (
                  // 수정 모드
                  <div>
                    <div className="mb-4">
                      <label className="block text-gray-700 mb-2">이름</label>
                      <input
                        type="text"
                        name="name"
                        value={editedProfile.name}
                        onChange={handleProfileChange}
                        className="w-full p-2 border rounded-md"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700 mb-2">이메일</label>
                      <input
                        type="email"
                        name="email"
                        value={editedProfile.email}
                        onChange={handleProfileChange}
                        className="w-full p-2 border rounded-md"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700 mb-2">
                        자기소개
                      </label>
                      <textarea
                        name="bio"
                        value={editedProfile.bio}
                        onChange={handleProfileChange}
                        className="w-full p-2 border rounded-md h-32"
                      ></textarea>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={handleSaveProfile}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                      >
                        저장하기
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400"
                      >
                        취소
                      </button>
                    </div>
                  </div>
                ) : (
                  // 표시 모드
                  <div>
                    <h3 className="text-2xl font-bold mb-2">
                      {userProfile.name}
                    </h3>
                    <p className="text-gray-600 mb-4">{userProfile.email}</p>
                    <div className="mb-6">
                      <h4 className="text-lg font-semibold mb-2">자기소개</h4>
                      <p className="text-gray-700">{userProfile.bio}</p>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold mb-2">회원 정보</h4>
                      <p className="text-gray-700">
                        가입일: {userProfile.joinDate}
                      </p>
                      <p className="text-gray-700">
                        작성한 여행: {myTrips.length}개
                      </p>
                      <p className="text-gray-700">
                        참여 중인 여행: {participatingTrips.length}개
                      </p>
                      <p className="text-gray-700">
                        완료한 여행: {completedTrips.length}개
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 내가 만든 여행 섹션 */}
        {activeTab === "myTrips" && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">내가 만든 여행</h3>
              <Link
                href="/trips/create"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                새 여행 만들기
              </Link>
            </div>

            {myTrips.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myTrips.map((trip) => (
                  <div
                    key={trip.id}
                    className="bg-white rounded-lg shadow-md p-6"
                  >
                    <h4 className="text-lg font-semibold mb-2">{trip.title}</h4>
                    <div className="mb-4">
                      <p className="text-gray-600 mb-1">
                        여행지: {trip.destination}
                      </p>
                      <p className="text-gray-600 mb-1">날짜: {trip.date}</p>
                      <p className="text-gray-600 mb-1">
                        상태:{" "}
                        <span
                          className={`font-medium ${
                            trip.status === "준비중"
                              ? "text-blue-600"
                              : trip.status === "여행중"
                              ? "text-green-600"
                              : "text-gray-600"
                          }`}
                        >
                          {trip.status}
                        </span>
                      </p>
                      <p className="text-gray-600">
                        모집인원: {trip.companions}명
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Link
                        href={`/trip/${trip.id}`}
                        className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 text-sm"
                      >
                        상세 보기
                      </Link>
                      <Link
                        href={`/trip/edit/${trip.id}`}
                        className="bg-gray-200 text-gray-800 px-3 py-1 rounded-md hover:bg-gray-300 text-sm"
                      >
                        수정하기
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <p className="text-gray-500 mb-4">아직 만든 여행이 없습니다.</p>
                <Link
                  href="/trips/create"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  첫 여행 만들기
                </Link>
              </div>
            )}
          </div>
        )}

        {/* 참여 중인 여행 섹션 */}
        {activeTab === "participating" && (
          <div>
            <h3 className="text-xl font-bold mb-4">참여 중인 여행</h3>

            {participatingTrips.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {participatingTrips.map((trip) => (
                  <div
                    key={trip.id}
                    className="bg-white rounded-lg shadow-md p-6"
                  >
                    <h4 className="text-lg font-semibold mb-2">{trip.title}</h4>
                    <div className="mb-4">
                      <p className="text-gray-600 mb-1">
                        여행지: {trip.destination}
                      </p>
                      <p className="text-gray-600 mb-1">날짜: {trip.date}</p>
                      <p className="text-gray-600 mb-1">
                        상태:{" "}
                        <span
                          className={`font-medium ${
                            trip.status === "준비중"
                              ? "text-blue-600"
                              : trip.status === "여행중"
                              ? "text-green-600"
                              : "text-gray-600"
                          }`}
                        >
                          {trip.status}
                        </span>
                      </p>
                      <p className="text-gray-600">
                        참여인원: {trip.companions}명
                      </p>
                    </div>
                    <Link
                      href={`/trip/${trip.id}`}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 inline-block"
                    >
                      상세 보기
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <p className="text-gray-500 mb-4">참여 중인 여행이 없습니다.</p>
                <Link
                  href="/trips"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  여행 찾아보기
                </Link>
              </div>
            )}
          </div>
        )}

        {/* 완료된 여행 섹션 */}
        {activeTab === "completed" && (
          <div>
            <h3 className="text-xl font-bold mb-4">완료된 여행</h3>

            {completedTrips.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {completedTrips.map((trip) => (
                  <div
                    key={trip.id}
                    className="bg-white rounded-lg shadow-md p-6"
                  >
                    <h4 className="text-lg font-semibold mb-2">{trip.title}</h4>
                    <div className="mb-4">
                      <p className="text-gray-600 mb-1">
                        여행지: {trip.destination}
                      </p>
                      <p className="text-gray-600 mb-1">날짜: {trip.date}</p>
                      <p className="text-gray-600">
                        참여인원: {trip.companions}명
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Link
                        href={`/trip/${trip.id}`}
                        className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 text-sm"
                      >
                        상세 보기
                      </Link>
                      <Link
                        href={`/trip/review/${trip.id}`}
                        className="bg-gray-200 text-gray-800 px-3 py-1 rounded-md hover:bg-gray-300 text-sm"
                      >
                        후기 작성
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <p className="text-gray-500">아직 완료된 여행이 없습니다.</p>
              </div>
            )}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
