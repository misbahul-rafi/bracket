type OptionCardProps = {
  label: string;
  description?: string;
  selected: boolean;
  onClick: () => void;
};

export default function OptionCard({ label, description, selected, onClick }: OptionCardProps) {
  return (
    <div
      onClick={onClick}
      className={`border rounded p-4 cursor-pointer transition duration-200
        ${selected ? ' border-white text-white' : 'border-[#EAB6B7] text-[#EAB6B7] hover:bg-gray-200'}
      `}
    >
      <h3 className="font-bold">{label}</h3>
      {description && <p className="text-sm">{description}</p>}
    </div>
  );
}