import { CodeBlock } from '@/components/code/CodeBlock'

export function Steps() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <article className="prose prose-slate dark:prose-invert max-w-none">
        <h1 className="text-4xl font-bold mb-4">Step Definition</h1>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Basic Step</h2>
          <CodeBlock
            code={`{
  id: 'personal-info',    // Unique identifier
  title: 'Personal Info'   // Display title
}`}
            language="typescript"
          />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Conditional Steps</h2>
          <p className="text-muted-foreground mb-4">
            Show or hide steps based on form data:
          </p>
          <CodeBlock
            code={`const wizard = createWizard({
  steps: [
    {
      id: 'info',
      title: 'Basic Info',
    },
    {
      id: 'company',
      title: 'Company Details',
      // Only show if user selected "business" type
      isActive: (data) => data.userType === 'business'
    },
    {
      id: 'confirm',
      title: 'Confirmation',
    },
  ],
})`}
            language="typescript"
            filename="conditional-steps.ts"
          />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Step Options</h2>
          <div className="space-y-4">
            <div className="p-4 rounded-lg border border-border bg-muted/30">
              <h3 className="font-semibold mb-2">id</h3>
              <p className="text-sm text-muted-foreground">Unique step identifier (required)</p>
            </div>

            <div className="p-4 rounded-lg border border-border bg-muted/30">
              <h3 className="font-semibold mb-2">title</h3>
              <p className="text-sm text-muted-foreground">Display title (required)</p>
            </div>

            <div className="p-4 rounded-lg border border-border bg-muted/30">
              <h3 className="font-semibold mb-2">isActive</h3>
              <p className="text-sm text-muted-foreground">Function to determine if step should be shown</p>
              <CodeBlock
                code={`isActive: (data) => {
  return data.hasAddress === true
}`}
                language="typescript"
              />
            </div>

            <div className="p-4 rounded-lg border border-border bg-muted/30">
              <h3 className="font-semibold mb-2">canSkip</h3>
              <p className="text-sm text-muted-foreground">Allow skipping this step</p>
              <CodeBlock
                code={`canSkip: true

// Or dynamic
canSkip: (data) => data.optional === true`}
                language="typescript"
              />
            </div>

            <div className="p-4 rounded-lg border border-border bg-muted/30">
              <h3 className="font-semibold mb-2">validation</h3>
              <p className="text-sm text-muted-foreground">Step-level validation schema</p>
              <CodeBlock
                code={`{
  id: 'info',
  title: 'Information',
  validation: {
    name: { required: true, minLength: 2 },
    email: { required: true, email: true },
    age: { min: 18, max: 120 }
  }
}`}
                language="typescript"
              />
            </div>

            <div className="p-4 rounded-lg border border-border bg-muted/30">
              <h3 className="font-semibold mb-2">onEnter / onLeave</h3>
              <p className="text-sm text-muted-foreground">Step lifecycle hooks</p>
              <CodeBlock
                code={`{
  id: 'confirm',
  title: 'Confirm',
  onEnter: async (data) => {
    // Fetch additional data
    const result = await fetch('/api/preview')
    return { ...data, preview: await result.json() }
  },
  onLeave: (data) => {
    console.log('Leaving confirm with:', data)
  }
}`}
                language="typescript"
              />
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Dynamic Steps</h2>
          <CodeBlock
            code={`// Generate steps dynamically
const userSteps = users.map(user => ({
  id: \`user-\${user.id}\`,
  title: user.name,
  isActive: (data) => data.selectedUsers?.includes(user.id)
}))

const wizard = createWizard({
  steps: [
    { id: 'intro', title: 'Welcome' },
    ...userSteps,
    { id: 'complete', title: 'Done' }
  ]
})`}
            language="typescript"
            filename="dynamic-steps.ts"
          />
        </section>
      </article>
    </div>
  )
}
