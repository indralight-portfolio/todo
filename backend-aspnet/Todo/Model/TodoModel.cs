namespace Todo.Model
{
    using Todo = Todo.Entity.Todo;

    public class TodoRequest
    {
        public long Id { get; set; }
        public string? Title { get; set; }
        public bool? Done { get; set; }
    }

    public class TodoResponse
    {
        public string Error { get; set; }
        public List<Todo> Data { get; set; }
    }
}