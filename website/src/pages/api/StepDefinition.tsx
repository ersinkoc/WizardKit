import { CodeBlock } from '@/components/code/CodeBlock'
import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

export function StepDefinition() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <article className="prose prose-slate dark:prose-invert max-w-none">
        <h1 className="text-4xl font-bold mb-4">Step Definition</h1>
        <p className="text-xl text-muted-foreground mb-8">
          Complete reference of the StepDefinition interface for configuring wizard steps
        </p>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Interface</h2>
          <CodeBlock
            code={`interface StepDefinition<TData = Record<string, unknown>> {
  // Required
  id: string
  title: string

  // Optional
  description?: string
  validation?: ValidationSchema<TData>
  isActive?: (data: TData) => boolean
  onEnter?: (data: TData) => TData | Partial<TData> | Promise<TData> | Promise<Partial<TData>>
  onLeave?: (data: TData) => void | Promise<void>
  meta?: Record<string, unknown>
}`}
            language="typescript"
            filename="step-definition.ts"
          />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Properties</h2>

          <div className="space-y-6">
            {/* id */}
            <div className="p-5 rounded-xl border border-border bg-card">
              <div className="flex items-center gap-2 mb-3">
                <h3 className="text-xl font-semibold text-primary">id</h3>
                <span className="px-2 py-0.5 rounded-md bg-red-500/10 text-red-500 text-xs font-medium">required</span>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Unique identifier for the step
              </p>
              <CodeBlock
                code={`{
  id: 'user-information',
  // ...
}`}
                language="typescript"
                className="mb-3"
              />
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Must be unique across all steps</li>
                <li>• Used for navigation with <code>goTo()</code></li>
                <li>• Used in validation error objects</li>
                <li>• Recommended: use kebab-case</li>
              </ul>
            </div>

            {/* title */}
            <div className="p-5 rounded-xl border border-border bg-card">
              <div className="flex items-center gap-2 mb-3">
                <h3 className="text-xl font-semibold text-primary">title</h3>
                <span className="px-2 py-0.5 rounded-md bg-red-500/10 text-red-500 text-xs font-medium">required</span>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Display title for the step
              </p>
              <CodeBlock
                code={`{
  id: 'user-info',
  title: 'User Information',
  // ...
}`}
                language="typescript"
                className="mb-3"
              />
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Displayed in UI components</li>
                <li>• Used in progress indicators</li>
                <li>• Can include emojis or special characters</li>
              </ul>
            </div>

            {/* description */}
            <div className="p-5 rounded-xl border border-border bg-card">
              <div className="flex items-center gap-2 mb-3">
                <h3 className="text-xl font-semibold text-primary">description</h3>
                <span className="px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-500 text-xs font-medium">optional</span>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Additional description or instructions for the step
              </p>
              <CodeBlock
                code={`{
  id: 'shipping',
  title: 'Shipping Address',
  description: 'Enter your shipping address for delivery',
  // ...
}`}
                language="typescript"
              />
            </div>

            {/* validation */}
            <div className="p-5 rounded-xl border border-border bg-card">
              <div className="flex items-center gap-2 mb-3">
                <h3 className="text-xl font-semibold text-primary">validation</h3>
                <span className="px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-500 text-xs font-medium">optional</span>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Validation rules for fields in this step
              </p>
              <CodeBlock
                code={`{
  id: 'account',
  title: 'Account Details',
  validation: {
    username: {
      required: true,
      minLength: 3,
      maxLength: 20,
      pattern: /^[a-zA-Z0-9_]+$/
    },
    email: {
      required: true,
      email: true
    },
    age: {
      required: true,
      min: 18,
      max: 120
    }
  }
}`}
                language="typescript"
                className="mb-3"
              />
              <p className="text-sm text-muted-foreground mb-3">
                See <Link to="/docs/validation" className="text-primary hover:underline">Validation documentation</Link> for all available rules.
              </p>
            </div>

            {/* isActive */}
            <div className="p-5 rounded-xl border border-border bg-card">
              <div className="flex items-center gap-2 mb-3">
                <h3 className="text-xl font-semibold text-primary">isActive</h3>
                <span className="px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-500 text-xs font-medium">optional</span>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Function to determine if step should be active based on data
              </p>
              <CodeBlock
                code={`interface SurveyData {
  userType: 'individual' | 'business'
  companyName?: string
}

const steps = [
  {
    id: 'selection',
    title: 'Select User Type'
  },
  {
    id: 'business-info',
    title: 'Business Information',
    isActive: (data: SurveyData) => data.userType === 'business'
  },
  {
    id: 'individual-info',
    title: 'Personal Information',
    isActive: (data: SurveyData) => data.userType === 'individual'
  }
]`}
                language="typescript"
                className="mb-3"
              />
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Called whenever data changes</li>
                <li>• Receives current wizard data</li>
                <li>• Inactive steps are skipped during navigation</li>
                <li>• Inactive steps are excluded from <code>activeSteps</code></li>
              </ul>
            </div>

            {/* onEnter */}
            <div className="p-5 rounded-xl border border-border bg-card">
              <div className="flex items-center gap-2 mb-3">
                <h3 className="text-xl font-semibold text-primary">onEnter</h3>
                <span className="px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-500 text-xs font-medium">optional</span>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Callback when entering this step
              </p>
              <CodeBlock
                code={`{
  id: 'results',
  title: 'Your Results',
  onEnter: (data) => {
    // Calculate derived data
    const monthlyPayment = calculatePayment(data)
    return { ...data, monthlyPayment }
  }
}

// Async version
{
  id: 'enrichment',
  title: 'Enrich Data',
  onEnter: async (data) => {
    const extra = await fetchExtraData(data.id)
    return { ...data, ...extra }
  }
}`}
                language="typescript"
                className="mb-3"
              />
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Called before step becomes active</li>
                <li>• Can modify/extend data</li>
                <li>• Supports async operations</li>
                <li>• Return value is merged into wizard data</li>
              </ul>
            </div>

            {/* onLeave */}
            <div className="p-5 rounded-xl border border-border bg-card">
              <div className="flex items-center gap-2 mb-3">
                <h3 className="text-xl font-semibold text-primary">onLeave</h3>
                <span className="px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-500 text-xs font-medium">optional</span>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Callback when leaving this step
              </p>
              <CodeBlock
                code={`{
  id: 'upload',
  title: 'Upload Files',
  onLeave: async (data) => {
    // Clean up temporary data
    if (data.tempFiles) {
      await cleanupTempFiles(data.tempFiles)
    }
  }
}

{
  id: 'analytics',
  title: 'Complete',
  onLeave: (data) => {
    // Track step completion
    analytics.track('step_completed', {
      step: 'analytics',
      data
    })
  }
}`}
                language="typescript"
                className="mb-3"
              />
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Called when navigating away from step</li>
                <li>• Supports async operations</li>
                <li>• Cannot modify data (use onEnter for that)</li>
                <li>• Good for cleanup and analytics</li>
              </ul>
            </div>

            {/* meta */}
            <div className="p-5 rounded-xl border border-border bg-card">
              <div className="flex items-center gap-2 mb-3">
                <h3 className="text-xl font-semibold text-primary">meta</h3>
                <span className="px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-500 text-xs font-medium">optional</span>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Additional metadata for the step
              </p>
              <CodeBlock
                code={`{
  id: 'confirmation',
  title: 'Confirm Order',
  meta: {
    icon: 'check-circle',
    color: 'green',
    showSummary: true,
    estimatedTime: '2 min'
  }
}

// Usage in components
const step = wizard.currentStep
console.log(step.meta?.icon)  // 'check-circle'`}
                language="typescript"
                className="mb-3"
              />
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Arbitrary key-value pairs</li>
                <li>• Useful for UI hints and custom behavior</li>
                <li>• Accessible via <code>wizard.currentStep.meta</code></li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Examples</h2>

          <h3 className="text-xl font-semibold mb-4">Basic Step</h3>
          <CodeBlock
            code={`const basicStep = {
  id: 'welcome',
  title: 'Welcome'
}`}
            language="typescript"
            className="mb-6"
          />

          <h3 className="text-xl font-semibold mb-4">Step with Validation</h3>
          <CodeBlock
            code={`const validatedStep = {
  id: 'email',
  title: 'Email Address',
  description: 'We\'ll send your confirmation here',
  validation: {
    email: {
      required: true,
      email: true
    }
  }
}`}
            language="typescript"
            className="mb-6"
          />

          <h3 className="text-xl font-semibold mb-4">Conditional Step</h3>
          <CodeBlock
            code={`interface FormData {
  hasInsurance: boolean
  insuranceProvider?: string
}

const conditionalStep = {
  id: 'insurance-details',
  title: 'Insurance Information',
  isActive: (data: FormData) => data.hasInsurance === true,
  validation: {
    insuranceProvider: { required: true }
  }
}`}
            language="typescript"
            className="mb-6"
          />

          <h3 className="text-xl font-semibold mb-4">Step with Lifecycle Hooks</h3>
          <CodeBlock
            code={`const stepWithHooks = {
  id: 'enrichment',
  title: 'Data Enrichment',
  onEnter: async (data) => {
    // Fetch additional data based on user input
    const response = await fetch(\`/api/enrich/\${data.zipCode}\`)
    const enriched = await response.json()
    return { ...data, city: enriched.city, state: enriched.state }
  },
  onLeave: (data) => {
    // Track that user saw this step
    analytics.track('step_viewed', { step: 'enrichment' })
  }
}`}
            language="typescript"
            className="mb-6"
          />

          <h3 className="text-xl font-semibold mb-4">Step with Metadata</h3>
          <CodeBlock
            code={`const stepWithMeta = {
  id: 'payment',
  title: 'Payment Method',
  description: 'Choose how you want to pay',
  meta: {
    category: 'checkout',
    estimatedTime: '3 min',
    icon: 'credit-card',
    requiresAuth: true,
    skipIfGuest: false
  }
}`}
            language="typescript"
          />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Validation Schema</h2>
          <p className="text-muted-foreground mb-4">
            The <code>validation</code> property uses a validation schema where each key corresponds
            to a field in your data:
          </p>
          <CodeBlock
            code={`interface ValidationSchema<TData = Record<string, unknown>> {
  [field: string]: ValidationRule | ValidationRule[]
}

interface ValidationRule {
  // Built-in rules
  required?: boolean
  email?: boolean
  url?: boolean
  min?: number
  max?: number
  minLength?: number
  maxLength?: number
  pattern?: RegExp

  // Custom validators
  validate?: (value: unknown, data: TData) => boolean | string | Promise<boolean | string>
  message?: string
}`}
            language="typescript"
            filename="validation-schema.ts"
            className="mb-4"
          />
          <p className="text-muted-foreground">
            See <Link to="/docs/validation" className="text-primary hover:underline">Validation documentation</Link> for detailed examples.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">TypeScript Support</h2>
          <p className="text-muted-foreground mb-4">
            Steps are fully typed when using generics with <code>createWizard</code>:
          </p>
          <CodeBlock
            code={`interface FormData {
  name: string
  email: string
  age: number
}

const wizard = createWizard<FormData>({
  steps: [
    {
      id: 'info',
      title: 'Information',
      // 'data' parameter is fully typed
      isActive: (data) => data.age >= 18,
      onEnter: (data) => {
        // Autocomplete works on 'data'
        return {
          ...data,
          processed: true
        }
      },
      validation: {
        // Fields are type-checked
        name: { required: true },
        age: { min: 18 }
      }
    }
  ]
})`}
            language="typescript"
          />
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
            <Link to="/api/wizard-instance" className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-accent transition-colors">
              <div>
                <div className="font-medium">Wizard Instance</div>
                <div className="text-sm text-muted-foreground">Methods and properties</div>
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
            <Link to="/docs/steps" className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-accent transition-colors">
              <div>
                <div className="font-medium">Steps Guide</div>
                <div className="text-sm text-muted-foreground">Working with steps</div>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </Link>
          </div>
        </section>
      </article>
    </div>
  )
}
