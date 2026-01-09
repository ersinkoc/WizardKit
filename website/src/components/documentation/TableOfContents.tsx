import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

interface Heading {
  id: string
  text: string
  level: number
}

export function TableOfContents({ className }: { className?: string }) {
  const [headings, setHeadings] = useState<Heading[]>([])
  const [activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    // Extract headings from the page
    const elements = Array.from(
      document.querySelectorAll('article h1, article h2, article h3')
    )

    const headingData: Heading[] = elements.map((elem) => ({
      id: elem.id,
      text: elem.textContent || '',
      level: parseInt(elem.tagName.substring(1)),
    }))

    setHeadings(headingData)
  }, [])

  useEffect(() => {
    // Set IDs for headings if they don't have them
    const elements = document.querySelectorAll('article h1, article h2, article h3')
    elements.forEach((elem) => {
      if (!elem.id) {
        const text = elem.textContent || ''
        elem.id = text
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .trim()
      }
    })

    // Update active heading on scroll
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      {
        rootMargin: '-80px 0px -80% 0px',
      }
    )

    elements.forEach((elem) => observer.observe(elem))

    return () => observer.disconnect()
  }, [headings])

  if (headings.length === 0) {
    return null
  }

  return (
    <nav className={cn('space-y-2', className)}>
      <h4 className="text-sm font-semibold mb-3">On This Page</h4>
      <ul className="space-y-2 text-sm">
        {headings.map((heading) => (
          <li
            key={heading.id}
            style={{ paddingLeft: `${(heading.level - 1) * 0.75}rem` }}
          >
            <a
              href={`#${heading.id}`}
              className={cn(
                'block py-1 border-l-2 transition-colors',
                activeId === heading.id
                  ? 'border-primary text-primary font-medium'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
              )}
              onClick={(e) => {
                e.preventDefault()
                document.getElementById(heading.id)?.scrollIntoView({
                  behavior: 'smooth',
                  block: 'start',
                })
              }}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
