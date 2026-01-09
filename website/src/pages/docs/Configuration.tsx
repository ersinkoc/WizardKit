import { CodeBlock } from '@/components/code/CodeBlock'
import { PACKAGE_NAME } from '@/lib/constants'

export function Configuration() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <article className="prose prose-slate dark:prose-invert max-w-none">
        <h1 className="text-4xl font-bold mb-4">Wizard Configuration</h1>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Basic Configuration</h2>
          <CodeBlock
            code={`import { createWizard } from '${PACKAGE_NAME}'

const wizard = createWizard({
  steps: [
    { id: 'step1', title: 'Step 1' },
    { id: 'step2', title: 'Step 2' },
  ],
})`}
            language="typescript"
            filename="wizard.ts"
          />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Configuration Options</h2>
          <div className="space-y-4">
            <div className="p-4 rounded-lg border border-border bg-muted/30">
              <h3 className="font-semibold mb-2">steps</h3>
              <p className="text-sm text-muted-foreground mb-2">Array of step definitions</p>
              <CodeBlock
                code={`steps: [
  { id: 'info', title: 'Information' },
  { id: 'confirm', title: 'Confirmation' }
]`}
                language="typescript"
              />
            </div>

            <div className="p-4 rounded-lg border border-border bg-muted/30">
              <h3 className="font-semibold mb-2">initialData</h3>
              <p className="text-sm text-muted-foreground mb-2">Initial form data</p>
              <CodeBlock
                code={`initialData: {
  name: '',
  email: ''
}`}
                language="typescript"
              />
            </div>

            <div className="p-4 rounded-lg border border-border bg-muted/30">
              <h3 className="font-semibold mb-2">initialStep</h3>
              <p className="text-sm text-muted-foreground mb-2">Starting step (ID or index)</p>
              <CodeBlock
                code={`// By step ID
initialStep: 'step2'

// By index
initialStep: 1`}
                language="typescript"
              />
            </div>

            <div className="p-4 rounded-lg border border-border bg-muted/30">
              <h3 className="font-semibold mb-2">linear</h3>
              <p className="text-sm text-muted-foreground mb-2">Force sequential navigation</p>
              <CodeBlock
                code={`linear: true  // Users must complete steps in order`}
                language="typescript"
              />
            </div>

            <div className="p-4 rounded-lg border border-border bg-muted/30">
              <h3 className="font-semibold mb-2">validateOnNext / validateOnPrev</h3>
              <p className="text-sm text-muted-foreground mb-2">Auto-validate on navigation</p>
              <CodeBlock
                code={`validateOnNext: true   // Validate before next (default: true)
validateOnPrev: false  // Validate before prev (default: false)`}
                language="typescript"
              />
            </div>

            <div className="p-4 rounded-lg border border-border bg-muted/30">
              <h3 className="font-semibold mb-2">persistKey</h3>
              <p className="text-sm text-muted-foreground mb-2">Enable state persistence</p>
              <CodeBlock
                code={`persistKey: 'my-wizard'
persistStorage: 'local'  // 'local' | 'session' | 'memory'
persistDebounce: 300     // Save delay in ms`}
                language="typescript"
              />
            </div>

            <div className="p-4 rounded-lg border border-border bg-muted/30">
              <h3 className="font-semibold mb-2">Callbacks</h3>
              <p className="text-sm text-muted-foreground mb-2">Lifecycle hooks</p>
              <CodeBlock
                code={`{
  onStepChange: (step, direction, data) => {},
  onDataChange: (data, changedFields) => {},
  onValidationError: (step, errors) => {},
  onComplete: async (data) => {
    await submit(data)
  },
  onCancel: (data, step) => {}
}`}
                language="typescript"
              />
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Complete Example</h2>
          <CodeBlock
            code={`import { createWizard } from '${PACKAGE_NAME}'

interface FormData {
  name: string
  email: string
  age?: number
}

const wizard = createWizard<FormData>({
  // Step definitions
  steps: [
    { id: 'personal', title: 'Personal Info' },
    { id: 'address', title: 'Address' },
    { id: 'confirm', title: 'Confirmation' },
  ],

  // Initial data
  initialData: {
    name: '',
    email: '',
  },

  // Start at specific step
  initialStep: 'personal',

  // Force linear progression
  linear: true,

  // Validation settings
  validateOnNext: true,
  validateOnPrev: false,

  // Persistence
  persistKey: 'signup-wizard',
  persistStorage: 'local',
  persistDebounce: 500,

  // Callbacks
  onStepChange: (step) => {
    console.log('Now at:', step.title)
  },

  onComplete: async (data) => {
    await fetch('/api/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },
})`}
            language="typescript"
            filename="wizard-config.ts"
          />
        </section>
      </article>
    </div>
  )
}
