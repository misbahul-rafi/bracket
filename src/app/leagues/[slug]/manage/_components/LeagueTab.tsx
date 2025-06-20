type Props = {
  tab: string;
  setTab: (value: string) => void;
};

export default function LeagueTab({ tab, setTab }: Props) {
  const tabs = [
    { key: "detail", label: "Detail" },
    { key: "manage-group", label: "Manage Group" },
    { key: "manage-match", label: "Manage Match" },
    { key: "matches", label: "Matches" },
    { key: "bracket", label: "Bracket" },
  ];

  return (
    <nav className="flex justify-around">
      {tabs.map((item) => (
        <button
          key={item.key}
          onClick={() => setTab(item.key)}
          className={`text-sm px-3 py-2 w-full ${
            tab === item.key
              ? "text-black-600 border-b border-[#de1e14] font-medium"
              : "text-gray-500 hover:bg-gray-300"
          }`}
        >
          {item.label}
        </button>
      ))}
    </nav>
  );
}
