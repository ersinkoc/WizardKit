import { CodeBlock } from '@/components/code/CodeBlock'

export function Events() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <article className="prose prose-slate dark:prose-invert max-w-none">
        <h1 className="text-4xl font-bold mb-4">Events</h1>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Available Events</h2>
          <CodeBlock
            code={`// Step change
wizard.on('step:change', ({ step, direction }) => {
  console.log(\`Moved \${direction} to \${step.title}\`)
})

// Data change
wizard.on('data:change', ({ data, changedFields }) => {
  console.log('Fields changed:', changedFields)
})

// Validation success
wizard.on('validation:success', ({ step }) => {
  console.log('Step validated:', step.id)
})

// Validation error
wizard.on('validation:error', ({ step, errors }) => {
  console.error('Validation failed:', errors)
})

// Wizard complete
wizard.on('complete', async ({ data }) => {
  await submitForm(data)
})

// Wizard reset
wizard.on('reset', () => {
  console.log('Wizard was reset')
})

// Wizard cancel
wizard.on('cancel', ({ data, step }) => {
  console.log('Cancelled at:', step.id)
})

// State restore (from persistence)
wizard.on('restore', ({ data }) => {
  console.log('Restored data:', data)
})`}
            language="typescript"
            filename="events.ts"
          />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Using Callbacks</h2>
          <CodeBlock
            code={`const wizard = createWizard({
  steps: [...],
  onStepChange: (step, direction, data) => {
    // Track page view
    analytics.track('Step View', {
      step: step.id,
      direction
    })
  },
  onDataChange: (data, changedFields) => {
    // Auto-save to backend
    debounce(() => saveDraft(data), 1000)
  },
  onValidationError: (step, errors) => {
    // Show toast notification
    toast.error(\`Please fix \${Object.keys(errors).length} errors\`)
  },
  onComplete: async (data) => {
    // Submit form
    await api.submit(data)
  },
  onCancel: (data, step) => {
    // Ask for confirmation
    if (hasUnsavedChanges(data)) {
      return confirm('Discard changes?')
    }
  }
})`}
            language="typescript"
            filename="callbacks.ts"
          />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Unsubscribing</h2>
          <CodeBlock
            code={`// on() returns unsubscribe function
const unsubscribe = wizard.on('step:change', ({ step }) => {
  console.log('Step:', step.id)
})

// Later, unsubscribe
unsubscribe()

// Or use off()
const handler = ({ step }) => console.log(step.id)
wizard.on('step:change', handler)
wizard.off('step:change', handler)

// One-time listener
wizard.once('complete', ({ data }) => {
  console.log('Completed only once!')
})`}
            language="typescript"
            filename="unsubscribe.ts"
          />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">State Subscription</h2>
          <CodeBlock
            code={`// Subscribe to all state changes
const unsubscribe = wizard.subscribe((state, prevState) => {
  console.log('Current step:', state.currentStep.id)
  console.log('Previous step:', prevState.currentStep.id)
  console.log('Data changed:', state.data !== prevState.data)
})

// Unsubscribe when done
unsubscribe()`}
            language="typescript"
            filename="subscribe.ts"
          />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Complete Example</h2>
          <CodeBlock
            code={`const wizard = createWizard({
  steps: [
    { id: 'info', title: 'Information' },
    { id: 'confirm', title: 'Confirmation' },
  ],
})

// Analytics tracking
wizard.on('step:change', ({ step, direction }) => {
  analytics.track('wizard_navigation', {
    step_id: step.id,
    step_title: step.title,
    direction,
    timestamp: Date.now()
  })
})

// Auto-save
wizard.on('data:change', debounce(({ data }) => {
  localStorage.setItem('wizard-draft', JSON.stringify(data))
}, 2000))

// Error handling
wizard.on('validation:error', ({ step, errors }) => {
  errorReporter.log({
    step: step.id,
    errors,
    userAgent: navigator.userAgent
  })
})

// Success
wizard.on('complete', async ({ data }) => {
  try {
    await submitForm(data)
    showToast('Success!', 'success')
  } catch (error) {
    showToast('Submission failed', 'error')
  }
})`}
            language="typescript"
            filename="complete-events.ts"
          />
        </section>
      </article>
    </div>
  )
}
