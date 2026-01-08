import './Examples.css'

function Examples() {
  return (
    <div className="page examples">
      <h1>Examples</h1>

      <section className="example">
        <h2>Multi-Step Form</h2>
        <p className="description">A complete registration wizard with validation.</p>
        <pre><code>{`import { createWizard } from '@oxog/wizardkit'

const wizard = createWizard({
  steps: [
    {
      id: 'account',
      title: 'Account Information',
      validate: {
        email: (value) => {
          if (!value) return 'Email is required'
          if (!/@/.test(value)) return 'Invalid email format'
        },
        password: (value) => {
          if (!value) return 'Password is required'
          if (value.length < 8) return 'Password must be at least 8 characters'
        },
      },
    },
    {
      id: 'personal',
      title: 'Personal Information',
      validate: {
        firstName: (value) => !value && 'First name is required',
        lastName: (value) => !value && 'Last name is required',
      },
    },
    {
      id: 'address',
      title: 'Address',
      validate: {
        street: (value) => !value && 'Street is required',
        city: (value) => !value && 'City is required',
        zipCode: (value) => !value && 'Zip code is required',
      },
    },
    {
      id: 'confirm',
      title: 'Confirm',
    },
  ],
  initialData: {
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    street: '',
    city: '',
    zipCode: '',
  },
})

wizard.on('complete', ({ data }) => {
  console.log('Registration complete:', data)
  // Send data to your API
})`}</code></pre>
      </section>

      <section className="example">
        <h2>Conditional Branching</h2>
        <p className="description">Show different steps based on user selection.</p>
        <pre><code>{`const wizard = createWizard({
  steps: [
    {
      id: 'user-type',
      title: 'Choose User Type',
    },
    {
      id: 'personal',
      title: 'Personal Information',
    },
    {
      id: 'company',
      title: 'Company Information',
      condition: (data) => data.userType === 'business',
    },
    {
      id: 'payment-personal',
      title: 'Payment',
      condition: (data) => data.userType === 'personal',
    },
    {
      id: 'payment-business',
      title: 'Business Payment',
      condition: (data) => data.userType === 'business',
    },
    {
      id: 'confirm',
      title: 'Confirm',
    },
  ],
  initialData: {
    userType: '',
  },
})`}</code></pre>
      </section>

      <section className="example">
        <h2>Dynamic Step Branches</h2>
        <p className="description">Route to different steps based on conditions.</p>
        <pre><code>{`const wizard = createWizard({
  steps: [
    {
      id: 'start',
      title: 'Start',
      branches: {
        premium: {
          condition: (data) => data.plan === 'premium',
          nextStep: 'payment-premium',
        },
        free: {
          condition: (data) => data.plan === 'free',
          nextStep: 'confirm',
        },
      },
    },
    {
      id: 'payment-premium',
      title: 'Premium Payment',
    },
    {
      id: 'confirm',
      title: 'Confirm',
    },
  ],
  initialData: {
    plan: '',
  },
})`}</code></pre>
      </section>

      <section className="example">
        <h2>E-commerce Checkout</h2>
        <p className="description">Complete checkout flow with cart review.</p>
        <pre><code>{`import { createWizard } from '@oxog/wizardkit'

const wizard = createWizard({
  steps: [
    {
      id: 'cart',
      title: 'Review Cart',
      onEnter: (data) => {
        // Fetch cart items from API
        fetch('/api/cart')
          .then(res => res.json())
          .then(items => {
            wizard.setData({ items })
          })
      },
    },
    {
      id: 'shipping',
      title: 'Shipping Information',
      validate: {
        address: (value) => !value && 'Address is required',
        city: (value) => !value && 'City is required',
        country: (value) => !value && 'Country is required',
      },
    },
    {
      id: 'billing',
      title: 'Billing Information',
      condition: (data) => data.sameAsShipping !== true,
      validate: {
        cardNumber: (value) => !value && 'Card number is required',
        expiry: (value) => !value && 'Expiry date is required',
        cvv: (value) => !value && 'CVV is required',
      },
    },
    {
      id: 'review',
      title: 'Review Order',
      beforeLeave: async (data) => {
        // Confirm order before completion
        const confirmed = confirm('Place your order?')
        return { block: !confirmed }
      },
    },
    {
      id: 'confirmation',
      title: 'Order Confirmed',
    },
  ],
  initialData: {
    items: [],
    sameAsShipping: false,
  },
})

wizard.on('complete', async ({ data }) => {
  // Process payment and create order
  const response = await fetch('/api/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  const order = await response.json()
  console.log('Order created:', order.id)
})`}</code></pre>
      </section>

      <section className="example">
        <h2>Survey Wizard</h2>
        <p className="description">Multi-step survey with progress tracking.</p>
        <pre><code>{`const wizard = createWizard({
  steps: [
    {
      id: 'demographics',
      title: 'Demographics',
    },
    {
      id: 'interests',
      title: 'Interests & Hobbies',
    },
    {
      id: 'experience',
      title: 'Experience Level',
    },
    {
      id: 'goals',
      title: 'Your Goals',
    },
    {
      id: 'feedback',
      title: 'Additional Feedback',
    },
    {
      id: 'thank-you',
      title: 'Thank You!',
    },
  ],
  initialData: {
    age: '',
    interests: [],
    experience: '',
    goals: '',
    feedback: '',
  },
})

// Track progress for analytics
wizard.on('step:change', ({ step }) => {
  analytics.track('Survey Progress', {
    step: step.id,
    title: step.title,
  })
})`}</code></pre>
      </section>

      <section className="example">
        <h2>Onboarding Flow</h2>
        <p className="description">User onboarding with optional steps.</p>
        <pre><code>{`const wizard = createWizard({
  steps: [
    {
      id: 'welcome',
      title: 'Welcome!',
      canSkip: true,
    },
    {
      id: 'profile',
      title: 'Setup Profile',
    },
    {
      id: 'preferences',
      title: 'Preferences',
      canSkip: true,
    },
    {
      id: 'notifications',
      title: 'Notification Settings',
      canSkip: true,
    },
    {
      id: 'invite-team',
      title: 'Invite Team Members',
      canSkip: true,
    },
    {
      id: 'complete',
      title: 'All Done!',
    },
  ],
  initialData: {
    name: '',
    avatar: '',
    theme: 'light',
    notifications: true,
    invites: [],
  },
  persistence: {
    enabled: true,
    key: 'onboarding-wizard',
    storage: 'sessionStorage',
  },
})`}</code></pre>
      </section>

      <section className="example">
        <h2>Async Validation</h2>
        <p className="description">Validate data against an API.</p>
        <pre><code>{`const wizard = createWizard({
  steps: [
    {
      id: 'username',
      title: 'Choose Username',
      validate: {
        username: async (value) => {
          if (!value) return 'Username is required'
          if (value.length < 3) return 'Username must be at least 3 characters'

          // Check availability via API
          const response = await fetch(\`/api/check-username?\${value}\`)
          const data = await response.json()

          if (!data.available) {
            return 'Username is already taken'
          }
        },
      },
    },
    {
      id: 'email',
      title: 'Email',
      validate: {
        email: async (value) => {
          if (!value) return 'Email is required'

          // Verify email via API
          const response = await fetch('/api/verify-email', {
            method: 'POST',
            body: JSON.stringify({ email: value }),
          })
          const data = await response.json()

          if (!data.valid) {
            return 'Email is invalid or already registered'
          }
        },
      },
    },
  ],
})`}</code></pre>
      </section>

      <section className="example">
        <h2>Wizard with Middleware</h2>
        <p className="description">Add logging and analytics middleware.</p>
        <pre><code>{`import { createWizard } from '@oxog/wizardkit'

const loggerMiddleware = {
  onEvent: (event, wizard) => {
    console.log('[Wizard Event]', event.type, event.payload)
  },
}

const analyticsMiddleware = {
  onEvent: (event, wizard) => {
    if (event.type === 'step:change') {
      analytics.track('Wizard Step Changed', {
        step: event.payload.step.id,
        direction: event.payload.direction,
      })
    }
    if (event.type === 'complete') {
      analytics.track('Wizard Completed', {
        data: event.payload.data,
      })
    }
  },
}

const wizard = createWizard({
  steps: [
    { id: 'step1', title: 'Step 1' },
    { id: 'step2', title: 'Step 2' },
    { id: 'step3', title: 'Step 3' },
  ],
  middleware: [loggerMiddleware, analyticsMiddleware],
})`}</code></pre>
      </section>

      <section className="example">
        <h2>Auto-save Wizard</h2>
        <p className="description">Automatically save progress to localStorage.</p>
        <pre><code>{`const wizard = createWizard({
  steps: [
    { id: 'step1', title: 'Step 1' },
    { id: 'step2', title: 'Step 2' },
    { id: 'step3', title: 'Step 3' },
  ],
  persistence: {
    enabled: true,
    key: 'my-wizard',
    storage: 'localStorage',
  },
})

// Progress is automatically saved
// When users return, they'll be on the same step with the same data

// Clear saved data when wizard is completed
wizard.on('complete', () => {
  wizard.clearPersistence()
})`}</code></pre>
      </section>

      <section className="example">
        <h2>Linear Navigation</h2>
        <p className="description">Restrict navigation to sequential steps only.</p>
        <pre><code>{`const wizard = createWizard({
  steps: [
    { id: 'step1', title: 'Step 1' },
    { id: 'step2', title: 'Step 2' },
    { id: 'step3', title: 'Step 3' },
    { id: 'step4', title: 'Step 4' },
  ],
  linear: true, // Only allow sequential navigation
})

// These will work:
wizard.next() // step1 -> step2
wizard.prev() // step2 -> step1

// This will fail (can't jump ahead):
wizard.goTo('step4') // false

// This will fail (step3 not reachable yet):
wizard.goTo('step3') // false`}</code></pre>
      </section>
    </div>
  )
}

export default Examples
