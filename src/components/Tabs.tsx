import classNames from 'classnames'

interface Tab<T> {
  value: T;
  label: string;
}

interface TabsProps<T> {
  active?: T;
  tabs?: Tab<T>[];
  className?: string;
  onChange?: (active: T) => void;
}

export function Tabs<T extends string>({
  active,
  tabs = [],
  className,
  onChange
}: TabsProps<T>) {
  return (
    <div className="tabs">
      {
        tabs.map(({ value, label }) => {
          const isActive = active === value

          return (
            <a
              className={classNames("tab tab-lifted", {
                'tab-active': isActive,
                [className!]: Boolean(className)
              })}
              key={value}
              onClick={() => {
                if (!isActive) {
                  onChange?.(value)
                }
              }}
            >
              { label }
            </a> 
          )
        })
      }
    </div>
  )
}