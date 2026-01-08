# WizardKit - Package Specification

## Overview

**Package Name**: `@oxog/wizardkit`
**Version**: 1.0.0
**Description**: Zero-dependency multi-step wizard toolkit with conditional steps, branching logic, and form integration.
**License**: MIT
**Author**: Ersin KOÇ
**Repository**: https://github.com/ersinkoc/wizardkit
**Documentation**: https://wizardkit.oxog.dev

## Problem Statement

Multi-step forms and wizards are common UI patterns, but existing solutions either:
- Have heavy dependencies (React Router, Formik, etc.)
- Lack flexibility for complex flows (conditional steps, branching)
- Have poor TypeScript support
- Are tied to specific frameworks
- Have large bundle sizes

## Solution

A lightweight, framework-agnostic wizard library that:
- Has **zero runtime dependencies**
- Supports complex navigation patterns (conditional steps, branching)
- Provides first-class TypeScript support with full generics
- Includes framework adapters for React, Vue, and Svelte
- Ships under 4KB (minified + gzipped)
- Achieves 100% test coverage

## Core Architecture

### Design Principles

1. **Zero Dependencies**: All functionality implemented from scratch
2. **Framework Agnostic**: Core library works with any UI framework
3. **Type Safety**: Full TypeScript with strict mode enabled
4. **Tree Shakeable**: Modular exports for optimal bundle size
5. **Immutable State**: Predictable state management with explicit mutations
6. **Event-Driven**: Pub/sub pattern for extensibility
7. **Middleware Support**: Redux-style middleware for action interception

### Architecture Pattern

The wizard follows a **Flux-like architecture**:

```
User Action → Action Dispatch → Middleware → State Update → Event Emission → UI Update
```

**Components**:
- **Action**: Plain objects describing state changes (`{ type: 'NEXT' }`)
- **State**: Immutable object holding wizard state
- **Middleware**: Functions that can intercept/modify actions
- **Events**: Notifications of state changes
- **Reducer**: Pure function that computes next state

## API Design

### Factory Function

```typescript
import { createWizard } from '@oxog/wizardkit'

const wizard = createWizard<TData>(config)
```

**Why a factory function?**
- Flexibility: Can create multiple wizard instances
- Encapsulation: Each instance has isolated state
- Tree-shaking: Only used code is bundled
- Type inference: Better TypeScript experience with generics

### Method Categories

1. **Navigation** (`next`, `prev`, `goTo`, `reset`)
2. **Data Management** (`getData`, `setData`, `setField`)
3. **Validation** (`validate`, `isValid`, `getErrors`)
4. **Queries** (`getStep`, `isStepVisible`)
5. **Lifecycle** (`destroy`, `persist`)

## Type System

### Generic Data Parameter

```typescript
interface WizardInstance<TData = Record<string, unknown>> {
  getData(): TData
  setData(data: Partial<TData>): void
  setField<K extends keyof TData>(field: K, value: TData[K]): void
}
```

**Benefits**:
- Autocomplete on field names
- Type checking on field values
- Refactoring support (rename field, errors show usage)

### Discriminated Unions for Actions

```typescript
type WizardAction =
  | { type: 'NEXT' }
  | { type: 'PREV' }
  | { type: 'GO_TO'; stepId: string }
  | { type: 'SET_DATA'; data: Record<string, unknown> }
```

**Benefits**:
- Type-safe action handling
- Exhaustive switch checking
- Better error messages

## Validation Strategy

### Three Validation Modes

1. **Function-Based**: Maximum flexibility
```typescript
validate: (data) => data.age >= 18 ? null : { age: 'Too young' }
```

2. **Schema-Based**: Declarative, common rules
```typescript
schema: {
  age: { required: true, min: 18 }
}
```

3. **Async Validation**: API calls, uniqueness checks
```typescript
validateAsync: async (data) => {
  const available = await checkUsername(data.username)
  return available ? null : { username: 'Taken' }
}
```

### Built-in Rules

| Rule | Parameters | Error Message |
|------|------------|---------------|
| required | - | Field is required |
| minLength | length | Must be at least X characters |
| maxLength | length | Must be at most X characters |
| min | value | Must be at least X |
| max | value | Must be at most X |
| pattern | RegExp | Must match pattern |
| email | - | Must be valid email |
| url | - | Must be valid URL |
| custom | (value) => boolean | Custom validation |

## Conditional Logic

### Step Visibility

```typescript
{
  id: 'premium-features',
  condition: (data) => data.plan === 'premium'
}
```

**Evaluation**: Re-evaluated on every data change and navigation

### Branching

```typescript
{
  id: 'payment',
  branches: {
    card: {
      condition: (data) => data.paymentMethod === 'card',
      nextStep: 'card-details'
    },
    transfer: {
      condition: (data) => data.paymentMethod === 'transfer',
      nextStep: 'bank-details'
    }
  }
}
```

**Resolution**: First matching branch wins

## Persistence Design

### Storage Interface

```typescript
interface PersistStorage {
  get: (key: string) => string | null | Promise<string | null>
  set: (key: string, value: string) => void | Promise<void>
  remove: (key: string) => void | Promise<void>
}
```

### Built-in Adapters

- `localStorage`: Persistent across sessions
- `sessionStorage`: Cleared on browser close
- Memory: For SSR/testing

### Auto-Save

Debounced saves (default: 300ms) on state changes.

## Event System

### Event Types

| Event | Payload | When |
|-------|---------|------|
| `step:change` | `{ step, direction, prevStep }` | After step change |
| `step:enter` | `{ step, direction }` | When entering step |
| `step:leave` | `{ step, direction }` | When leaving step |
| `data:change` | `{ data, changedFields }` | After data mutation |
| `validation:error` | `{ step, errors }` | On validation failure |
| `validation:success` | `{ step }` | On validation pass |
| `complete` | `{ data }` | On wizard completion |
| `cancel` | `{ data, step }` | On wizard cancellation |
| `reset` | `{ }` | On wizard reset |

## Lifecycle Hooks

### Hook Order for Navigation

```
beforeLeave (current) → beforeEnter (next) → Validation → onLeave (current) → Step Change → onEnter (next)
```

### Hook Signatures

```typescript
beforeEnter?: (data, wizard) => boolean | Promise<boolean>
onEnter?: (data, wizard, direction) => void
beforeLeave?: (data, wizard, direction) => BeforeLeaveResult | Promise<BeforeLeaveResult>
onLeave?: (data, wizard, direction) => void
```

## Framework Adapters

### React Adapter

**Components**: `WizardProvider`, `WizardStepper`, `WizardContent`, `WizardNavigation`
**Hooks**: `useWizard`, `useWizardStep`, `useWizardForm`, `useWizardNavigation`

**Pattern**: Context API + hooks for reactivity

### Vue Adapter

**Components**: Same as React
**Composables**: `useWizard`, `useWizardStep`

**Pattern**: Provide/inject + composition API

### Svelte Adapter

**Store**: Writable store with derived values
**Actions**: Methods bound to store

**Pattern**: Svelte stores + auto-subscription

## Performance Considerations

### Bundle Size Targets

| Package | Target | Strategy |
|---------|--------|----------|
| Core | < 4KB | Minimal code, tree-shaking |
| React Adapter | < 2KB | Peer dependencies |
| Vue Adapter | < 2KB | Peer dependencies |
| Svelte Adapter | < 2KB | Peer dependencies |
| Total | < 8KB | Modular imports |

### Optimization Techniques

1. **Code Splitting**: Adapters are separate entry points
2. **Tree Shaking**: ESM with proper exports
3. **Minification**: tsup with esbuild
4. **Compression**: gzip for metrics

## Testing Strategy

### Coverage Requirements

- **Statements**: 100%
- **Branches**: 100%
- **Functions**: 100%
- **Lines**: 100%

### Test Categories

1. **Unit Tests**: Individual functions and classes
2. **Integration Tests**: Multi-step flows
3. **Adapter Tests**: Framework-specific integration
4. **E2E Tests**: Full wizard workflows

### Test Framework

- **Vitest**: Fast, native ESM, TypeScript support
- **Coverage**: c8 (built-in to Vitest)

## Documentation

### Required Documentation

1. **Getting Started**: Installation and basic usage
2. **Core Concepts**: Explanation of key features
3. **API Reference**: Complete API documentation
4. **Framework Guides**: React, Vue, Svelte specifics
5. **Examples**: Interactive demos
6. **Migration Guide**: If upgrading from v0.x

### Documentation Site

**Tech Stack**:
- React 18+ with TypeScript
- Vite for fast builds
- Tailwind CSS for styling
- shadcn/ui for components
- Framer Motion for animations
- Deployed to GitHub Pages

## Use Cases

### Primary Use Cases

1. **Checkout Flows**: E-commerce multi-step checkout
2. **Onboarding**: User registration and setup
3. **Surveys**: Questionnaires and quizzes
4. **Forms**: Long forms broken into steps
5. **Wizards**: Any step-by-step process

### Example Wizards

- E-commerce checkout
- Bank account opening
- Insurance quote
- Event registration
- Job application

## Non-Goals

These are explicitly **not** goals:

1. **UI Components**: Only provides navigation logic, not form inputs
2. **Animation Library**: Leaves transitions to user
3. **Routing Integration**: Does not integrate with URL routing
4. **Accessibility**: Leaves ARIA implementation to user
5. **Mobile Detection**: No responsive logic (up to user)

## Success Criteria

A successful WizardKit release must:

1. ✅ Have **zero runtime dependencies**
2. ✅ Achieve **100% test coverage**
3. ✅ Pass **all tests** (100% success rate)
4. ✅ Bundle under **4KB** (core)
5. ✅ Support **TypeScript strict mode**
6. ✅ Include **React, Vue, Svelte** adapters
7. ✅ Have **comprehensive documentation**
8. ✅ Include **working examples**
9. ✅ Use **permissive license** (MIT)
10. ✅ Be **production-ready**

## Versioning

Follows **Semantic Versioning 2.0**:
- **MAJOR**: Breaking changes
- **MINOR**: New features, backward compatible
- **PATCH**: Bug fixes, backward compatible

## Release Checklist

Before releasing to NPM:

- [ ] All tests passing (100% success)
- [ ] Coverage at 100%
- [ ] Bundle size verified (< 4KB)
- [ ] TypeScript strict mode enabled
- [ ] Documentation complete
- [ ] Examples working
- [ ] CHANGELOG.md updated
- [ ] package.json version bumped
- [ ] git tag created
- [ ] Published to NPM
- [ ] Website deployed

---

**Specification Status**: Complete
**Last Updated**: 2025-12-28
**Author**: Ersin KOÇ
