// ============ STEP TYPES ============

export interface StepDefinition<TData = Record<string, unknown>> {
  // Identity
  id: string
  title: string
  description?: string
  icon?: string
  meta?: Record<string, unknown>

  // Visibility & Access
  condition?: StepCondition<TData>
  conditions?: StepCondition<TData>[] // AND logic
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

export type StepCondition<TData> = (data: TData, context: WizardContext) => boolean

export interface BranchDefinition<TData> {
  condition: (data: TData) => boolean
  nextStep: string
}

export interface Step {
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

// ============ VALIDATION TYPES ============

export type ValidateFn<TData> = (data: TData) => ValidationErrors | null
export type ValidateAsyncFn<TData> = (
  data: TData
) => ValidationErrors | null | Promise<ValidationErrors | null>
export type ValidationErrors = Record<string, string>

export interface ValidationSchema {
  [field: string]: FieldValidation
}

export interface FieldValidation {
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

export type ValidationRule =
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

export type BeforeEnterHook<TData> = (
  data: TData,
  wizard: WizardInstance<TData>
) => boolean | Promise<boolean>

export type OnEnterHook<TData> = (
  data: TData,
  wizard: WizardInstance<TData>,
  direction: NavigationDirection
) => void

export type BeforeLeaveHook<TData> = (
  data: TData,
  wizard: WizardInstance<TData>,
  direction: NavigationDirection
) => BeforeLeaveResult | Promise<BeforeLeaveResult>

export type OnLeaveHook<TData> = (
  data: TData,
  wizard: WizardInstance<TData>,
  direction: NavigationDirection
) => void

export interface BeforeLeaveResult {
  block: boolean
  message?: string
}

export type NavigationDirection = 'next' | 'prev' | 'jump'

// ============ WIZARD CONFIG ============

export interface WizardConfig<TData = Record<string, unknown>> {
  // Steps
  steps: StepDefinition<TData>[]

  // Initial state
  initialData?: Partial<TData>
  initialStep?: string | number

  // Behavior
  linear?: boolean // Default: true
  validateOnNext?: boolean // Default: true
  validateOnPrev?: boolean // Default: false
  allowSkipValidation?: boolean // Default: false

  // Persistence
  persistKey?: string
  persistStorage?: 'local' | 'session' | PersistStorage
  persistFields?: ('data' | 'currentStep' | 'history')[]
  persistDebounce?: number // Default: 300ms

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

export interface PersistStorage {
  get: (key: string) => string | null | Promise<string | null>
  set: (key: string, value: string) => void | Promise<void>
  remove: (key: string) => void | Promise<void>
}

// ============ FORM ADAPTER ============

export interface FormAdapter<TData> {
  getData: () => TData
  setData: (data: Partial<TData>) => void
  validate: () => Promise<boolean> | boolean
  getErrors: () => ValidationErrors
  reset?: () => void
}

// ============ CUSTOM VALIDATOR ============

export type CustomValidator<TData> = (
  schema: ValidationSchema,
  data: TData
) => ValidationErrors | null | Promise<ValidationErrors | null>

// ============ WIZARD STATE ============

export interface WizardState<TData = Record<string, unknown>> {
  // Current position
  currentStep: Step
  currentIndex: number

  // Steps
  steps: Step[]
  activeSteps: Step[] // Conditions passed
  visibleSteps: Step[] // For UI display

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
  progress: number // 0-1
  progressPercent: number // 0-100
  completedSteps: number
  totalSteps: number

  // Status
  isLoading: boolean // During async operations
  isValidating: boolean
}

// ============ WIZARD INSTANCE ============

export interface WizardInstance<TData = Record<string, unknown>> {
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
  checkCanGoNext(): Promise<boolean>
  checkCanGoPrev(): boolean
  checkCanGoTo(stepId: string): Promise<boolean>

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
  on<E extends WizardEvent>(
    event: E,
    handler: WizardEventHandler<E>
  ): Unsubscribe
  off<E extends WizardEvent>(event: E, handler: WizardEventHandler<E>): void
  once<E extends WizardEvent>(event: E, handler: WizardEventHandler<E>): void

  subscribe(
    handler: (state: WizardState<TData>, prevState: WizardState<TData>) => void
  ): Unsubscribe

  // ===== ACTION DISPATCH =====
  dispatch(action: WizardAction): void | Promise<void>

  // ===== MIDDLEWARE =====
  use(middleware: WizardMiddleware<TData>): Unsubscribe

  // ===== LIFECYCLE =====
  destroy(): void
}

export type Unsubscribe = () => void

// ============ EVENTS ============

export type WizardEvent =
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

export interface WizardEventMap {
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

export type WizardEventHandler<E extends WizardEvent> = (
  payload: WizardEventMap[E]
) => void

// ============ ACTIONS ============

export type WizardAction<TData = Record<string, unknown>> =
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
  | { type: 'SET_DATA'; data: Partial<TData>; replace?: boolean }
  | { type: 'MERGE_DATA'; data: Partial<TData> }
  | { type: 'SET_FIELD'; field: string; value: unknown }
  | { type: 'CLEAR_FIELD'; field: string }
  | { type: 'SET_ERRORS'; errors: ValidationErrors }
  | { type: 'CLEAR_ERRORS'; stepId?: string }
  | { type: 'UNDO' }

// ============ MIDDLEWARE ============

export type WizardMiddleware<TData = Record<string, unknown>> = (
  action: WizardAction<TData>,
  next: (action: WizardAction<TData>) => void | Promise<void>,
  getState: () => WizardState<TData>
) => void | Promise<void>

// ============ CONTEXT ============

export interface WizardContext {
  currentStep: Step
  history: string[]
  direction: NavigationDirection | null
}
