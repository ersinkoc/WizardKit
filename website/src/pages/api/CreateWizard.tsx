import { CodeBlock } from '@/components/code/CodeBlock'
import { Link } from 'react-router-dom'

export function CreateWizard() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <article className="prose prose-slate dark:prose-invert max-w-none">
        <h1 className="text-4xl font-bold mb-4">createWizard()</h1>
        <p className="text-xl text-muted-foreground mb-8">
          Create a new wizard instance with configuration
        </p>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Signature</h2>
          <CodeBlock
            code={`function createWizard<TData = Record<string, unknown>>(
  config: WizardConfig<TData>
): WizardInstance<TData>`}
            language="typescript"
          />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Parameters</h2>
          <div className="space-y-4">
            <div className="p-4 rounded-lg border border-border bg-muted/30">
              <h3 className="font-semibold mb-2">config: WizardConfig&lt;TData&gt;</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Configuration object for the wizard
              </p>
              <Link to="/api/step-definition" className="text-primary hover:underline">
                See Step Definition →
              </Link>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Returns</h2>
          <div className="p-4 rounded-lg border border-border bg-muted/30">
            <p className="mb-2"><code>WizardInstance&lt;TData&gt;</code></p>
            <p className="text-sm text-muted-foreground">
              A wizard instance with all navigation, data management, and validation methods
            </p>
            <Link to="/api/wizard-instance" className="text-primary hover:underline">
              See Wizard Instance →
            </Link>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Configuration Options</h2>
          <div className="space-y-4">
            <div className="p-4 rounded-lg border border-border bg-muted/30">
              <h3 className="font-semibold mb-2 text-primary">steps</h3>
              <p className="text-sm text-muted-foreground mb-2">StepDefinition[] - Required</p>
              <p className="text-sm">Array of step definitions</p>
            </div>

            <div className="p-4 rounded-lg border border-border bg-muted/30">
              <h3 className="font-semibold mb-2 text-primary">initialData</h3>
              <p className="text-sm text-muted-foreground mb-2">TData - Optional</p>
              <p className="text-sm">Initial form data</p>
            </div>

            <div className="p-4 rounded-lg border border-border bg-muted/30">
              <h3 className="font-semibold mb-2 text-primary">initialStep</h3>
              <p className="text-sm text-muted-foreground mb-2">string | number - Optional</p>
              <p className="text-sm">Starting step (ID or index)</p>
            </div>

            <div className="p-4 rounded-lg border border-border bg-muted/30">
              <h3 className="font-semibold mb-2 text-primary">linear</h3>
              <p className="text-sm text-muted-foreground mb-2">boolean - Optional (default: false)</p>
              <p className="text-sm">Force sequential navigation</p>
            </div>

            <div className="p-4 rounded-lg border border-border bg-muted/30">
              <h3 className="font-semibold mb-2 text-primary">validateOnNext</h3>
              <p className="text-sm text-muted-foreground mb-2">boolean - Optional (default: true)</p>
              <p className="text-sm">Validate before moving to next step</p>
            </div>

            <div className="p-4 rounded-lg border border-border bg-muted/30">
              <h3 className="font-semibold mb-2 text-primary">validateOnPrev</h3>
              <p className="text-sm text-muted-foreground mb-2">boolean - Optional (default: false)</p>
              <p className="text-sm">Validate before moving to previous step</p>
            </div>

            <div className="p-4 rounded-lg border border-border bg-muted/30">
              <h3 className="font-semibold mb-2 text-primary">persistKey</h3>
              <p className="text-sm text-muted-foreground mb-2">string - Optional</p>
              <p className="text-sm">Enable persistence with this key</p>
            </div>

            <div className="p-4 rounded-lg border border-border bg-muted/30">
              <h3 className="font-semibold mb-2 text-primary">persistStorage</h3>
              <p className="text-sm text-muted-foreground mb-2">'local' | 'session' | 'memory' - Optional</p>
              <p className="text-sm">Storage backend (default: 'local')</p>
            </div>

            <div className="p-4 rounded-lg border border-border bg-muted/30">
              <h3 className="font-semibold mb-2 text-primary">persistDebounce</h3>
              <p className="text-sm text-muted-foreground mb-2">number - Optional</p>
              <p className="text-sm">Save delay in milliseconds (default: 300)</p>
            </div>

            <div className="p-4 rounded-lg border border-border bg-muted/30">
              <h3 className="font-semibold mb-2 text-primary">persistFields</h3>
              <p className="text-sm text-muted-foreground mb-2">(keyof WizardState)[] - Optional</p>
              <p className="text-sm">Which fields to persist (default: all)</p>
            </div>

            <div className="p-4 rounded-lg border border-border bg-muted/30">
              <h3 className="font-semibold mb-2 text-primary">onStepChange</h3>
              <p className="text-sm text-muted-foreground mb-2">(step, direction, data) =&gt; void - Optional</p>
              <p className="text-sm">Called when step changes</p>
            </div>

            <div className="p-4 rounded-lg border border-border bg-muted/30">
              <h3 className="font-semibold mb-2 text-primary">onDataChange</h3>
              <p className="text-sm text-muted-foreground mb-2">(data, changedFields) =&gt; void - Optional</p>
              <p className="text-sm">Called when data changes</p>
            </div>

            <div className="p-4 rounded-lg border border-border bg-muted/30">
              <h3 className="font-semibold mb-2 text-primary">onValidationError</h3>
              <p className="text-sm text-muted-foreground mb-2">(step, errors) =&gt; void - Optional</p>
              <p className="text-sm">Called when validation fails</p>
            </div>

            <div className="p-4 rounded-lg border border-border bg-muted/30">
              <h3 className="font-semibold mb-2 text-primary">onComplete</h3>
              <p className="text-sm text-muted-foreground mb-2">(data) =&gt; void | Promise&lt;void&gt; - Optional</p>
              <p className="text-sm">Called when wizard completes</p>
            </div>

            <div className="p-4 rounded-lg border border-border bg-muted/30">
              <h3 className="font-semibold mb-2 text-primary">onCancel</h3>
              <p className="text-sm text-muted-foreground mb-2">(data, step) =&gt; void - Optional</p>
              <p className="text-sm">Called when wizard is cancelled</p>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Examples</h2>
          <CodeBlock
            code={`// Basic usage
const wizard = createWizard({
  steps: [
    { id: 'step1', title: 'Step 1' },
    { id: 'step2', title: 'Step 2' },
  ],
})

// With TypeScript
interface UserData {
  name: string
  email: string
}

const wizard = createWizard<UserData>({
  steps: [...],
  initialData: {
    name: '',
    email: '',
  },
})

// With all options
const wizard = createWizard({
  steps: [...],
  initialData: {...},
  initialStep: 'step2',
  linear: true,
  validateOnNext: true,
  persistKey: 'my-wizard',
  persistStorage: 'local',
  onStepChange: (step) => console.log(step.id),
  onComplete: async (data) => {
    await submit(data)
  },
})`}
            language="typescript"
            filename="create-wizard.ts"
          />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">See Also</h2>
          <div className="space-y-2">
            <Link to="/api/wizard-instance" className="block p-3 rounded-lg border border-border hover:bg-accent transition-colors">
              <div className="font-medium">Wizard Instance</div>
              <div className="text-sm text-muted-foreground">All available methods and properties</div>
            </Link>
            <Link to="/api/step-definition" className="block p-3 rounded-lg border border-border hover:bg-accent transition-colors">
              <div className="font-medium">Step Definition</div>
              <div className="text-sm text-muted-foreground">Step configuration options</div>
            </Link>
            <Link to="/api/types" className="block p-3 rounded-lg border border-border hover:bg-accent transition-colors">
              <div className="font-medium">TypeScript Types</div>
              <div className="text-sm text-muted-foreground">Available type definitions</div>
            </Link>
          </div>
        </section>
      </article>
    </div>
  )
}
