export function getCookie(name: string): string | null {
  if (typeof window === 'undefined') return null;
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

export async function apiRequest(path: string, options: RequestInit = {}) {
  const token = getCookie('auth_token');
  const headers = new Headers(options.headers || {});
  
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  
  if (options.body && !(options.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  try {
    const response = await fetch(`http://localhost:8080${path}`, {
      ...options,
      headers,
    });

    if (response.status === 401) {
      if (typeof window !== 'undefined') {
        document.cookie = 'auth_token=; path=/; max-age=0; SameSite=Lax';
        document.cookie = 'auth_user=; path=/; max-age=0; SameSite=Lax';
        document.cookie = 'auth_role=; path=/; max-age=0; SameSite=Lax';
        window.location.href = '/login';
      }
      throw new Error('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.');
    }

    if (response.status === 403) {
      throw new Error('Bạn không có quyền thực hiện hành động này.');
    }

    const data = await response.json();
    
    if (data.code !== 1000) {
      throw new Error(data.message || 'Yêu cầu không hợp lệ.');
    }
    
    return data.result;
  } catch (err: any) {
    console.error('API Request Error:', err);
    throw err;
  }
}
