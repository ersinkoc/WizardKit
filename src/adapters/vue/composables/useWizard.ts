import { ref, computed, onUnmounted, type Ref } from 'vue'
import type { WizardInstance, WizardConfig, WizardState } from '../../../types.js'
import { createWizard } from '../../../core/factory.js'

/**
 * Main wizard composable for Vue
 * Provides reactive wizard state and methods
 */
export function useWizard<TData = Record<string, unknown>>(
  config?: WizardConfig<TData>
) {
  const wizard: Ref<WizardInstance<TData> | null> = ref(null)
  const state: Ref<WizardState<TData> | null> = ref(null)
  let unsubscribe: (() => void) | null = null

  // Create wizard if config is provided
  if (config && !wizard.value) {
    wizard.value = createWizard<TData>(config)

    // Subscribe to state changes
    unsubscribe = wizard.value.subscribe((newState) => {
      state.value = newState as WizardState<TData>
    })

    // Initialize state
    state.value = wizard.value.getState() as WizardState<TData>
  }

  // Cleanup on unmount
  onUnmounted(() => {
    if (unsubscribe) {
      unsubscribe()
    }
  })

  // Computed properties for reactive access
  const currentStep = computed(() => state.value?.currentStep)
  const currentIndex = computed(() => state.value?.currentIndex ?? 0)
  const steps = computed(() => state.value?.steps ?? [])
  const activeSteps = computed(() => state.value?.activeSteps ?? [])
  const data = computed(() => state.value?.data ?? ({} as TData))
  const errors = computed(() => state.value?.errors ?? {})
  const history = computed(() => state.value?.history ?? [])
  const progress = computed(() => state.value?.progress ?? 0)
  const progressPercent = computed(() => state.value?.progressPercent ?? 0)
  const isFirst = computed(() => state.value?.isFirst ?? true)
  const isLast = computed(() => state.value?.isLast ?? false)
  const isComplete = computed(() => state.value?.isComplete ?? false)
  const canGoNext = computed(() => state.value?.canGoNext ?? false)
  const canGoPrev = computed(() => state.value?.canGoPrev ?? false)
  const isLoading = computed(() => state.value?.isLoading ?? false)
  const isValidating = computed(() => state.value?.isValidating ?? false)

  // Methods
  const next = () => wizard.value?.next()
  const prev = () => wizard.value?.prev()
  const goTo = (stepId: string) => wizard.value?.goTo(stepId)
  const goToIndex = (index: number) => wizard.value?.goToIndex(index)
  const first = () => wizard.value?.first()
  const last = () => wizard.value?.last()
  const skip = () => wizard.value?.skip()
  const reset = () => wizard.value?.reset()
  const complete = () => wizard.value?.complete()
  const cancel = () => wizard.value?.cancel()

  const getData = () => wizard.value?.getData()
  const setData = (newData: Partial<TData>) => wizard.value?.setData(newData)
  const setField = <K extends keyof TData>(field: K, value: TData[K]) =>
    wizard.value?.setField(field, value)
  const clearField = <K extends keyof TData>(field: K) =>
    wizard.value?.clearField(field)
  const resetData = () => wizard.value?.resetData()

  const validate = () => wizard.value?.validate()
  const isValid = () => wizard.value?.isValid()
  const getErrors = () => wizard.value?.getErrors()
  const setErrors = (newErrors: Record<string, string>) =>
    wizard.value?.setErrors(newErrors)
  const clearErrors = () => wizard.value?.clearErrors()

  const getStep = (stepId: string) => wizard.value?.getStep(stepId)
  const isStepVisible = (stepId: string) => wizard.value?.isStepVisible(stepId)
  const isStepActive = (stepId: string) => wizard.value?.isStepActive(stepId)
  const isStepCompleted = (stepId: string) =>
    wizard.value?.isStepCompleted(stepId)

  const on = <E extends keyof import('../../../types.js').WizardEventMap>(
    event: E,
    handler: (payload: import('../../../types.js').WizardEventMap[E]) => void
  ) => wizard.value?.on(event, handler as any)
  const off = <E extends keyof import('../../../types.js').WizardEventMap>(
    event: E,
    handler: (payload: import('../../../types.js').WizardEventMap[E]) => void
  ) => wizard.value?.off(event, handler as any)
  const once = <E extends keyof import('../../../types.js').WizardEventMap>(
    event: E,
    handler: (payload: import('../../../types.js').WizardEventMap[E]) => void
  ) => wizard.value?.once(event, handler as any)

  return {
    // Wizard instance
    wizard,

    // State
    state,
    currentStep,
    currentIndex,
    steps,
    activeSteps,
    data,
    errors,
    history,
    progress,
    progressPercent,
    isFirst,
    isLast,
    isComplete,
    canGoNext,
    canGoPrev,
    isLoading,
    isValidating,

    // Methods
    next,
    prev,
    goTo,
    goToIndex,
    first,
    last,
    skip,
    reset,
    complete,
    cancel,

    // Data methods
    getData,
    setData,
    setField,
    clearField,
    resetData,

    // Validation methods
    validate,
    isValid,
    getErrors,
    setErrors,
    clearErrors,

    // Query methods
    getStep,
    isStepVisible,
    isStepActive,
    isStepCompleted,

    // Event methods
    on,
    off,
    once,
  }
}

/**
 * Wizard step composable for Vue
 * Provides step-specific reactive state
 */
export function useWizardStep<TData = Record<string, unknown>>(
  wizard: Ref<WizardInstance<TData> | null>,
  stepId: string
) {
  const state = computed(() => wizard.value?.getState())
  const step = computed(() => state.value?.steps.find((s) => s.id === stepId))
  const stepErrors = computed(() =>
    wizard.value?.getErrors(stepId)
  )

  const isActive = computed(() => step.value?.isActive ?? false)
  const isCurrent = computed(() => state.value?.currentStep.id === stepId)
  const isCompleted = computed(() => wizard.value?.isStepCompleted(stepId))
  const isUpcoming = computed(() => !isCurrent.value && !isCompleted.value)
  const isDisabled = computed(() => step.value?.isDisabled ?? false)
  const canSkip = computed(() => step.value?.canSkip ?? false)
  const hasError = computed(() => step.value?.hasError ?? false)
  const errors = computed(() => stepErrors.value ?? {})

  const data = computed(() => state.value?.data ?? ({} as TData))

  const setField = <K extends keyof TData>(field: K, value: TData[K]) =>
    wizard.value?.setField(field, value)
  const validate = () => wizard.value?.validate(stepId)
  const isValid = () => wizard.value?.isStepValid(stepId)

  return {
    step,
    isActive,
    isCurrent,
    isCompleted,
    isUpcoming,
    isDisabled,
    canSkip,
    hasError,
    errors,
    data,
    setField,
    validate,
    isValid,
  }
}
