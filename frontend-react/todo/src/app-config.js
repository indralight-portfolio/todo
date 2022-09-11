let backendBaseURL;
let kakaoRedirectUri;

const hostname = window && window.location && window.location.hostname;

kakaoRedirectUri = 'http://' + hostname + '/kakao';
if (hostname === 'localhost') {
  backendBaseURL = 'http://localhost:8081';
  kakaoRedirectUri = 'http://localhost:3000/kakao';
} else if (hostname === 'todo-springboot.indralight.net') {
  backendBaseURL = 'http://localhost:8080';
} else if (hostname === 'todo-nodejs.indralight.net') {
  backendBaseURL = 'http://localhost:8081';
} else if (hostname === 'todo-aspnet.indralight.net') {
  backendBaseURL = 'http://localhost:8082';
}

export const API_BASE_URL = `${backendBaseURL}`;
export const KAKAO_REDIRECT_URI = `${kakaoRedirectUri}`;
