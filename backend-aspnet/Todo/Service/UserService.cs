using Microsoft.EntityFrameworkCore;
using Todo.Entity;
using Todo.Model;

namespace Todo.Service
{
    public class UserService
    {
        private readonly ILogger<UserService> _logger;
        private readonly TodoDbContext _todoDbContext;
        private readonly KakaoOAuthService _kakaoOAuthService;

        public UserService(ILogger<UserService> logger, TodoDbContext todoDbContext, KakaoOAuthService kakaoOAuthService)
        {
            _logger = logger;
            _todoDbContext = todoDbContext;
            _kakaoOAuthService = kakaoOAuthService;
        }

        public async Task<User> Create(User user)
        {
            const string provider = "local";

            if (await _todoDbContext.User.AnyAsync(e => e.Email == user.Email && e.Provider == provider) == true)
            {
                throw new Exception($"Email already exists {user.Email}");
            }

            _todoDbContext.Add(user);
            await _todoDbContext.SaveChangesAsync();

            return user;
        }

        public async Task<User?> SignInLocal(string email, string password)
        {
            const string provider = "local";

            var user = await _todoDbContext.User.FirstOrDefaultAsync(e => e.Email == email && e.Provider == provider);
            if (user != null && user.Password!.Equals(password))
                return user;
            return null;
        }

        public async Task<User?> GetByKakao(KakaoOAuthRequest request)
        {
            const string provider = "kakao";

            try
            {
                string accessToken = await _kakaoOAuthService.GetAccessToken(request);
                var kakaoUser = await _kakaoOAuthService.GetKakakoUser(accessToken);
                var user = await _todoDbContext.User.FirstOrDefaultAsync(e => e.Provider == provider && e.SnsId == kakaoUser!.Id.ToString());
                if (user == null)
                {
                    user = new User
                    {
                        Email = kakaoUser!.Email,
                        Nick = kakaoUser!.Nickname,
                        Provider = provider,
                        SnsId = kakaoUser!.Id.ToString(),
                    };
                    _todoDbContext.Add(user);
                    await _todoDbContext.SaveChangesAsync();
                }
                return user;
            }
            catch (Exception e)
            {
                _logger.LogError($"GetByKakao. exception: {e.Message}");
            }
            return null;
        }
    }
}