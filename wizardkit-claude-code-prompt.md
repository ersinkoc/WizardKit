# WizardKit - Zero-Dependency Multi-Step Wizard Toolkit

## Package Identity

- **NPM Package**: `@oxog/wizardkit`
- **GitHub Repository**: `https://github.com/ersinkoc/wizardkit`
- **Documentation Site**: `https://wizardkit.oxog.dev`
- **License**: MIT
- **Author**: Ersin KOÇ
- **Created**: 2025-12-28

**NO social media, Discord, email, or external links.**

## Package Description

Zero-dependency multi-step wizard toolkit with conditional steps, branching logic, and form integration.

WizardKit is a powerful, lightweight wizard/stepper library that handles multi-step forms, onboarding flows, checkout processes, and any step-by-step user journey. Features include conditional step visibility, branching navigation, built-in and external form state management, sync/async validation, persistence, lifecycle hooks, and middleware support. Framework-agnostic core with dedicated adapters for React, Vue, and Svelte—all under 4KB with zero runtime dependencies.

---

## NON-NEGOTIABLE RULES

These rules are ABSOLUTE and must be followed without exception:

### 1. ZERO DEPENDENCIES
```json
{
  "dependencies": {}  // MUST BE EMPTY - NO EXCEPTIONS
}
```
Implement EVERYTHING from scratch. No runtime dependencies allowed.

### 2. 100% TEST COVERAGE & 100% SUCCESS RATE
- Every line of code must be tested
- Every branch must be tested
- All tests must pass (100% success rate)
- Use Vitest for testing
- Coverage report must show 100%

### 3. DEVELOPMENT WORKFLOW
Create these documents FIRST, before any code:
1. **SPECIFICATION.md** - Complete package specification
2. **IMPLEMENTATION.md** - Architecture and design decisions
3. **TASKS.md** - Ordered task list with dependencies

Only after these documents are complete, implement the code following TASKS.md sequentially.

### 4. TYPESCRIPT STRICT MODE
```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true
  }
}
```

### 5. NO EXTERNAL LINKS
- ❌ No social media (Twitter, LinkedIn, etc.)
- ❌ No Discord/Slack links
- ❌ No email addresses
- ❌ No donation/sponsor links
- ✅ Only GitHub repo and documentation site allowed

### 6. BUNDLE SIZE TARGET
- Core package: < 4KB minified + gzipped
- With all adapters: < 8KB
- Tree-shakeable

---

## CORE TYPES

```typescript
// ============ STEP TYPES ============

interface StepDefinition<TData = Record<string, unknown>> {
  // Identity
  id: string
  title: string
  description?: string
  icon?: string
  meta?: Record<string, unknown>
  
  // Visibility & Access
  condition?: StepCondition<TData>
  conditions?: StepCondition<TData>[]  // AND logic
  disabled?: boolean | ((data: TData) => boolean)
  canSkip?: boolean | ((data: TData) => boolean)
  
  // Validation
  validate?: ValidateFn<TData>
  validateAsync?: ValidateAsyncFn<TData>
  schema?: ValidationSchema
  
  // Branching
  branches?: Record<string, BranchDefinition<TData>>
  nextStep?: string | ((data: TData) => string)
  prevStep?: string | ((data: TData) => string)
  
  // Lifecycle Hooks
  beforeEnter?: BeforeEnterHook<TData>
  onEnter?: OnEnterHook<TData>
  beforeLeave?: BeforeLeaveHook<TData>
  onLeave?: OnLeaveHook<TData>
}

type StepCondition<TData> = (data: TData, context: WizardContext) => boolean

interface BranchDefinition<TData> {
  condition: (data: TData) => boolean
  nextStep: string
}

// ============ VALIDATION TYPES ============

type ValidateFn<TData> = (data: TData) => ValidationErrors | null
type ValidateAsyncFn<TData> = (data: TData) => Promise<ValidationErrors | null>
type ValidationErrors = Record<string, string>

interface ValidationSchema {
  [field: string]: FieldValidation
}

interface FieldValidation {
  required?: boolean
  minLength?: number
  maxLength?: number
  min?: number
  max?: number
  pattern?: RegExp
  email?: boolean
  url?: boolean
  custom?: (value: unknown, data: Record<string, unknown>) => boolean
  message?: string
  messages?: Partial<Record<ValidationRule, string>>
}

type ValidationRule = 
  | 'required' 
  | 'minLength' 
  | 'maxLength' 
  | 'min' 
  | 'max' 
  | 'pattern' 
  | 'email' 
  | 'url' 
  | 'custom'

// ============ LIFECYCLE HOOKS ============

type BeforeEnterHook<TData> = (
  data: TData,
  wizard: WizardInstance<TData>
) => boolean | Promise<boolean>

type OnEnterHook<TData> = (
  data: TData,
  wizard: WizardInstance<TData>,
  direction: NavigationDirection
) => void

type BeforeLeaveHook<TData> = (
  data: TData,
  wizard: WizardInstance<TData>,
  direction: NavigationDirection
) => BeforeLeaveResult | Promise<BeforeLeaveResult>

type OnLeaveHook<TData> = (
  data: TData,
  wizard: WizardInstance<TData>,
  direction: NavigationDirection
) => void

interface BeforeLeaveResult {
  block: boolean
  message?: string
}

type NavigationDirection = 'next' | 'prev' | 'jump'

// ============ WIZARD CONFIG ============

interface WizardConfig<TData = Record<string, unknown>> {
  // Steps
  steps: StepDefinition<TData>[]
  
  // Initial state
  initialData?: Partial<TData>
  initialStep?: string | number
  
  // Behavior
  linear?: boolean                    // Default: true
  validateOnNext?: boolean            // Default: true
  validateOnPrev?: boolean            // Default: false
  allowSkipValidation?: boolean       // Default: false
  
  // Persistence
  persistKey?: string
  persistStorage?: 'local' | 'session' | PersistStorage
  persistFields?: ('data' | 'currentStep' | 'history')[]
  persistDebounce?: number            // Default: 300ms
  
  // Form adapter (external form library)
  formAdapter?: FormAdapter<TData>
  
  // Custom validator
  validator?: CustomValidator<TData>
  
  // Callbacks
  onStepChange?: (step: Step, direction: NavigationDirection, data: TData) => void
  onDataChange?: (data: TData, changedFields: string[]) => void
  onValidationError?: (step: Step, errors: ValidationErrors) => void
  onComplete?: (data: TData) => void | Promise<void>
  onCancel?: (data: TData, step: Step) => void
}

// ============ PERSISTENCE ============

interface PersistStorage {
  get: (key: string) => string | null | Promise<string | null>
  set: (key: string, value: string) => void | Promise<void>
  remove: (key: string) => void | Promise<void>
}

// ============ FORM ADAPTER ============

interface FormAdapter<TData> {
  getData: () => TData
  setData: (data: Partial<TData>) => void
  validate: () => Promise<boolean> | boolean
  getErrors: () => ValidationErrors
  reset?: () => void
}

// ============ CUSTOM VALIDATOR ============

type CustomValidator<TData> = (
  schema: ValidationSchema,
  data: TData
) => ValidationErrors | null | Promise<ValidationErrors | null>

// ============ WIZARD STATE ============

interface WizardState<TData = Record<string, unknown>> {
  // Current position
  currentStep: Step
  currentIndex: number
  
  // Steps
  steps: Step[]
  activeSteps: Step[]           // Conditions passed
  visibleSteps: Step[]          // For UI display
  
  // Data
  data: TData
  errors: ValidationErrors
  
  // Navigation state
  history: string[]
  isFirst: boolean
  isLast: boolean
  isComplete: boolean
  canGoNext: boolean
  canGoPrev: boolean
  
  // Progress
  progress: number              // 0-1
  progressPercent: number       // 0-100
  completedSteps: number
  totalSteps: number
  
  // Status
  isLoading: boolean            // During async operations
  isValidating: boolean
}

interface Step {
  id: string
  index: number
  title: string
  description?: string
  icon?: string
  meta?: Record<string, unknown>
  isActive: boolean
  isCompleted: boolean
  isCurrent: boolean
  isUpcoming: boolean
  isDisabled: boolean
  canSkip: boolean
  hasError: boolean
  errors: ValidationErrors
}

// ============ WIZARD INSTANCE ============

interface WizardInstance<TData = Record<string, unknown>> {
  // ===== STATE GETTERS =====
  getState(): WizardState<TData>
  
  // Shortcuts
  readonly currentStep: Step
  readonly currentIndex: number
  readonly steps: Step[]
  readonly activeSteps: Step[]
  readonly data: TData
  readonly errors: ValidationErrors
  readonly history: string[]
  readonly progress: number
  readonly progressPercent: number
  readonly isFirst: boolean
  readonly isLast: boolean
  readonly isComplete: boolean
  readonly canGoNext: boolean
  readonly canGoPrev: boolean
  readonly isLoading: boolean
  
  // ===== NAVIGATION =====
  next(): Promise<boolean>
  prev(): Promise<boolean>
  goTo(stepId: string): Promise<boolean>
  goToIndex(index: number): Promise<boolean>
  first(): Promise<boolean>
  last(): Promise<boolean>
  skip(): Promise<boolean>
  reset(): void
  complete(): Promise<boolean>
  cancel(): void
  
  // Async checks
  canGoNext(): Promise<boolean>
  canGoPrev(): boolean
  canGoTo(stepId: string): Promise<boolean>
  
  // ===== DATA MANAGEMENT =====
  getData(): TData
  getData<K extends keyof TData>(field: K): TData[K]
  getData<K extends keyof TData>(fields: K[]): Pick<TData, K>
  
  setData(data: Partial<TData>, replace?: boolean): void
  setField<K extends keyof TData>(field: K, value: TData[K]): void
  clearField<K extends keyof TData>(field: K): void
  
  getStepData(stepId: string): Partial<TData>
  setStepData(stepId: string, data: Partial<TData>): void
  
  resetData(): void
  resetStepData(stepId: string): void
  
  // ===== VALIDATION =====
  validate(): Promise<ValidationErrors | null>
  validate(stepId: string): Promise<ValidationErrors | null>
  validateAll(): Promise<Record<string, ValidationErrors>>
  
  isValid(): Promise<boolean>
  isStepValid(stepId: string): Promise<boolean>
  
  getErrors(): ValidationErrors
  getErrors(stepId: string): ValidationErrors
  setErrors(errors: ValidationErrors): void
  clearErrors(): void
  clearErrors(stepId: string): void
  
  // ===== STEP QUERIES =====
  getStep(stepId: string): Step | undefined
  getStepByIndex(index: number): Step | undefined
  isStepVisible(stepId: string): boolean
  isStepActive(stepId: string): boolean
  isStepCompleted(stepId: string): boolean
  isStepDisabled(stepId: string): boolean
  
  // ===== HISTORY =====
  getHistory(): string[]
  canUndo(): boolean
  undo(): Promise<boolean>
  
  // ===== PERSISTENCE =====
  persist(): void | Promise<void>
  restore(): void | Promise<void>
  clearPersisted(): void | Promise<void>
  
  // ===== EVENTS =====
  on<E extends WizardEvent>(event: E, handler: WizardEventHandler<E>): Unsubscribe
  off<E extends WizardEvent>(event: E, handler: WizardEventHandler<E>): void
  once<E extends WizardEvent>(event: E, handler: WizardEventHandler<E>): void
  
  subscribe(handler: (state: WizardState<TData>, prevState: WizardState<TData>) => void): Unsubscribe
  
  // ===== ACTION DISPATCH =====
  dispatch(action: WizardAction): void | Promise<void>
  
  // ===== MIDDLEWARE =====
  use(middleware: WizardMiddleware<TData>): Unsubscribe
  
  // ===== LIFECYCLE =====
  destroy(): void
}

type Unsubscribe = () => void

// ============ EVENTS ============

type WizardEvent =
  | 'step:change'
  | 'step:enter'
  | 'step:leave'
  | 'data:change'
  | 'validation:error'
  | 'validation:success'
  | 'complete'
  | 'cancel'
  | 'reset'
  | 'persist'
  | 'restore'

interface WizardEventMap {
  'step:change': { step: Step; direction: NavigationDirection; prevStep: Step }
  'step:enter': { step: Step; direction: NavigationDirection }
  'step:leave': { step: Step; direction: NavigationDirection }
  'data:change': { data: Record<string, unknown>; changedFields: string[] }
  'validation:error': { step: Step; errors: ValidationErrors }
  'validation:success': { step: Step }
  'complete': { data: Record<string, unknown> }
  'cancel': { data: Record<string, unknown>; step: Step }
  'reset': {}
  'persist': { data: Record<string, unknown> }
  'restore': { data: Record<string, unknown> }
}

type WizardEventHandler<E extends WizardEvent> = (payload: WizardEventMap[E]) => void

// ============ ACTIONS ============

type WizardAction =
  | { type: 'NEXT' }
  | { type: 'PREV' }
  | { type: 'GO_TO'; stepId: string }
  | { type: 'GO_TO_INDEX'; index: number }
  | { type: 'FIRST' }
  | { type: 'LAST' }
  | { type: 'SKIP' }
  | { type: 'RESET' }
  | { type: 'COMPLETE' }
  | { type: 'CANCEL' }
  | { type: 'SET_DATA'; data: Record<string, unknown>; replace?: boolean }
  | { type: 'MERGE_DATA'; data: Record<string, unknown> }
  | { type: 'SET_FIELD'; field: string; value: unknown }
  | { type: 'CLEAR_FIELD'; field: string }
  | { type: 'SET_ERRORS'; errors: ValidationErrors }
  | { type: 'CLEAR_ERRORS'; stepId?: string }
  | { type: 'UNDO' }

// ============ MIDDLEWARE ============

type WizardMiddleware<TData> = (
  action: WizardAction,
  next: (action: WizardAction) => void | Promise<void>,
  getState: () => WizardState<TData>
) => void | Promise<void>

// ============ CONTEXT ============

interface WizardContext {
  currentStep: Step
  history: string[]
  direction: NavigationDirection | null
}
```

---

## FACTORY FUNCTION

```typescript
import { createWizard } from '@oxog/wizardkit'

// Basic usage
const wizard = createWizard({
  steps: [
    { id: 'info', title: 'Bilgiler' },
    { id: 'address', title: 'Adres' },
    { id: 'payment', title: 'Ödeme' },
    { id: 'confirm', title: 'Onay' },
  ],
  initialData: {
    name: '',
    email: '',
    address: '',
  },
  onComplete: (data) => {
    console.log('Wizard completed:', data)
  },
})

// Full configuration
const wizard = createWizard<CheckoutData>({
  steps: [
    {
      id: 'account-type',
      title: 'Hesap Türü',
      description: 'Hesap türünüzü seçin',
    },
    {
      id: 'personal',
      title: 'Kişisel Bilgiler',
      condition: (data) => data.accountType === 'individual',
      validate: (data) => {
        const errors: ValidationErrors = {}
        if (!data.name) errors.name = 'Ad gerekli'
        if (!data.tcNo?.match(/^\d{11}$/)) errors.tcNo = 'Geçersiz TC'
        return Object.keys(errors).length ? errors : null
      },
    },
    {
      id: 'corporate',
      title: 'Kurumsal Bilgiler',
      condition: (data) => data.accountType === 'corporate',
      schema: {
        companyName: { required: true, minLength: 2, message: 'Şirket adı gerekli' },
        taxNo: { required: true, pattern: /^\d{10}$/, message: 'Geçersiz vergi no' },
      },
    },
    {
      id: 'address',
      title: 'Adres Bilgileri',
      validateAsync: async (data) => {
        const isValid = await validateAddressAPI(data.address)
        return isValid ? null : { address: 'Geçersiz adres' }
      },
    },
    {
      id: 'payment',
      title: 'Ödeme',
      canSkip: true,
      branches: {
        card: {
          condition: (data) => data.paymentMethod === 'card',
          nextStep: 'card-details',
        },
        transfer: {
          condition: (data) => data.paymentMethod === 'transfer',
          nextStep: 'bank-details',
        },
      },
    },
    {
      id: 'card-details',
      title: 'Kart Bilgileri',
      condition: (data) => data.paymentMethod === 'card',
      beforeEnter: async (data, wizard) => {
        // Check if user can pay with card
        return await checkCardPaymentAvailable()
      },
    },
    {
      id: 'bank-details',
      title: 'Banka Bilgileri',
      condition: (data) => data.paymentMethod === 'transfer',
    },
    {
      id: 'confirm',
      title: 'Onay',
      beforeLeave: async (data, wizard, direction) => {
        if (direction === 'next') {
          const confirmed = await showConfirmDialog()
          return { block: !confirmed, message: 'Onaylamanız gerekiyor' }
        }
        return { block: false }
      },
    },
  ],
  
  initialData: {
    accountType: null,
    name: '',
    email: '',
    paymentMethod: 'card',
  },
  
  // Options
  linear: false,
  validateOnNext: true,
  persistKey: 'checkout-wizard',
  persistStorage: 'local',
  persistDebounce: 500,
  
  // Callbacks
  onStepChange: (step, direction, data) => {
    analytics.track('wizard_step', { step: step.id, direction })
  },
  onDataChange: (data, changedFields) => {
    console.log('Data changed:', changedFields)
  },
  onValidationError: (step, errors) => {
    console.log('Validation failed:', step.id, errors)
  },
  onComplete: async (data) => {
    await submitOrder(data)
  },
  onCancel: (data, step) => {
    console.log('Wizard cancelled at:', step.id)
  },
})
```

---

## NAVIGATION API

```typescript
// ===== METHOD-BASED =====

// Basic navigation
await wizard.next()           // Next step (validates current)
await wizard.prev()           // Previous step
await wizard.goTo('payment')  // Go to specific step by ID
await wizard.goToIndex(2)     // Go to specific step by index
await wizard.first()          // Go to first step
await wizard.last()           // Go to last step
await wizard.skip()           // Skip current step (if canSkip)
wizard.reset()                // Reset to initial state
await wizard.complete()       // Complete wizard
wizard.cancel()               // Cancel wizard

// Checks
const canNext = await wizard.canGoNext()
const canPrev = wizard.canGoPrev()
const canGoPayment = await wizard.canGoTo('payment')

// ===== ACTION-BASED =====

wizard.dispatch({ type: 'NEXT' })
wizard.dispatch({ type: 'PREV' })
wizard.dispatch({ type: 'GO_TO', stepId: 'payment' })
wizard.dispatch({ type: 'GO_TO_INDEX', index: 2 })
wizard.dispatch({ type: 'FIRST' })
wizard.dispatch({ type: 'LAST' })
wizard.dispatch({ type: 'SKIP' })
wizard.dispatch({ type: 'RESET' })
wizard.dispatch({ type: 'COMPLETE' })
wizard.dispatch({ type: 'CANCEL' })

// Data actions
wizard.dispatch({ type: 'SET_DATA', data: { name: 'Ersin' } })
wizard.dispatch({ type: 'SET_DATA', data: { name: 'Ersin' }, replace: true })
wizard.dispatch({ type: 'MERGE_DATA', data: { email: 'test@test.com' } })
wizard.dispatch({ type: 'SET_FIELD', field: 'name', value: 'Ersin' })
wizard.dispatch({ type: 'CLEAR_FIELD', field: 'email' })

// Error actions
wizard.dispatch({ type: 'SET_ERRORS', errors: { name: 'Invalid' } })
wizard.dispatch({ type: 'CLEAR_ERRORS' })
wizard.dispatch({ type: 'CLEAR_ERRORS', stepId: 'personal' })

// History
wizard.dispatch({ type: 'UNDO' })
```

---

## DATA MANAGEMENT

```typescript
// ===== GETTERS =====

// All data
const allData = wizard.getData()

// Single field
const name = wizard.getData('name')

// Multiple fields
const { name, email } = wizard.getData(['name', 'email'])

// Step-specific data (fields used in that step)
const personalData = wizard.getStepData('personal')


// ===== SETTERS =====

// Merge data
wizard.setData({ name: 'Ersin', email: 'ersin@test.com' })

// Replace all data
wizard.setData({ name: 'Ersin' }, true)

// Single field
wizard.setField('name', 'Ersin')

// Clear field
wizard.clearField('email')

// Step-specific data
wizard.setStepData('personal', { name: 'Ersin', tcNo: '12345678901' })


// ===== RESET =====

// Reset all data to initial
wizard.resetData()

// Reset specific step data
wizard.resetStepData('personal')
```

---

## VALIDATION

```typescript
// ===== FUNCTION-BASED VALIDATION =====

const steps = [
  {
    id: 'personal',
    title: 'Kişisel Bilgiler',
    validate: (data) => {
      const errors: ValidationErrors = {}
      
      if (!data.name) {
        errors.name = 'Ad gerekli'
      } else if (data.name.length < 2) {
        errors.name = 'Ad en az 2 karakter olmalı'
      }
      
      if (!data.email) {
        errors.email = 'Email gerekli'
      } else if (!isValidEmail(data.email)) {
        errors.email = 'Geçersiz email formatı'
      }
      
      if (!data.phone) {
        errors.phone = 'Telefon gerekli'
      } else if (!data.phone.match(/^05\d{9}$/)) {
        errors.phone = 'Geçerli telefon numarası girin'
      }
      
      return Object.keys(errors).length ? errors : null
    },
  },
]

// ===== ASYNC VALIDATION =====

const steps = [
  {
    id: 'username',
    title: 'Kullanıcı Adı',
    validateAsync: async (data) => {
      if (!data.username) {
        return { username: 'Kullanıcı adı gerekli' }
      }
      
      const available = await checkUsernameAvailability(data.username)
      if (!available) {
        return { username: 'Bu kullanıcı adı alınmış' }
      }
      
      return null
    },
  },
]

// ===== SCHEMA-BASED VALIDATION =====

const steps = [
  {
    id: 'personal',
    title: 'Kişisel Bilgiler',
    schema: {
      name: {
        required: true,
        minLength: 2,
        maxLength: 50,
        message: 'Ad 2-50 karakter olmalı',
      },
      email: {
        required: true,
        email: true,
        message: 'Geçerli bir email adresi girin',
      },
      age: {
        required: true,
        min: 18,
        max: 120,
        messages: {
          required: 'Yaş gerekli',
          min: '18 yaşından büyük olmalısınız',
          max: 'Geçersiz yaş',
        },
      },
      website: {
        url: true,
        message: 'Geçerli bir URL girin',
      },
      phone: {
        required: true,
        pattern: /^05\d{9}$/,
        message: '05 ile başlayan 11 haneli telefon girin',
      },
      terms: {
        custom: (value) => value === true,
        message: 'Şartları kabul etmelisiniz',
      },
    },
  },
]

// ===== COMBINED VALIDATION =====

const steps = [
  {
    id: 'address',
    title: 'Adres',
    // Schema for basic validation
    schema: {
      city: { required: true },
      district: { required: true },
      address: { required: true, minLength: 10 },
    },
    // Async for API validation
    validateAsync: async (data) => {
      const result = await validateAddressWithAPI(data)
      if (!result.valid) {
        return { address: result.message }
      }
      return null
    },
  },
]

// ===== MANUAL VALIDATION =====

// Validate current step
const errors = await wizard.validate()

// Validate specific step
const errors = await wizard.validate('personal')

// Validate all steps
const allErrors = await wizard.validateAll()
// { personal: { name: 'Required' }, address: null, payment: { cardNo: 'Invalid' } }

// Check validity
const isCurrentValid = await wizard.isValid()
const isPersonalValid = await wizard.isStepValid('personal')

// Error management
const currentErrors = wizard.getErrors()
const stepErrors = wizard.getErrors('personal')

wizard.setErrors({ name: 'Custom error' })
wizard.clearErrors()
wizard.clearErrors('personal')

// ===== CUSTOM VALIDATOR (Zod, Yup, etc.) =====

import { z } from 'zod'

const wizard = createWizard({
  steps: [
    {
      id: 'personal',
      schema: {
        name: z.string().min(2),
        email: z.string().email(),
      },
    },
  ],
  validator: (schema, data) => {
    // schema is the Zod schema from step definition
    const result = schema.safeParse(data)
    if (!result.success) {
      return result.error.flatten().fieldErrors
    }
    return null
  },
})
```

---

## CONDITIONAL STEPS & BRANCHING

```typescript
const wizard = createWizard({
  steps: [
    { id: 'start', title: 'Başlangıç' },
    
    // ===== SIMPLE CONDITION =====
    {
      id: 'premium-features',
      title: 'Premium Özellikler',
      condition: (data) => data.plan === 'premium',
    },
    
    // ===== MULTIPLE CONDITIONS (AND) =====
    {
      id: 'corporate-billing',
      title: 'Kurumsal Fatura',
      conditions: [
        (data) => data.accountType === 'corporate',
        (data) => data.needInvoice === true,
      ],
    },
    
    // ===== DYNAMIC CONDITION =====
    {
      id: 'additional-info',
      title: 'Ek Bilgiler',
      condition: (data, context) => {
        // Access wizard context
        return context.history.includes('premium-features')
      },
    },
    
    // ===== BRANCHING =====
    {
      id: 'payment-select',
      title: 'Ödeme Yöntemi',
      branches: {
        'credit-card': {
          condition: (data) => data.paymentType === 'card',
          nextStep: 'card-details',
        },
        'bank-transfer': {
          condition: (data) => data.paymentType === 'transfer',
          nextStep: 'bank-details',
        },
        'crypto': {
          condition: (data) => data.paymentType === 'crypto',
          nextStep: 'wallet-connect',
        },
      },
    },
    
    // Branch destinations
    {
      id: 'card-details',
      title: 'Kart Bilgileri',
      condition: (data) => data.paymentType === 'card',
    },
    {
      id: 'bank-details',
      title: 'Banka Bilgileri',
      condition: (data) => data.paymentType === 'transfer',
    },
    {
      id: 'wallet-connect',
      title: 'Cüzdan Bağla',
      condition: (data) => data.paymentType === 'crypto',
    },
    
    // ===== CUSTOM NAVIGATION =====
    {
      id: 'review',
      title: 'İnceleme',
      // Dynamic next step
      nextStep: (data) => {
        if (data.needVerification) return 'verification'
        return 'confirm'
      },
      // Dynamic prev step
      prevStep: (data) => {
        if (data.paymentType === 'card') return 'card-details'
        if (data.paymentType === 'transfer') return 'bank-details'
        return 'payment-select'
      },
    },
    
    {
      id: 'verification',
      title: 'Doğrulama',
      condition: (data) => data.needVerification,
    },
    
    { id: 'confirm', title: 'Onay' },
  ],
})

// ===== RUNTIME QUERIES =====

// Get all steps that pass conditions
const activeSteps = wizard.activeSteps
// [start, personal, card-details, confirm]

// Get visible steps for UI
const visibleSteps = wizard.getState().visibleSteps

// Check specific step
wizard.isStepVisible('premium-features')  // false
wizard.isStepActive('card-details')       // true
```

---

## LIFECYCLE HOOKS

```typescript
const steps = [
  {
    id: 'payment',
    title: 'Ödeme',
    
    // ===== BEFORE ENTER =====
    // Called before entering the step
    // Return false to prevent entering
    beforeEnter: async (data, wizard) => {
      // Check permission
      const hasAccess = await checkPaymentAccess(data.userId)
      if (!hasAccess) {
        showError('Ödeme sayfasına erişim izniniz yok')
        return false
      }
      
      // Load required data
      await loadPaymentMethods()
      
      return true
    },
    
    // ===== ON ENTER =====
    // Called after entering the step
    onEnter: (data, wizard, direction) => {
      console.log(`Entered payment step from ${direction}`)
      
      // Track analytics
      analytics.track('payment_step_entered', {
        direction,
        cartTotal: data.cartTotal,
      })
      
      // Focus first input
      document.getElementById('card-number')?.focus()
    },
    
    // ===== BEFORE LEAVE =====
    // Called before leaving the step
    // Return { block: true } to prevent leaving
    beforeLeave: async (data, wizard, direction) => {
      // Only validate when going next
      if (direction === 'next') {
        // Check if payment is confirmed
        if (!data.paymentConfirmed) {
          return {
            block: true,
            message: 'Ödeme bilgilerini onaylamalısınız',
          }
        }
        
        // Process payment
        const result = await processPayment(data)
        if (!result.success) {
          return {
            block: true,
            message: result.error,
          }
        }
      }
      
      return { block: false }
    },
    
    // ===== ON LEAVE =====
    // Called after leaving the step
    onLeave: (data, wizard, direction) => {
      console.log(`Left payment step going ${direction}`)
      
      // Cleanup
      clearSensitiveData()
      
      // Track
      analytics.track('payment_step_left', { direction })
    },
  },
]
```

---

## PERSISTENCE

```typescript
// ===== AUTO PERSISTENCE =====

const wizard = createWizard({
  steps,
  persistKey: 'checkout-wizard',
  persistStorage: 'local',                    // 'local' | 'session'
  persistFields: ['data', 'currentStep', 'history'],
  persistDebounce: 300,                       // Debounce saves
})

// Auto-restores on creation if data exists
// Auto-saves on state changes

// ===== MANUAL CONTROL =====

// Force persist
await wizard.persist()

// Force restore
await wizard.restore()

// Clear persisted data
await wizard.clearPersisted()

// ===== CUSTOM STORAGE =====

const wizard = createWizard({
  steps,
  persistKey: 'checkout',
  persistStorage: {
    get: async (key) => {
      return await redis.get(key)
    },
    set: async (key, value) => {
      await redis.set(key, value, 'EX', 3600) // 1 hour TTL
    },
    remove: async (key) => {
      await redis.del(key)
    },
  },
})

// ===== ENCRYPTION =====

import { encrypt, decrypt } from './crypto'

const wizard = createWizard({
  steps,
  persistKey: 'secure-wizard',
  persistStorage: {
    get: (key) => {
      const encrypted = localStorage.getItem(key)
      return encrypted ? decrypt(encrypted) : null
    },
    set: (key, value) => {
      localStorage.setItem(key, encrypt(value))
    },
    remove: (key) => {
      localStorage.removeItem(key)
    },
  },
})
```

---

## EVENTS & SUBSCRIPTIONS

```typescript
// ===== SUBSCRIBE TO ALL CHANGES =====

const unsubscribe = wizard.subscribe((state, prevState) => {
  console.log('State changed:', state)
  
  if (state.currentStep !== prevState.currentStep) {
    console.log('Step changed:', state.currentStep.id)
  }
  
  if (state.data !== prevState.data) {
    console.log('Data changed:', state.data)
  }
})

// Unsubscribe
unsubscribe()

// ===== SPECIFIC EVENTS =====

wizard.on('step:change', ({ step, direction, prevStep }) => {
  console.log(`Changed from ${prevStep.id} to ${step.id} (${direction})`)
})

wizard.on('step:enter', ({ step, direction }) => {
  console.log(`Entered ${step.id} from ${direction}`)
})

wizard.on('step:leave', ({ step, direction }) => {
  console.log(`Left ${step.id} going ${direction}`)
})

wizard.on('data:change', ({ data, changedFields }) => {
  console.log('Changed fields:', changedFields)
})

wizard.on('validation:error', ({ step, errors }) => {
  console.log(`Validation failed at ${step.id}:`, errors)
})

wizard.on('validation:success', ({ step }) => {
  console.log(`Validation passed at ${step.id}`)
})

wizard.on('complete', ({ data }) => {
  console.log('Wizard completed with:', data)
})

wizard.on('cancel', ({ data, step }) => {
  console.log(`Cancelled at ${step.id}`)
})

wizard.on('reset', () => {
  console.log('Wizard reset')
})

wizard.on('persist', ({ data }) => {
  console.log('Data persisted')
})

wizard.on('restore', ({ data }) => {
  console.log('Data restored')
})

// ===== REMOVE LISTENER =====

const handler = ({ step }) => console.log(step)
wizard.on('step:enter', handler)
wizard.off('step:enter', handler)

// ===== ONCE =====

wizard.once('complete', ({ data }) => {
  // Only called once
  sendConfirmationEmail(data)
})
```

---

## MIDDLEWARE

```typescript
// ===== LOGGING MIDDLEWARE =====

wizard.use((action, next, getState) => {
  console.log('Before:', action.type, getState())
  next(action)
  console.log('After:', action.type, getState())
})

// ===== ANALYTICS MIDDLEWARE =====

wizard.use((action, next, getState) => {
  next(action)
  
  if (action.type === 'NEXT' || action.type === 'PREV') {
    analytics.track('wizard_navigation', {
      action: action.type,
      step: getState().currentStep.id,
    })
  }
})

// ===== VALIDATION MIDDLEWARE =====

wizard.use(async (action, next, getState) => {
  if (action.type === 'NEXT') {
    const errors = await wizard.validate()
    if (errors) {
      console.log('Blocked navigation due to errors:', errors)
      return // Don't call next
    }
  }
  next(action)
})

// ===== CONFIRMATION MIDDLEWARE =====

wizard.use(async (action, next, getState) => {
  if (action.type === 'COMPLETE') {
    const confirmed = await showConfirmDialog('Complete wizard?')
    if (!confirmed) return
  }
  next(action)
})

// ===== REMOVE MIDDLEWARE =====

const unsubscribe = wizard.use(loggingMiddleware)
unsubscribe() // Remove middleware
```

---

## REACT ADAPTER

```tsx
import {
  // Provider & Context
  WizardProvider,
  
  // Hooks
  useWizard,
  useWizardStep,
  useWizardForm,
  useWizardNavigation,
  useWizardProgress,
  useWizardData,
  useWizardValidation,
  
  // Components
  WizardStepper,
  WizardContent,
  WizardNavigation,
  WizardProgress,
} from '@oxog/wizardkit/react'

// ============ PROVIDER ============

function App() {
  const wizard = useMemo(() => createWizard({
    steps: checkoutSteps,
    initialData: { name: '', email: '' },
  }), [])
  
  return (
    <WizardProvider
      wizard={wizard}
      onComplete={async (data) => {
        await submitOrder(data)
        router.push('/success')
      }}
      onCancel={() => {
        router.push('/cart')
      }}
    >
      <CheckoutWizard />
    </WizardProvider>
  )
}

// ============ MAIN HOOK ============

function CheckoutWizard() {
  const {
    // State
    currentStep,
    steps,
    activeSteps,
    data,
    errors,
    progress,
    progressPercent,
    isFirst,
    isLast,
    canGoNext,
    canGoPrev,
    isLoading,
    isComplete,
    
    // Navigation
    next,
    prev,
    goTo,
    skip,
    reset,
    complete,
    
    // Data
    setData,
    setField,
    getData,
    
    // Validation
    validate,
    isValid,
    clearErrors,
    
    // Raw instance
    wizard,
  } = useWizard()

  return (
    <div className="wizard-container">
      <WizardStepper />
      
      <div className="wizard-content">
        {currentStep.id === 'personal' && <PersonalStep />}
        {currentStep.id === 'address' && <AddressStep />}
        {currentStep.id === 'payment' && <PaymentStep />}
        {currentStep.id === 'confirm' && <ConfirmStep />}
      </div>
      
      <WizardNavigation />
    </div>
  )
}

// ============ STEP HOOK ============

function PersonalStep() {
  const {
    isActive,
    isCurrent,
    isCompleted,
    isUpcoming,
    isDisabled,
    data,
    errors,
    setField,
    validate,
  } = useWizardStep('personal')

  return (
    <div className={isCurrent ? 'active' : ''}>
      <h2>Kişisel Bilgiler</h2>
      
      <div className="form-field">
        <label>Ad Soyad</label>
        <input
          value={data.name || ''}
          onChange={(e) => setField('name', e.target.value)}
          className={errors.name ? 'error' : ''}
        />
        {errors.name && <span className="error-text">{errors.name}</span>}
      </div>
      
      <div className="form-field">
        <label>Email</label>
        <input
          type="email"
          value={data.email || ''}
          onChange={(e) => setField('email', e.target.value)}
          className={errors.email ? 'error' : ''}
        />
        {errors.email && <span className="error-text">{errors.email}</span>}
      </div>
    </div>
  )
}

// ============ FORM HOOK ============

function PersonalStep() {
  const {
    register,
    errors,
    values,
    setValue,
    handleSubmit,
    isValid,
    isDirty,
  } = useWizardForm({
    stepId: 'personal',
    // Optional: Zod/Yup schema
    schema: personalSchema,
  })

  const onSubmit = handleSubmit((data) => {
    console.log('Form submitted:', data)
  })

  return (
    <form onSubmit={onSubmit}>
      <div className="form-field">
        <label>Ad Soyad</label>
        <input {...register('name')} />
        {errors.name && <span>{errors.name.message}</span>}
      </div>
      
      <div className="form-field">
        <label>Email</label>
        <input {...register('email', { type: 'email' })} />
        {errors.email && <span>{errors.email.message}</span>}
      </div>
      
      <button type="submit" disabled={!isValid}>
        Kaydet
      </button>
    </form>
  )
}

// ============ NAVIGATION HOOK ============

function WizardButtons() {
  const {
    next,
    prev,
    canGoNext,
    canGoPrev,
    isFirst,
    isLast,
    isLoading,
    skip,
    canSkip,
  } = useWizardNavigation()

  return (
    <div className="wizard-buttons">
      <button
        onClick={prev}
        disabled={isFirst || !canGoPrev || isLoading}
      >
        ← Geri
      </button>
      
      {canSkip && (
        <button onClick={skip} disabled={isLoading}>
          Atla
        </button>
      )}
      
      <button
        onClick={next}
        disabled={!canGoNext || isLoading}
      >
        {isLoading ? 'Yükleniyor...' : isLast ? 'Tamamla ✓' : 'İleri →'}
      </button>
    </div>
  )
}

// ============ PROGRESS HOOK ============

function ProgressIndicator() {
  const {
    progress,
    progressPercent,
    completedSteps,
    totalSteps,
    currentIndex,
  } = useWizardProgress()

  return (
    <div className="progress-container">
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
      <span className="progress-text">
        {completedSteps} / {totalSteps} tamamlandı
      </span>
    </div>
  )
}

// ============ DATA HOOK ============

function OrderSummary() {
  const {
    data,
    getData,
    setData,
    setField,
    resetData,
  } = useWizardData()

  return (
    <div className="summary">
      <h3>Sipariş Özeti</h3>
      <p>Ad: {data.name}</p>
      <p>Email: {data.email}</p>
      <p>Adres: {data.address}</p>
      <button onClick={() => setField('coupon', 'INDIRIM10')}>
        Kupon Uygula
      </button>
    </div>
  )
}

// ============ VALIDATION HOOK ============

function ValidationStatus() {
  const {
    errors,
    hasErrors,
    validate,
    validateAll,
    isValid,
    clearErrors,
  } = useWizardValidation()

  return (
    <div>
      {hasErrors && (
        <div className="error-summary">
          {Object.entries(errors).map(([field, error]) => (
            <p key={field}>{field}: {error}</p>
          ))}
        </div>
      )}
      <button onClick={clearErrors}>Hataları Temizle</button>
    </div>
  )
}

// ============ BUILT-IN COMPONENTS ============

// Stepper
<WizardStepper
  variant="horizontal"              // 'horizontal' | 'vertical' | 'dots' | 'progress'
  showNumbers={true}
  showTitles={true}
  showDescriptions={false}
  clickable={true}                  // Click to navigate
  className="my-stepper"
  stepClassName="my-step"
  activeClassName="active"
  completedClassName="completed"
  renderStep={(step, state) => (
    <div className={`custom-step ${state.isCurrent ? 'current' : ''}`}>
      <span className="step-number">{step.index + 1}</span>
      <span className="step-title">{step.title}</span>
    </div>
  )}
/>

// Content with transitions
<WizardContent
  components={{
    'personal': PersonalStep,
    'address': AddressStep,
    'payment': PaymentStep,
    'confirm': ConfirmStep,
  }}
  transition="slide"                // 'slide' | 'fade' | 'none'
  transitionDuration={300}
  className="wizard-content"
  // Or render function
  render={(currentStep) => {
    switch (currentStep.id) {
      case 'personal': return <PersonalStep />
      case 'address': return <AddressStep />
      default: return <div>Unknown step</div>
    }
  }}
/>

// Navigation
<WizardNavigation
  prevLabel="← Geri"
  nextLabel="İleri →"
  completeLabel="Tamamla ✓"
  skipLabel="Atla"
  showSkip={true}
  showProgress={true}
  className="wizard-nav"
  prevClassName="btn-prev"
  nextClassName="btn-next"
  renderPrev={(props) => (
    <button {...props} className="custom-prev">
      <ArrowLeft /> Geri
    </button>
  )}
  renderNext={(props, { isLast, isLoading }) => (
    <button {...props} className="custom-next">
      {isLoading ? <Spinner /> : isLast ? 'Bitir' : 'Devam'}
    </button>
  )}
/>

// Progress bar
<WizardProgress
  variant="bar"                     // 'bar' | 'circle' | 'steps'
  showPercentage={true}
  showStepCount={true}
  className="wizard-progress"
/>
```

---

## VUE ADAPTER

```typescript
import {
  createWizardPlugin,
  useWizard,
  useWizardStep,
  useWizardNavigation,
  WizardStepper,
  WizardContent,
  WizardNavigation,
} from '@oxog/wizardkit/vue'

// Plugin
const app = createApp(App)
app.use(createWizardPlugin())

// Composition API
<script setup>
import { useWizard, useWizardStep } from '@oxog/wizardkit/vue'

const wizard = useWizard({
  steps: [...],
  initialData: {},
})

const {
  currentStep,
  data,
  errors,
  next,
  prev,
  setField,
} = wizard

// Step-specific
const personalStep = useWizardStep('personal')
</script>

<template>
  <div class="wizard">
    <WizardStepper :wizard="wizard" />
    
    <div class="content">
      <div v-if="currentStep.id === 'personal'">
        <input
          :value="data.name"
          @input="setField('name', $event.target.value)"
        />
        <span v-if="errors.name">{{ errors.name }}</span>
      </div>
    </div>
    
    <WizardNavigation :wizard="wizard" />
  </div>
</template>
```

---

## SVELTE ADAPTER

```typescript
import {
  createWizardStore,
  wizardStep,
} from '@oxog/wizardkit/svelte'

// Create store
const wizard = createWizardStore({
  steps: [...],
  initialData: {},
})

// Usage in component
<script>
  import { wizard } from './wizard'
  
  $: currentStep = $wizard.currentStep
  $: data = $wizard.data
  $: errors = $wizard.errors
</script>

<div class="wizard">
  <!-- Stepper -->
  <div class="stepper">
    {#each $wizard.activeSteps as step}
      <button
        class:active={step.isCurrent}
        class:completed={step.isCompleted}
        on:click={() => wizard.goTo(step.id)}
      >
        {step.title}
      </button>
    {/each}
  </div>
  
  <!-- Content -->
  {#if currentStep.id === 'personal'}
    <div>
      <input
        value={data.name || ''}
        on:input={(e) => wizard.setField('name', e.target.value)}
      />
      {#if errors.name}
        <span class="error">{errors.name}</span>
      {/if}
    </div>
  {/if}
  
  <!-- Navigation -->
  <div class="nav">
    <button
      on:click={() => wizard.prev()}
      disabled={$wizard.isFirst}
    >
      Geri
    </button>
    <button
      on:click={() => wizard.next()}
      disabled={!$wizard.canGoNext}
    >
      {$wizard.isLast ? 'Tamamla' : 'İleri'}
    </button>
  </div>
</div>

// Svelte action
<div use:wizardStep={{ id: 'personal', wizard }}>
  ...
</div>
```

---

## FORM LIBRARY ADAPTERS

```typescript
// ===== REACT HOOK FORM =====

import { useForm } from 'react-hook-form'
import { createReactHookFormAdapter } from '@oxog/wizardkit/adapters'

function CheckoutWizard() {
  const form = useForm()
  
  const wizard = useMemo(() => createWizard({
    steps,
    formAdapter: createReactHookFormAdapter(form),
  }), [form])
  
  return (
    <WizardProvider wizard={wizard}>
      <FormProvider {...form}>
        <WizardContent />
      </FormProvider>
    </WizardProvider>
  )
}

// ===== FORMIK =====

import { useFormik } from 'formik'
import { createFormikAdapter } from '@oxog/wizardkit/adapters'

const formik = useFormik({
  initialValues: {},
  onSubmit: () => {},
})

const wizard = createWizard({
  steps,
  formAdapter: createFormikAdapter(formik),
})

// ===== CUSTOM ADAPTER =====

const customAdapter: FormAdapter<MyData> = {
  getData: () => myFormState.values,
  setData: (data) => myFormState.setValues(data),
  validate: async () => {
    const result = await myFormState.validate()
    return result.isValid
  },
  getErrors: () => myFormState.errors,
  reset: () => myFormState.reset(),
}
```

---

## TECHNICAL REQUIREMENTS

| Requirement | Value |
|-------------|-------|
| Runtime | Universal (Browser + Node) |
| Module | ESM + CJS |
| Node.js | >= 18 |
| TypeScript | Strict mode, full generics |
| Dependencies | ZERO |
| Test Coverage | 100% |
| Bundle Size | < 4KB core |

---

## PROJECT STRUCTURE

```
wizardkit/
├── src/
│   ├── index.ts                    # Main exports
│   ├── types.ts                    # Type definitions
│   │
│   ├── core/
│   │   ├── wizard.ts               # Main wizard class
│   │   ├── step.ts                 # Step management
│   │   ├── navigation.ts           # Navigation logic
│   │   ├── state.ts                # State management
│   │   ├── conditions.ts           # Condition evaluation
│   │   ├── branching.ts            # Branch logic
│   │   └── middleware.ts           # Middleware system
│   │
│   ├── validation/
│   │   ├── validator.ts            # Validation engine
│   │   ├── schema.ts               # Schema-based validation
│   │   ├── rules.ts                # Built-in rules
│   │   └── async.ts                # Async validation
│   │
│   ├── persistence/
│   │   ├── storage.ts              # Storage interface
│   │   ├── local.ts                # localStorage adapter
│   │   ├── session.ts              # sessionStorage adapter
│   │   └── memory.ts               # In-memory adapter
│   │
│   ├── events/
│   │   ├── emitter.ts              # Event emitter
│   │   └── types.ts                # Event types
│   │
│   ├── adapters/
│   │   ├── react/
│   │   │   ├── index.ts
│   │   │   ├── provider.tsx
│   │   │   ├── context.ts
│   │   │   ├── hooks/
│   │   │   │   ├── useWizard.ts
│   │   │   │   ├── useWizardStep.ts
│   │   │   │   ├── useWizardForm.ts
│   │   │   │   ├── useWizardNavigation.ts
│   │   │   │   ├── useWizardProgress.ts
│   │   │   │   ├── useWizardData.ts
│   │   │   │   └── useWizardValidation.ts
│   │   │   └── components/
│   │   │       ├── WizardStepper.tsx
│   │   │       ├── WizardContent.tsx
│   │   │       ├── WizardNavigation.tsx
│   │   │       └── WizardProgress.tsx
│   │   │
│   │   ├── vue/
│   │   │   ├── index.ts
│   │   │   ├── plugin.ts
│   │   │   ├── composables/
│   │   │   │   ├── useWizard.ts
│   │   │   │   └── useWizardStep.ts
│   │   │   └── components/
│   │   │       ├── WizardStepper.vue
│   │   │       ├── WizardContent.vue
│   │   │       └── WizardNavigation.vue
│   │   │
│   │   ├── svelte/
│   │   │   ├── index.ts
│   │   │   ├── store.ts
│   │   │   └── actions.ts
│   │   │
│   │   └── form/
│   │       ├── react-hook-form.ts
│   │       └── formik.ts
│   │
│   └── utils/
│       ├── helpers.ts
│       └── array.ts
│
├── tests/
│   ├── unit/
│   │   ├── core/
│   │   ├── validation/
│   │   ├── persistence/
│   │   └── adapters/
│   ├── integration/
│   │   ├── wizard.test.ts
│   │   ├── conditional.test.ts
│   │   ├── branching.test.ts
│   │   └── persistence.test.ts
│   └── fixtures/
│
├── examples/
│   ├── vanilla/
│   │   ├── basic/
│   │   ├── conditional/
│   │   └── checkout/
│   ├── react/
│   │   ├── basic/
│   │   ├── checkout/
│   │   ├── onboarding/
│   │   └── survey/
│   ├── vue/
│   │   └── checkout/
│   └── svelte/
│       └── checkout/
│
├── website/                        # React + Vite documentation
│   └── [See WEBSITE section]
│
├── .github/
│   └── workflows/
│       └── deploy-website.yml
│
├── SPECIFICATION.md
├── IMPLEMENTATION.md
├── TASKS.md
├── README.md
├── CHANGELOG.md
├── LICENSE
├── package.json
├── tsconfig.json
├── tsup.config.ts
└── vitest.config.ts
```

---

## DOCUMENTATION WEBSITE

Build a modern documentation site using React + Vite.

### Technology Stack (MANDATORY)

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18+ | UI framework |
| **Vite** | 5+ | Build tool |
| **TypeScript** | 5+ | Type safety |
| **Tailwind CSS** | 3+ | Styling (npm, NOT CDN) |
| **shadcn/ui** | Latest | UI components |
| **React Router** | 6+ | Routing |
| **Lucide React** | Latest | Icons |
| **Framer Motion** | Latest | Animations |
| **Prism.js** | Latest | Syntax highlighting |

### Fonts (MANDATORY)

- **JetBrains Mono** - ALL code
- **Inter** - Body text

### Required Pages

1. **Home** (`/`)
   - Hero with wizard animation
   - Feature highlights
   - Install command
   - Live demo (interactive wizard)
   - Comparison table

2. **Getting Started** (`/docs/getting-started`)
   - Installation
   - Quick start
   - Basic example

3. **Core Concepts** (`/docs/concepts/*`)
   - Steps
   - Navigation
   - Data Management
   - Validation
   - Conditional Steps
   - Branching
   - Lifecycle Hooks
   - Persistence
   - Events
   - Middleware

4. **API Reference** (`/docs/api/*`)
   - createWizard
   - WizardInstance
   - Types

5. **React Guide** (`/docs/react/*`)
   - WizardProvider
   - useWizard
   - useWizardStep
   - useWizardForm
   - Components

6. **Vue Guide** (`/docs/vue/*`)

7. **Svelte Guide** (`/docs/svelte/*`)

8. **Examples** (`/examples`)
   - Checkout Flow
   - Onboarding Wizard
   - Survey/Quiz
   - Multi-step Form
   - Conditional Flow

9. **Playground** (`/playground`)
   - Interactive wizard builder
   - Step configurator
   - Live preview

### Design Theme

- Purple/violet accent (#8b5cf6) - Wizard/magic theme
- Dark mode default
- Light mode support

### Code Features (MANDATORY)

- ✅ Line numbers
- ✅ Syntax highlighting
- ✅ Copy button
- ✅ Filename header
- ✅ IDE window style
- ✅ JetBrains Mono font

### GitHub Actions

```yaml
# .github/workflows/deploy-website.yml
name: Deploy Website

on:
  push:
    branches: [main]
    paths:
      - 'website/**'
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: website/package-lock.json
      - run: cd website && npm ci
      - run: cd website && npm run build
      - run: echo "wizardkit.oxog.dev" > website/dist/CNAME
      - uses: actions/configure-pages@v4
      - uses: actions/upload-pages-artifact@v3
        with:
          path: website/dist

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - uses: actions/deploy-pages@v4
        id: deployment
```

---

## README.md

````markdown
# WizardKit

<div align="center">
  <img src="website/public/logo.svg" alt="WizardKit" width="120" />
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

</div>

---

## Features

- 🧙 **Multi-step Wizard** - Any step-by-step flow
- 🔀 **Conditional Steps** - Show/hide based on data
- 🌳 **Branching** - A→B or A→C navigation
- ✅ **Validation** - Sync, async, schema-based
- 💾 **Persistence** - Auto-save progress
- 🎣 **Lifecycle Hooks** - beforeEnter, onLeave, etc.
- 📦 **Form Integration** - Built-in or external
- ⚛️ **React/Vue/Svelte** - Framework adapters
- 🔌 **Zero Dependencies** - Lightweight
- ⚡ **< 4KB** - Tiny bundle

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
  onComplete: (data) => console.log('Done!', data),
})

wizard.next()
wizard.setData({ name: 'John' })
```

## React

```tsx
import { WizardProvider, useWizard, WizardStepper } from '@oxog/wizardkit/react'

function App() {
  return (
    <WizardProvider wizard={wizard}>
      <WizardStepper />
      <WizardContent />
      <WizardNavigation />
    </WizardProvider>
  )
}
```

## Documentation

Visit [wizardkit.oxog.dev](https://wizardkit.oxog.dev) for full documentation.

## License

MIT © [Ersin KOÇ](https://github.com/ersinkoc)
````

---

## IMPLEMENTATION CHECKLIST

### Before Implementation
- [ ] Create SPECIFICATION.md
- [ ] Create IMPLEMENTATION.md
- [ ] Create TASKS.md

### Core
- [ ] Wizard class
- [ ] Step management
- [ ] Navigation (next/prev/goTo)
- [ ] State management
- [ ] Condition evaluation
- [ ] Branching logic
- [ ] Middleware system

### Validation
- [ ] Function-based validation
- [ ] Async validation
- [ ] Schema-based validation
- [ ] Built-in rules
- [ ] Custom validator support

### Persistence
- [ ] Storage interface
- [ ] localStorage adapter
- [ ] sessionStorage adapter
- [ ] Custom storage support
- [ ] Auto-save/restore

### Events
- [ ] Event emitter
- [ ] All event types
- [ ] Subscribe/unsubscribe

### Adapters
- [ ] React hooks
- [ ] React components
- [ ] Vue composables
- [ ] Vue components
- [ ] Svelte store
- [ ] Form library adapters

### Testing
- [ ] 100% coverage
- [ ] All tests passing

### Website
- [ ] React + Vite setup
- [ ] All pages
- [ ] Interactive examples
- [ ] Playground
- [ ] GitHub Actions

---

## BEGIN IMPLEMENTATION

Start by creating SPECIFICATION.md with the complete package specification. Then proceed with IMPLEMENTATION.md and TASKS.md before writing any actual code.

Remember: This package will be published to NPM. It must be production-ready, zero-dependency, fully tested, and professionally documented.

**Date: 2025-12-28**
**Author: Ersin KOÇ**
**Repository: github.com/ersinkoc/wizardkit**
**Website: wizardkit.oxog.dev**
