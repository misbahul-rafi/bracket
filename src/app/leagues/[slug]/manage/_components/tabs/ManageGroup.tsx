'use client'

import { useEffect, useState } from "react";
import { StageStruct } from "../../../../../../../types/struct";
import { Group, GroupMember, Team } from "@prisma/client";
import GroupTable from "./../GroupTable";
import { useTeams } from "@/hooks/teams";
import Spinner from "@/components/Spinner";
import { useCreateGroups } from "@/hooks/groups";
import GroupDetail from "./GroupDetail";
import KCFromGroup from "./KCFromGroup";

export interface GroupXMembers extends Group {
  members: (GroupMember & {
    team: Team;
  })[];
}

const MAX_MEMBERS_IN_GROUP = 16;
type ValidationStatus = "not-found" | "duplicate" | "valid";

export default function ManageGroup({ stage, leagueSlug, fetching }: { stage: StageStruct, leagueSlug: string, fetching: () => void }) {
  if (stage.isLocked) return <GroupDetail stage={stage} />

  const [groups, setGroups] = useState<GroupXMembers[]>(() => {
    if (stage.name !== "Group Stage" && stage.groups.length === 0) {
      const newGroupId = Date.now();
      const newGroup: GroupXMembers = {
        id: -newGroupId,
        name: `Participants`,
        stageId: stage.id,
        members: Array.from({ length: 3 }, (_, index) => ({
          id: -(newGroupId + index),
          groupId: newGroupId,
          teamId: 0,
          team: {
            id: 0,
            name: "",
            code: "",
            region: "",
            userId: ""
          },
        })),
      };
      return [newGroup];
    }
    return stage.groups;
  });

  const [minMemberInGroup, setMinMemberInGroup] = useState(3);
  const [membersInGroup, setMembersInGroup] = useState<number>(minMemberInGroup)
  const { data: allTeams = [], isLoading, refetch } = useTeams()
  const [validationResults, setValidationResults] = useState<Record<number, ValidationStatus>>({});
  const [isAllValid, setIsAllValid] = useState(false);
  const { mutate: createGroups, isPending } = useCreateGroups(leagueSlug);

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
                userId: ""
              },
            });
          }

          return { ...group, members: newMembers };
        }

        return group;
      })
    );
  }, [membersInGroup]);

  useEffect(() => {
    if (!allTeams.length) return;
    const teamNames = groups.flatMap(g => g.members.map(m => m.team.name.trim().toLowerCase()));
    const counts: Record<string, number> = {};
    teamNames.forEach(name => {
      if (name !== "") {
        counts[name] = (counts[name] || 0) + 1;
      }
    });
    const results: Record<number, ValidationStatus> = {};

    groups.forEach(g => {
      g.members.forEach(m => {
        const name = m.team.name.trim();
        const lowerName = name.toLowerCase();

        if (name === "" || /^Team \d+$/i.test(name)) {
          results[m.id] = "valid";
          return;
        }

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
                      userId: ""
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
      name: `Group ${String.fromCharCode(65 + groups.length)}`,
      stageId: stage.id,
      members: Array.from({ length: membersInGroup }, (_, index) => ({
        id: -(newGroupId + index),
        groupId: newGroupId,
        teamId: 0,
        team: {
          id: 0,
          name: "",
          code: "",
          region: "",
          userId: ""
        },
      })),
    };

    setGroups((prev) => [...prev, newGroup]);
  };

  const handleSave = async () => {
    const payload = {
      stageId: stage.id,
      groups: groups
    }
    createGroups(payload, {
      onSuccess: () => {
        console.log("Success")
        fetching()
      },
      onError: (err) => console.log(err)
    })
  };
  const handleLock = async () => {
    const result = await fetch(`/api/leagues/${stage.id}/lockstage`, {
      method: "PATCH",
      headers: { "Content-Tyope": "application/json" },
      body: JSON.stringify({ stageId: stage.id })
    })
    if (!result.ok) return console.log("Error to lock group")
    return fetching();
  }
  return (
    <section className="flex-2 border rounded-lg p-5">
      <header className="flex justify-between items-center border-b pb-2 text-xs">
        <h1 className="">Manage {stage.name}</h1>
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
            {stage.name === "Group Stage" &&
              <button onClick={handleAddGroup} className="border px-2 py-1 rounded">
                Add Group
              </button>
            }
            <button
              onClick={handleSave}
              className="border px-2 py-1 rounded disabled:opacity-50"
              disabled={!isAllValid || isPending}

            >
              Save
            </button>
            <button
              onClick={(handleLock)}
              className="border px-2 py-1 rounded disabled:opacity-50"
              disabled={!isAllValid || isPending}

            >
              Lock Group
            </button>
          </div>
        </div>
      </header>
      <div className="">
        <div className="flex gap-5 flex-wrap h-full mt-5 flex-row p-3 justify-start">
          {isLoading ? <Spinner /> : groups.map((group, index) => (
            <GroupTable
              key={group.id ?? index}
              group={group}
              onGroupNameChange={handleGroupNameChange}
              onMemberChange={handleMemberChange}
              validationResults={validationResults}
              fetchTeam={refetch}
              {...(stage.name === "Group Stage" && {
                onDeleteGroup: handleDeleteGroup,
              })}
            />
          ))}
        </div>
        <KCFromGroup
          groupStage={stage}
        />

      </div>
    </section>
  );
}