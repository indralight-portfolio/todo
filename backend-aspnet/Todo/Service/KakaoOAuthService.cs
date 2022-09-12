using System;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Todo.Controllers;
using Todo.Entity;
using Todo.Model;

namespace Todo.Service
{
    public class KakaoOAuthService
    {
        private readonly ILogger<KakaoOAuthService> _logger;

        public KakaoOAuthService(ILogger<KakaoOAuthService> logger)
        {
            _logger = logger;
        }

        public async Task<string> GetAccessToken(KakaoOAuthRequest request)
        {
            var code = request.Code;
            var redirectUri = request.RedirectUri;

            const string kakaoId = "29ec7a66579f65c6ba3efa0d673d5b6a";

            string accessToken = "";
            string refreshToken = "";

            string param = $"grant_type=authorization_code" +
                $"&client_id={kakaoId}" +
                $"&redirect_uri={redirectUri}" +
                $"&code={code}";
            string reqUrl = $"https://kauth.kakao.com/oauth/token?{param}";

            HttpRequestMessage requestMessage = new HttpRequestMessage(HttpMethod.Post, reqUrl);
            using var httpClient = new HttpClient();
            HttpResponseMessage httpResponse = await httpClient.SendAsync(requestMessage);

            if (httpResponse?.IsSuccessStatusCode == true)
            {
                string responseString = await httpResponse.Content.ReadAsStringAsync();
                try
                {
                    JObject json = JObject.Parse(responseString);
                    accessToken = json["access_token"].ToString();
                    refreshToken = json["refresh_token"].ToString();
                }
                catch (Exception e)
                {
                    _logger.LogError($"kakaoOAuth. exception: {e.Message}");
                }
            }
            else
            {
                _logger.LogError($"kakaoOAuth. statsuCode: {httpResponse.StatusCode}");
            }

            return accessToken;
        }

        public async Task<SnsUser?> GetKakakoUser(string token)
        {
            string reqUrl = $"https://kapi.kakao.com/v2/user/me";

            HttpRequestMessage requestMessage = new HttpRequestMessage(HttpMethod.Post, reqUrl);
            requestMessage.Headers.Add("Authorization", $"Bearer {token}");
            using var httpClient = new HttpClient();
            HttpResponseMessage httpResponse = await httpClient.SendAsync(requestMessage);

            if (httpResponse?.IsSuccessStatusCode == true)
            {
                string responseString = await httpResponse.Content.ReadAsStringAsync();
                try
                {
                    JObject json = JObject.Parse(responseString);

                    var id = json["id"].ToObject<long>();
                    var email = json["kakao_account"]["email"].ToString();
                    var nickname = json["kakao_account"]["profile"]["nickname"].ToString();

                    return new SnsUser
                    {
                        Id = id,
                        Email = email,
                        Nickname = nickname,
                    };
                }
                catch (Exception e)
                {
                    _logger.LogError($"kakaoOAuth. exception: {e.Message}");
                }
            }
            else
            {
                _logger.LogError($"kakaoOAuth. statsuCode: {httpResponse?.StatusCode}");
            }

            return null;
        }
    }
}