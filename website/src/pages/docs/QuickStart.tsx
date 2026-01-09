import { CodeBlock } from '@/components/code/CodeBlock'
import { PACKAGE_NAME } from '@/lib/constants'

export function QuickStart() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <article className="prose prose-slate dark:prose-invert max-w-none">
        <h1 className="text-4xl font-bold mb-4">Quick Start</h1>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Step 1: Create a Wizard</h2>
          <CodeBlock
            code={`import { createWizard } from '${PACKAGE_NAME}'

const wizard = createWizard({
  steps: [
    { id: 'personal', title: 'Personal Info' },
    { id: 'address', title: 'Address' },
    { id: 'confirm', title: 'Confirm' },
  ],
  initialData: {
    name: '',
    email: '',
  },
})`}
            language="typescript"
            filename="wizard.ts"
          />
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Step 2: Navigate</h2>
          <CodeBlock
            code={`// Go to next step
await wizard.next()

// Go to previous step
await wizard.prev()

// Jump to specific step
await wizard.goTo('address')

// Check if can proceed
const canProceed = await wizard.isValid()
if (canProceed) {
  await wizard.next()
}`}
            language="typescript"
          />
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Step 3: Access State</h2>
          <CodeBlock
            code={`// Current step info
console.log(wizard.currentStep.id)    // 'address'
console.log(wizard.currentStep.title)  // 'Address'
console.log(wizard.currentIndex)       // 1

// Progress
console.log(wizard.progress)          // 0.66 (66%)
console.log(wizard.progressPercent)   // 66

// Navigation state
console.log(wizard.isFirst)           // false
console.log(wizard.isLast)            // false
console.log(wizard.canGoNext)         // true
console.log(wizard.canGoPrev)         // true`}
            language="typescript"
          />
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Step 4: Manage Data</h2>
          <CodeBlock
            code={`// Get all data
const data = wizard.data

// Get specific field
const name = wizard.getData('name')

// Set data
wizard.setData({ name: 'John', email: 'john@example.com' })

// Set single field
wizard.setField('name', 'Jane')

// Clear field
wizard.clearField('email')

// Reset to initial data
wizard.resetData()`}
            language="typescript"
          />
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Step 5: Listen to Events</h2>
          <CodeBlock
            code={`// Step change
wizard.on('step:change', ({ step, direction }) => {
  console.log(\`Moved to \${step.title}\`)
})

// Data change
wizard.on('data:change', ({ data, changedFields }) => {
  console.log('Fields changed:', changedFields)
})

// Validation errors
wizard.on('validation:error', ({ step, errors }) => {
  console.error('Validation failed:', errors)
})

// Complete
wizard.on('complete', ({ data }) => {
  console.log('Wizard complete!', data)
})`}
            language="typescript"
          />
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Complete Example</h2>
          <CodeBlock
            code={`import { createWizard } from '${PACKAGE_NAME}'

interface FormData {
  name: string
  email: string
}

const wizard = createWizard<FormData>({
  steps: [
    { id: 'info', title: 'Information' },
    { id: 'confirm', title: 'Confirm' },
  ],
  initialData: { name: '', email: '' },
})

// Event handlers
wizard.on('step:change', ({ step }) => {
  console.log('Current step:', step.title)
})

wizard.on('complete', async ({ data }) => {
  // Submit form
  await fetch('/api/submit', {
    method: 'POST',
    body: JSON.stringify(data),
  })
})

// UI Integration
document.getElementById('next')?.addEventListener('click', async () => {
  const isValid = await wizard.isValid()
  if (isValid) {
    await wizard.next()
  }
})

document.getElementById('prev')?.addEventListener('click', () => {
  wizard.prev()
})`}
            language="typescript"
            filename="app.ts"
          />
        </section>
      </article>
    </div>
  )
}
