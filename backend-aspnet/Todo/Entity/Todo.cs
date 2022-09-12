using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Todo.Entity
{
    [Table("todo")]
    public partial class Todo
    {
        [Key]
        [Column("id")]
        public long Id { get; set; }
        [Column("done")]
        public bool Done { get; set; }
        [Column("title")]
        [StringLength(255)]
        public string Title { get; set; } = null!;
        [Column("user_id")]
        public long UserId { get; set; }
    }
}
