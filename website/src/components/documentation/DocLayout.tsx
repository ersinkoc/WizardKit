import type { ReactNode } from 'react'
import { TableOfContents } from './TableOfContents'

interface DocLayoutProps {
  children: ReactNode
}

export function DocLayout({ children }: DocLayoutProps) {
  return (
    <div className="flex gap-8">
      {/* Main Content */}
      <div className="flex-1 min-w-0">
        {children}
      </div>

      {/* Table of Contents - Hidden on mobile */}
      <aside className="hidden xl:block w-64 shrink-0">
        <div className="sticky top-20">
          <TableOfContents />
        </div>
      </aside>
    </div>
  )
}
