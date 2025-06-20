'use client'

import React, { JSX, useState } from 'react'
import { MatchStruct } from '../../types/struct'
import { formatDateToWIB } from '@/utils/TimeFunctions'

type Team = {
  id: number
  name: string
}

import { BracketType } from '@prisma/client'

type Match = {
  id: number
  date: Date
  bracket?: BracketType | null
  homeTeam?: Team
  awayTeam?: Team
  winnerFrom?: [number, number]
}

const BOX_WIDTH = 120
const BOX_HEIGHT = 70
const BOX_GAP_Y = 40
const ROUND_GAP_X = 180

const generateMatches = (backendMatches: MatchStruct[]): Match[] => {
  // console.log(backendMatches)
  return backendMatches.map((m, i) => {
    const isVirtual = m.homeTeam.name.startsWith('Winner') || m.awayTeam.name.startsWith('Winner')
    const winnerFrom: [number, number] | undefined = isVirtual
      ? [
        parseInt(m.homeTeam.name.match(/\d+/)?.[0] || '0'),
        parseInt(m.awayTeam.name.match(/\d+/)?.[0] || '0'),
      ]
      : undefined

    return {
      id: i + 1,
      date: m.date,
      bracket: m.bracket,
      homeTeam: m.homeTeam,
      awayTeam: m.awayTeam,
      winnerFrom,
    }
  })
}

export default function BracketSingle({ data }: { data: MatchStruct[] }) {
  const matches = generateMatches(data || [])
  if (matches.length === 0) {
    return <p className="text-sm text-gray-500">Belum ada match yang tersedia.</p>
  }
  const [scores, setScores] = useState<Record<number, { home: number; away: number }>>({})

  const handleScoreChange = (id: number, side: 'home' | 'away', value: number) => {
    setScores(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        [side]: value,
      },
    }))
  }

  const compute = (matches: Match[]) => {
    const idToWinner: Record<number, Team> = {}
    const result: Match[] = []
    const brackets = [...new Set(matches.map(m => m.bracket))].filter(Boolean) as string[]

    for (const bracket of brackets) {
      for (const match of matches.filter(m => m.bracket === bracket)) {
        let home = match.homeTeam
        let away = match.awayTeam

        if (match.winnerFrom) {
          home = idToWinner[match.winnerFrom[0]]
          away = idToWinner[match.winnerFrom[1]]
        }

        const score = scores[match.id]
        if (score && home && away) {
          const winner = score.home > score.away ? home : score.away > score.home ? away : undefined
          if (winner) idToWinner[match.id] = winner
        }

        result.push({ ...match, homeTeam: home, awayTeam: away })
      }
    }

    return result
  }

  const updatedMatches = compute(matches)
  console.log(updatedMatches)
  const grouped = [...new Set(updatedMatches.map(m => m.bracket))].map(bracket =>
    updatedMatches.filter(m => m.bracket === bracket)
  )

  if (grouped.length === 0 || grouped[0].length === 0) {
    return <p className="text-sm text-gray-500">Belum ada match yang tersedia.</p>
  }
  const totalHeight = grouped[0].length * BOX_HEIGHT + (grouped[0].length - 1) * BOX_GAP_Y

  return (
    <div className="overflow-auto">
      <svg width={ROUND_GAP_X * grouped.length} height={totalHeight} className="bg-gray-100">
        {(() => {
          const matchPositions = new Map<number, { x: number; midY: number }>()
          const boxes: JSX.Element[] = []

          for (let roundIndex = 0; roundIndex < grouped.length; roundIndex++) {
            const roundMatches = grouped[roundIndex]

            for (let matchIndex = 0; matchIndex < roundMatches.length; matchIndex++) {
              const match = roundMatches[matchIndex]
              const x = roundIndex * ROUND_GAP_X
              let y = 0

              if (roundIndex === 0) {
                y = matchIndex * (BOX_HEIGHT + BOX_GAP_Y)
              } else {
                const prevMatches = grouped[roundIndex - 1]
                const prev1 = prevMatches[matchIndex * 2]
                const prev2 = prevMatches[matchIndex * 2 + 1]
                const pos1 = matchPositions.get(prev1?.id)
                const pos2 = matchPositions.get(prev2?.id)
                if (!pos1 || !pos2) continue
                const mid = (pos1.midY + pos2.midY) / 2
                y = mid - BOX_HEIGHT / 2
              }

              const midY = y + BOX_HEIGHT / 2
              matchPositions.set(match.id, { x, midY })

              boxes.push(
                <g key={`box-${match.id}`}>
                  <rect x={x} y={y} width={BOX_WIDTH} height={BOX_HEIGHT} fill="#fff" rx={6} />
                  <foreignObject x={x} y={y} width={BOX_WIDTH} height={BOX_HEIGHT}>
                    <div className="flex flex-col justify-center text-xs bg-white border rounded-lg p-1">
                      <label className="flex justify-between">
                        <span>{match.homeTeam?.name || 'TBD'}</span>
                        {match.awayTeam && (
                          <select
                            value={scores[match.id]?.home || 0}
                            onChange={e => handleScoreChange(match.id, 'home', Number(e.target.value))}
                          >
                            {[0, 1, 2, 3].map(n => <option key={n}>{n}</option>)}
                          </select>
                        )}
                      </label>
                      <label className="flex justify-between">
                        <span>{match.awayTeam?.name || 'TBD'}</span>
                        {match.awayTeam && (
                          <select
                            value={scores[match.id]?.away || 0}
                            onChange={e => handleScoreChange(match.id, 'away', Number(e.target.value))}
                          >
                            {[0, 1, 2, 3].map(n => <option key={n}>{n}</option>)}
                          </select>
                        )}
                      </label>
                      <div>
                        {formatDateToWIB(match.date)}
                      </div>
                    </div>
                  </foreignObject>
                </g>
              )
            }
          }

          const lines = grouped.flatMap((matches, roundIdx) => {
            if (roundIdx === grouped.length - 1) return []
            return matches.map((match, idx) => {
              const current = matchPositions.get(match.id)
              const next = matchPositions.get(grouped[roundIdx + 1][Math.floor(idx / 2)]?.id)
              if (!current || !next) return null
              const x1 = current.x + BOX_WIDTH, y1 = current.midY
              const x2 = next.x, y2 = next.midY
              return (
                <g key={`line-${match.id}`}>
                  <line x1={x1} y1={y1} x2={x1 + 20} y2={y1} stroke="black" />
                  <line x1={x1 + 20} y1={y1} x2={x1 + 20} y2={y2} stroke="black" />
                  <line x1={x1 + 20} y1={y2} x2={x2} y2={y2} stroke="black" />
                </g>
              )
            })
          })

          return [...boxes, ...lines]
        })()}
      </svg>
    </div>
  )
}