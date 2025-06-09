import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { GroupXMembers } from '../../../../types/struct';

type props = {
  leagueId: number,
  groups: GroupXMembers[]
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { leagueId, groups }: props = body;

    for (const group of groups) {
      if (group.id < 0) {
        await prisma.group.create({
          data: {
            name: group.name,
            leagueId,
            members: {
              create: group.members.map((member) => ({
                teamId: member.teamId,
              })),
            },
          },
        });
      } else {
        const queries = [];
        queries.push(
          prisma.group.update({
            where: { id: group.id },
            data: { name: group.name },
          })
        );
        for (const member of group.members) {
          if (member.id < 0) {
            queries.push(
              prisma.groupMember.create({
                data: {
                  groupId: group.id,
                  teamId: member.teamId,
                },
              })
            );
          } else {
            queries.push(
              prisma.groupMember.upsert({
                where: { id: member.id },
                update: {
                  teamId: member.teamId,
                },
                create: {
                  groupId: group.id,
                  teamId: member.teamId,
                },
              })
            );
          }
        }

        await prisma.$transaction(queries);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[GROUP_UPDATE_ERROR]', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
