using System.Security.Claims;
using System.Security.Principal;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Todo.Entity;
using Todo.Model;
using Todo.Service;

namespace Todo.Controllers
{
    using Todo = Entity.Todo;

    [ApiController]
    [Route("todo")]
    [Authorize]
    public class TodoController : ControllerBase
    {
        private readonly ILogger<TodoController> _logger;
        private readonly TodoService _todoService;

        public TodoController(ILogger<TodoController> logger, TodoService todoService)
        {
            _logger = logger;
            _todoService = todoService;
        }

        private long GetUserId()
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            long.TryParse(identity?.FindFirst("id")?.Value ?? string.Empty, out var userId);
            return userId;
        }

        [HttpGet]
        public async Task<ActionResult<TodoResponse>> List()
        {
            var userId = GetUserId();

            try
            {
                var response = new TodoResponse
                {
                    Data = await _todoService.GetList(userId),
                };
                return Ok(response);
            }
            catch (Exception e)
            {
                return BadRequest(new TodoResponse { Error = e.Message });
            }
        }

        [HttpPut]
        public async Task<ActionResult<TodoResponse>> Create(TodoRequest request)
        {
            var userId = GetUserId();

            try
            {
                var todo = new Todo
                {
                    Title = request.Title ?? string.Empty,
                    Done = request.Done ?? false,
                    UserId = userId,
                };
                var response = new TodoResponse
                {
                    Data = await _todoService.Create(todo),
                };
                return Ok(response);
            }
            catch (Exception e)
            {
                return BadRequest(new TodoResponse { Error = e.Message });
            }
        }

        [HttpDelete]
        public async Task<ActionResult<TodoResponse>> Delete(TodoRequest request)
        {
            var userId = GetUserId();
            try
            {
                var todo = new Todo
                {
                    Id = request.Id,
                    UserId = userId,
                };
                var response = new TodoResponse
                {
                    Data = await _todoService.Delete(todo),
                };
                return Ok(response);
            }
            catch (Exception e)
            {
                return BadRequest(new TodoResponse { Error = e.Message });
            }
        }

        [HttpPatch]
        public async Task<ActionResult<TodoResponse>> Update(TodoRequest request)
        {
            var userId = GetUserId();

            try
            {
                var todo = new Todo
                {
                    Id = request.Id,
                    Title = request.Title ?? string.Empty,
                    Done = request.Done ?? false,
                    UserId = userId,
                };

                var response = new TodoResponse
                {
                    Data = await _todoService.Update(todo),
                };
                return Ok(response);
            }
            catch (Exception e)
            {
                return BadRequest(new TodoResponse { Error = e.Message });
            }
        }
    }
}