'use client'
import { StageStruct } from "../../../../../../../types/struct";


export type BracketMatch = {
  id: number;
  round: number;
  home: string;
  away: string;
  winner: string;
};
export default function GroupDetail({ stage }: { stage: StageStruct }) {
  return (
    <section className="flex-2 border rounded-lg p-3">
      <header className="h-10">
        <h3 className="text-lg font-semibold mb-4 text-gray-700 capitalize">Group in {stage.name}</h3>
      </header>

      <div className="flex flex-row flex-wrap justify-center gap-10">
        {stage.groups.map((group) => (
          <div key={group.id} className="flex flex-col">
            <p>{group.name}</p>
            <table>
              <thead className="border-y">
                <tr>
                  <th className="w-10 border-l">No.</th>
                  <th className="w-60 border-x">Team</th>
                </tr>
              </thead>
              <tbody>
                {group.members.map((member, idx) => (
                  <tr key={`${member.id}`} className="border-y">
                    <td className="border-l text-center">{idx + 1}</td>
                    <td className="border-x pl-3">{member.team.name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </section>
  );
}