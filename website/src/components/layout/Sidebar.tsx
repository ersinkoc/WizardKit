import { Link, useLocation } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { DOCS_NAV, API_NAV } from '@/lib/constants'
import { SearchBar } from '@/components/documentation/SearchBar'

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const location = useLocation()

  const isActive = (href: string) => {
    return location.pathname === href || location.pathname.startsWith(href + '/')
  }

  return (
    <aside className={cn('w-64 border-r border-border bg-muted/30', className)}>
      <nav className="space-y-6 p-4">
        {/* Search */}
        <div className="px-0 pb-4">
          <SearchBar />
        </div>
        {/* Docs Navigation */}
        {DOCS_NAV.map((section) => (
          <div key={section.title}>
            <h3 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {section.title}
            </h3>
            <ul className="space-y-1">
              {section.items.map((item) => (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    className={cn(
                      'flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors',
                      isActive(item.href)
                        ? 'bg-accent text-accent-foreground font-medium'
                        : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'
                    )}
                  >
                    {item.name}
                    {isActive(item.href) && <ChevronRight className="ml-auto h-4 w-4" />}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* API Navigation */}
        {API_NAV.map((section) => (
          <div key={section.title}>
            <h3 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {section.title}
            </h3>
            <ul className="space-y-1">
              {section.items.map((item) => (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    className={cn(
                      'flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors',
                      isActive(item.href)
                        ? 'bg-accent text-accent-foreground font-medium'
                        : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'
                    )}
                  >
                    {item.name}
                    {isActive(item.href) && <ChevronRight className="ml-auto h-4 w-4" />}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  )
}
