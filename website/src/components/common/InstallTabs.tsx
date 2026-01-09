import { useState } from 'react'
import { cn } from '@/lib/utils'

interface InstallTabsProps {
  packageName?: string
  className?: string
}

const PACKAGE_MANAGERS = [
  { name: 'npm', command: (pkg: string) => `npm install ${pkg}` },
  { name: 'yarn', command: (pkg: string) => `yarn add ${pkg}` },
  { name: 'pnpm', command: (pkg: string) => `pnpm add ${pkg}` },
  { name: 'bun', command: (pkg: string) => `bun add ${pkg}` },
] as const

export function InstallTabs({ packageName = '@oxog/wizardkit', className }: InstallTabsProps) {
  const [activeTab, setActiveTab] = useState(0)

  return (
    <div className={cn('rounded-lg border border-border bg-muted/50', className)}>
      {/* Tab Headers */}
      <div className="flex gap-1 border-b border-border p-1">
        {PACKAGE_MANAGERS.map((pm, index) => (
          <button
            key={pm.name}
            type="button"
            onClick={() => setActiveTab(index)}
            className={cn(
              'flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
              activeTab === index
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {pm.name}
          </button>
        ))}
      </div>

      {/* Command Display */}
      <div className="flex items-center justify-between px-4 py-3">
        <code className="text-sm font-mono">
          {PACKAGE_MANAGERS[activeTab].command(packageName)}
        </code>
      </div>
    </div>
  )
}
