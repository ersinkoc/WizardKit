import './VueDocs.css'

function VueDocs() {
  return (
    <div className="page vue-docs">
      <h1>Vue Adapter</h1>

      <section className="installation">
        <h2>Installation</h2>
        <p>Install the Vue adapter:</p>
        <pre><code>npm install @oxog/wizardkit-vue</code></pre>
      </section>

      <section className="basic-usage">
        <h2>Basic Usage</h2>
        <p>Use the <code>useWizard</code> composable in your components:</p>
        <pre><code>{`<script setup>
import { useWizard } from '@oxog/wizardkit-vue'

const wizard = useWizard({
  steps: [
    { id: 'name', title: 'Your Name' },
    { id: 'email', title: 'Your Email' },
    { id: 'confirm', title: 'Confirm' },
  ],
})
</script>

<template>
  <div>
    <h1>{{ wizard.currentStep.title }}</h1>
    <button @click="wizard.prev" :disabled="wizard.isFirst">
      Previous
    </button>
    <button @click="wizard.next" :disabled="wizard.isLast">
      {{ wizard.isLast ? 'Complete' : 'Next' }}
    </button>
  </div>
</template>`}</code></pre>
      </section>

      <section className="with-forms">
        <h2>Working with Forms</h2>
        <p>Combine WizardKit with form libraries:</p>
        <pre><code>{`<script setup>
import { useWizard } from '@oxog/wizardkit-vue'
import { useForm } from 'vee-validate'

const wizard = useWizard({
  steps: [
    { id: 'personal', title: 'Personal Info' },
    { id: 'address', title: 'Address' },
    { id: 'confirm', title: 'Confirm' },
  ],
})

const { defineField, handleSubmit, errors } = useForm({
  validationSchema: wizard.currentStep.validate,
})

const [firstName] = defineField('firstName')
const [lastName] = defineField('lastName')

const onSubmit = handleSubmit((data) => {
  wizard.setData(data)
  if (wizard.isLast) {
    wizard.complete()
  } else {
    wizard.next()
  }
})
</script>

<template>
  <form @submit="onSubmit">
    <h2>{{ wizard.currentStep.title }}</h2>

    <div v-if="wizard.currentStep.id === 'personal'">
      <input v-model="firstName" placeholder="First Name" />
      <input v-model="lastName" placeholder="Last Name" />
    </div>

    <div v-if="wizard.currentStep.id === 'address'">
      <input v-model="wizard.data.street" placeholder="Street" />
      <input v-model="wizard.data.city" placeholder="City" />
    </div>

    <div v-if="wizard.currentStep.id === 'confirm'">
      <p>First Name: {{ wizard.data.firstName }}</p>
      <p>Last Name: {{ wizard.data.lastName }}</p>
    </div>

    <button type="button" @click="wizard.prev" :disabled="wizard.isFirst">
      Previous
    </button>
    <button type="submit">
      {{ wizard.isLast ? 'Complete' : 'Next' }}
    </button>
  </form>
</template>`}</code></pre>
      </section>

      <section className="wizard-plugin">
        <h2>Wizard Plugin</h2>
        <p>Share wizard state across components with the plugin:</p>
        <pre><code>{`// main.ts
import { createApp } from 'vue'
import { WizardPlugin } from '@oxog/wizardkit-vue'
import App from './App.vue'

const app = createApp(App)

app.use(WizardPlugin, {
  steps: [
    { id: 'step1', title: 'Step 1' },
    { id: 'step2', title: 'Step 2' },
  ],
})

app.mount('#app')`}</code></pre>

        <pre><code>{`<!-- App.vue -->
<script setup>
import { useWizard } from '@oxog/wizardkit-vue'
import ProgressBar from './ProgressBar.vue'
import StepContent from './StepContent.vue'
import Navigation from './Navigation.vue'

const wizard = useWizard()
</script>

<template>
  <div>
    <ProgressBar />
    <StepContent />
    <Navigation />
  </div>
</template>`}</code></pre>

        <pre><code>{`<!-- ProgressBar.vue -->
<script setup>
import { useWizardState } from '@oxog/wizardkit-vue'

const { progress } = useWizardState()
</script>

<template>
  <div>Progress: {{ progress.percentage }}%</div>
</template>`}</code></pre>

        <pre><code>{`<!-- StepContent.vue -->
<script setup>
import { useWizardStep } from '@oxog/wizardkit-vue'

const step = useWizardStep()
</script>

<template>
  <h1>{{ step.title }}</h1>
</template>`}</code></pre>

        <pre><code>{`<!-- Navigation.vue -->
<script setup>
import { useWizard } from '@oxog/wizardkit-vue'

const { prev, next, isFirst, isLast } = useWizard()
</script>

<template>
  <div>
    <button @click="prev" :disabled="isFirst">Previous</button>
    <button @click="next">{{ isLast ? 'Complete' : 'Next' }}</button>
  </div>
</template>`}</code></pre>
      </section>

      <section className="composables">
        <h2>Available Composables</h2>

        <div className="composable">
          <h3>useWizard</h3>
          <p>Access wizard instance.</p>
          <pre><code>{`const wizard = useWizard()`}</code></pre>
          <p className="returns">Returns: <code>WizardInstance&lt;TData&gt;</code></p>
        </div>

        <div className="composable">
          <h3>useWizardState</h3>
          <p>Subscribe to wizard state changes.</p>
          <pre><code>{`const state = useWizardState()`}</code></pre>
          <p className="returns">Returns: <code>Ref&lt;WizardState&lt;TData&gt;&gt;</code></p>
        </div>

        <div className="composable">
          <h3>useWizardData</h3>
          <p>Subscribe to wizard data changes.</p>
          <pre><code>{`const data = useWizardData()`}</code></pre>
          <p className="returns">Returns: <code>Ref&lt;TData&gt;</code></p>
        </div>

        <div className="composable">
          <h3>useWizardStep</h3>
          <p>Subscribe to current step changes.</p>
          <pre><code>{`const step = useWizardStep()`}</code></pre>
          <p className="returns">Returns: <code>Ref&lt;Step&gt;</code></p>
        </div>

        <div className="composable">
          <h3>useWizardProgress</h3>
          <p>Subscribe to progress changes.</p>
          <pre><code>{`const progress = useWizardProgress()`}</code></pre>
          <p className="returns">Returns: <code>{'Ref<{ index: number; total: number; percentage: number }>'}</code></p>
        </div>

        <div className="composable">
          <h3>useWizardErrors</h3>
          <p>Subscribe to validation errors.</p>
          <pre><code>{`const errors = useWizardErrors()`}</code></pre>
          <p className="returns">Returns: <code>Ref&lt;ValidationErrors | null&gt;</code></p>
        </div>
      </section>

      <section className="components">
        <h2>Built-in Components</h2>

        <div className="component">
          <h3>WizardProgress</h3>
          <p>Display progress bar or stepper.</p>
          <pre><code>{`<WizardProgress variant="bar" />
<WizardProgress variant="stepper" />`}</code></pre>
        </div>

        <div className="component">
          <h3>WizardStep</h3>
          <p>Conditional rendering based on current step.</p>
          <pre><code>{`<WizardStep id="personal">
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
const email = wizard.data.email // string`}</code></pre>
      </section>

      <section className="examples">
        <h2>Complete Example</h2>
        <pre><code>{`<script setup lang="ts">
import { useWizard, WizardProgress } from '@oxog/wizardkit-vue'

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

const submit = () => {
  if (wizard.isLast) {
    wizard.complete()
  } else {
    wizard.next()
  }
}
</script>

<template>
  <div class="wizard">
    <WizardProgress variant="stepper" />

    <form @submit.prevent="submit">
      <h1>{{ wizard.currentStep.title }}</h1>

      <div v-if="wizard.currentStep.id === 'name'">
        <input v-model="wizard.data.name" placeholder="Your Name" />
      </div>

      <div v-if="wizard.currentStep.id === 'email'">
        <input v-model="wizard.data.email" placeholder="Your Email" />
      </div>

      <div v-if="wizard.currentStep.id === 'address'">
        <input v-model="wizard.data.address" placeholder="Your Address" />
      </div>

      <div v-if="wizard.currentStep.id === 'confirm'">
        <p>Name: {{ wizard.data.name }}</p>
        <p>Email: {{ wizard.data.email }}</p>
        <p>Address: {{ wizard.data.address }}</p>
      </div>

      <div v-if="wizard.errors" class="errors">
        <p v-for="(error, field) in wizard.errors" :key="field">
          {{ error }}
        </p>
      </div>

      <div class="buttons">
        <button type="button" @click="wizard.prev" :disabled="wizard.isFirst">
          Previous
        </button>
        <button type="submit">
          {{ wizard.isLast ? 'Complete' : 'Next' }}
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.wizard {
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
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

export default VueDocs
