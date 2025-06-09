'use client'

import { useEffect, useState } from "react";
import { LeagueStruct } from "../../../../../../types/struct";
import { Group, GroupMember, Team } from "@prisma/client";
import GroupTable from "./GroupTable";

export interface GroupXMembers extends Group {
  members: (GroupMember & {
    team: Team;
  })[];
}

const MAX_MEMBERS_IN_GROUP = 16;
type ValidationStatus = "not-found" | "duplicate" | "valid";

export default function GroupManage({ league, fetching }: { league: LeagueStruct, fetching: () => void }) {
  const [groups, setGroups] = useState<GroupXMembers[]>(league.groups)
  const [minMemberInGroup, setMinMemberInGroup] = useState(3);
  const [membersInGroup, setMembersInGroup] = useState<number>(minMemberInGroup)
  const [allTeams, setAllTeams] = useState<Team[]>([]);
  const [validationResults, setValidationResults] = useState<Record<number, ValidationStatus>>({});
  const [isAllValid, setIsAllValid] = useState(false);


  async function fetchTeams() {
    const res = await fetch('/api/teams');
    if (res.ok) {
      const data: Team[] = await res.json();
      setAllTeams(data);
    } else {
      setAllTeams([]);
    }
  }
  // Fetch teams once on mount
  useEffect(() => {
    fetchTeams();
  }, []);

  // Calculate minMemberInGroup based on real member count
  useEffect(() => {
    const getRealMemberCount = (members: GroupXMembers["members"]) =>
      members.reduce((count, m) => {
        const name = m.team.name.trim();
        const isDummyName = name === "" || /^Team \d+$/i.test(name);
        const isDummyTeam = m.team.id === 0 && isDummyName;
        return isDummyTeam ? count : count + 1;
      }, 0);

    const maxRealMemberCount = Math.max(
      ...groups.map(g => getRealMemberCount(g.members)),
      3
    );

    setMinMemberInGroup(maxRealMemberCount);
  }, [groups]);
  useEffect(() => {
    setGroups((prevGroups) =>
      prevGroups.map((group) => {
        const currentLength = group.members.length;

        if (currentLength < membersInGroup) {
          const newMembers = [...group.members];

          for (let i = currentLength; i < membersInGroup; i++) {
            newMembers.push({
              id: -(Date.now() + Math.random()),
              groupId: group.id,
              teamId: 0,
              team: {
                id: 0,
                name: "",
                code: "",
                region: "",
              },
            });
          }

          return { ...group, members: newMembers };
        }

        return group;
      })
    );
  }, [membersInGroup]);

  // Validation logic: runs when groups or allTeams change
  useEffect(() => {
    if (!allTeams.length) return;

    // Flatten all team names from groups members (trim lowercase for consistent matching)
    const teamNames = groups.flatMap(g => g.members.map(m => m.team.name.trim().toLowerCase()));

    // Count occurrences for duplicates
    const counts: Record<string, number> = {};
    teamNames.forEach(name => {
      if (name !== "") {
        counts[name] = (counts[name] || 0) + 1;
      }
    });

    // Create validation results mapping memberId => status
    const results: Record<number, ValidationStatus> = {};

    groups.forEach(g => {
      g.members.forEach(m => {
        const name = m.team.name.trim();
        const lowerName = name.toLowerCase();

        if (name === "" || /^Team \d+$/i.test(name)) {
          // dummy, anggap valid secara visual tapi belum boleh disimpan
          results[m.id] = "valid";
          return;
        }

        // Check if in database
        const found = allTeams.some(t => t.name.toLowerCase() === lowerName);

        if (!found) {
          results[m.id] = "not-found";
        } else if (counts[lowerName] > 1) {
          results[m.id] = "duplicate";
        } else {
          results[m.id] = "valid";
        }
      });
    });

    setValidationResults(results);
    const allValid = groups.every(group =>
      group.members.every(member => {
        const name = member.team.name.trim();
        const isDummy = name === "" || /^Team \d+$/i.test(name);
        const status = results[member.id];

        if (isDummy) return false;
        return status === "valid";
      })
    );

    setIsAllValid(allValid);
  }, [groups, allTeams]);
  const handleGroupNameChange = (groupId: number, newName: string) => {
    setGroups((prevGroups) =>
      prevGroups.map((g) =>
        g.id === groupId ? { ...g, name: newName } : g
      )
    );
  };
  const handleDeleteGroup = (groupId: number) => {
    const group = groups.find(g => g.id === groupId);
    if (!group) return;

    const isAllDummy = group.members.every(member =>
      member.team.id === 0 &&
      (
        member.team.name.trim() === "" ||
        /^Team \d+$/i.test(member.team.name.trim())
      )
    );

    if (!isAllDummy) {
      console.log("Grup tidak bisa dihapus karena berisi data tim yang valid.");
      return;
    }

    setGroups(prev => prev.filter(g => g.id !== groupId));
  };


  const handleMemberChange = (
    groupId: number,
    memberId: number,
    newTeamName: string
  ) => {
    const matchedTeam = allTeams.find(
      (team) => team.name.trim().toLowerCase() === newTeamName.trim().toLowerCase()
    );

    setGroups((prevGroups) =>
      prevGroups.map((group) =>
        group.id === groupId
          ? {
            ...group,
            members: group.members.map((member) =>
              member.id === memberId
                ? {
                  ...member,
                  teamId: matchedTeam ? matchedTeam.id : 0,
                  team: matchedTeam
                    ? matchedTeam
                    : {
                      id: 0,
                      name: newTeamName,
                      code: "",
                      region: "",
                    },
                }
                : member
            ),
          }
          : group
      )
    );
  };


  const handleMemberInGroupChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = parseInt(e.target.value);
    if (isNaN(value)) return;

    if (value < minMemberInGroup) value = minMemberInGroup;
    if (value > MAX_MEMBERS_IN_GROUP) value = MAX_MEMBERS_IN_GROUP;

    if (value < membersInGroup) {
      const isSafeToReduce = groups.every(group =>
        group.members.slice(value).every(member =>
          member.team.id === 0 &&
          (
            member.team.name.trim() === "" ||
            /^Team \d+$/i.test(member.team.name.trim())
          )
        )
      );

      if (!isSafeToReduce) {
        console.log("Kosongkan nama tim terlebih dahulu sebelum mengurangi jumlah team per grup.");
        return;
      }

      const updatedGroups = groups.map(group => ({
        ...group,
        members: group.members.slice(0, value)
      }));
      setGroups(updatedGroups);
    }

    setMembersInGroup(value);
  };

  const handleAddGroup = () => {
    const newGroupId = Date.now();

    const newGroup: GroupXMembers = {
      id: -newGroupId,
      name: `Group ${groups.length + 1}`,
      leagueId: league.id,
      members: Array.from({ length: membersInGroup }, (_, index) => ({
        id: -(newGroupId + index),
        groupId: newGroupId,
        teamId: 0,
        team: {
          id: 0,
          name: "",
          code: "",
          region: "",
        },
      })),
    };

    setGroups((prev) => [...prev, newGroup]);
  };

  const handleSave = async () => {
    const res = await fetch(`/api/groups`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        leagueId: league.id,
        groups: groups
      })
    });

    if (!res.ok) {
      console.error("Gagal menyimpan grup");
    } else {
      console.log("Grup berhasil disimpan");
    }

    fetching();
  };
  const handleLock = async () => {
    const result = await fetch(`/api/leagues/${league.slug}/lockgroup`, {
      method: "PATCH",
      headers: {"Content-Tyope": "application/json"},
      body: JSON.stringify({leagueId: league.id})
    })
    if(!result.ok) return console.log("Error to lock group")
    return fetching();
  }


  return (
    <section className="flex-2">
      <header className="flex justify-between items-center">
        <h1>Manage Group</h1>
        <div className="flex gap-3 items-center">
          <label htmlFor="teamsInGroup">Teams/Group :</label>
          <input
            type="number"
            name="teamsInGroup"
            id="teamsInGroup"
            max={MAX_MEMBERS_IN_GROUP}
            min={minMemberInGroup}
            value={membersInGroup}
            onChange={handleMemberInGroupChange}
            className="border w-20 text-center rounded-lg"
          />
          <div className="flex gap-3">
            <button onClick={handleAddGroup} className="border px-2 py-1 rounded">
              Add Group
            </button>
            <button
              onClick={handleSave}
              className="border px-2 py-1 rounded disabled:opacity-50"
              disabled={!isAllValid}

            >
              Save
            </button>
            <button
              onClick={(handleLock)}
              className="border px-2 py-1 rounded disabled:opacity-50"
              disabled={!isAllValid}

            >
              Lock Group
            </button>
          </div>
        </div>
      </header>
      <div className="flex gap-5 flex-wrap">
        {groups.map((group, index) => (
          <GroupTable
            key={group.id ?? index}
            group={group}
            onGroupNameChange={handleGroupNameChange}
            onMemberChange={handleMemberChange}
            validationResults={validationResults}
            onDeleteGroup={handleDeleteGroup}
          />
        ))}
      </div>
    </section>
  );
}
