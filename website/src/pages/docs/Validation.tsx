import { CodeBlock } from '@/components/code/CodeBlock'

export function Validation() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <article className="prose prose-slate dark:prose-invert max-w-none">
        <h1 className="text-4xl font-bold mb-4">Validation</h1>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Built-in Rules</h2>
          <CodeBlock
            code={`{
  id: 'info',
  title: 'Information',
  validation: {
    // Required field
    name: { required: true },

    // String length
    username: {
      minLength: 3,
      maxLength: 20
    },

    // Number range
    age: {
      min: 18,
      max: 120
    },

    // Email format
    email: { email: true },

    // URL format
    website: { url: true },

    // Pattern matching
    phone: {
      pattern: /^\\d{3}-\\d{3}-\\d{4}$/
    },

    // Multiple rules
    password: {
      required: true,
      minLength: 8,
      pattern: /^(?=.*[A-Z])(?=.*\\d)/
    }
  }
}`}
            language="typescript"
            filename="validation-rules.ts"
          />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Custom Validators</h2>
          <CodeBlock
            code={`{
  id: 'signup',
  title: 'Sign Up',
  validation: {
    // Custom async validator
    username: {
      custom: async (value, data) => {
        const response = await fetch(\`/api/check-username?username=\${value}\`)
        const result = await response.json()
        return result.available
      }
    },

    // Custom validator with access to all data
    password: {
      custom: (value, data) => {
        // Confirm password matches
        return value === data.confirmPassword
      }
    },

    // Custom error message
    email: {
      required: true,
      email: true,
      message: 'Please enter a valid email address'
    }
  }
}`}
            language="typescript"
            filename="custom-validation.ts"
          />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Validating</h2>
          <CodeBlock
            code={`// Validate current step
const errors = await wizard.validate()
if (errors) {
  console.log('Validation failed:', errors)
}

// Validate specific step
const stepErrors = await wizard.validate('personal-info')

// Validate all steps
const allErrors = await wizard.validateAll()

// Check if valid
const isValid = await wizard.isValid()
const stepValid = await wizard.isStepValid('personal-info')`}
            language="typescript"
            filename="validate.ts"
          />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Working with Errors</h2>
          <CodeBlock
            code={`// Get errors for current step
const errors = wizard.getErrors()

// Get errors for specific step
const stepErrors = wizard.getErrors('personal-info')

// Set errors manually
wizard.setErrors({
  name: 'Name is required',
  email: 'Invalid email format'
})

// Clear errors
wizard.clearErrors()  // All errors
wizard.clearErrors('personal-info')  // Step errors`}
            language="typescript"
            filename="errors.ts"
          />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Validation Events</h2>
          <CodeBlock
            code={`// Listen for validation errors
wizard.on('validation:error', ({ step, errors }) => {
  console.log('Step:', step.id)
  console.log('Errors:', errors)
  // Show error notification
})

// Listen for validation success
wizard.on('validation:success', ({ step }) => {
  console.log('Step valid:', step.id)
})`}
            language="typescript"
            filename="validation-events.ts"
          />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Auto-Validation</h2>
          <CodeBlock
            code={`const wizard = createWizard({
  steps: [...],
  // Validate before moving to next step
  validateOnNext: true,   // Default: true
  // Validate before moving to previous step
  validateOnPrev: false,  // Default: false
})

// With auto-validation, next() returns false if invalid
const canProceed = await wizard.next()
if (!canProceed) {
  console.log('Validation failed')
}`}
            language="typescript"
            filename="auto-validation.ts"
          />
        </section>
      </article>
    </div>
  )
}
