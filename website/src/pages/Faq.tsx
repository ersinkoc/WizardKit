import { Link } from 'react-router-dom'
import { HelpCircle, ChevronRight } from 'lucide-react'
import { PACKAGE_NAME } from '@/lib/constants'

const faqs = [
  {
    category: 'Getting Started',
    questions: [
      {
        q: 'What is WizardKit?',
        a: `${PACKAGE_NAME} is a zero-dependency multi-step wizard toolkit for JavaScript and TypeScript. It provides a simple yet powerful API for creating wizards with conditional steps, validation, state management, and more.`,
      },
      {
        q: 'How do I install WizardKit?',
        a: `You can install WizardKit using npm, yarn, or pnpm:

\`\`\`bash
npm install @oxog/wizardkit
# or
yarn add @oxog/wizardkit
# or
pnpm add @oxog/wizardkit
\`\`\``,
      },
      {
        q: 'Does WizardKit work with my framework?',
        a: `Yes! WizardKit is framework-agnostic and works with React, Vue, Svelte, or vanilla JavaScript. We also provide framework-specific packages like @oxog/wizardkit/react for convenience.`,
      },
      {
        q: 'What are the bundle size implications?',
        a: `WizardKit is designed to be tiny. The core is under 1KB gzipped with zero dependencies. This makes it ideal for performance-critical applications.`,
      },
    ],
  },
  {
    category: 'Features',
    questions: [
      {
        q: 'Can I show/hide steps dynamically?',
        a: `Yes! Use the \`isActive\` property on step definitions:

\`\`\`typescript
{
  id: 'business-info',
  title: 'Business Information',
  isActive: (data) => data.userType === 'business'
}
\`\`\`

The step will only appear when the condition is met.`,
      },
      {
        q: 'How does validation work?',
        a: `WizardKit includes built-in validation rules like \`required\`, \`email\`, \`min\`, \`max\`, and more. You can also add custom validators:

\`\`\`typescript
validation: {
  username: {
    required: true,
    minLength: 3,
    validate: (value) => !value.includes('admin') || 'Cannot use "admin"'
  }
}
\`\`\``,
      },
      {
        q: 'Can I persist wizard state?',
        a: `Yes! Enable persistence with the \`persistKey\` option:

\`\`\`typescript
const wizard = createWizard({
  steps: [...],
  persistKey: 'my-wizard',
  persistStorage: 'local', // or 'session' or 'memory'
})
\`\`\`

The wizard state will automatically save and restore.`,
      },
      {
        q: 'How do I listen to events?',
        a: `Use the \`on()\` method to subscribe to events:

\`\`\`typescript
wizard.on('complete', ({ data }) => {
  console.log('Wizard completed:', data)
})

wizard.on('step:change', ({ step, direction }) => {
  console.log(\`Moved \${direction} to \${step.title}\`)
})
\`\`\``,
      },
    ],
  },
  {
    category: 'Usage',
    questions: [
      {
        q: 'How do I integrate with React?',
        a: `Use the \`useWizard\` hook from the React package:

\`\`\`typescript
import { useWizard } from '@oxog/wizardkit/react'

function MyWizard() {
  const wizard = useWizard({
    steps: [...]
  })

  return (
    <div>
      <h1>{wizard.currentStep.title}</h1>
      <button onClick={wizard.next}>Next</button>
    </div>
  )
}
\`\`\``,
      },
      {
        q: 'Can I use TypeScript?',
        a: `Absolutely! WizardKit is written in TypeScript and provides full type safety. Use generics to type your data:

\`\`\`typescript
interface FormData {
  name: string
  email: string
}

const wizard = createWizard<FormData>({
  steps: [...]
})

wizard.data.name // Type: string
\`\`\``,
      },
      {
        q: 'How do I skip validation for navigation?',
        a: `Set \`validateOnNext\` and \`validateOnPrev\` to false:

\`\`\`typescript
const wizard = createWizard({
  steps: [...],
  validateOnNext: false,
  validateOnPrev: false
})
\`\`\`

You can also manually validate with \`await wizard.isValid()\` before navigating.`,
      },
      {
        q: 'Can I have multiple wizards on the same page?',
        a: `Yes! Each call to \`createWizard()\` creates an independent wizard instance with its own state:

\`\`\`typescript
const wizard1 = createWizard({ steps: [...] })
const wizard2 = createWizard({ steps: [...] })

// They operate independently
wizard1.next()
wizard2.prev()
\`\`\``,
      },
    ],
  },
  {
    category: 'Advanced',
    questions: [
      {
        q: 'How do I customize the step data?',
        a: `Use the \`onEnter\` hook to modify data when entering a step:

\`\`\`typescript
{
  id: 'results',
  title: 'Results',
  onEnter: (data) => {
    const calculated = calculateSomething(data)
    return { ...data, calculated }
  }
}
\`\`\``,
      },
      {
        q: 'Can I integrate with form libraries?',
        a: `Yes! WizardKit works well with form libraries like react-hook-form, VeeValidate, and Felte. The validation can be handled by WizardKit or your form library - it's up to you.`,
      },
      {
        q: 'How do I reset the wizard?',
        a: `Use the \`resetData()\` method to reset data to initial values, or create a new wizard instance:

\`\`\`typescript
// Reset data only
wizard.resetData()

// Or create a new wizard instance
const wizard = createWizard({ steps: [...] })
\`\`\``,
      },
      {
        q: 'Is WizardKit accessible?',
        a: `WizardKit provides the logic and state management for wizards. The UI/UX including accessibility is up to you and your framework. This gives you full control over the implementation while keeping the core library tiny.`,
      },
    ],
  },
  {
    category: 'Support',
    questions: [
      {
        q: 'Where can I get help?',
        a: `You can find help in several places:
- Check the [documentation](/docs/introduction)
- Browse [examples](/examples)
- Search [GitHub issues](https://github.com/ersinkoc/wizardkit/issues)
- Ask a question on [GitHub Discussions](https://github.com/ersinkoc/wizardkit/discussions)`,
      },
      {
        q: 'How do I report bugs?',
        a: `Please report bugs on [GitHub Issues](https://github.com/ersinkoc/wizardkit/issues). Include:
- A clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Your environment (OS, browser, framework, version)`,
      },
      {
        q: 'Can I contribute?',
        a: `Yes! Contributions are welcome. Please:
1. Check existing issues and PRs
2. Fork the repository
3. Create a branch for your feature
4. Add tests if applicable
5. Submit a pull request

See [CONTRIBUTING.md](https://github.com/ersinkoc/wizardkit/blob/main/CONTRIBUTING.md) for details.`,
      },
      {
        q: 'What is the license?',
        a: `WizardKit is released under the [MIT License](https://github.com/ersinkoc/wizardkit/blob/main/LICENSE). You're free to use it in personal and commercial projects.`,
      },
    ],
  },
]

export function Faq() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-12 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
          <HelpCircle className="w-8 h-8" />
        </div>
        <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
        <p className="text-xl text-muted-foreground">
          Everything you need to know about {PACKAGE_NAME}
        </p>
      </div>

      {/* FAQ Sections */}
      <div className="space-y-12">
        {faqs.map((section) => (
          <section key={section.category}>
            <h2 className="text-2xl font-bold mb-6">{section.category}</h2>
            <div className="space-y-4">
              {section.questions.map((faq, index) => (
                <details
                  key={index}
                  className="group rounded-xl border border-border bg-card overflow-hidden"
                >
                  <summary className="flex cursor-pointer items-center justify-between p-5 font-medium hover:bg-accent/50 transition-colors list-none">
                    <span className="pr-4">{faq.q}</span>
                    <span className="flex-shrink-0 ml-2">
                      <svg
                        className="w-5 h-5 text-muted-foreground transition-transform group-open:rotate-180"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </span>
                  </summary>
                  <div className="px-5 pb-5 text-muted-foreground">
                    <div className="pt-2 border-t border-border/50">
                      {faq.a.includes('```') ? (
                        <div className="space-y-3">
                          {faq.a.split('```').map((part, i) => {
                            if (i % 2 === 1) {
                              const lines = part.trim().split('\n')
                              const code = lines.slice(1).join('\n')
                              return (
                                <pre
                                  key={i}
                                  className="p-4 rounded-lg bg-muted overflow-x-auto text-sm"
                                >
                                  <code>{code}</code>
                                </pre>
                              )
                            }
                            return (
                              <p key={i} dangerouslySetInnerHTML={{ __html: part }} />
                            )
                          })}
                        </div>
                      ) : (
                        <p dangerouslySetInnerHTML={{ __html: faq.a }} />
                      )}
                    </div>
                  </div>
                </details>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Still Have Questions */}
      <section className="mt-16 p-8 rounded-xl bg-muted/50 border border-border">
        <h3 className="text-2xl font-bold mb-4">Still have questions?</h3>
        <p className="text-muted-foreground mb-6">
          Can't find the answer you're looking for? Please reach out to our community.
        </p>
        <div className="grid sm:grid-cols-2 gap-4">
          <a
            href="https://github.com/ersinkoc/wizardkit/issues"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent transition-colors group"
          >
            <div>
              <div className="font-medium">GitHub Issues</div>
              <div className="text-sm text-muted-foreground">Report bugs or request features</div>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground" />
          </a>
          <a
            href="https://github.com/ersinkoc/wizardkit/discussions"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent transition-colors group"
          >
            <div>
              <div className="font-medium">GitHub Discussions</div>
              <div className="text-sm text-muted-foreground">Ask questions and share ideas</div>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground" />
          </a>
        </div>
      </section>

      {/* Quick Links */}
      <section className="mt-12">
        <h3 className="font-semibold mb-4">Related Links</h3>
        <div className="grid sm:grid-cols-3 gap-4">
          <Link
            to="/docs/introduction"
            className="block p-4 rounded-lg border border-border hover:bg-accent transition-colors"
          >
            <div className="font-medium">Documentation</div>
            <div className="text-sm text-muted-foreground">Get started with WizardKit</div>
          </Link>
          <Link
            to="/examples"
            className="block p-4 rounded-lg border border-border hover:bg-accent transition-colors"
          >
            <div className="font-medium">Examples</div>
            <div className="text-sm text-muted-foreground">See WizardKit in action</div>
          </Link>
          <Link
            to="/api/create-wizard"
            className="block p-4 rounded-lg border border-border hover:bg-accent transition-colors"
          >
            <div className="font-medium">API Reference</div>
            <div className="text-sm text-muted-foreground">Complete API documentation</div>
          </Link>
        </div>
      </section>
    </div>
  )
}
