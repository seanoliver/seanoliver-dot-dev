import { Element } from 'react-scroll'
import { Separator } from './ui/separator'

export default function Section({
  className,
  title,
  children,
}: {
  className?: string
  title: string
  children: React.ReactNode
}): JSX.Element {
  const isHome = title === 'Home'

  return (
    <Element
      name={title.toLowerCase()}
      className={className || 'text-sm w-full md:my-20 my-10 flex md:flex-row flex-col'}
    >
      {!isHome && <div className="text-muted-foreground w-1/4 md:mb-0 mb-4">{title}</div>}
      <Separator orientation="vertical" />
      <div className={isHome ? 'w-full' : 'md:w-3/4 w-full'}>{children}</div>
    </Element>
  )
}
