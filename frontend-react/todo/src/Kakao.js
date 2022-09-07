import React from 'react';
import { kakao } from './service/ApiService';
import { KAKAO_REDIRECT_URI } from './app-config';

const Kakao = (props) => {
  let params = new URL(document.URL).searchParams;
  let code = params.get('code');

  kakao({ code: code, redirectUri: KAKAO_REDIRECT_URI });

  return <div>잠시만 기다려 주세요! 로그인 중입니다.</div>;
};
export default Kakao;
