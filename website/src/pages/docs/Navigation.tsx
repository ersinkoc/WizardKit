import { CodeBlock } from '@/components/code/CodeBlock'
import { PACKAGE_NAME } from '@/lib/constants'

export function Navigation() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <article className="prose prose-slate dark:prose-invert max-w-none">
        <h1 className="text-4xl font-bold mb-4">Navigation</h1>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Basic Navigation</h2>
          <CodeBlock
            code={`import { createWizard } from '${PACKAGE_NAME}'

const wizard = createWizard({
  steps: [
    { id: 'step1', title: 'Step 1' },
    { id: 'step2', title: 'Step 2' },
    { id: 'step3', title: 'Step 3' },
  ],
})

// Go to next step
await wizard.next()

// Go to previous step
await wizard.prev()

// Go to specific step by ID
await wizard.goTo('step3')

// Go to step by index
await wizard.goToIndex(1)

// Jump to first/last
await wizard.first()
await wizard.last()

// Skip current step
await wizard.skip()`}
            language="typescript"
            filename="navigation.ts"
          />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Navigation State</h2>
          <CodeBlock
            code={`// Check navigation state
wizard.canGoNext     // Can proceed to next?
wizard.canGoPrev     // Can go back?
wizard.isFirst       // Is first step?
wizard.isLast        // Is last step?
wizard.isComplete    // Is wizard complete?

// Current position
wizard.currentIndex  // Current step index
wizard.currentStep   // Current step object
wizard.currentStep.id
wizard.currentStep.title`}
            language="typescript"
          />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Progress Tracking</h2>
          <CodeBlock
            code={`// Progress values (0-1)
wizard.progress          // 0.66 (66%)
wizard.progressPercent   // 66

// Step status
wizard.isStepVisible('step3')   // Is step active?
wizard.isStepCompleted('step1') // Was step completed?
wizard.isStepDisabled('step2')  // Is step disabled?

// Navigation history
wizard.getHistory()  // ['step1', 'step2']
wizard.canUndo()     // Can go back?
await wizard.undo()  // Go to previous in history`}
            language="typescript"
          />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Linear Mode</h2>
          <p className="text-muted-foreground mb-4">
            Force users to complete steps in order:
          </p>
          <CodeBlock
            code={`const wizard = createWizard({
  steps: [
    { id: 'step1', title: 'Step 1' },
    { id: 'step2', title: 'Step 2' },
    { id: 'step3', title: 'Step 3' },
  ],
  linear: true,
})

// In linear mode:
await wizard.goTo('step3')  // Returns false
await wizard.next()          // OK - goes to step2
await wizard.goTo('step2')  // OK - adjacent step`}
            language="typescript"
            filename="linear-mode.ts"
          />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Async Navigation Guards</h2>
          <CodeBlock
            code={`// Check if can proceed before navigation
const canProceed = await wizard.checkCanGoNext()
if (canProceed) {
  await wizard.next()
}

// Check if specific step is reachable
const canGoToConfirm = await wizard.checkCanGoTo('confirm')
if (canGoToConfirm) {
  await wizard.goTo('confirm')
}`}
            language="typescript"
          />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Completion</h2>
          <CodeBlock
            code={`// Complete the wizard
const success = await wizard.complete()

if (success) {
  console.log('Wizard completed!')
  console.log(wizard.data)
}

// Reset to beginning
wizard.reset()

// Cancel the wizard
wizard.cancel()  // Triggers onCancel callback`}
            language="typescript"
          />
        </section>
      </article>
    </div>
  )
}
