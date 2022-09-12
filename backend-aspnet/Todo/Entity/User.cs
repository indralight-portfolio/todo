using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Todo.Entity
{
    [Table("user")]
    [Index("Email", "Provider", Name = "UKnqrwybr61j4tv0yjquumwxs2", IsUnique = true)]
    [Index("Email", Name = "UKob8kqyqqgmefl0aco34akdtpe", IsUnique = true)]
    public partial class User
    {
        [Key]
        [Column("id")]
        public long Id { get; set; }
        [Column("email")]
        public string Email { get; set; } = null!;
        [Column("nick")]
        [StringLength(255)]
        public string Nick { get; set; } = null!;
        [Column("password")]
        [StringLength(255)]
        public string? Password { get; set; }
        [Column("provider")]
        public string Provider { get; set; } = null!;
        [Column("sns_id")]
        [StringLength(255)]
        public string? SnsId { get; set; }
    }
}
