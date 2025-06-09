'use client'
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function ViewJSON({ data }: { data: any }) {
  return (
    <pre className="whitespace-pre-wrap break-words text-sm bg-gray-100 p-4 rounded-md">
      {JSON.stringify(data, null, 2)}
    </pre>
  );
}