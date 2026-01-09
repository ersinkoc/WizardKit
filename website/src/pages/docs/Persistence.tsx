import { CodeBlock } from '@/components/code/CodeBlock'
import { PACKAGE_NAME } from '@/lib/constants'

export function Persistence() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <article className="prose prose-slate dark:prose-invert max-w-none">
        <h1 className="text-4xl font-bold mb-4">Persistence</h1>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Enabling Persistence</h2>
          <CodeBlock
            code={`const wizard = createWizard({
  steps: [...],
  // Enable persistence
  persistKey: 'my-wizard',
  persistStorage: 'local',  // 'local' | 'session' | 'memory'
  persistDebounce: 300,     // Save delay in ms
  persistFields: ['data', 'currentStep', 'history']  // What to save
})`}
            language="typescript"
            filename="persistence.ts"
          />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Storage Options</h2>
          <div className="space-y-4">
            <div className="p-4 rounded-lg border border-border bg-muted/30">
              <h3 className="font-semibold mb-2">localStorage</h3>
              <p className="text-sm text-muted-foreground mb-2">Persists across browser sessions</p>
              <CodeBlock
                code={`persistStorage: 'local'  // Default`}
                language="typescript"
              />
            </div>

            <div className="p-4 rounded-lg border border-border bg-muted/30">
              <h3 className="font-semibold mb-2">sessionStorage</h3>
              <p className="text-sm text-muted-foreground mb-2">Cleared when browser tab closes</p>
              <CodeBlock
                code={`persistStorage: 'session'`}
                language="typescript"
              />
            </div>

            <div className="p-4 rounded-lg border border-border bg-muted/30">
              <h3 className="font-semibold mb-2">Memory</h3>
              <p className="text-sm text-muted-foreground mb-2">In-memory only, cleared on refresh</p>
              <CodeBlock
                code={`persistStorage: 'memory'`}
                language="typescript"
              />
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Manual Persistence</h2>
          <CodeBlock
            code={`// Save current state immediately
wizard.persist()

// Restore saved state
wizard.restore()

// Clear persisted data
wizard.clearPersisted()

// Check if data exists
const hasData = localStorage.getItem('my-wizard') !== null`}
            language="typescript"
            filename="manual-persistence.ts"
          />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Custom Storage</h2>
          <CodeBlock
            code={`// Use custom storage adapter
const customStorage = {
  get: async (key) => {
    const response = await fetch(\`/api/state/\${key}\`)
    return await response.text()
  },
  set: async (key, value) => {
    await fetch(\`/api/state/\${key}\`, {
      method: 'POST',
      body: value
    })
  },
  remove: async (key) => {
    await fetch(\`/api/state/\${key}\`, {
      method: 'DELETE'
    })
  }
}

// Note: This requires integrating with PersistenceManager directly`}
            language="typescript"
            filename="custom-storage.ts"
          />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Persistence Events</h2>
          <CodeBlock
            code={`// Listen for restore events
wizard.on('restore', ({ data }) => {
  console.log('Restored from persistence:', data)
  // Show welcome back message
  showToast('Welcome back! Your progress was restored.')
})

// Check if wizard was restored
if (wizard.history.length > 0 && wizard.currentIndex > 0) {
  console.log('Wizard was restored from previous session')
}`}
            language="typescript"
            filename="persistence-events.ts"
          />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Complete Example</h2>
          <CodeBlock
            code={`import { createWizard } from '${PACKAGE_NAME}'

const wizard = createWizard({
  steps: [
    { id: 'personal', title: 'Personal Info' },
    { id: 'address', title: 'Address' },
    { id: 'payment', title: 'Payment' },
  ],

  // Enable auto-save
  persistKey: 'checkout-wizard',
  persistStorage: 'local',
  persistDebounce: 500,

  // Notify on restore
  onDataChange: (data) => {
    // Auto-save happens automatically
    console.log('Data will be saved in 500ms')
  }
})

// Listen for restore
wizard.on('restore', () => {
  console.log('Welcome back! Your progress has been restored.')
})`}
            language="typescript"
            filename="complete-persistence.ts"
          />
        </section>
      </article>
    </div>
  )
}
