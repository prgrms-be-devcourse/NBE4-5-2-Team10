// API 기본 URL 설정
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

// API 요청 타입 정의
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

// 인증 헤더 가져오기
const getAuthHeader = (): Record<string, string> => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('accessToken');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }
  return {};
};

// 기본 API 요청 함수
export async function apiRequest<T>(
  url: string, 
  method: HttpMethod = 'GET', 
  data?: any,
  isFormData: boolean = false
): Promise<T> {
  const headers: HeadersInit = {
    ...getAuthHeader(),
  };

  // FormData가 아닌 경우에만 Content-Type 헤더 추가
  if (!isFormData && method !== 'GET') {
    headers['Content-Type'] = 'application/json';
  }

  const config: RequestInit = {
    method,
    headers,
    credentials: 'include', // 쿠키 포함
  };

  // GET 요청이 아니고 데이터가 있는 경우
  if (method !== 'GET' && data) {
    config.body = isFormData ? data : JSON.stringify(data);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${url}`, config);

    // 401 Unauthorized - 토큰 만료 처리
    if (response.status === 401) {
      // 리프레시 토큰으로 새 액세스 토큰 요청
      try {
        const refreshResponse = await fetch(`${API_BASE_URL}/member/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });

        if (refreshResponse.ok) {
          const refreshData = await refreshResponse.json();
          
          // 새 액세스 토큰 저장
          if (typeof window !== 'undefined') {
            localStorage.setItem('accessToken', refreshData.data.accessToken);
          }
          
          // 원래 요청 재시도
          headers['Authorization'] = `Bearer ${refreshData.data.accessToken}`;
          const retryResponse = await fetch(`${API_BASE_URL}${url}`, {
            ...config,
            headers
          });
          
          if (!retryResponse.ok) {
            throw new Error(`API 요청 실패: ${retryResponse.status}`);
          }
          
          return processResponse<T>(retryResponse);
        } else {
          // 리프레시 토큰도 만료된 경우 로그아웃 처리
          if (typeof window !== 'undefined') {
            localStorage.removeItem('accessToken');
            window.location.href = '/member/login';
          }
          throw new Error('인증이 만료되었습니다. 다시 로그인해주세요.');
        }
      } catch (error) {
        // 리프레시 토큰 요청 자체가 실패한 경우
        if (typeof window !== 'undefined') {
          localStorage.removeItem('accessToken');
          window.location.href = '/member/login';
        }
        throw new Error('인증 갱신에 실패했습니다. 다시 로그인해주세요.');
      }
    }

    if (!response.ok) {
      throw new Error(`API 요청 실패: ${response.status}`);
    }

    return processResponse<T>(response);
  } catch (error) {
    console.error('API 요청 중 오류 발생:', error);
    throw error;
  }
}

// 응답 처리 함수
async function processResponse<T>(response: Response): Promise<T> {
  try {
    const contentType = response.headers.get('content-type');
    
    // JSON 응답 처리
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      
      // 백엔드에서 RsData 형식으로 응답하는 경우
      if (data.hasOwnProperty('code') && data.hasOwnProperty('msg')) {
        if (data.code.startsWith('4') || data.code.startsWith('5')) {
          throw new Error(data.msg);
        }
        return data.data as T;
      }
      
      return data as T;
    }
    
    // 텍스트 응답 처리
    if (contentType && contentType.includes('text/plain')) {
      const text = await response.text();
      return text as unknown as T;
    }
    
    // 기타 응답 형식
    return {} as T;
  } catch (error) {
    console.error('응답 처리 중 오류 발생:', error);
    throw error;
  }
}

// 편의 함수
export const api = {
  get: <T>(url: string) => apiRequest<T>(url, 'GET'),
  post: <T>(url: string, data?: any, isFormData: boolean = false) => 
    apiRequest<T>(url, 'POST', data, isFormData),
  put: <T>(url: string, data?: any, isFormData: boolean = false) => 
    apiRequest<T>(url, 'PUT', data, isFormData),
  delete: <T>(url: string) => apiRequest<T>(url, 'DELETE')
};