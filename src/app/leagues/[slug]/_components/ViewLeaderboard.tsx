'use client'

import { LeaderboardStruct, LeagueStruct } from "../../../../../types/struct";

export default function ViewLeaderboard({ league }: { league: LeagueStruct }) {
  const leaderboardMap: Record<number, LeaderboardStruct> = {};

  // Siapkan entry leaderboard berdasarkan group members
  league.stage.forEach((s) => {
    s.groups.forEach((group) => {
      group.members.forEach((member) => {
        leaderboardMap[member.team.id] = {
          team: member.team,
          matchPlayed: 0,
          matchWon: 0,
          matchLost: 0,
          matchDiff: 0,
          gameWon: 0,
          gameLost: 0,
          gameDiff: 0,
        };
      });
    });
  });


  // Proses semua match
  league.stage.forEach((s) => {
    s.matches.forEach((match) => {
      const homeId = match.homeTeam.id;
      const awayId = match.awayTeam.id;
      const homeScore = match.homeScore;
      const awayScore = match.awayScore;

      // Skip match tanpa skor
      if (homeScore === 0 && awayScore === 0) return;

      const homeEntry = leaderboardMap[homeId] ??= {
        team: match.homeTeam,
        matchPlayed: 0,
        matchWon: 0,
        matchLost: 0,
        matchDiff: 0,
        gameWon: 0,
        gameLost: 0,
        gameDiff: 0,
      };

      const awayEntry = leaderboardMap[awayId] ??= {
        team: match.awayTeam,
        matchPlayed: 0,
        matchWon: 0,
        matchLost: 0,
        matchDiff: 0,
        gameWon: 0,
        gameLost: 0,
        gameDiff: 0,
      };

      homeEntry.matchPlayed++;
      awayEntry.matchPlayed++;

      homeEntry.gameWon += homeScore;
      homeEntry.gameLost += awayScore;

      awayEntry.gameWon += awayScore;
      awayEntry.gameLost += homeScore;

      if (homeScore > awayScore) {
        homeEntry.matchWon++;
        awayEntry.matchLost++;
      } else {
        awayEntry.matchWon++;
        homeEntry.matchLost++;
      }
    });
  });

  // Hitung diff
  Object.values(leaderboardMap).forEach((entry) => {
    entry.matchDiff = entry.matchWon - entry.matchLost;
    entry.gameDiff = entry.gameWon - entry.gameLost;
  });

  // Urutkan leaderboard
  const leaderboard = Object.values(leaderboardMap).sort((a, b) => {
    if (b.matchDiff !== a.matchDiff) return b.matchDiff - a.matchDiff;
    return b.gameDiff - a.gameDiff;
  });
  const isRegionUniform = leaderboard.every(
    (entry) => entry.team.region === leaderboard[0].team.region
  );

  return (
    <div>
      {leaderboard.length === 0 ? (
        <p className="italic text-gray-500">No teams available.</p>
      ) : (
        <table className="w-full text-left border-collapse">
          <thead className="text border-b">
            <tr>
              <th className="py-1">#</th>
              <th className="py-1">Team</th>
              <th className="py-1">Code</th>
              {!isRegionUniform && <th className="py-1">Region</th>}
              <th className="text-center">
                <p>Match</p>
                <p>W - L</p>
              </th>
              <th className="text-center">Diff</th>
              <th className="text-center">
                <p>Game</p>
                <p>W - L</p>
              </th>
              <th className="text-center">Diff</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((team, idx) => (
              <tr
                key={team.team.id}
                className={idx % 2 === 0 ? 'bg-gray-100' : undefined}
              >
                <td className="py-2 text-center text-sm">{idx + 1}</td>
                <td className="py-2 text-sm">{team.team.name}</td>
                <td className="py-2 uppercase text-sm">{team.team.code}</td>
                {!isRegionUniform && (
                  <td className="py-2 text-sm">{team.team.region}</td>
                )}
                <td className="py-2 text-center text-sm">{team.matchWon} - {team.matchLost}</td>
                <td className="py-2 text-center text-sm">{team.matchDiff}</td>
                <td className="py-2 text-center text-sm">{team.gameWon} - {team.gameLost}</td>
                <td className="py-2 text-center text-sm">{team.gameDiff}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
