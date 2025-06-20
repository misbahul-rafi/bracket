'use client'

import { useEffect, useState } from "react"
import { MatchStruct, StageStruct } from "../../../../../../../types/struct"
import BracketSingle from "@/components/BracketSingle"
import { Team, BracketType } from "@prisma/client"

type Props = {
  groupStage: StageStruct
}

export default function KCFromGroup({ groupStage }: Props) {
  const [qualifiedPerGroup, setQualifiedPerGroup] = useState(1)
  const [qualifiedTeams, setQualifiedTeams] = useState<Team[]>([])
  const [matches, setMatches] = useState<MatchStruct[]>([])

  useEffect(() => {
    const selectedTeams: Team[] = []
    groupStage.groups.forEach(group => {
      const sortedMembers = group.members
        .filter(m => m.team.id !== 0)
        .slice(0, qualifiedPerGroup) // tambahkan sorting jika ada poin

      sortedMembers.forEach(member => {
        selectedTeams.push(member.team)
      })
    })

    setQualifiedTeams(selectedTeams)
  }, [groupStage.groups, qualifiedPerGroup])

  useEffect(() => {
    const allowedParticipants = [4, 8, 16, 32]
    if (!allowedParticipants.includes(qualifiedTeams.length)) {
      setMatches([])
      return
    }

    const getBracketType = (roundIndex: number, totalRounds: number): BracketType => {
      const bracketOrder: BracketType[] = [
        'ROUND_OF_32',
        'ROUND_OF_16',
        'QUARTERFINAL',
        'SEMIFINAL',
        'FINAL'
      ]
      return BracketType[bracketOrder[bracketOrder.length - totalRounds + roundIndex]]
    }

    const now = new Date()
    let matchId = 1
    const allMatches: MatchStruct[] = []
    let currentMatches: MatchStruct[] = []

    const totalRounds = Math.log2(qualifiedTeams.length)

    // ROUND 1
    for (let i = 0; i < qualifiedTeams.length; i += 2) {
      const home = qualifiedTeams[i]
      const away = qualifiedTeams[i + 1]

      currentMatches.push({
        id: matchId++,
        date: now,
        homeTeam: home,
        awayTeam: away,
        homeTeamId: home.id,
        awayTeamId: away.id,
        homeScore: 0,
        awayScore: 0,
        format: "BO1",
        bracket: getBracketType(0, totalRounds),
        stageId: -1,
        matchCode: ""
      })
    }

    allMatches.push(...currentMatches)
    const rounds: MatchStruct[][] = [currentMatches]

    // ROUND 2+
    for (let roundIndex = 1; currentMatches.length > 1; roundIndex++) {
      const nextMatches: MatchStruct[] = []
      for (let i = 0; i < currentMatches.length; i += 2) {
        const prev1 = currentMatches[i]
        const prev2 = currentMatches[i + 1]

        nextMatches.push({
          id: matchId++,
          date: now,
          homeTeam: {
            id: 0,
            name: `Winner ${prev1.id}`,
            code: '',
            region: '',
            userId: ''
          },
          awayTeam: {
            id: 0,
            name: `Winner ${prev2.id}`,
            code: '',
            region: '',
            userId: ''
          },
          homeTeamId: 0,
          awayTeamId: 0,
          homeScore: 0,
          awayScore: 0,
          format: "BO1",
          bracket: getBracketType(roundIndex, totalRounds),
          stageId: -1,
          matchCode: ""
        })
      }
      allMatches.push(...nextMatches)
      rounds.push(nextMatches)
      currentMatches = nextMatches
    }

    // THIRD PLACE
    const isThirdPlaceNeeded = qualifiedTeams.length >= 4
    if (isThirdPlaceNeeded) {
      const semifinalRound = rounds.at(-2)
      if (semifinalRound && semifinalRound.length === 2) {
        const loserPlaceholder = (id: number) => ({
          id: 0,
          name: `Loser ${id}`,
          code: '',
          region: '',
          userId: ''
        })

        allMatches.push({
          id: matchId++,
          date: now,
          homeTeam: loserPlaceholder(semifinalRound[0].id),
          awayTeam: loserPlaceholder(semifinalRound[1].id),
          homeTeamId: 0,
          awayTeamId: 0,
          homeScore: 0,
          awayScore: 0,
          format: "BO1",
          bracket: BracketType.THIRD_PLACE,
          matchCode: "",
          stageId: -1
        })
      }
    }

    setMatches(allMatches)
  }, [qualifiedTeams])

  return (
    <section className="mt-6 border p-4 rounded text-xs">
      <header className="mb-3">
        <h2 className="font-semibold">Preview Knockout Bracket</h2>
        <p className="text-gray-500">
          Tentukan jumlah tim yang lolos dari setiap grup untuk masuk ke Knockout.
        </p>
      </header>

      <div className="flex items-center gap-4">
        <label htmlFor="qualifiedPerGroup" className="font-medium">
          Qualified Teams / Group:
        </label>
        <input
          id="qualifiedPerGroup"
          type="number"
          value={qualifiedPerGroup}
          onChange={(e) => setQualifiedPerGroup(Number(e.target.value))}
          min={1}
          max={groupStage.groups[0]?.members.length || 16}
          className="w-15 border rounded px-2 py-1 text-center"
        />
      </div>

      {matches.length > 0 ? (
        <>
          <p className="text-sm text-gray-700 mb-4">
            Total Knockout Participants: <span className="font-bold">{qualifiedTeams.length}</span>
          </p>
          <BracketSingle data={matches} />
        </>
      ) : (
        <p className="text-sm text-red-500">Jumlah tim tidak valid. Harus 4, 8, 16, atau 32.</p>
      )}
    </section>
  )
}
