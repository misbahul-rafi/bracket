import { League, Esport, Match, Team, Stage, Group, GroupMember } from "@prisma/client"


export interface EsportXLeague extends Esport {
  leagues: League[]
}

export interface LeagueStruct extends League {
  esport: Esport;
  stage: (Stage & {
    groups: (Group & {
      members: (GroupMember & {
        team: Team;
      })[];
    })[];
    matches: (Match & {
      homeTeam: Team;
      awayTeam: Team;
    })[];
  })[];
}
export interface StageStruct extends Stage {
  groups: (Group & {
    members: (GroupMember & {
      team: Team;
    })[];
  })[];
  matches: (Match & {
    homeTeam: Team;
    awayTeam: Team;
  })[];
}

export interface LeagueXEsport extends League {
  esport: Esport
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

export interface ScheduleStruct {
  startDate: String;
  days: string[];
  timesPerDay: { [day: string]: string[] };
};