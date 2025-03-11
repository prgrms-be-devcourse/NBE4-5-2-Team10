const API_BASE_URL = "http://localhost:8080/recruits"; // 로컬 백엔드 URL

export async function getRecruits() {
  const response = await fetch(API_BASE_URL);
  if (!response.ok) throw new Error("모집 목록을 불러오지 못했습니다.");
  return response.json();
}

export async function getRecruitById(recruitId: string) {
  const response = await fetch(`http://localhost:8080/recruits/${recruitId}`);

  if (!response.ok) {
    throw new Error("❌ 모집 상세 정보를 불러오지 못했습니다.");
  }

  return response.json();
}
