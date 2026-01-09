import { Link } from 'react-router-dom'
import { Home, ArrowLeft, FileQuestion } from 'lucide-react'
import { PACKAGE_NAME } from '@/lib/constants'

export function NotFound() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-2xl">
      <div className="text-center">
        {/* Icon */}
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 text-primary mb-6">
          <FileQuestion className="w-10 h-10" />
        </div>

        {/* Error Code */}
        <h1 className="text-6xl font-bold text-muted-foreground mb-4">404</h1>

        {/* Message */}
        <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
        <p className="text-muted-foreground mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>

        {/* Suggested Links */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
          >
            <Home className="w-4 h-4" />
            Go Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-border hover:bg-accent transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
        </div>

        {/* Quick Links */}
        <div className="p-6 rounded-xl border border-border bg-muted/30">
          <h3 className="font-semibold mb-4">Looking for something?</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <Link
              to="/docs/introduction"
              className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-accent transition-colors group"
            >
              <span>Documentation</span>
              <span className="text-muted-foreground group-hover:text-foreground">→</span>
            </Link>
            <Link
              to="/api/create-wizard"
              className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-accent transition-colors group"
            >
              <span>API Reference</span>
              <span className="text-muted-foreground group-hover:text-foreground">→</span>
            </Link>
            <Link
              to="/examples"
              className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-accent transition-colors group"
            >
              <span>Examples</span>
              <span className="text-muted-foreground group-hover:text-foreground">→</span>
            </Link>
            <Link
              to="/playground"
              className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-accent transition-colors group"
            >
              <span>Playground</span>
              <span className="text-muted-foreground group-hover:text-foreground">→</span>
            </Link>
          </div>
        </div>

        {/* Package Name */}
        <p className="mt-12 text-sm text-muted-foreground">
          {PACKAGE_NAME} - Zero-dependency multi-step wizard toolkit
        </p>
      </div>
    </div>
  )
}
