import { API_BASE_URL } from '../app-config';
const ACCESS_TOKEN = 'ACCESS_TOKEN';

export function call(api, method, request) {
  let headers = new Headers({ 'Content-Type': 'application/json' });

  const accessToken = localStorage.getItem(ACCESS_TOKEN);
  if (accessToken && accessToken !== null) {
    headers.append('Authorization', 'Bearer ' + accessToken);
  }

  let options = {
    headers: headers,
    url: API_BASE_URL + api,
    method: method,
  };
  if (request) {
    options.body = JSON.stringify(request);
  }
  return fetch(options.url, options)
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      return Promise.reject(response.status);
    })
    .catch((error) => {
      console.log(error);
      if (error === 403) {
        window.location.href = '/login';
      }
      return Promise.reject(error);
    });
}

export async function signin(userDTO) {
  try {
    const response = await call('/auth/signin', 'POST', userDTO);
    if (response.token) {
      localStorage.setItem(ACCESS_TOKEN, response.token);
      window.location.href = '/';
    }
  } catch {
    alert('로그인에 실패하였습니다.');
  }
}

export async function signout() {
  localStorage.removeItem(ACCESS_TOKEN);
  window.location.href = '/login';
}

export async function signup(userDTO) {
  try {
    const response = await call('/auth/signup', 'POST', userDTO);
    window.location.href = '/login';
  } catch (e) {
    alert('이미 가입한 이메일 입니다.');
  }
}

export async function kakao(kakoOAuthDTO) {
  try {
    const response = await call('/auth/kakao', 'POST', kakoOAuthDTO);
    if (response.token) {
      localStorage.setItem(ACCESS_TOKEN, response.token);
      localStorage.setItem('nick', response.nick);
      window.location.href = '/';
    }
  } catch {
    alert('로그인에 실패하였습니다.');
  }
}
