import { CodeBlock } from '@/components/code/CodeBlock'
import { Link } from 'react-router-dom'
import { ChevronRight, FileCode } from 'lucide-react'

export function Types() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <article className="prose prose-slate dark:prose-invert max-w-none">
        <div className="flex items-center gap-3 mb-4">
          <FileCode className="w-10 h-10 text-primary" />
          <h1 className="text-4xl font-bold mb-0">TypeScript Types</h1>
        </div>
        <p className="text-xl text-muted-foreground mb-8">
          Complete type definitions for WizardKit
        </p>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Core Types</h2>

          <div className="space-y-6">
            {/* WizardConfig */}
            <div className="p-5 rounded-xl border border-border bg-card">
              <h3 className="text-xl font-semibold text-primary mb-3">WizardConfig&lt;TData&gt;</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Configuration object passed to <code>createWizard()</code>
              </p>
              <CodeBlock
                code={`interface WizardConfig<TData = Record<string, unknown>> {
  // Required
  steps: StepDefinition<TData>[]

  // Optional
  initialData?: TData
  initialStep?: string | number
  linear?: boolean
  validateOnNext?: boolean
  validateOnPrev?: boolean

  // Persistence
  persistKey?: string
  persistStorage?: 'local' | 'session' | 'memory'
  persistDebounce?: number
  persistFields?: (keyof WizardState<TData>)[]

  // Callbacks
  onStepChange?: StepChangeCallback<TData>
  onDataChange?: DataChangeCallback<TData>
  onValidationError?: ValidationErrorCallback<TData>
  onComplete?: CompleteCallback<TData>
  onCancel?: CancelCallback<TData>
}`}
                language="typescript"
                filename="wizard-config.ts"
              />
            </div>

            {/* WizardInstance */}
            <div className="p-5 rounded-xl border border-border bg-card">
              <h3 className="text-xl font-semibold text-primary mb-3">WizardInstance&lt;TData&gt;</h3>
              <p className="text-sm text-muted-foreground mb-4">
                The wizard instance returned by <code>createWizard()</code>
              </p>
              <CodeBlock
                code={`interface WizardInstance<TData = Record<string, unknown>> {
  // Methods
  next: () => Promise<WizardState<TData>>
  prev: () => Promise<WizardState<TData>>
  goTo: (stepId: string) => Promise<WizardState<TData>>
  goToIndex: (index: number) => Promise<WizardState<TData>>
  first: () => Promise<WizardState<TData>>
  last: () => Promise<WizardState<TData>>
  skip: (count: number) => Promise<WizardState<TData>>

  setData: (data: Partial<TData> | ((prev: TData) => Partial<TData>)) => WizardInstance<TData>
  setField: <K extends keyof TData>(key: K, value: TData[K]) => WizardInstance<TData>
  resetData: () => WizardInstance<TData>
  setStepData: (stepId: string, data: Record<string, unknown>) => WizardInstance<TData>

  validate: (stepId?: string) => Promise<ValidationResult>
  isValid: (stepId?: string) => Promise<boolean>
  clearErrors: (stepId?: string) => void

  on: <E extends WizardEvent>(event: E, handler: EventHandler<E, TData>) => () => void

  save: () => Promise<WizardInstance<TData>>
  load: () => Promise<WizardInstance<TData>>
  clear: () => Promise<WizardInstance<TData>>

  complete: () => Promise<WizardState<TData>>
  cancel: () => Promise<WizardState<TData>>

  // Properties
  readonly data: TData
  readonly currentStep: StepDefinition<TData>
  readonly currentIndex: number
  readonly steps: StepDefinition<TData>[]
  readonly activeSteps: StepDefinition<TData>[]
  readonly errors: ValidationErrors
  readonly progress: number
  readonly progressPercent: number
  readonly isFirst: boolean
  readonly isLast: boolean
  readonly canGoNext: boolean
  readonly canGoPrev: boolean
  readonly isComplete: boolean
}`}
                language="typescript"
                filename="wizard-instance.ts"
              />
            </div>

            {/* WizardState */}
            <div className="p-5 rounded-xl border border-border bg-card">
              <h3 className="text-xl font-semibold text-primary mb-3">WizardState&lt;TData&gt;</h3>
              <p className="text-sm text-muted-foreground mb-4">
                The complete wizard state
              </p>
              <CodeBlock
                code={`interface WizardState<TData = Record<string, unknown>> {
  data: TData
  stepData: Record<string, Record<string, unknown>>
  currentStep: StepDefinition<TData>
  currentIndex: number
  steps: StepDefinition<TData>[]
  errors: ValidationErrors
  isComplete: boolean
  progress: number
}`}
                language="typescript"
                filename="wizard-state.ts"
              />
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Step Types</h2>

          <div className="p-5 rounded-xl border border-border bg-card">
            <h3 className="text-xl font-semibold text-primary mb-3">StepDefinition&lt;TData&gt;</h3>
            <CodeBlock
              code={`interface StepDefinition<TData = Record<string, unknown>> {
  // Required
  id: string
  title: string

  // Optional
  description?: string
  validation?: ValidationSchema<TData>
  isActive?: (data: TData) => boolean
  onEnter?: (data: TData) => TData | Partial<TData> | Promise<TData> | Promise<Partial<TData>>
  onLeave?: (data: TData) => void | Promise<void>
  meta?: Record<string, unknown>
}`}
              language="typescript"
              filename="step-definition.ts"
            />
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Validation Types</h2>

          <div className="space-y-6">
            {/* ValidationSchema */}
            <div className="p-5 rounded-xl border border-border bg-card">
              <h3 className="text-xl font-semibold text-primary mb-3">ValidationSchema&lt;TData&gt;</h3>
              <CodeBlock
                code={`interface ValidationSchema<TData = Record<string, unknown>> {
  [field: string]: ValidationRule<TData> | ValidationRule<TData>[]
}`}
                language="typescript"
              />
            </div>

            {/* ValidationRule */}
            <div className="p-5 rounded-xl border border-border bg-card">
              <h3 className="text-xl font-semibold text-primary mb-3">ValidationRule&lt;TData&gt;</h3>
              <CodeBlock
                code={`interface ValidationRule<TData = Record<string, unknown>> {
  // Built-in rules
  required?: boolean
  email?: boolean
  url?: boolean
  min?: number
  max?: number
  minLength?: number
  maxLength?: number
  pattern?: RegExp

  // Custom validation
  validate?: (
    value: unknown,
    data: TData
  ) => boolean | string | Promise<boolean> | Promise<string>

  // Error message
  message?: string

  // Custom error messages per rule
  messages?: {
    required?: string
    email?: string
    url?: string
    min?: string
    max?: string
    minLength?: string
    maxLength?: string
    pattern?: string
  }
}`}
                language="typescript"
              />
            </div>

            {/* ValidationResult */}
            <div className="p-5 rounded-xl border border-border bg-card">
              <h3 className="text-xl font-semibold text-primary mb-3">ValidationResult</h3>
              <CodeBlock
                code={`interface ValidationResult {
  valid: boolean
  errors: ValidationErrors
}`}
                language="typescript"
              />
            </div>

            {/* ValidationErrors */}
            <div className="p-5 rounded-xl border border-border bg-card">
              <h3 className="text-xl font-semibold text-primary mb-3">ValidationErrors</h3>
              <CodeBlock
                code={`type ValidationErrors = Record<
  string,
  string | string[] | Record<string, string>
>`}
                language="typescript"
              />
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Event Types</h2>

          <div className="space-y-6">
            {/* WizardEvent */}
            <div className="p-5 rounded-xl border border-border bg-card">
              <h3 className="text-xl font-semibold text-primary mb-3">WizardEvent</h3>
              <p className="text-sm text-muted-foreground mb-4">
                All available wizard events
              </p>
              <CodeBlock
                code={`type WizardEvent =
  | 'complete'
  | 'cancel'
  | 'step:change'
  | 'data:change'
  | 'validation:error'
  | 'validation:success'`}
                language="typescript"
              />
            </div>

            {/* EventPayloads */}
            <div className="p-5 rounded-xl border border-border bg-card">
              <h3 className="text-xl font-semibold text-primary mb-3">Event Payloads</h3>
              <CodeBlock
                code={`// Complete event
interface CompleteEvent<TData> {
  type: 'complete'
  data: TData
  step: StepDefinition<TData>
}

// Cancel event
interface CancelEvent<TData> {
  type: 'cancel'
  data: TData
  step: StepDefinition<TData>
}

// Step change event
interface StepChangeEvent<TData> {
  type: 'step:change'
  step: StepDefinition<TData>
  direction: 'next' | 'prev' | 'jump'
  data: TData
}

// Data change event
interface DataChangeEvent<TData> {
  type: 'data:change'
  data: TData
  changedFields: (keyof TData)[]
}

// Validation error event
interface ValidationErrorEvent<TData> {
  type: 'validation:error'
  step: StepDefinition<TData>
  errors: ValidationErrors
}

// Validation success event
interface ValidationSuccessEvent<TData> {
  type: 'validation:success'
  step: StepDefinition<TData>
}`}
                language="typescript"
                filename="event-payloads.ts"
              />
            </div>

            {/* EventHandler */}
            <div className="p-5 rounded-xl border border-border bg-card">
              <h3 className="text-xl font-semibold text-primary mb-3">EventHandler</h3>
              <CodeBlock
                code={`type EventHandler<E extends WizardEvent, TData> = (
  event: EventPayload<E, TData>
) => void | Promise<void>`}
                language="typescript"
              />
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Callback Types</h2>

          <div className="space-y-6">
            {/* StepChangeCallback */}
            <div className="p-4 rounded-lg border border-border bg-muted/30">
              <h3 className="font-semibold mb-2 text-primary">StepChangeCallback&lt;TData&gt;</h3>
              <CodeBlock
                code={`type StepChangeCallback<TData> = (
  step: StepDefinition<TData>,
  direction: 'next' | 'prev' | 'jump',
  data: TData
) => void | Promise<void>`}
                language="typescript"
              />
            </div>

            {/* DataChangeCallback */}
            <div className="p-4 rounded-lg border border-border bg-muted/30">
              <h3 className="font-semibold mb-2 text-primary">DataChangeCallback&lt;TData&gt;</h3>
              <CodeBlock
                code={`type DataChangeCallback<TData> = (
  data: TData,
  changedFields: (keyof TData)[]
) => void | Promise<void>`}
                language="typescript"
              />
            </div>

            {/* ValidationErrorCallback */}
            <div className="p-4 rounded-lg border border-border bg-muted/30">
              <h3 className="font-semibold mb-2 text-primary">ValidationErrorCallback&lt;TData&gt;</h3>
              <CodeBlock
                code={`type ValidationErrorCallback<TData> = (
  step: StepDefinition<TData>,
  errors: ValidationErrors
) => void | Promise<void>`}
                language="typescript"
              />
            </div>

            {/* CompleteCallback */}
            <div className="p-4 rounded-lg border border-border bg-muted/30">
              <h3 className="font-semibold mb-2 text-primary">CompleteCallback&lt;TData&gt;</h3>
              <CodeBlock
                code={`type CompleteCallback<TData> = (
  data: TData
) => void | Promise<void>`}
                language="typescript"
              />
            </div>

            {/* CancelCallback */}
            <div className="p-4 rounded-lg border border-border bg-muted/30">
              <h3 className="font-semibold mb-2 text-primary">CancelCallback&lt;TData&gt;</h3>
              <CodeBlock
                code={`type CancelCallback<TData> = (
  data: TData,
  step: StepDefinition<TData>
) => void | Promise<void>`}
                language="typescript"
              />
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Persistence Types</h2>

          <div className="space-y-4">
            <div className="p-4 rounded-lg border border-border bg-muted/30">
              <h3 className="font-semibold mb-2 text-primary">PersistStorage</h3>
              <CodeBlock
                code={`type PersistStorage = 'local' | 'session' | 'memory'`}
                language="typescript"
              />
            </div>

            <div className="p-4 rounded-lg border border-border bg-muted/30">
              <h3 className="font-semibold mb-2 text-primary">PersistConfig&lt;TData&gt;</h3>
              <CodeBlock
                code={`interface PersistConfig<TData = Record<string, unknown>> {
  key: string
  storage: PersistStorage
  debounce: number
  fields?: (keyof WizardState<TData>)[]
}`}
                language="typescript"
              />
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Utility Types</h2>

          <div className="space-y-4">
            <div className="p-4 rounded-lg border border-border bg-muted/30">
              <h3 className="font-semibold mb-2 text-primary">DeepPartial</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Makes all properties optional recursively
              </p>
              <CodeBlock
                code={`type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object
    ? DeepPartial<T[P]>
    : T[P]
}`}
                language="typescript"
              />
            </div>

            <div className="p-4 rounded-lg border border-border bg-muted/30">
              <h3 className="font-semibold mb-2 text-primary">Merge</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Merge two types
              </p>
              <CodeBlock
                code={`type Merge<A, B> = Omit<A, keyof B> & B`}
                language="typescript"
              />
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Type Guards</h2>

          <div className="p-5 rounded-xl border border-border bg-card">
            <h3 className="text-xl font-semibold text-primary mb-3">Built-in Type Guards</h3>
            <CodeBlock
              code={`// Check if wizard instance
function isWizardInstance(obj: unknown): obj is WizardInstance {
  return obj !== null &&
    typeof obj === 'object' &&
    'next' in obj &&
    'prev' in obj &&
    'data' in obj
}

// Check if step definition
function isStepDefinition(obj: unknown): obj is StepDefinition {
  return obj !== null &&
    typeof obj === 'object' &&
    'id' in obj &&
    'title' in obj
}`}
              language="typescript"
              filename="type-guards.ts"
            />
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Generic Usage Examples</h2>

          <h3 className="text-xl font-semibold mb-4">Basic Generic</h3>
          <CodeBlock
            code={`interface FormData {
  name: string
  email: string
}

const wizard = createWizard<FormData>({
  steps: [...],
  initialData: {
    name: '',
    email: ''
  }
})

// Type-safe access
wizard.data.name  // string
wizard.setField('email', 'test@example.com')  // OK
wizard.setField('age', 25)  // Type error!`}
            language="typescript"
            className="mb-6"
          />

          <h3 className="text-xl font-semibold mb-4">Inferred Generic</h3>
          <CodeBlock
            code={`// TypeScript infers the type from initialData
const wizard = createWizard({
  steps: [...],
  initialData: {
    name: '',
    email: '',
    age: 0
  }
})

// Type is: WizardInstance<{ name: string; email: string; age: number }>`}
            language="typescript"
            className="mb-6"
          />

          <h3 className="text-xl font-semibold mb-4">Union Types</h3>
          <CodeBlock
            code={`type UserRole = 'admin' | 'user' | 'guest'

interface UserData {
  name: string
  role: UserRole
  permissions?: string[]
}

const wizard = createWizard<UserData>({
  steps: [
    {
      id: 'admin-only',
      title: 'Admin Settings',
      isActive: (data) => data.role === 'admin'
    }
  ]
})`}
            language="typescript"
          />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">See Also</h2>
          <div className="space-y-2">
            <Link to="/api/create-wizard" className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-accent transition-colors">
              <div>
                <div className="font-medium">createWizard()</div>
                <div className="text-sm text-muted-foreground">Function reference</div>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </Link>
            <Link to="/api/wizard-instance" className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-accent transition-colors">
              <div>
                <div className="font-medium">Wizard Instance</div>
                <div className="text-sm text-muted-foreground">Methods and properties</div>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </Link>
            <Link to="/api/step-definition" className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-accent transition-colors">
              <div>
                <div className="font-medium">Step Definition</div>
                <div className="text-sm text-muted-foreground">Step interface</div>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </Link>
          </div>
        </section>
      </article>
    </div>
  )
}
