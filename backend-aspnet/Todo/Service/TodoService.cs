using Microsoft.EntityFrameworkCore;
using Todo.Entity;
using Todo.Model;

namespace Todo.Service
{
    using Todo = Entity.Todo;

    public class TodoService
    {
        private readonly ILogger<TodoService> _logger;
        private readonly TodoDbContext _todoDbContext;

        public TodoService(ILogger<TodoService> logger, TodoDbContext todoDbContext)
        {
            _logger = logger;
            _todoDbContext = todoDbContext;
        }

        public async Task<List<Todo>> GetList(long userId)
        {
            return await _todoDbContext.Todo.Where(e => e.UserId == userId).ToListAsync();
        }

        public async Task<List<Todo>> Create(Todo todo)
        {
            _todoDbContext.Todo.Add(todo);
            await _todoDbContext.SaveChangesAsync();

            return await GetList(todo.UserId);
        }

        public async Task<List<Todo>> Delete(Todo todo)
        {
            _todoDbContext.Todo.Remove(todo);
            await _todoDbContext.SaveChangesAsync();

            return await GetList(todo.UserId);
        }

        public async Task<List<Todo>> Update(Todo todo)
        {
            var exTodo = await _todoDbContext.Todo.FindAsync(todo.Id);
            if (exTodo != null)
            {
                exTodo.Title = todo.Title;
                exTodo.Done = todo.Done;
                _todoDbContext.Todo.Update(exTodo);
                await _todoDbContext.SaveChangesAsync();
            }

            return await GetList(todo.UserId);
        }
    }
}