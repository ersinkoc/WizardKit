import { CodeBlock } from '@/components/code/CodeBlock'
import { InstallTabs } from '@/components/common/InstallTabs'
import { PACKAGE_NAME } from '@/lib/constants'

export function Installation() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <article className="prose prose-slate dark:prose-invert max-w-none">
        <h1 className="text-4xl font-bold mb-4">Installation</h1>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Package Managers</h2>
          <InstallTabs />
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Framework Adapters</h2>
          <p className="text-muted-foreground mb-4">
            For framework-specific integrations, install the corresponding adapter:
          </p>
          <CodeBlock
            code={`# React adapter
npm install @oxog/wizardkit/react

# Vue adapter
npm install @oxog/wizardkit/vue

# Svelte adapter
npm install @oxog/wizardkit/svelte`}
            language="bash"
          />
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">TypeScript</h2>
          <p className="text-muted-foreground mb-4">
            WizardKit is written in TypeScript and includes full type definitions. No
            additional @types package is needed.
          </p>
          <CodeBlock
            code={`import { createWizard } from '${PACKAGE_NAME}'
import type { WizardConfig } from '${PACKAGE_NAME}'

interface FormData {
  name: string
  email: string
  age?: number
}

const config: WizardConfig<FormData> = {
  steps: [
    { id: 'info', title: 'Information' },
    { id: 'confirm', title: 'Confirm' },
  ],
  initialData: {
    name: '',
    email: '',
  },
}

const wizard = createWizard<FormData>(config)

// Fully typed!
wizard.data.name // string
wizard.data.age // number | undefined`}
            language="typescript"
            filename="wizard.ts"
          />
        </section>
      </article>
    </div>
  )
}
