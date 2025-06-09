'use client';

import { GroupXMembers } from "./GroupManage";

interface Props {
  group: GroupXMembers;
  onGroupNameChange: (groupId: number, newName: string) => void;
  onMemberChange: (groupId: number, memberId: number, newTeamName: string) => void;
  validationResults: Record<number, "not-found" | "duplicate" | "valid">;
  onDeleteGroup: (groupId: number) => void;
}

export default function GroupTable({
  group,
  onGroupNameChange,
  onMemberChange,
  validationResults,
  onDeleteGroup
}: Props) {
  const isAllDummy = (group: GroupXMembers) =>
    group.members.every((member) =>
      member.team.id === 0 &&
      (
        member.team.name.trim() === "" ||
        /^Team \d+$/i.test(member.team.name.trim())
      )
    );

  const showDelete = isAllDummy(group);

  const renderStatus = (memberId: number) => {
    const member = group.members.find(m => m.id === memberId);
    if (!member) return "";

    const name = member.team.name.trim();
    const isDummy = name === "" || /^Team \d+$/i.test(name);

    if (isDummy) {
      return "-";
    }

    const status = validationResults[memberId];
    if (!status) return "";

    switch (status) {
      case "not-found":
        return <span className="text-red-600 font-semibold">Not Found</span>;
      case "duplicate":
        return <span className="text-yellow-600 font-semibold">⚠️ Duplicate</span>;
      case "valid":
        return <span className="text-green-600 font-semibold">✅</span>;
      default:
        return "";
    }
  };

  return (
    <div className="border p-3 rounded shadow max-w-md w-full">
      <div className="flex items-center justify-between mb-2">
        <div className="flex gap-3 items-center">
          <label htmlFor={`group-${group.id}`}>Group Name:</label>
          <input
            className="border-b"
            type="text"
            id={`group-${group.id}`}
            value={group.name}
            onChange={(e) => onGroupNameChange(group.id, e.target.value)}
          />
        </div>
        {showDelete && (
          <button
            onClick={() => onDeleteGroup(group.id)}
            className="text-red-500 hover:underline"
          >
            Delete
          </button>
        )}
      </div>
      <table className="w-full border border-collapse">
        <thead>
          <tr>
            <th className="border p-1">No.</th>
            <th className="border p-1">Team</th>
            <th className="border p-1">Status</th>
          </tr>
        </thead>
        <tbody>
          {group.members.map((member, index) => (
            <tr key={member.id} className="border-b">
              <td className="border p-1 text-center">{index + 1}</td>
              <td className="border p-1">
                <input
                  type="text"
                  value={member.team.name}
                  onChange={(e) =>
                    onMemberChange(group.id, member.id, e.target.value)
                  }
                  className="w-full border-b"
                />
              </td>
              <td className="border p-1 text-center">{renderStatus(member.id)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
