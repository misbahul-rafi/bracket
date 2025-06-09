import { CiSearch } from "react-icons/ci"
import { IoClose } from "react-icons/io5"

type Props = {
  value: string
  onChange: (value: string) => void
  onClear: () => void
}

export default function TwitterSearch({ value, onChange, onClear }: Props) {
  return (
    <form className="relative w-full text-sm font-normal">
      <label htmlFor="search" className="flex items-center h-10 px-4 rounded-full bg-[#283542] text-white relative shadow">
        <CiSearch />
        <input
          id="search"
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete="off"
          placeholder="Search league..."
          className="ml-3 w-full bg-transparent text-white placeholder:text-[#949faa] focus:outline-none"
        />
        {value && (
          <button
            type="button"
            onClick={onClear}
            className="absolute right-3 bg-[#1b9bee] text-white w-5 h-5 rounded-full flex items-center justify-center text-xs hover:scale-110 transition-transform duration-200"
          >
            <IoClose />
          </button>
        )}
      </label>
    </form>
  )
}
