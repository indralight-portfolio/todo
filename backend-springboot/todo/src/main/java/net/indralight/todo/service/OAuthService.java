package net.indralight.todo.service;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.net.HttpURLConnection;
import java.net.URL;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;

import com.google.gson.JsonElement;
import com.google.gson.JsonParser;

import net.indralight.todo.dto.SnsUserDTO;

@Service
public class OAuthService {

    @Autowired
    private Environment environment;

    public String getKakaoAccessToken(String code) {
        final String kakaoID = "29ec7a66579f65c6ba3efa0d673d5b6a";
        final String baseUri = environment.getProperty("spring.kakao.redirectbaseuri");
        System.out.println("kakaoID : " + kakaoID);

        String access_Token = "";
        String refresh_Token = "";
        String reqURL = "https://kauth.kakao.com/oauth/token";

        try {
            URL url = new URL(reqURL);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();

            // POST 요청을 위해 기본값이 false인 setDoOutput을 true로
            conn.setRequestMethod("POST");
            conn.setDoOutput(true);

            // POST 요청에 필요로 요구하는 파라미터 스트림을 통해 전송
            BufferedWriter bw = new BufferedWriter(new OutputStreamWriter(conn.getOutputStream()));
            StringBuilder sb = new StringBuilder();
            sb.append("grant_type=authorization_code");
            sb.append("&client_id=" + kakaoID); // TODO REST_API_KEY 입력
            sb.append("&redirect_uri=" + baseUri + "/auth/kakao"); // TODO 인가코드 받은
                                                                   // redirect_uri 입력
            sb.append("&code=" + code);
            bw.write(sb.toString());
            bw.flush();

            // 결과 코드가 200이라면 성공
            int responseCode = conn.getResponseCode();
            System.out.println("responseCode : " + responseCode);

            // 요청을 통해 얻은 JSON타입의 Response 메세지 읽어오기
            BufferedReader br = new BufferedReader(new InputStreamReader(conn.getInputStream()));
            String line = "";
            String result = "";

            while ((line = br.readLine()) != null) {
                result += line;
            }
            System.out.println("response body : " + result);

            // Gson 라이브러리에 포함된 클래스로 JSON파싱 객체 생성
            JsonElement element = JsonParser.parseString(result);

            access_Token = element.getAsJsonObject()
                    .get("access_token")
                    .getAsString();
            refresh_Token = element.getAsJsonObject()
                    .get("refresh_token")
                    .getAsString();

            System.out.println("access_token : " + access_Token);
            System.out.println("refresh_token : " + refresh_Token);

            br.close();
            bw.close();
        } catch (IOException e) {
            e.printStackTrace();
        }

        return access_Token;
    }

    public SnsUserDTO createKakaoUser(String token) throws Exception {

        String reqURL = "https://kapi.kakao.com/v2/user/me";

        // access_token을 이용하여 사용자 정보 조회
        try {
            URL url = new URL(reqURL);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();

            conn.setRequestMethod("POST");
            conn.setDoOutput(true);
            conn.setRequestProperty("Authorization", "Bearer " + token); // 전송할 header 작성,
                                                                         // access_token전송

            // 결과 코드가 200이라면 성공
            int responseCode = conn.getResponseCode();
            System.out.println("responseCode : " + responseCode);

            // 요청을 통해 얻은 JSON타입의 Response 메세지 읽어오기
            BufferedReader br = new BufferedReader(new InputStreamReader(conn.getInputStream()));
            String line = "";
            String result = "";

            while ((line = br.readLine()) != null) {
                result += line;
            }
            System.out.println("response body : " + result);

            // Gson 라이브러리로 JSON파싱
            JsonElement element = JsonParser.parseString(result);

            Long id = element.getAsJsonObject()
                    .get("id")
                    .getAsLong();
            boolean hasEmail = element.getAsJsonObject()
                    .get("kakao_account")
                    .getAsJsonObject()
                    .get("has_email")
                    .getAsBoolean();
            String email = "";
            if (hasEmail) {
                email = element.getAsJsonObject()
                        .get("kakao_account")
                        .getAsJsonObject()
                        .get("email")
                        .getAsString();
            }
            String nickname = element.getAsJsonObject()
                    .get("kakao_account")
                    .getAsJsonObject()
                    .get("profile")
                    .getAsJsonObject()
                    .get("nickname")
                    .getAsString();

            System.out.println("id : " + id);
            System.out.println("email : " + email);

            br.close();

            return SnsUserDTO.builder()
                    .id(id)
                    .email(email)
                    .nickname(nickname)
                    .build();

        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }
    }

}
