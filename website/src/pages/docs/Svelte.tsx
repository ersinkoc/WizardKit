import { CodeBlock } from '@/components/code/CodeBlock'

export function Svelte() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <article className="prose prose-slate dark:prose-invert max-w-none">
        <h1 className="text-4xl font-bold mb-4">Svelte Integration</h1>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Installation</h2>
          <CodeBlock
            code={`npm install @oxog/wizardkit/svelte`}
            language="bash"
          />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Wizard Store</h2>
          <CodeBlock
            code={`<!-- Wizard.svelte -->
<script lang="ts">
  import { createWizard } from '@oxog/wizardkit'
  import { setWizardStore } from '@oxog/wizardkit/svelte'

  const wizard = createWizard({
    steps: [
      { id: 'info', title: 'Information' },
      { id: 'confirm', title: 'Confirmation' },
    ],
    initialData: {
      name: '',
      email: '',
    },
  })

  setWizardStore(wizard)
</script>

<!-- App.svelte -->
<script lang="ts">
  import { wizard } from '@oxog/wizardkit/svelte'
</script>

<h1>{$wizard.currentStep.title}</h1>

{#if $wizard.currentIndex === 0}
  <InfoStep data={$wizard.data} />
{/if}

{#if $wizard.currentIndex === 1}
  <ConfirmStep data={$wizard.data} />
{/if}

<button on:click={() => $wizard.prev()} disabled={!$wizard.canGoPrev}>
  Previous
</button>

<button on:click={() => $wizard.next()} disabled={!$wizard.canGoNext}>
  Next
</button>

<div>Progress: {$wizard.progressPercent}%</div>`}
            language="svelte"
            filename="wizard.svelte"
          />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">With Felte (Form Validation)</h2>
          <CodeBlock
            code={`<!-- FormStep.svelte -->
<script lang="ts">
  import { wizard } from '@oxog/wizardkit/svelte'
  import { form, fields } from 'felte'

  const { form: formElement } = form({
    initialValues: $wizard.data,
    onSubmit: (values) => {
      $wizard.setData(values)
      $wizard.next()
    },
  })

  const { nameField, emailField } = fields({
    name: {
      validator: (value) => value.length >= 2 || 'Name too short',
    },
    email: {
      validator: (value) => /^[^@]+@[^@]+$/.test(value) || 'Invalid email',
    },
  })
</script>

<form use:formElement>
  <input use:nameField name="name" />
  <span>{nameField.error}</span>

  <input use:emailField name="email" />
  <span>{emailField.error}</span>

  <button type="submit">Next</button>
</form>`}
            language="svelte"
            filename="felte-form.svelte"
          />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Action Directive</h2>
          <CodeBlock
            code={`<script lang="ts">
  import { createWizard, next, prev } from '@oxog/wizardkit'
  import { wizardAction } from '@oxog/wizardkit/svelte'

  const wizard = createWizard({
    steps: [
      { id: 'step1', title: 'Step 1' },
      { id: 'step2', title: 'Step 2' },
    ],
  })
</script>

<button use:wizardAction={next}>
  Next Step
</button>

<button use:wizardAction={prev}>
  Previous
</button>`}
            language="svelte"
            filename="wizard-action.svelte"
          />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Complete Example</h2>
          <CodeBlock
            code={`<!-- +page.svelte (SvelteKit) -->
<script lang="ts">
  import { createWizard } from '@oxog/wizardkit'
  import { setWizardStore } from '@oxog/wizardkit/svelte'
  import { onMount } from 'svelte'

  let wizardStore

  onMount(() => {
    const wizard = createWizard({
      steps: [
        { id: 'account', title: 'Account' },
        { id: 'profile', title: 'Profile' },
        { id: 'preferences', title: 'Preferences' },
      ],
      initialData: {
        username: '',
        email: '',
        bio: '',
      },
      persistKey: 'signup-wizard',
      persistStorage: 'local',
    })

    setWizardStore(wizard)
    wizardStore = wizard
  })
</script>

{#if $wizardStore}
  <WizardProgress />
  <WizardSteps />
  <WizardContent />
{/if}`}
            language="svelte"
            filename="sveltekit-page.svelte"
          />
        </section>
      </article>
    </div>
  )
}
