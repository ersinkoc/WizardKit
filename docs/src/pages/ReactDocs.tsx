import './ReactDocs.css'

function ReactDocs() {
  return (
    <div className="page react-docs">
      <h1>React Adapter</h1>

      <section className="installation">
        <h2>Installation</h2>
        <p>Install the React adapter:</p>
        <pre><code>npm install @oxog/wizardkit-react</code></pre>
      </section>

      <section className="basic-usage">
        <h2>Basic Usage</h2>
        <p>Use the <code>useWizard</code> hook in your components:</p>
        <pre><code>{`import { useWizard } from '@oxog/wizardkit-react'

function MyWizard() {
  const wizard = useWizard({
    steps: [
      { id: 'name', title: 'Your Name' },
      { id: 'email', title: 'Your Email' },
      { id: 'confirm', title: 'Confirm' },
    ],
  })

  return (
    <div>
      <h1>{wizard.currentStep.title}</h1>
      <button onClick={wizard.prev} disabled={wizard.isFirst}>
        Previous
      </button>
      <button onClick={wizard.next} disabled={wizard.isLast}>
        {wizard.isLast ? 'Complete' : 'Next'}
      </button>
    </div>
  )
}`}</code></pre>
      </section>

      <section className="with-forms">
        <h2>Working with Forms</h2>
        <p>Combine WizardKit with form libraries:</p>
        <pre><code>{`import { useWizard } from '@oxog/wizardkit-react'
import { useForm } from 'react-hook-form'

function FormWizard() {
  const wizard = useWizard({
    steps: [
      { id: 'personal', title: 'Personal Info' },
      { id: 'address', title: 'Address' },
      { id: 'confirm', title: 'Confirm' },
    ],
  })

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: wizard.data,
  })

  const onSubmit = (data) => {
    wizard.setData(data)
    if (wizard.isLast) {
      wizard.complete()
    } else {
      wizard.next()
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2>{wizard.currentStep.title}</h2>

      {wizard.currentStep.id === 'personal' && (
        <>
          <input {...register('firstName')} placeholder="First Name" />
          <input {...register('lastName')} placeholder="Last Name" />
        </>
      )}

      {wizard.currentStep.id === 'address' && (
        <>
          <input {...register('street')} placeholder="Street" />
          <input {...register('city')} placeholder="City" />
        </>
      )}

      {wizard.currentStep.id === 'confirm' && (
        <div>
          <p>First Name: {wizard.data.firstName}</p>
          <p>Last Name: {wizard.data.lastName}</p>
        </div>
      )}

      <button type="button" onClick={wizard.prev} disabled={wizard.isFirst}>
        Previous
      </button>
      <button type="submit">
        {wizard.isLast ? 'Complete' : 'Next'}
      </button>
    </form>
  )
}`}</code></pre>
      </section>

      <section className="wizard-provider">
        <h2>WizardProvider</h2>
        <p>Share wizard state across components:</p>
        <pre><code>{`import { WizardProvider, useWizard } from '@oxog/wizardkit-react'

function App() {
  return (
    <WizardProvider
      steps={[
        { id: 'step1', title: 'Step 1' },
        { id: 'step2', title: 'Step 2' },
      ]}
    >
      <Wizard />
    </WizardProvider>
  )
}

function Wizard() {
  const wizard = useWizard()

  return (
    <div>
      <ProgressBar />
      <StepContent />
      <Navigation />
    </div>
  )
}

function ProgressBar() {
  const { progress } = useWizard()
  return <div>Progress: {progress.percentage}%</div>
}

function StepContent() {
  const { currentStep } = useWizard()
  return <h1>{currentStep.title}</h1>
}

function Navigation() {
  const { prev, next, isFirst, isLast } = useWizard()
  return (
    <div>
      <button onClick={prev} disabled={isFirst}>Previous</button>
      <button onClick={next}>{isLast ? 'Complete' : 'Next'}</button>
    </div>
  )
}`}</code></pre>
      </section>

      <section className="hooks">
        <h2>Available Hooks</h2>

        <div className="hook">
          <h3>useWizard</h3>
          <p>Access wizard instance (must be used inside WizardProvider or with config).</p>
          <pre><code>{`const wizard = useWizard()`}</code></pre>
          <p className="returns">Returns: <code>WizardInstance&lt;TData&gt;</code></p>
        </div>

        <div className="hook">
          <h3>useWizardState</h3>
          <p>Subscribe to wizard state changes.</p>
          <pre><code>{`const state = useWizardState()`}</code></pre>
          <p className="returns">Returns: <code>WizardState&lt;TData&gt;</code></p>
        </div>

        <div className="hook">
          <h3>useWizardData</h3>
          <p>Subscribe to wizard data changes.</p>
          <pre><code>{`const data = useWizardData()`}</code></pre>
          <p className="returns">Returns: <code>TData</code></p>
        </div>

        <div className="hook">
          <h3>useWizardStep</h3>
          <p>Subscribe to current step changes.</p>
          <pre><code>{`const step = useWizardStep()`}</code></pre>
          <p className="returns">Returns: <code>Step</code></p>
        </div>
      </section>

      <section className="components">
        <h2>Built-in Components</h2>

        <div className="component">
          <h3>WizardProgress</h3>
          <p>Display progress bar or stepper.</p>
          <pre><code>{`import { WizardProgress } from '@oxog/wizardkit-react'

<WizardProgress variant="bar" />
<WizardProgress variant="stepper" />`}</code></pre>
        </div>

        <div className="component">
          <h3>WizardStep</h3>
          <p>Conditional rendering based on current step.</p>
          <pre><code>{`import { WizardStep } from '@oxog/wizardkit-react'

<WizardStep id="personal">
  <PersonalInfoForm />
</WizardStep>

<WizardStep id="address">
  <AddressForm />
</WizardStep>`}</code></pre>
        </div>
      </section>

      <section className="typescript">
        <h2>TypeScript Support</h2>
        <p>Full TypeScript support with generics:</p>
        <pre><code>{`interface WizardData {
  firstName: string
  lastName: string
  email: string
}

function MyWizard() {
  const wizard = useWizard<WizardData>({
    steps: [
      { id: 'name', title: 'Name' },
      { id: 'email', title: 'Email' },
    ],
    initialData: {
      firstName: '',
      lastName: '',
      email: '',
    },
  })

  // Fully typed!
  wizard.setField('email', 'test@example.com')
  const email: string = wizard.data.email
}`}</code></pre>
      </section>

      <section className="examples">
        <h2>Complete Example</h2>
        <pre><code>{`import { WizardProvider, useWizard, WizardProgress } from '@oxog/wizardkit/react'
import { useForm } from 'react-hook-form'

interface FormData {
  name: string
  email: string
  address: string
}

function App() {
  return (
    <WizardProvider<FormData>
      steps={[
        {
          id: 'name',
          title: 'Your Name',
          validate: {
            name: (value) => !value && 'Name is required',
          },
        },
        {
          id: 'email',
          title: 'Your Email',
          validate: {
            email: (value) => !/@/.test(value) && 'Invalid email',
          },
        },
        {
          id: 'address',
          title: 'Your Address',
        },
        {
          id: 'confirm',
          title: 'Confirm',
        },
      ]}
      initialData={{
        name: '',
        email: '',
        address: '',
      }}
    >
      <Wizard />
    </WizardProvider>
  )
}

function Wizard() {
  const { register, handleSubmit } = useForm<FormData>()
  const wizard = useWizard<FormData>()

  const onSubmit = (data: FormData) => {
    wizard.setData(data)
    if (wizard.isLast) {
      wizard.complete()
    } else {
      wizard.next()
    }
  }

  return (
    <div className="wizard">
      <WizardProgress variant="stepper" />

      <form onSubmit={handleSubmit(onSubmit)}>
        <h1>{wizard.currentStep.title}</h1>

        {wizard.currentStep.id === 'name' && (
          <input {...register('name')} placeholder="Your Name" />
        )}

        {wizard.currentStep.id === 'email' && (
          <input {...register('email')} placeholder="Your Email" />
        )}

        {wizard.currentStep.id === 'address' && (
          <input {...register('address')} placeholder="Your Address" />
        )}

        {wizard.currentStep.id === 'confirm' && (
          <div>
            <p>Name: {wizard.data.name}</p>
            <p>Email: {wizard.data.email}</p>
            <p>Address: {wizard.data.address}</p>
          </div>
        )}

        {wizard.errors && (
          <div className="errors">
            {Object.entries(wizard.errors).map(([field, error]) => (
              <p key={field}>{error}</p>
            ))}
          </div>
        )}

        <div className="buttons">
          <button type="button" onClick={wizard.prev} disabled={wizard.isFirst}>
            Previous
          </button>
          <button type="submit">
            {wizard.isLast ? 'Complete' : 'Next'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default App`}</code></pre>
      </section>
    </div>
  )
}

export default ReactDocs
