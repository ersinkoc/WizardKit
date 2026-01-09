# WizardKit

<div align="center">
  <h3>Zero-dependency multi-step wizard toolkit</h3>
  <p>
    <a href="https://wizardkit.oxog.dev">Documentation</a> •
    <a href="https://wizardkit.oxog.dev/docs/getting-started">Getting Started</a> •
    <a href="https://wizardkit.oxog.dev/examples">Examples</a>
  </p>
</div>

<div align="center">

[![npm version](https://img.shields.io/npm/v/@oxog/wizardkit.svg)](https://www.npmjs.com/package/@oxog/wizardkit)
[![bundle size](https://img.shields.io/bundlephobia/minzip/@oxog/wizardkit)](https://bundlephobia.com/package/@oxog/wizardkit)
[![license](https://img.shields.io/npm/l/@oxog/wizardkit.svg)](LICENSE)
[![tests](https://img.shields.io/badge/tests-100%25-success)](tests)

</div>

---

## Features

- **Multi-step Wizard** - Any step-by-step flow
- **Conditional Steps** - Show/hide based on data
- **Branching** - A→B or A→C navigation
- **Validation** - Sync, async, schema-based
- **Persistence** - Auto-save progress
- **Lifecycle Hooks** - beforeEnter, onLeave, etc.
- **Form Integration** - Built-in or external
- **React/Vue/Svelte** - Framework adapters
- **Zero Dependencies** - Lightweight
- **< 4KB** - Tiny bundle

## Installation

```bash
npm install @oxog/wizardkit
```

## Quick Start

```typescript
import { createWizard } from '@oxog/wizardkit'

const wizard = createWizard({
  steps: [
    { id: 'info', title: 'Information' },
    { id: 'address', title: 'Address' },
    { id: 'confirm', title: 'Confirm' },
  ],
  initialData: {
    name: '',
    email: '',
  },
})

// Navigate
wizard.next()
wizard.prev()
wizard.goTo('address')

// Get state
const { currentStep, data, progress } = wizard.getState()

// Set data
wizard.setData({ name: 'John' })
wizard.setField('email', 'john@example.com')

// Listen to events
wizard.on('complete', ({ data }) => {
  console.log('Wizard completed!', data)
})
```

## React

```tsx
import { useWizard } from '@oxog/wizardkit/react'

function MyWizard() {
  const wizard = useWizard({
    steps: [
      { id: 'info', title: 'Information' },
      { id: 'address', title: 'Address' },
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
}
```

## Documentation

Visit [wizardkit.oxog.dev](https://wizardkit.oxog.dev) for full documentation.

## License

MIT © [Ersin KOÇ](https://github.com/ersinkoc)
