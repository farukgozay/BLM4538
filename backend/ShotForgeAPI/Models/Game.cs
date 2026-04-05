using System;

namespace ShotForgeAPI.Models
{
    public class Game
    {
        public int Id { get; set; }
        public int SeasonId { get; set; }
        public DateTime Date { get; set; }
        public string HomeTeamName { get; set; } = string.Empty;
        public string AwayTeamName { get; set; } = string.Empty;
        public int HomeScore { get; set; }
        public int AwayScore { get; set; }
        
        public Season Season { get; set; }
    }
}
