import { CodeBlock } from '@/components/code/CodeBlock'

export function Vue() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <article className="prose prose-slate dark:prose-invert max-w-none">
        <h1 className="text-4xl font-bold mb-4">Vue Integration</h1>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Installation</h2>
          <CodeBlock
            code={`npm install @oxog/wizardkit/vue`}
            language="bash"
          />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">useWizard Composable</h2>
          <CodeBlock
            code={`<script setup lang="ts">
import { useWizard } from '@oxog/wizardkit/vue'

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
</script>

<template>
  <div>
    <h1>{{ wizard.currentStep.title }}</h1>

    <InfoStep
      v-if="wizard.currentIndex === 0"
      :data="wizard.data"
      @update="wizard.setData"
    />

    <ConfirmStep
      v-if="wizard.currentIndex === 1"
      :data="wizard.data"
    />

    <button
      @click="wizard.prev"
      :disabled="!wizard.canGoPrev"
    >
      Previous
    </button>

    <button
      @click="wizard.next"
      :disabled="!wizard.canGoNext"
    >
      Next
    </button>

    <div>Progress: {{ wizard.progressPercent }}%</div>
  </div>
</template>`}
            language="vue"
            filename="use-wizard.vue"
          />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">With VeeValidate</h2>
          <CodeBlock
            code={`<script setup lang="ts">
import { useWizard } from '@oxog/wizardkit/vue'
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'

const wizard = useWizard({
  steps: [
    { id: 'info', title: 'Information' },
    { id: 'confirm', title: 'Confirmation' },
  ],
})

const schema = yup.object({
  name: yup.string().required().min(2),
  email: yup.string().required().email(),
})

const { handleSubmit } = useForm({
  validationSchema: schema,
  initialValues: wizard.data,
})

const { value: name, errorMessage: nameError } = useField('name')
const { value: email, errorMessage: emailError } = useField('email')

const onSubmit = handleSubmit((values) => {
  wizard.setData(values)
  wizard.next()
})
</script>

<template>
  <form @submit="onSubmit">
    <input v-model="name" />
    <span v-if="nameError">{{ nameError }}</span>

    <input v-model="email" />
    <span v-if="emailError">{{ emailError }}</span>

    <button type="submit">Next</button>
  </form>
</template>`}
            language="vue"
            filename="vee-validate.vue"
          />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Wizard Plugin</h2>
          <CodeBlock
            code={`// main.ts
import { createApp } from 'vue'
import { WizardPlugin } from '@oxog/wizardkit/vue'
import App from './App.vue'

const app = createApp(App)

app.use(WizardPlugin, {
  steps: [
    { id: 'step1', title: 'Step 1' },
    { id: 'step2', title: 'Step 2' },
  ],
})

app.mount('#app')

// MyWizard.vue
<script setup lang="ts">
import { injectWizard } from '@oxog/wizardkit/vue'

const wizard = injectWizard()
</script>

<template>
  <div>
    <h1>{{ wizard.currentStep.title }}</h1>
    <button @click="wizard.next">Next</button>
  </div>
</template>`}
            language="vue"
            filename="wizard-plugin.vue"
          />
        </section>
      </article>
    </div>
  )
}
