import { CodeBlock } from '@/components/code/CodeBlock'
import { Link } from 'react-router-dom'
import { ChevronRight, Zap, Users, ShoppingCart, FileText, Calculator } from 'lucide-react'
import { PACKAGE_NAME } from '@/lib/constants'

const examples = [
  {
    id: 'multi-step-form',
    title: 'Multi-Step Registration Form',
    description: 'Complete user registration with validation across multiple steps',
    icon: Users,
    difficulty: 'Beginner',
    category: 'Forms',
    code: `import { createWizard } from '${PACKAGE_NAME}'

interface UserData {
  username: string
  email: string
  password: string
  age: number
}

const wizard = createWizard<UserData>({
  steps: [
    {
      id: 'account',
      title: 'Account Details',
      validation: {
        username: { required: true, minLength: 3 },
        email: { required: true, email: true },
        password: { required: true, minLength: 8 }
      }
    },
    {
      id: 'profile',
      title: 'Profile Information',
      validation: {
        age: { required: true, min: 18, max: 120 }
      }
    },
    {
      id: 'review',
      title: 'Review & Submit'
    },
  ],
  linear: true,
  validateOnNext: true,
})

// Submit handler
wizard.on('complete', async ({ data }) => {
  const response = await fetch('/api/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })

  if (response.ok) {
    console.log('Registration successful!')
  }
})`,
    language: 'typescript'
  },
  {
    id: 'conditional-branching',
    title: 'Conditional Branching Wizard',
    description: 'Show different steps based on user selections',
    icon: Zap,
    difficulty: 'Intermediate',
    category: 'Advanced',
    code: `import { createWizard } from '${PACKAGE_NAME}'

interface SurveyData {
  userType: 'individual' | 'business'
  companyName?: string
  businessSize?: string
}

const wizard = createWizard<SurveyData>({
  steps: [
    {
      id: 'selection',
      title: 'Select User Type'
    },
    {
      id: 'business-info',
      title: 'Business Information',
      // Only show for business users
      isActive: (data) => data.userType === 'business'
    },
    {
      id: 'individual-info',
      title: 'Personal Information',
      // Only show for individual users
      isActive: (data) => data.userType === 'individual'
    },
    {
      id: 'complete',
      title: 'Complete'
    }
  ],
})

// When user type changes, wizard re-evaluates active steps
wizard.setField('userType', 'business')
// business-info step becomes active
// individual-info step becomes hidden`,
    language: 'typescript'
  },
  {
    id: 'ecommerce-checkout',
    title: 'E-commerce Checkout',
    description: 'Shopping cart checkout with shipping and payment',
    icon: ShoppingCart,
    difficulty: 'Intermediate',
    category: 'E-commerce',
    code: `import { createWizard } from '${PACKAGE_NAME}'

interface CheckoutData {
  items: CartItem[]
  shipping: ShippingInfo
  payment: PaymentInfo
}

const wizard = createWizard<CheckoutData>({
  steps: [
    { id: 'cart', title: 'Review Cart' },
    {
      id: 'shipping',
      title: 'Shipping Address',
      validation: {
        fullName: { required: true },
        address: { required: true },
        city: { required: true },
        zipCode: { required: true, pattern: /^\\d{5}$/ }
      }
    },
    {
      id: 'payment',
      title: 'Payment Method',
      validation: {
        cardNumber: { required: true, pattern: /^\\d{16}$/ },
        expiry: { required: true, pattern: /^(0[1-9]|1[0-2])\\/\\d{2}$/ },
        cvv: { required: true, pattern: /^\\d{3,4}$/ }
      }
    },
    {
      id: 'confirm',
      title: 'Confirm Order'
    }
  ],
  validateOnNext: true,
  persistKey: 'checkout-wizard',
})

// Auto-save progress
wizard.on('data:change', ({ data }) => {
  localStorage.setItem('checkout-draft', JSON.stringify(data))
})`,
    language: 'typescript'
  },
  {
    id: 'survey-wizard',
    title: 'Dynamic Survey Wizard',
    description: 'Survey with conditional questions based on answers',
    icon: FileText,
    difficulty: 'Intermediate',
    category: 'Surveys',
    code: `import { createWizard } from '${PACKAGE_NAME}'

interface SurveyData {
  satisfaction: number
  useCase: string
  features: string[]
  feedback: string
}

const wizard = createWizard<SurveyData>({
  steps: [
    {
      id: 'satisfaction',
      title: 'Overall Satisfaction',
      validation: {
        satisfaction: { required: true, min: 1, max: 5 }
      }
    },
    {
      id: 'use-case',
      title: 'Primary Use Case',
      isActive: (data) => data.satisfaction <= 3
    },
    {
      id: 'features',
      title: 'Feature Requests',
      isActive: (data) => data.satisfaction >= 4
    },
    {
      id: 'feedback',
      title: 'Additional Feedback'
    }
  ],
})

// Steps dynamically show/hide based on satisfaction rating`,
    language: 'typescript'
  },
  {
    id: 'loan-calculator',
    title: 'Loan Calculator Wizard',
    description: 'Calculate loan payments with step-by-step input',
    icon: Calculator,
    difficulty: 'Advanced',
    category: 'Finance',
    code: `import { createWizard } from '${PACKAGE_NAME}'

interface LoanData {
  amount: number
  term: number
  rate: number
  monthlyPayment?: number
}

const wizard = createWizard<LoanData>({
  steps: [
    {
      id: 'amount',
      title: 'Loan Amount',
      validation: {
        amount: { required: true, min: 1000, max: 1000000 }
      }
    },
    {
      id: 'term',
      title: 'Loan Term',
      validation: {
        term: { required: true, min: 12, max: 360 }
      }
    },
    {
      id: 'rate',
      title: 'Interest Rate',
      validation: {
        rate: { required: true, min: 0.1, max: 30 }
      }
    },
    {
      id: 'results',
      title: 'Your Payment',
      onEnter: (data) => {
        // Calculate monthly payment
        const P = data.amount
        const r = data.rate / 100 / 12
        const n = data.term
        const M = P * (r * (1 + r)^n) / ((1 + r)^n - 1)
        return { ...data, monthlyPayment: Math.round(M) }
      }
    }
  ],
})`,
    language: 'typescript'
  },
]

const categories = [...new Set(examples.map(e => e.category))]

export function Examples() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4">Examples</h1>
        <p className="text-xl text-muted-foreground">
          Practical examples to help you get started with {PACKAGE_NAME}
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button className="px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium">
          All
        </button>
        {categories.map((category) => (
          <button
            key={category}
            className="px-4 py-2 rounded-full border border-border hover:bg-accent text-sm font-medium transition-colors"
          >
            {category}
          </button>
        ))}
      </div>

      {/* Examples Grid */}
      <div className="grid gap-6">
        {examples.map((example) => {
          const Icon = example.icon
          return (
            <div
              key={example.id}
              className="border border-border rounded-xl p-6 hover:border-primary/50 transition-colors"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{example.title}</h3>
                    <p className="text-sm text-muted-foreground">{example.description}</p>
                  </div>
                </div>
                <span className="px-2 py-1 rounded-md bg-muted text-xs font-medium">
                  {example.difficulty}
                </span>
              </div>

              {/* Code Preview */}
              <div className="mt-4">
                <CodeBlock
                  code={example.code}
                  language={example.language}
                  showLineNumbers={false}
                />
              </div>

              {/* Actions */}
              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Category: {example.category}
                </span>
                <Link
                  to={`/playground?example=${example.id}`}
                  className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                >
                  Open in Playground
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          )
        })}
      </div>

      {/* Tips Section */}
      <div className="mt-16 p-6 rounded-xl bg-muted/50 border border-border">
        <h3 className="text-lg font-semibold mb-3">Pro Tips</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="text-primary">•</span>
            <span>Use TypeScript generics for full type safety on your data</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary">•</span>
            <span>Enable persistence to auto-save user progress</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary">•</span>
            <span>Use conditional steps to show/hide based on user input</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary">•</span>
            <span>Listen to events for analytics and tracking</span>
          </li>
        </ul>
      </div>
    </div>
  )
}
