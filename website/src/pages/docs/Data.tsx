import { CodeBlock } from '@/components/code/CodeBlock'

export function Data() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <article className="prose prose-slate dark:prose-invert max-w-none">
        <h1 className="text-4xl font-bold mb-4">Data Management</h1>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Getting Data</h2>
          <CodeBlock
            code={`// Get all data
const allData = wizard.data

// Get specific field
const name = wizard.getData('name')

// Get multiple fields
const { name, email } = wizard.getData(['name', 'email'])

// Get step-specific data
const stepData = wizard.getStepData('personal-info')`}
            language="typescript"
            filename="get-data.ts"
          />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Setting Data</h2>
          <CodeBlock
            code={`// Set multiple fields (merge)
wizard.setData({
  name: 'John',
  email: 'john@example.com'
})

// Replace all data
wizard.setData({
  name: 'Jane',
  email: 'jane@example.com'
}, true)  // true = replace, false = merge

// Set single field
wizard.setField('name', 'Alice')

// Set with type safety
wizard.setField('age', 30)  // TypeScript checks type`}
            language="typescript"
            filename="set-data.ts"
          />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Clearing Data</h2>
          <CodeBlock
            code={`// Clear specific field
wizard.clearField('email')

// Clear step data
wizard.resetStepData('personal-info')

// Reset all data to initial
wizard.resetData()

// Full wizard reset
wizard.reset()  // Resets data, step, and history`}
            language="typescript"
            filename="clear-data.ts"
          />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Data Change Events</h2>
          <CodeBlock
            code={`// Listen to data changes
wizard.on('data:change', ({ data, changedFields }) => {
  console.log('Fields changed:', changedFields)
  console.log('New data:', data)
})

// Or use callback in config
const wizard = createWizard({
  steps: [...],
  onDataChange: (data, changedFields) => {
    console.log('Changed:', changedFields)
  }
})`}
            language="typescript"
            filename="data-events.ts"
          />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Step-Specific Data</h2>
          <CodeBlock
            code={`// Get data for specific step
const stepData = wizard.getStepData('personal-info')

// Set data for specific step
wizard.setStepData('personal-info', {
  firstName: 'John',
  lastName: 'Doe'
})

// Reset specific step
wizard.resetStepData('personal-info')`}
            language="typescript"
            filename="step-data.ts"
          />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Type Safety</h2>
          <CodeBlock
            code={`interface FormData {
  name: string
  email: string
  age?: number
  preferences: {
    newsletter: boolean
    theme: 'light' | 'dark'
  }
}

const wizard = createWizard<FormData>({
  steps: [...],
  initialData: {
    name: '',
    email: '',
    preferences: {
      newsletter: false,
      theme: 'light'
    }
  }
})

// Fully typed access
wizard.data.name  // string
wizard.data.age   // number | undefined
wizard.setField('age', 25)  // OK
wizard.setField('age', '25')  // TypeScript error!`}
            language="typescript"
            filename="typed-data.ts"
          />
        </section>
      </article>
    </div>
  )
}
