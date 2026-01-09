import { CodeBlock as CodeshinBlock } from '@oxog/codeshine/react'
import { useTheme } from '@/components/ThemeProvider'
import { cn } from '@/lib/utils'

interface CodeBlockProps {
  code: string
  language?: string
  filename?: string
  showLineNumbers?: boolean
  highlightLines?: (number | string)[]
  className?: string
}

export function CodeBlock({
  code,
  language = 'typescript',
  filename,
  showLineNumbers = true,
  highlightLines,
  className,
}: CodeBlockProps) {
  const { theme } = useTheme()

  // Sync codeshine theme with app theme
  const codeTheme = theme === 'dark' ? 'github-dark' : 'github-light'

  return (
    <div
      className={cn(
        'relative group rounded-xl overflow-hidden',
        'border border-border bg-card shadow-sm',
        'my-4',
        className
      )}
    >
      {/* IDE Header - macOS style */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-muted/50 border-b border-border">
        <div className="flex items-center gap-3">
          {/* Traffic lights */}
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-500 transition-colors" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80 hover:bg-yellow-500 transition-colors" />
            <div className="w-3 h-3 rounded-full bg-green-500/80 hover:bg-green-500 transition-colors" />
          </div>
          {/* Filename or language */}
          {filename && (
            <span className="text-sm text-muted-foreground font-mono">
              {filename}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground uppercase tracking-wide">
            {language}
          </span>
        </div>
      </div>

      {/* Code Block - @oxog/codeshine */}
      <div className="overflow-x-auto p-4">
        <CodeshinBlock
          code={code}
          language={language}
          theme={codeTheme}
          lineNumbers={showLineNumbers}
          highlightLines={highlightLines}
        />
      </div>
    </div>
  )
}
