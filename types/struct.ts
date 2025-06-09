import { League, Game, Match, Team, Group, GroupMember } from "@prisma/client"

export interface LeagueStruct extends League {
  game: Game
  matches: (Match & {
    homeTeam: Team
    awayTeam: Team
  })[]
  groups: (Group & {
    members: (GroupMember & {
      team: Team
    })[]
  })[]
}
export interface LeagueXGame extends League {
  game: Game
}
export interface LeaderboardStruct {
  team: Team;
  matchPlayed: number;
  matchWon: number;
  matchLost: number;
  matchDiff: number
  gameWon: number;
  gameLost: number;
  gameDiff: number;
}
export interface MatchStruct extends Match {
  homeTeam: Team;
  awayTeam: Team;
}
export interface GroupXMembers extends Group {
  members: (GroupMember & {
    team: Team;
  })[];
}

export interface ScheduleStruct{
  startDate: String;
  days: string[];
  timesPerDay: { [day: string]: string[] };
};