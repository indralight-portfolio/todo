let backendBaseURL;
let kakaoRedirectUri;
let backendName;
let swaggerUrl;

const hostname = window && window.location && window.location.hostname;
const host = window && window.location && window.location.host;

kakaoRedirectUri = 'http://' + host + '/kakao';
if (hostname === 'localhost') {
  backendName = 'local';
  backendBaseURL = 'http://localhost:8080';
  kakaoRedirectUri = 'http://localhost:3000/kakao';
  swaggerUrl = backendBaseURL + '/swagger';
} else if (hostname === 'todo-springboot.indralight.net') {
  backendBaseURL = 'http://todo-backend.indralight.net:8080';
  backendName = 'springboot';
  swaggerUrl = backendBaseURL + '/swagger-ui/';
} else if (hostname === 'todo-nodejs.indralight.net') {
  backendBaseURL = 'http://todo-backend.indralight.net:8081';
  backendName = 'nodejs';
  swaggerUrl = backendBaseURL + '/swagger';
} else if (hostname === 'todo-aspnet.indralight.net') {
  backendBaseURL = 'http://todo-backend.indralight.net:8082';
  backendName = 'aspnet';
  swaggerUrl = backendBaseURL + '/swagger';
}

export const API_BASE_URL = `${backendBaseURL}`;
export const KAKAO_REDIRECT_URI = `${kakaoRedirectUri}`;
export const API_NAME = `${backendName}`;
export const SWAGGER_URL = `${swaggerUrl}`;
