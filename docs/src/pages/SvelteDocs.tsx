import './SvelteDocs.css'

function SvelteDocs() {
  return (
    <div className="page svelte-docs">
      <h1>Svelte Adapter</h1>

      <section className="installation">
        <h2>Installation</h2>
        <p>Install the Svelte adapter:</p>
        <pre><code>npm install @oxog/wizardkit-svelte</code></pre>
      </section>

      <section className="basic-usage">
        <h2>Basic Usage</h2>
        <p>Use the wizard store in your components:</p>
        <pre><code>{`<script>
import { useWizard } from '@oxog/wizardkit-svelte'

const wizard = useWizard({
  steps: [
    { id: 'name', title: 'Your Name' },
    { id: 'email', title: 'Your Email' },
    { id: 'confirm', title: 'Confirm' },
  ],
})
</script>

<div>
  <h1>{$wizard.currentStep.title}</h1>
  <button on:click={wizard.prev} disabled={$wizard.isFirst}>
    Previous
  </button>
  <button on:click={wizard.next} disabled={$wizard.isLast}>
    {$wizard.isLast ? 'Complete' : 'Next'}
  </button>
</div>`}</code></pre>
      </section>

      <section className="with-forms">
        <h2>Working with Forms</h2>
        <p>Combine WizardKit with form libraries:</p>
        <pre><code>{`<script>
import { useWizard } from '@oxog/wizardkit-svelte'
import { useForm } from 'svelte-bindings'

const wizard = useWizard({
  steps: [
    { id: 'personal', title: 'Personal Info' },
    { id: 'address', title: 'Address' },
    { id: 'confirm', title: 'Confirm' },
  ],
})

let firstName = ''
let lastName = ''

function handleSubmit() {
  wizard.setData({ firstName, lastName })
  if ($wizard.isLast) {
    wizard.complete()
  } else {
    wizard.next()
  }
}
</script>

<form on:submit|preventDefault={handleSubmit}>
  <h2>{$wizard.currentStep.title}</h2>

  {#if $wizard.currentStep.id === 'personal'}
    <input bind:value={firstName} placeholder="First Name" />
    <input bind:value={lastName} placeholder="Last Name" />
  {/if}

  {#if $wizard.currentStep.id === 'address'}
    <input bind:value={$wizard.data.street} placeholder="Street" />
    <input bind:value={$wizard.data.city} placeholder="City" />
  {/if}

  {#if $wizard.currentStep.id === 'confirm'}
    <p>First Name: {$wizard.data.firstName}</p>
    <p>Last Name: {$wizard.data.lastName}</p>
  {/if}

  <button type="button" on:click={wizard.prev} disabled={$wizard.isFirst}>
    Previous
  </button>
  <button type="submit">
    {$wizard.isLast ? 'Complete' : 'Next'}
  </button>
</form>`}</code></pre>
      </section>

      <section className="stores">
        <h2>Available Stores</h2>

        <div className="store">
          <h3>useWizard</h3>
          <p>Access wizard instance (returns a readable store).</p>
          <pre><code>{`const wizard = useWizard()`}</code></pre>
          <p className="returns">Returns: <code>Readable&lt;WizardInstance&lt;TData&gt;&gt;</code></p>
        </div>

        <div className="store">
          <h3>wizardState</h3>
          <p>Subscribe to wizard state changes.</p>
          <pre><code>{`import { wizardState } from '@oxog/wizardkit-svelte'`}</code></pre>
          <p className="returns">Returns: <code>Readable&lt;WizardState&lt;TData&gt;&gt;</code></p>
        </div>

        <div className="store">
          <h3>wizardData</h3>
          <p>Subscribe to wizard data changes.</p>
          <pre><code>{`import { wizardData } from '@oxog/wizardkit-svelte'`}</code></pre>
          <p className="returns">Returns: <code>Readable&lt;TData&gt;</code></p>
        </div>

        <div className="store">
          <h3>wizardStep</h3>
          <p>Subscribe to current step changes.</p>
          <pre><code>{`import { wizardStep } from '@oxog/wizardkit-svelte'`}</code></pre>
          <p className="returns">Returns: <code>Readable&lt;Step&gt;</code></p>
        </div>

        <div className="store">
          <h3>wizardProgress</h3>
          <p>Subscribe to progress changes.</p>
          <pre><code>{`import { wizardProgress } from '@oxog/wizardkit-svelte'`}</code></pre>
          <p className="returns">Returns: <code>{'Readable<{ index: number; total: number; percentage: number }>'}</code></p>
        </div>

        <div className="store">
          <h3>wizardErrors</h3>
          <p>Subscribe to validation errors.</p>
          <pre><code>{`import { wizardErrors } from '@oxog/wizardkit-svelte'`}</code></pre>
          <p className="returns">Returns: <code>Readable&lt;ValidationErrors | null&gt;</code></p>
        </div>
      </section>

      <section className="actions">
        <h2>Actions</h2>

        <div className="action">
          <h3>next</h3>
          <p>Move to the next step.</p>
          <pre><code>{`import { next } from '@oxog/wizardkit-svelte'

next()`}</code></pre>
        </div>

        <div className="action">
          <h3>prev</h3>
          <p>Move to the previous step.</p>
          <pre><code>{`import { prev } from '@oxog/wizardkit-svelte'

prev()`}</code></pre>
        </div>

        <div className="action">
          <h3>goTo</h3>
          <p>Jump to a specific step by ID.</p>
          <pre><code>{`import { goTo } from '@oxog/wizardkit-svelte'

goTo('address')`}</code></pre>
        </div>

        <div className="action">
          <h3>setData</h3>
          <p>Set wizard data.</p>
          <pre><code>{`import { setData } from '@oxog/wizardkit-svelte'

setData({ firstName: 'John' })`}</code></pre>
        </div>

        <div className="action">
          <h3>setField</h3>
          <p>Set a single field value.</p>
          <pre><code>{`import { setField } from '@oxog/wizardkit-svelte'

setField('email', 'john@example.com')`}</code></pre>
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
setField<WizardData>('email', 'test@example.com')
const email: string = $wizard.data.email`}</code></pre>
      </section>

      <section className="examples">
        <h2>Complete Example</h2>
        <pre><code>{`<script lang="ts">
import { useWizard, wizardProgress } from '@oxog/wizardkit-svelte'

interface FormData {
  name: string
  email: string
  address: string
}

const wizard = useWizard<FormData>({
  steps: [
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
  ],
  initialData: {
    name: '',
    email: '',
    address: '',
  },
})

const progress = wizardProgress()

function handleSubmit() {
  if ($wizard.isLast) {
    wizard.complete()
  } else {
    wizard.next()
  }
}
</script>

<div class="wizard">
  <div class="progress">
    Progress: {$progress.percentage}%
  </div>

  <form on:submit|preventDefault={handleSubmit}>
    <h1>{$wizard.currentStep.title}</h1>

    {#if $wizard.currentStep.id === 'name'}
      <input bind:value={$wizard.data.name} placeholder="Your Name" />
    {/if}

    {#if $wizard.currentStep.id === 'email'}
      <input bind:value={$wizard.data.email} placeholder="Your Email" />
    {/if}

    {#if $wizard.currentStep.id === 'address'}
      <input bind:value={$wizard.data.address} placeholder="Your Address" />
    {/if}

    {#if $wizard.currentStep.id === 'confirm'}
      <p>Name: {$wizard.data.name}</p>
      <p>Email: {$wizard.data.email}</p>
      <p>Address: {$wizard.data.address}</p>
    {/if}

    {#if $wizard.errors}
      <div class="errors">
        {#each Object.entries($wizard.errors) as [field, error]}
          <p>{error}</p>
        {/each}
      </div>
    {/if}

    <div class="buttons">
      <button type="button" on:click={wizard.prev} disabled={$wizard.isFirst}>
        Previous
      </button>
      <button type="submit">
        {$wizard.isLast ? 'Complete' : 'Next'}
      </button>
    </div>
  </form>
</div>

<style>
  .wizard {
    max-width: 500px;
    margin: 0 auto;
    padding: 20px;
  }

  .progress {
    margin-bottom: 20px;
    padding: 10px;
    background: #f0f0f0;
    border-radius: 4px;
  }

  input {
    width: 100%;
    padding: 10px;
    margin-bottom: 15px;
    border: 1px solid #ddd;
    border-radius: 4px;
  }

  .errors {
    color: red;
    margin-bottom: 15px;
  }

  .buttons {
    display: flex;
    gap: 10px;
  }

  button {
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    background: #667eea;
    color: white;
    cursor: pointer;
  }

  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
</style>`}</code></pre>
      </section>
    </div>
  )
}

export default SvelteDocs
