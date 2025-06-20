'use client'

import { useParams } from "next/navigation";
import LeagueContainer from "@/components/LeagueContainer";
import { useEsport } from "@/hooks/esports";
import Image from "next/image";
import Spinner from "@/components/Spinner";

export default function ESportPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: esport, isLoading, isError, error } = useEsport(slug)

  if (isError) return <div className="text-center py-8 text-red-500">Error: {error.message}</div>;

  const leagues = esport?.leagues?.map(league => ({
    ...league,
    esport: {
      id: esport.id,
      name: esport.name,
      slug: esport.slug,
      imageUrl: esport.imageUrl || '',
      description: esport.description || '',
      userId: esport.userId,
    }
  })) || [];

  return (
    <main className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <div className="flex items-center gap-4">
          <Image
            src={
              esport?.imageUrl?.startsWith("http")
                ? esport.imageUrl
                : "https://images.unsplash.com/vector-1739891192689-5237d3aa2f28?w=800"
            }
            alt={esport?.name ?? "Image Esport"}
            width={64}
            height={64}
          />
          <div>
            <h1 className="text-3xl font-bold">{esport?.name}</h1>
            <p className="text-gray-600 mt-2">{esport?.description ?? "Game Descriptions"}</p>
          </div>
        </div>
      </header>
      {
        isLoading ? <Spinner /> :
          !esport?.leagues ? "No leagues" : <LeagueContainer leagues={leagues} />
      }
    </main>
  );
}


