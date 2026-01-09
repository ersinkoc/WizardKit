import { useState, useEffect } from 'react'
import { Search, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SearchResult {
  title: string
  href: string
  category: string
}

const searchData: SearchResult[] = [
  // Getting Started
  { title: 'Introduction', href: '/docs/introduction', category: 'Getting Started' },
  { title: 'Installation', href: '/docs/installation', category: 'Getting Started' },
  { title: 'Quick Start', href: '/docs/quick-start', category: 'Getting Started' },

  // Core Concepts
  { title: 'Wizard Configuration', href: '/docs/configuration', category: 'Core Concepts' },
  { title: 'Step Definition', href: '/docs/steps', category: 'Core Concepts' },
  { title: 'Navigation', href: '/docs/navigation', category: 'Core Concepts' },
  { title: 'Data Management', href: '/docs/data', category: 'Core Concepts' },
  { title: 'Validation', href: '/docs/validation', category: 'Core Concepts' },
  { title: 'Events', href: '/docs/events', category: 'Core Concepts' },
  { title: 'Persistence', href: '/docs/persistence', category: 'Core Concepts' },

  // Framework Integrations
  { title: 'React Integration', href: '/docs/react', category: 'Framework Integrations' },
  { title: 'Vue Integration', href: '/docs/vue', category: 'Framework Integrations' },
  { title: 'Svelte Integration', href: '/docs/svelte', category: 'Framework Integrations' },

  // API Reference
  { title: 'createWizard()', href: '/api/create-wizard', category: 'API Reference' },
  { title: 'Wizard Instance', href: '/api/wizard-instance', category: 'API Reference' },
  { title: 'Step Definition', href: '/api/step-definition', category: 'API Reference' },
  { title: 'TypeScript Types', href: '/api/types', category: 'API Reference' },

  // Examples
  { title: 'Examples', href: '/examples', category: 'Examples' },
  { title: 'Multi-Step Registration Form', href: '/examples#multi-step-form', category: 'Examples' },
  { title: 'Conditional Branching Wizard', href: '/examples#conditional-branching', category: 'Examples' },
  { title: 'E-commerce Checkout', href: '/examples#ecommerce-checkout', category: 'Examples' },
  { title: 'Dynamic Survey Wizard', href: '/examples#survey-wizard', category: 'Examples' },
  { title: 'Loan Calculator Wizard', href: '/examples#loan-calculator', category: 'Examples' },
]

export function SearchBar() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (query.length < 2) {
      setResults([])
      return
    }

    const filtered = searchData.filter(
      (item) =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase())
    )

    setResults(filtered.slice(0, 8))
  }, [query])

  return (
    <div className="relative">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="search"
          placeholder="Search documentation..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          className={cn(
            'w-full h-10 pl-10 pr-10 rounded-lg border border-border bg-background',
            'text-sm placeholder:text-muted-foreground',
            'focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
            'transition-all'
          )}
        />
        {query && (
          <button
            onClick={() => {
              setQuery('')
              setResults([])
              setIsOpen(false)
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && query.length >= 2 && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Results */}
          <div className="absolute z-20 w-full mt-2 bg-background border border-border rounded-lg shadow-lg max-h-96 overflow-auto">
            {results.length > 0 ? (
              <div className="p-2">
                {results.map((result, index) => (
                  <a
                    key={index}
                    href={result.href}
                    onClick={() => {
                      setIsOpen(false)
                      setQuery('')
                    }}
                    className="block px-3 py-2 rounded-md hover:bg-accent transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{result.title}</span>
                      <span className="text-xs text-muted-foreground">{result.category}</span>
                    </div>
                  </a>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-sm text-muted-foreground">
                No results found for "{query}"
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
