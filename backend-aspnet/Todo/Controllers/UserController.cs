using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Todo.Entity;
using Todo.Model;
using Todo.Service;

namespace Todo.Controllers
{
    [ApiController]
    [Route("auth")]
    public class UserController : ControllerBase
    {
        private readonly ILogger<UserController> _logger;
        private readonly UserService _userService;
        private readonly JwtManager _jwtManager;

        public UserController(ILogger<UserController> logger, UserService userService, JwtManager jwtManager)
        {
            _logger = logger;
            _userService = userService;
            _jwtManager = jwtManager;
        }

        [HttpPost("signup")]
        public async Task<ActionResult<User>> SignUp(UserRequest request)
        {
            const string provider = "local";
            try
            {
                var user = new User
                {
                    Email = request.Email,
                    Nick = request.Nick ?? "",
                    Password = request.Password,
                    Provider = provider,
                };
                await _userService.Create(user);
                return Ok(user);
            }
            catch (Exception e)
            {
                return BadRequest(new { error = e.Message });
            }
        }

        [HttpPost("signin")]
        public async Task<ActionResult<UserResponse>> SignIn(UserRequest request)
        {
            var user = await _userService.SignInLocal(request.Email, request.Password);
            if (user != null)
            {
                var token = _jwtManager.Generate(user);
                var response = new UserResponse
                {
                    Token = token,
                    User = user,
                };
                return Ok(response);
            }
            else
            {
                return BadRequest(new { error = "Login failed." });
            }
        }

        [HttpPost("kakao")]
        public async Task<ActionResult<UserResponse>> Kakao(KakaoOAuthRequest request)
        {
            var user = await _userService.GetByKakao(request);

            if (user != null)
            {
                var token = _jwtManager.Generate(user);
                var response = new UserResponse
                {
                    Token = token,
                    User = user,
                };
                return Ok(response);
            }
            else
            {
                return BadRequest(new { error = "Login failed." });
            }
        }
    }
}