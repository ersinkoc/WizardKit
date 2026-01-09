import { CodeBlock } from '@/components/code/CodeBlock'

export function React() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <article className="prose prose-slate dark:prose-invert max-w-none">
        <h1 className="text-4xl font-bold mb-4">React Integration</h1>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Installation</h2>
          <CodeBlock
            code={`npm install @oxog/wizardkit/react`}
            language="bash"
          />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">useWizard Hook</h2>
          <CodeBlock
            code={`import { useWizard } from '@oxog/wizardkit/react'

function MyWizard() {
  const wizard = useWizard({
    steps: [
      { id: 'info', title: 'Information' },
      { id: 'confirm', title: 'Confirmation' },
    ],
    initialData: {
      name: '',
      email: '',
    },
  })

  return (
    <div>
      <h1>{wizard.currentStep.title}</h1>

      {wizard.currentIndex === 0 && (
        <InfoStep data={wizard.data} setData={wizard.setData} />
      )}

      {wizard.currentIndex === 1 && (
        <ConfirmStep data={wizard.data} />
      )}

      <button onClick={wizard.prev} disabled={!wizard.canGoPrev}>
        Previous
      </button>

      <button onClick={wizard.next} disabled={!wizard.canGoNext}>
        Next
      </button>

      <div>Progress: {wizard.progressPercent}%</div>
    </div>
  )
}`}
            language="tsx"
            filename="use-wizard.tsx"
          />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">With react-hook-form</h2>
          <CodeBlock
            code={`import { useWizard } from '@oxog/wizardkit/react'
import { useForm } from 'react-hook-form'

function MyWizard() {
  const wizard = useWizard({
    steps: [
      { id: 'info', title: 'Information' },
      { id: 'confirm', title: 'Confirmation' },
    ],
  })

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: wizard.data,
  })

  const onSubmit = (data) => {
    wizard.setData(data)
    wizard.next()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('name')} />
      {errors.name && <span>{errors.name.message}</span>}

      <input {...register('email')} />
      {errors.email && <span>{errors.email.message}</span>}

      <button type="submit">Next</button>
    </form>
  )
}`}
            language="tsx"
            filename="react-hook-form.tsx"
          />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">WizardProvider</h2>
          <CodeBlock
            code={`import { WizardProvider, useWizard } from '@oxog/wizardkit/react'

function App() {
  return (
    <WizardProvider
      steps={[
        { id: 'step1', title: 'Step 1' },
        { id: 'step2', title: 'Step 2' },
      ]}
    >
      <MyWizard />
    </WizardProvider>
  )
}

function MyWizard() {
  const wizard = useWizard()  // Gets wizard from context
  return (
    <div>
      <h1>{wizard.currentStep.title}</h1>
      <button onClick={wizard.next}>Next</button>
    </div>
  )
}`}
            language="tsx"
            filename="wizard-provider.tsx"
          />
        </section>
      </article>
    </div>
  )
}
