using System;
using System.Collections.Generic;

namespace ShotForgeAPI.Models
{
    public class Season
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty; // e.g. "2024-25"
        
        public ICollection<Game> Games { get; set; } = new List<Game>();
    }
}
