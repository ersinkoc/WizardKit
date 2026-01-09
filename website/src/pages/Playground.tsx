import { useState } from 'react'
import { Play, RotateCcw, Copy, Check } from 'lucide-react'
import { PACKAGE_NAME } from '@/lib/constants'

const presetExamples = [
  {
    id: 'basic',
    name: 'Basic Wizard',
    code: `import { createWizard } from '${PACKAGE_NAME}'

const wizard = createWizard({
  steps: [
    { id: 'step1', title: 'Step 1' },
    { id: 'step2', title: 'Step 2' },
    { id: 'step3', title: 'Step 3' },
  ],
})

// Navigate
wizard.next()
console.log(wizard.currentStep.id) // 'step2'
console.log(wizard.progress) // 0.33`,
  },
  {
    id: 'typed',
    name: 'Typed Wizard',
    code: `interface FormData {
  name: string
  email: string
  age?: number
}

const wizard = createWizard<FormData>({
  steps: [
    { id: 'info', title: 'Information' },
    { id: 'confirm', title: 'Confirm' },
  ],
  initialData: {
    name: '',
    email: '',
  },
})

// Type-safe access
wizard.setField('name', 'John')
wizard.data.name // string
wizard.data.age // number | undefined`,
  },
  {
    id: 'validation',
    name: 'With Validation',
    code: `const wizard = createWizard({
  steps: [
    {
      id: 'info',
      title: 'Information',
      validation: {
        name: { required: true, minLength: 2 },
        email: { required: true, email: true },
        age: { min: 18, max: 120 }
      }
    },
    { id: 'confirm', title: 'Confirm' }
  ],
  validateOnNext: true,
})

// Validate before proceeding
const isValid = await wizard.isValid()
if (isValid) {
  await wizard.next()
}`,
  },
  {
    id: 'events',
    name: 'Events & Callbacks',
    code: `const wizard = createWizard({
  steps: [
    { id: 'step1', title: 'Step 1' },
    { id: 'step2', title: 'Step 2' },
  ],
  onStepChange: (step, direction, data) => {
    console.log(\`Moved \${direction} to \${step.title}\`)
  },
  onDataChange: (data, changedFields) => {
    console.log('Changed:', changedFields)
  },
  onComplete: async (data) => {
    await submitForm(data)
  },
})

wizard.on('validation:error', ({ step, errors }) => {
  console.error('Errors:', errors)
})`,
  },
]

export function Playground() {
  const [code, setCode] = useState(presetExamples[0].code)
  const [output, setOutput] = useState('')
  const [selectedPreset, setSelectedPreset] = useState('basic')
  const [isRunning, setIsRunning] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleRun = async () => {
    setIsRunning(true)
    setOutput('')

    try {
      // Capture console.log output
      const logs: string[] = []
      const originalLog = console.log
      const originalError = console.error

      console.log = (...args: unknown[]) => {
        logs.push(args.map(a =>
          typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)
        ).join(' '))
      }
      console.error = (...args: unknown[]) => {
        logs.push('ERROR: ' + args.join(' '))
      }

      // Create a Function to execute the code
      // Note: This is a simplified playground - real execution would need proper sandboxing
      const result = `// Playground Output
// Note: This is a simulated output for demonstration
// Actual execution would require a sandboxed environment

${code.split('\n').map((line, i) => `Line ${i + 1}: ${line.trim() || '(empty)'}`).join('\n')}

// In a real playground, your code would execute here
// and show actual results from createWizard()
`

      console.log = originalLog
      console.error = originalError

      setOutput(result)
    } catch (error) {
      setOutput(`Error: ${error instanceof Error ? error.message : String(error)}`)
    } finally {
      setIsRunning(false)
    }
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleReset = () => {
    const preset = presetExamples.find(p => p.id === selectedPreset)
    if (preset) {
      setCode(preset.code)
    }
    setOutput('')
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Playground</h1>
        <p className="text-xl text-muted-foreground">
          Try out {PACKAGE_NAME} directly in your browser
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Editor Panel */}
        <div className="space-y-4">
          {/* Preset Selector */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Example:</label>
            <select
              value={selectedPreset}
              onChange={(e) => {
                setSelectedPreset(e.target.value)
                const preset = presetExamples.find(p => p.id === e.target.value)
                if (preset) {
                  setCode(preset.code)
                  setOutput('')
                }
              }}
              className="flex-1 px-3 py-2 rounded-md border border-border bg-background text-sm"
            >
              {presetExamples.map((preset) => (
                <option key={preset.id} value={preset.id}>
                  {preset.name}
                </option>
              ))}
            </select>
          </div>

          {/* Code Editor */}
          <div className="relative">
            <div className="absolute top-3 right-3 z-10 flex items-center gap-2">
              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-background border border-border hover:bg-accent transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset
              </button>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-background border border-border hover:bg-accent transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-green-500" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Copy
                  </>
                )}
              </button>
              <button
                onClick={handleRun}
                disabled={isRunning}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                <Play className="w-3.5 h-3.5" />
                {isRunning ? 'Running...' : 'Run'}
              </button>
            </div>

            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full h-[500px] p-4 font-mono text-sm rounded-lg border border-border bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Write your code here..."
              spellCheck={false}
            />
          </div>
        </div>

        {/* Output Panel */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Output</h2>
            {output && (
              <button
                onClick={() => setOutput('')}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Clear
              </button>
            )}
          </div>

          <div className="h-[500px] rounded-lg border border-border bg-muted/30 p-4 overflow-auto">
            {output ? (
              <pre className="text-sm font-mono whitespace-pre-wrap">{output}</pre>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <p className="mb-2">Click Run to execute your code</p>
                  <p className="text-xs">Output will appear here</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="mt-8 p-6 rounded-xl bg-muted/50 border border-border">
        <h3 className="font-semibold mb-3">Playground Info</h3>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>
            This is a <strong>simulated playground</strong> for demonstration purposes.
            The output shown is a preview of how your code would be structured.
          </p>
          <p>
            For a fully functional playground with live code execution, consider:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Using a web worker for sandboxed execution</li>
            <li>Integrating with an online code runner API</li>
            <li>Building a server-side execution environment</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
