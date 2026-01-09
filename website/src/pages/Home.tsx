import { Link } from 'react-router-dom'
import { Package, Zap, Shield, Code, CheckCircle2, FileCode, Layers } from 'lucide-react'
import { InstallTabs } from '@/components/common/InstallTabs'
import { CodeBlock } from '@/components/code/CodeBlock'
import { PACKAGE_NAME, DESCRIPTION, GITHUB_REPO } from '@/lib/constants'

const FEATURES = [
  {
    icon: Zap,
    title: 'Zero Dependencies',
    description: 'No external dependencies - just pure TypeScript magic.',
  },
  {
    icon: Shield,
    title: 'Type Safe',
    description: 'Full TypeScript support with generics for type-safe data.',
  },
  {
    icon: Layers,
    title: 'Conditional Steps',
    description: 'Show/hide steps based on user input or conditions.',
  },
  {
    icon: Code,
    title: 'Framework Agnostic',
    description: 'Works with React, Vue, Svelte, or vanilla JS.',
  },
  {
    icon: CheckCircle2,
    title: 'Built-in Validation',
    description: 'Comprehensive validation system with custom rules.',
  },
  {
    icon: FileCode,
    title: 'Tiny Bundle',
    description: 'Core is under 500 bytes gzipped.',
  },
] as const

const exampleCode = `import { createWizard } from '${PACKAGE_NAME}'

const wizard = createWizard({
  steps: [
    { id: 'info', title: 'Personal Information' },
    { id: 'address', title: 'Address' },
    { id: 'confirm', title: 'Confirmation' },
  ],
  initialData: {
    name: '',
    email: '',
    address: '',
  },
})

// Navigate between steps
wizard.next()
wizard.prev()
wizard.goTo('confirm')

// Get current state
console.log(wizard.currentStep)
console.log(wizard.data)
console.log(wizard.progress) // 0.66`

export function Home() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      {/* Hero Section */}
      <section className="text-center py-16 md:py-24">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
          <Package className="w-4 h-4" />
          <span>@oxog</span>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
          {PACKAGE_NAME}
        </h1>

        {/* Description */}
        <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          {DESCRIPTION}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <Link
            to="/docs/introduction"
            className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 transition-colors"
          >
            Get Started
          </Link>
          <a
            href={`https://github.com/${GITHUB_REPO}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-lg border border-border px-6 py-3 text-sm font-medium hover:bg-accent transition-colors"
          >
            View on GitHub
          </a>
        </div>

        {/* Install Command */}
        <div className="max-w-md mx-auto">
          <InstallTabs />
        </div>
      </section>

      {/* Code Example */}
      <section className="py-12">
        <CodeBlock
          code={exampleCode}
          language="typescript"
          filename="wizard.ts"
        />
      </section>

      {/* Features Grid */}
      <section className="py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feature) => {
            const Icon = feature.icon
            return (
              <div
                key={feature.title}
                className="group rounded-xl border border-border bg-card p-6 hover:shadow-lg transition-all"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-16 border-t border-border">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">&lt;1KB</div>
            <div className="text-sm text-muted-foreground">Core Size</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">0</div>
            <div className="text-sm text-muted-foreground">Dependencies</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">100%</div>
            <div className="text-sm text-muted-foreground">TypeScript</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">3</div>
            <div className="text-sm text-muted-foreground">Frameworks</div>
          </div>
        </div>
      </section>
    </div>
  )
}
