import './GettingStarted.css'

function GettingStarted() {
  return (
    <div className="page getting-started">
      <h1>Getting Started</h1>

      <section className="installation">
        <h2>Installation</h2>
        <p>Install WizardKit using your preferred package manager:</p>
        <div className="code-blocks">
          <pre><code>npm install @oxog/wizardkit</code></pre>
          <pre><code>pnpm add @oxog/wizardkit</code></pre>
          <pre><code>yarn add @oxog/wizardkit</code></pre>
        </div>
      </section>

      <section className="basic-usage">
        <h2>Basic Usage</h2>
        <p>Here's a simple wizard with three steps:</p>
        <pre><code>{`import { createWizard } from '@oxog/wizardkit'

const wizard = createWizard({
  steps: [
    { id: 'personal', title: 'Personal Info' },
    { id: 'address', title: 'Address' },
    { id: 'confirm', title: 'Confirm' },
  ],
})

// Navigate between steps
wizard.next()
wizard.prev()

// Get current state
const state = wizard.getState()
console.log(state.currentStep) // { id: 'address', title: 'Address', ... }
`}</code></pre>
      </section>

      <section className="step-data">
        <h2>Working with Data</h2>
        <p>Collect and manage data throughout your wizard:</p>
        <pre><code>{`const wizard = createWizard({
  steps: [
    { id: 'name', title: 'Your Name' },
    { id: 'email', title: 'Your Email' },
    { id: 'confirm', title: 'Confirm' },
  ],
  initialData: {
    firstName: '',
    lastName: '',
    email: '',
  },
})

// Set data
wizard.setData({ firstName: 'John', lastName: 'Doe' })

// Get data
const data = wizard.getData()
console.log(data.firstName) // 'John'

// Set individual field
wizard.setField('email', 'john@example.com')
`}</code></pre>
      </section>

      <section className="validation">
        <h2>Validation</h2>
        <p>Add validation to your steps:</p>
        <pre><code>{`const wizard = createWizard({
  steps: [
    {
      id: 'email',
      title: 'Email',
      validate: {
        email: (value) => {
          if (!value || !/@/.test(value)) {
            return 'Please enter a valid email'
          }
        },
      },
    },
  ],
})

// Check if current step is valid
const isValid = wizard.isValid()
console.log(isValid) // false

// Get errors
const errors = wizard.getErrors()
console.log(errors) // { email: 'Please enter a valid email' }
`}</code></pre>
      </section>

      <section className="conditional-steps">
        <h2>Conditional Steps</h2>
        <p>Show or hide steps based on user input:</p>
        <pre><code>{`const wizard = createWizard({
  steps: [
    { id: 'name', title: 'Name' },
    {
      id: 'company',
      title: 'Company',
      condition: (data) => data.accountType === 'business',
    },
    { id: 'confirm', title: 'Confirm' },
  ],
  initialData: { accountType: 'business' },
})

// The 'company' step will be visible because accountType is 'business'
`}</code></pre>
      </section>

      <section className="events">
        <h2>Events</h2>
        <p>Listen to wizard events:</p>
        <pre><code>{`const wizard = createWizard({
  steps: [
    { id: 'step1', title: 'Step 1' },
    { id: 'step2', title: 'Step 2' },
  ],
})

// Listen for step changes
wizard.on('step:change', ({ step, direction, prevStep }) => {
  console.log(\`Moved from \${prevStep.title} to \${step.title}\`)
})

// Listen for completion
wizard.on('complete', ({ data }) => {
  console.log('Wizard completed with data:', data)
})

// Listen for validation errors
wizard.on('validation:error', ({ step, errors }) => {
  console.error(\`Validation failed on \${step.title}:\`, errors)
})
`}</code></pre>
      </section>

      <section className="persistence">
        <h2>Persistence</h2>
        <p>Automatically save wizard state:</p>
        <pre><code>{`const wizard = createWizard({
  steps: [
    { id: 'step1', title: 'Step 1' },
    { id: 'step2', title: 'Step 2' },
  ],
  persistence: {
    enabled: true,
    key: 'my-wizard',
    storage: 'localStorage', // or 'sessionStorage'
  },
})

// State is automatically saved and restored
// When users return, they'll be on the same step with the same data
`}</code></pre>
      </section>
    </div>
  )
}

export default GettingStarted
