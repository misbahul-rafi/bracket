type SelectInputProps = {
  name: string
  label?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void
  options: { label: string; value: string }[]
} & React.SelectHTMLAttributes<HTMLSelectElement>

export default function SelectInput({
  name,
  label,
  value,
  onChange,
  options,
  ...rest
}: SelectInputProps) {
  return (
    <div>
      {label && (
        <label
          htmlFor={name}
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          {label}
        </label>
      )}
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        {...rest}
      >
        <option value="">-- Select Game --</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  )
}
