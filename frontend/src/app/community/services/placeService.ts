import { api } from '../utils/api';

// 여행지 관련 타입 정의
export interface Place {
  id: number;
  cityName: string;
  placeName: string;
  description: string;
  category: string;
  imageUrl?: string;
}

export interface PlaceResponse {
  code: string;
  msg: string;
  data: Place[];
}

export interface PlaceDetailResponse {
  code: string;
  msg: string;
  data: Place;
}

export interface CitiesResponse {
  code: string;
  msg: string;
  data: string[];
}

// 모든 여행지 조회
export async function getAllPlaces(cityName?: string): Promise<Place[]> {
  try {
    let url = '/place';
    if (cityName) {
      url += `?cityName=${encodeURIComponent(cityName)}`;
    }
    
    const response = await api.get<PlaceResponse>(url);
    return response.data || [];
  } catch (error) {
    console.error("여행지 목록 조회 중 오류 발생:", error);
    return [];
  }
}

// 특정 여행지 조회
export async function getPlaceById(placeId: number): Promise<Place | null> {
  try {
    const response = await api.get<PlaceDetailResponse>(`/place/${placeId}`);
    return response.data;
  } catch (error) {
    console.error(`여행지 ID ${placeId} 조회 중 오류 발생:`, error);
    return null;
  }
}

// 여행지 검색
export async function searchPlaces(name?: string, city?: string): Promise<Place[]> {
  try {
    let url = '/place/search?';
    const params = [];
    
    if (name) {
      params.push(`name=${encodeURIComponent(name)}`);
    }
    
    if (city) {
      params.push(`city=${encodeURIComponent(city)}`);
    }
    
    url += params.join('&');
    
    const response = await api.get<PlaceResponse>(url);
    return response.data || [];
  } catch (error) {
    console.error("여행지 검색 중 오류 발생:", error);
    return [];
  }
}

// 모든 도시 조회
export async function getAllCities(): Promise<string[]> {
  try {
    const response = await api.get<CitiesResponse>('/place/cities');
    return response.data || [];
  } catch (error) {
    console.error("도시 목록 조회 중 오류 발생:", error);
    return [];
  }
}

// 도시별 여행지 조회
export async function getPlacesByCity(cityName: string): Promise<Place[]> {
  try {
    const response = await api.get<PlaceResponse>(`/place?cityName=${encodeURIComponent(cityName)}`);
    return response.data || [];
  } catch (error) {
    console.error(`도시 ${cityName}의 여행지 목록 조회 중 오류 발생:`, error);
    return [];
  }
}

// 여행지를 ID와 이름 형식으로 변환
export function getPlacesAsOptions(places: Place[]): { id: number; name: string }[] {
  return places.map(place => ({
    id: place.id,
    name: `${place.placeName} (${place.cityName})`
  }));
}