// ============ FACTORY FUNCTION ============
export { createWizard } from './core/factory.js'

// ============ CORE ============
export { Wizard } from './core/wizard.js'

// ============ TYPES ============
export type {
  // Step types
  StepDefinition,
  StepCondition,
  BranchDefinition,
  Step,

  // Validation types
  ValidateFn,
  ValidateAsyncFn,
  ValidationErrors,
  ValidationSchema,
  FieldValidation,
  ValidationRule,

  // Lifecycle hooks
  BeforeEnterHook,
  OnEnterHook,
  BeforeLeaveHook,
  OnLeaveHook,
  BeforeLeaveResult,
  NavigationDirection,

  // Wizard config
  WizardConfig,

  // Persistence
  PersistStorage,

  // Form adapter
  FormAdapter,

  // Custom validator
  CustomValidator,

  // Wizard state
  WizardState,

  // Wizard instance
  WizardInstance,
  Unsubscribe,

  // Events
  WizardEvent,
  WizardEventMap,
  WizardEventHandler,

  // Actions
  WizardAction,

  // Middleware
  WizardMiddleware,

  // Context
  WizardContext,
} from './types.js'

// ============ EVENTS ============
export { EventEmitter, createEventEmitter } from './events/emitter.js'

// ============ VALIDATION ============
export {
  validationRules,
  validateField,
  validateSchema,
  getErrorMessage,
  defaultMessages,
} from './validation/rules.js'
export { ValidationEngine, createValidationEngine } from './validation/validator.js'

// ============ PERSISTENCE ============
export {
  localStorageAdapter,
  sessionStorageAdapter,
  createMemoryStorage,
  createStorage,
} from './persistence/storage.js'
export {
  PersistenceManager,
  createPersistenceManager,
} from './persistence/manager.js'
export type { PersistenceConfig } from './persistence/manager.js'
