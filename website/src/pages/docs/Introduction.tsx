import { Package, CheckCircle2 } from 'lucide-react'
import { InstallTabs } from '@/components/common/InstallTabs'
import { CodeBlock } from '@/components/code/CodeBlock'
import { PACKAGE_NAME, DESCRIPTION } from '@/lib/constants'

const quickStartCode = `import { createWizard } from '${PACKAGE_NAME}'

const wizard = createWizard({
  steps: [
    { id: 'info', title: 'Personal Information' },
    { id: 'address', title: 'Address' },
    { id: 'confirm', title: 'Confirmation' },
  ],
})

// Navigate
wizard.next()
console.log(wizard.currentStep.id) // 'address'

// Access data
wizard.setData({ name: 'John' })
console.log(wizard.data.name) // 'John'

// Progress
console.log(wizard.progress) // 0.33 (33%)`

export function Introduction() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <article className="prose prose-slate dark:prose-invert max-w-none">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Package className="w-6 h-6 text-primary" />
            <span className="text-sm font-medium text-muted-foreground">@oxog</span>
          </div>
          <h1 className="text-4xl font-bold mb-4">Introduction</h1>
          <p className="text-xl text-muted-foreground">
            {DESCRIPTION}
          </p>
        </div>

        {/* What is WizardKit */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">What is WizardKit?</h2>
          <p className="text-muted-foreground mb-4">
            WizardKit is a zero-dependency multi-step wizard toolkit for building complex
            form wizards and onboarding flows. It provides a simple yet powerful API for
            managing multi-step processes with conditional navigation, validation, and
            state persistence.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
            {[
              'Zero dependencies',
              'TypeScript with full generics',
              'Conditional steps & branching',
              'Built-in validation',
              'State persistence',
              'Framework agnostic',
            ].map((feature) => (
              <div key={feature} className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Installation */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Installation</h2>
          <p className="text-muted-foreground mb-4">
            Install WizardKit using your favorite package manager:
          </p>
          <InstallTabs />
        </section>

        {/* Quick Start */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Quick Start</h2>
          <p className="text-muted-foreground mb-4">
            Create your first wizard in just a few lines of code:
          </p>
          <CodeBlock code={quickStartCode} language="typescript" filename="wizard.ts" />
        </section>

        {/* Core Concepts */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Core Concepts</h2>
          <div className="space-y-4">
            <div className="p-4 rounded-lg border border-border bg-muted/30">
              <h3 className="font-semibold mb-2">Steps</h3>
              <p className="text-sm text-muted-foreground">
                Each wizard consists of multiple steps with unique IDs and titles. Steps
                can be shown/hidden conditionally based on user input.
              </p>
            </div>
            <div className="p-4 rounded-lg border border-border bg-muted/30">
              <h3 className="font-semibold mb-2">Navigation</h3>
              <p className="text-sm text-muted-foreground">
                Move between steps using next(), prev(), or goTo(). Linear mode ensures
                users complete steps in order.
              </p>
            </div>
            <div className="p-4 rounded-lg border border-border bg-muted/30">
              <h3 className="font-semibold mb-2">Data</h3>
              <p className="text-sm text-muted-foreground">
                Store form data with full TypeScript support. Data persists across steps
                and can be automatically saved to localStorage.
              </p>
            </div>
            <div className="p-4 rounded-lg border border-border bg-muted/30">
              <h3 className="font-semibold mb-2">Validation</h3>
              <p className="text-sm text-muted-foreground">
                Validate fields before proceeding. Supports built-in rules and custom
                validators with async support.
              </p>
            </div>
          </div>
        </section>

        {/* What's Next */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">What's Next?</h2>
          <p className="text-muted-foreground mb-4">
            Ready to dive deeper? Check out these guides:
          </p>
          <ul className="space-y-2">
            <li>
              <a href="/docs/installation" className="text-primary hover:underline">
                Installation →
              </a>
            </li>
            <li>
              <a href="/docs/quick-start" className="text-primary hover:underline">
                Quick Start Guide →
              </a>
            </li>
            <li>
              <a href="/docs/configuration" className="text-primary hover:underline">
                Wizard Configuration →
              </a>
            </li>
            <li>
              <a href="/docs/react" className="text-primary hover:underline">
                React Integration →
              </a>
            </li>
          </ul>
        </section>
      </article>
    </div>
  )
}
