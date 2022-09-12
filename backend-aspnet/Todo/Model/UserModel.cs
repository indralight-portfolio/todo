using Todo.Entity;

namespace Todo.Model
{
    public class UserRequest
    {
        public string Email { get; set; }
        public string? Nick { get; set; }
        public string Password { get; set; }
    }

    public class UserResponse
    {
        public string Token { get; set; }
        public User User { get; set; }
    }

    public class KakaoOAuthRequest
    {
        public string Code { get; set; }
        public string RedirectUri { get; set; }
    }

    public class SnsUser
    {
        public long Id { get; set; }
        public string Email { get; set; }
        public string Nickname { get; set; }
    }
}