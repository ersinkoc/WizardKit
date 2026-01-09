import { CodeBlock } from '@/components/code/CodeBlock'
import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

export function WizardInstance() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <article className="prose prose-slate dark:prose-invert max-w-none">
        <h1 className="text-4xl font-bold mb-4">Wizard Instance</h1>
        <p className="text-xl text-muted-foreground mb-8">
          Complete reference of all methods and properties available on a wizard instance
        </p>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Overview</h2>
          <p className="text-muted-foreground mb-4">
            The wizard instance returned by <code>createWizard()</code> provides all the methods
            and properties you need to control navigation, manage data, validate inputs, and
            respond to events.
          </p>
          <CodeBlock
            code={`const wizard = createWizard({
  steps: [...],
  // ...config
})

// Access all methods and properties
wizard.next()
wizard.data
wizard.currentStep
wizard.on('complete', ({ data }) => {...})`}
            language="typescript"
            filename="wizard-instance.ts"
          />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Navigation Methods</h2>

          <div className="space-y-6">
            {/* next */}
            <div className="p-5 rounded-xl border border-border bg-card">
              <div className="flex items-center gap-2 mb-3">
                <h3 className="text-xl font-semibold text-primary">next()</h3>
                <span className="px-2 py-0.5 rounded-md bg-green-500/10 text-green-500 text-xs font-medium">async</span>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Move to the next step in the wizard
              </p>
              <CodeBlock
                code={`await wizard.next()
// Returns: WizardState`}
                language="typescript"
                className="mb-3"
              />
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Validates current step if <code>validateOnNext</code> is true</li>
                <li>• Respects <code>linear</code> mode if enabled</li>
                <li>• Calls <code>onStepChange</code> callback</li>
                <li>• Skips inactive steps (conditional steps)</li>
              </ul>
            </div>

            {/* prev */}
            <div className="p-5 rounded-xl border border-border bg-card">
              <div className="flex items-center gap-2 mb-3">
                <h3 className="text-xl font-semibold text-primary">prev()</h3>
                <span className="px-2 py-0.5 rounded-md bg-green-500/10 text-green-500 text-xs font-medium">async</span>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Move to the previous step in the wizard
              </p>
              <CodeBlock
                code={`await wizard.prev()
// Returns: WizardState`}
                language="typescript"
                className="mb-3"
              />
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Validates current step if <code>validateOnPrev</code> is true</li>
                <li>• Skips inactive steps</li>
                <li>• No effect if at first step</li>
              </ul>
            </div>

            {/* goTo */}
            <div className="p-5 rounded-xl border border-border bg-card">
              <div className="flex items-center gap-2 mb-3">
                <h3 className="text-xl font-semibold text-primary">goTo(stepId)</h3>
                <span className="px-2 py-0.5 rounded-md bg-green-500/10 text-green-500 text-xs font-medium">async</span>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Navigate to a specific step by ID
              </p>
              <CodeBlock
                code={`await wizard.goTo('confirmation')
// Returns: WizardState`}
                language="typescript"
                className="mb-3"
              />
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Validates current step based on direction</li>
                <li>• Works even in linear mode (allows jumping)</li>
                <li>• Throws error if step ID not found</li>
              </ul>
            </div>

            {/* goToIndex */}
            <div className="p-5 rounded-xl border border-border bg-card">
              <div className="flex items-center gap-2 mb-3">
                <h3 className="text-xl font-semibold text-primary">goToIndex(index)</h3>
                <span className="px-2 py-0.5 rounded-md bg-green-500/10 text-green-500 text-xs font-medium">async</span>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Navigate to a specific step by index
              </p>
              <CodeBlock
                code={`await wizard.goToIndex(2)
// Returns: WizardState`}
                language="typescript"
                className="mb-3"
              />
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Index is 0-based</li>
                <li>• Only navigates to active steps</li>
                <li>• Throws error if index out of bounds</li>
              </ul>
            </div>

            {/* first */}
            <div className="p-5 rounded-xl border border-border bg-card">
              <div className="flex items-center gap-2 mb-3">
                <h3 className="text-xl font-semibold text-primary">first()</h3>
                <span className="px-2 py-0.5 rounded-md bg-green-500/10 text-green-500 text-xs font-medium">async</span>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Jump to the first step
              </p>
              <CodeBlock
                code={`await wizard.first()
// Returns: WizardState`}
                language="typescript"
              />
            </div>

            {/* last */}
            <div className="p-5 rounded-xl border border-border bg-card">
              <div className="flex items-center gap-2 mb-3">
                <h3 className="text-xl font-semibold text-primary">last()</h3>
                <span className="px-2 py-0.5 rounded-md bg-green-500/10 text-green-500 text-xs font-medium">async</span>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Jump to the last active step
              </p>
              <CodeBlock
                code={`await wizard.last()
// Returns: WizardState`}
                language="typescript"
              />
            </div>

            {/* skip */}
            <div className="p-5 rounded-xl border border-border bg-card">
              <div className="flex items-center gap-2 mb-3">
                <h3 className="text-xl font-semibold text-primary">skip(count)</h3>
                <span className="px-2 py-0.5 rounded-md bg-green-500/10 text-green-500 text-xs font-medium">async</span>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Skip ahead by a specified number of steps
              </p>
              <CodeBlock
                code={`await wizard.skip(2)  // Skip 2 steps ahead
// Returns: WizardState`}
                language="typescript"
              />
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Data Methods</h2>

          <div className="space-y-6">
            {/* setData */}
            <div className="p-5 rounded-xl border border-border bg-card">
              <div className="flex items-center gap-2 mb-3">
                <h3 className="text-xl font-semibold text-primary">setData(data)</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Merge data into the wizard state
              </p>
              <CodeBlock
                code={`wizard.setData({ name: 'John', email: 'john@example.com' })
// Returns: WizardInstance<TData>

// Also supports updater function
wizard.setData((prev) => ({
  ...prev,
  count: prev.count + 1
}))`}
                language="typescript"
                className="mb-3"
              />
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Shallow merges with existing data</li>
                <li>• Triggers <code>onDataChange</code> callback</li>
                <li>• Emits <code>data:change</code> event</li>
                <li>• Auto-saves if persistence is enabled</li>
              </ul>
            </div>

            {/* setField */}
            <div className="p-5 rounded-xl border border-border bg-card">
              <div className="flex items-center gap-2 mb-3">
                <h3 className="text-xl font-semibold text-primary">setField(key, value)</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Update a single field in the wizard data
              </p>
              <CodeBlock
                code={`wizard.setField('name', 'John')
// Returns: WizardInstance<TData>

// With TypeScript generics for type safety
interface FormData {
  name: string
  age: number
}
const wizard = createWizard<FormData>(...)
wizard.setField('name', 'John')  // Type-safe!`}
                language="typescript"
              />
            </div>

            {/* resetData */}
            <div className="p-5 rounded-xl border border-border bg-card">
              <div className="flex items-center gap-2 mb-3">
                <h3 className="text-xl font-semibold text-primary">resetData()</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Reset data to initial values
              </p>
              <CodeBlock
                code={`wizard.resetData()
// Returns: WizardInstance<TData>
// Resets to initialData from config`}
                language="typescript"
              />
            </div>

            {/* setStepData */}
            <div className="p-5 rounded-xl border border-border bg-card">
              <div className="flex items-center gap-2 mb-3">
                <h3 className="text-xl font-semibold text-primary">setStepData(stepId, data)</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Store data specific to a step
              </p>
              <CodeBlock
                code={`wizard.setStepData('shipping', {
  address: '123 Main St',
  city: 'New York'
})
// Returns: WizardInstance<TData>`}
                language="typescript"
              />
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Validation Methods</h2>

          <div className="space-y-6">
            {/* validate */}
            <div className="p-5 rounded-xl border border-border bg-card">
              <div className="flex items-center gap-2 mb-3">
                <h3 className="text-xl font-semibold text-primary">validate(stepId?)</h3>
                <span className="px-2 py-0.5 rounded-md bg-green-500/10 text-green-500 text-xs font-medium">async</span>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Validate the current or specified step
              </p>
              <CodeBlock
                code={`const result = await wizard.validate()
// Returns: ValidationResult
// { valid: boolean, errors: ValidationErrors }

// Validate specific step
const stepResult = await wizard.validate('shipping')

// Check if valid
if (result.valid) {
  await wizard.next()
} else {
  console.log(result.errors)
}`}
                language="typescript"
                className="mb-3"
              />
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Runs all validation rules for the step</li>
                <li>• Supports async validators</li>
                <li>• Returns detailed error information</li>
              </ul>
            </div>

            {/* isValid */}
            <div className="p-5 rounded-xl border border-border bg-card">
              <div className="flex items-center gap-2 mb-3">
                <h3 className="text-xl font-semibold text-primary">isValid(stepId?)</h3>
                <span className="px-2 py-0.5 rounded-md bg-green-500/10 text-green-500 text-xs font-medium">async</span>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Check if the current or specified step is valid
              </p>
              <CodeBlock
                code={`const isValid = await wizard.isValid()
// Returns: boolean

if (await wizard.isValid()) {
  await wizard.next()
}`}
                language="typescript"
              />
            </div>

            {/* clearErrors */}
            <div className="p-5 rounded-xl border border-border bg-card">
              <div className="flex items-center gap-2 mb-3">
                <h3 className="text-xl font-semibold text-primary">clearErrors(stepId?)</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Clear validation errors for a step or all steps
              </p>
              <CodeBlock
                code={`// Clear current step errors
wizard.clearErrors()

// Clear specific step errors
wizard.clearErrors('shipping')

// Returns: WizardInstance<TData>`}
                language="typescript"
              />
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Event Methods</h2>

          <div className="space-y-6">
            {/* on */}
            <div className="p-5 rounded-xl border border-border bg-card">
              <div className="flex items-center gap-2 mb-3">
                <h3 className="text-xl font-semibold text-primary">on(event, handler)</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Subscribe to wizard events
              </p>
              <CodeBlock
                code={`// Subscribe to events
wizard.on('complete', ({ data, step }) => {
  console.log('Wizard completed!', data)
})

wizard.on('step:change', ({ step, direction, data }) => {
  console.log(\`Moved \${direction} to \${step.id}\`)
})

wizard.on('data:change', ({ data, changedFields }) => {
  console.log('Data changed:', changedFields)
})

wizard.on('validation:error', ({ step, errors }) => {
  console.error('Validation failed:', errors)
})

// Returns: unsubscribe function
const unsubscribe = wizard.on('step:change', handler)
// Later: unsubscribe()`}
                language="typescript"
                className="mb-3"
              />
              <p className="text-sm text-muted-foreground">
                See <Link to="/docs/events" className="text-primary hover:underline">Events documentation</Link> for all available events.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Persistence Methods</h2>

          <div className="space-y-6">
            {/* save */}
            <div className="p-5 rounded-xl border border-border bg-card">
              <div className="flex items-center gap-2 mb-3">
                <h3 className="text-xl font-semibold text-primary">save()</h3>
                <span className="px-2 py-0.5 rounded-md bg-green-500/10 text-green-500 text-xs font-medium">async</span>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Manually save the current wizard state
              </p>
              <CodeBlock
                code={`await wizard.save()
// Returns: WizardInstance<TData>
// Saves to configured persistStorage`}
                language="typescript"
              />
            </div>

            {/* load */}
            <div className="p-5 rounded-xl border border-border bg-card">
              <div className="flex items-center gap-2 mb-3">
                <h3 className="text-xl font-semibold text-primary">load()</h3>
                <span className="px-2 py-0.5 rounded-md bg-green-500/10 text-green-500 text-xs font-medium">async</span>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Load wizard state from storage
              </p>
              <CodeBlock
                code={`await wizard.load()
// Returns: WizardInstance<TData>
// Restores state from persistStorage`}
                language="typescript"
              />
            </div>

            {/* clear */}
            <div className="p-5 rounded-xl border border-border bg-card">
              <div className="flex items-center gap-2 mb-3">
                <h3 className="text-xl font-semibold text-primary">clear()</h3>
                <span className="px-2 py-0.5 rounded-md bg-green-500/10 text-green-500 text-xs font-medium">async</span>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Clear persisted wizard state from storage
              </p>
              <CodeBlock
                code={`await wizard.clear()
// Returns: WizardInstance<TData>
// Removes state from persistStorage`}
                language="typescript"
              />
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Completion Methods</h2>

          <div className="space-y-6">
            {/* complete */}
            <div className="p-5 rounded-xl border border-border bg-card">
              <div className="flex items-center gap-2 mb-3">
                <h3 className="text-xl font-semibold text-primary">complete()</h3>
                <span className="px-2 py-0.5 rounded-md bg-green-500/10 text-green-500 text-xs font-medium">async</span>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Mark the wizard as complete
              </p>
              <CodeBlock
                code={`await wizard.complete()
// Returns: WizardState
// Sets isComplete to true
// Triggers onComplete callback`}
                language="typescript"
              />
            </div>

            {/* cancel */}
            <div className="p-5 rounded-xl border border-border bg-card">
              <div className="flex items-center gap-2 mb-3">
                <h3 className="text-xl font-semibold text-primary">cancel()</h3>
                <span className="px-2 py-0.5 rounded-md bg-green-500/10 text-green-500 text-xs font-medium">async</span>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
              Cancel the wizard operation
              </p>
              <CodeBlock
                code={`await wizard.cancel()
// Returns: WizardState
// Triggers onCancel callback`}
                language="typescript"
              />
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Properties</h2>

          <div className="space-y-4">
            <div className="p-4 rounded-lg border border-border bg-muted/30">
              <h3 className="font-semibold mb-2 text-primary">data: TData</h3>
              <p className="text-sm text-muted-foreground">
                Current wizard data (read-only). Use <code>setData()</code> or <code>setField()</code> to modify.
              </p>
            </div>

            <div className="p-4 rounded-lg border border-border bg-muted/30">
              <h3 className="font-semibold mb-2 text-primary">currentStep: StepDefinition</h3>
              <p className="text-sm text-muted-foreground">
                The currently active step definition
              </p>
            </div>

            <div className="p-4 rounded-lg border border-border bg-muted/30">
              <h3 className="font-semibold mb-2 text-primary">currentIndex: number</h3>
              <p className="text-sm text-muted-foreground">
                Index of the current step among active steps
              </p>
            </div>

            <div className="p-4 rounded-lg border border-border bg-muted/30">
              <h3 className="font-semibold mb-2 text-primary">steps: StepDefinition[]</h3>
              <p className="text-sm text-muted-foreground">
                All step definitions (read-only)
              </p>
            </div>

            <div className="p-4 rounded-lg border border-border bg-muted/30">
              <h3 className="font-semibold mb-2 text-primary">activeSteps: StepDefinition[]</h3>
              <p className="text-sm text-muted-foreground">
                Only currently active steps (respects <code>isActive</code> conditions)
              </p>
            </div>

            <div className="p-4 rounded-lg border border-border bg-muted/30">
              <h3 className="font-semibold mb-2 text-primary">errors: ValidationErrors</h3>
              <p className="text-sm text-muted-foreground">
                Current validation errors by step ID
              </p>
            </div>

            <div className="p-4 rounded-lg border border-border bg-muted/30">
              <h3 className="font-semibold mb-2 text-primary">progress: number</h3>
              <p className="text-sm text-muted-foreground">
                Current progress as a decimal (0 to 1)
              </p>
            </div>

            <div className="p-4 rounded-lg border border-border bg-muted/30">
              <h3 className="font-semibold mb-2 text-primary">progressPercent: number</h3>
              <p className="text-sm text-muted-foreground">
                Current progress as a percentage (0 to 100)
              </p>
            </div>

            <div className="p-4 rounded-lg border border-border bg-muted/30">
              <h3 className="font-semibold mb-2 text-primary">isFirst: boolean</h3>
              <p className="text-sm text-muted-foreground">
                Whether the current step is the first step
              </p>
            </div>

            <div className="p-4 rounded-lg border border-border bg-muted/30">
              <h3 className="font-semibold mb-2 text-primary">isLast: boolean</h3>
              <p className="text-sm text-muted-foreground">
                Whether the current step is the last active step
              </p>
            </div>

            <div className="p-4 rounded-lg border border-border bg-muted/30">
              <h3 className="font-semibold mb-2 text-primary">canGoNext: boolean</h3>
              <p className="text-sm text-muted-foreground">
                Whether navigation to next step is possible
              </p>
            </div>

            <div className="p-4 rounded-lg border border-border bg-muted/30">
              <h3 className="font-semibold mb-2 text-primary">canGoPrev: boolean</h3>
              <p className="text-sm text-muted-foreground">
                Whether navigation to previous step is possible
              </p>
            </div>

            <div className="p-4 rounded-lg border border-border bg-muted/30">
              <h3 className="font-semibold mb-2 text-primary">isComplete: boolean</h3>
              <p className="text-sm text-muted-foreground">
                Whether the wizard has been completed
              </p>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">See Also</h2>
          <div className="space-y-2">
            <Link to="/api/create-wizard" className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-accent transition-colors">
              <div>
                <div className="font-medium">createWizard()</div>
                <div className="text-sm text-muted-foreground">Creating wizard instances</div>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </Link>
            <Link to="/api/step-definition" className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-accent transition-colors">
              <div>
                <div className="font-medium">Step Definition</div>
                <div className="text-sm text-muted-foreground">Step configuration interface</div>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </Link>
            <Link to="/api/types" className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-accent transition-colors">
              <div>
                <div className="font-medium">TypeScript Types</div>
                <div className="text-sm text-muted-foreground">All type definitions</div>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </Link>
          </div>
        </section>
      </article>
    </div>
  )
}
