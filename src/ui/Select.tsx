import classNames from 'classnames'
import { ChangeEvent } from 'react';

interface Option {
  value: string;
  label: string;
}

interface SelectProps {
  value?: string;
  className?: string;
  onChange?: (e: ChangeEvent<HTMLSelectElement>) => void;
  options?: Option[]
}

export function Select({
  value,
  className,
  options = [],
  onChange
}: SelectProps) {
  return (
    <select
      className={classNames("select select-bordered select-sm", {
        [className!]: Boolean(className)
      })}
      value={value}
      onChange={onChange}
    >
      {
        options.map(({ value, label }) => (
          <option key={value} value={value}>
            { label }
          </option>
        ))
      }
    </select>
  )
}
