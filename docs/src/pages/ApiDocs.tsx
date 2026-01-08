import './ApiDocs.css'

function ApiDocs() {
  return (
    <div className="page api-docs">
      <h1>API Reference</h1>

      <section className="api-section">
        <h2>createWizard</h2>
        <p className="description">Create a new wizard instance.</p>
        <pre><code>{`import { createWizard } from '@oxog/wizardkit'

const wizard = createWizard(options)`}</code></pre>

        <h3>Options</h3>
        <table>
          <thead>
            <tr>
              <th>Option</th>
              <th>Type</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>steps</code></td>
              <td><code>StepDefinition[]</code></td>
              <td>Array of step definitions (required)</td>
            </tr>
            <tr>
              <td><code>initialData</code></td>
              <td><code>TData</code></td>
              <td>Initial wizard data</td>
            </tr>
            <tr>
              <td><code>linear</code></td>
              <td><code>boolean</code></td>
              <td>Restrict navigation to linear flow</td>
            </tr>
            <tr>
              <td><code>validateOnNext</code></td>
              <td><code>boolean</code></td>
              <td>Validate before moving forward (default: true)</td>
            </tr>
            <tr>
              <td><code>validateOnPrev</code></td>
              <td><code>boolean</code></td>
              <td>Validate before moving backward (default: false)</td>
            </tr>
            <tr>
              <td><code>persistence</code></td>
              <td><code>PersistenceConfig</code></td>
              <td>Auto-save configuration</td>
            </tr>
            <tr>
              <td><code>middleware</code></td>
              <td><code>Middleware[]</code></td>
              <td>Middleware functions</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section className="api-section">
        <h2>Navigation Methods</h2>

        <div className="method">
          <h3><code>next()</code></h3>
          <p>Move to the next step.</p>
          <pre><code>{`const success = await wizard.next()`}</code></pre>
          <p className="returns">Returns: <code>Promise&lt;boolean&gt;</code></p>
        </div>

        <div className="method">
          <h3><code>prev()</code></h3>
          <p>Move to the previous step.</p>
          <pre><code>{`const success = await wizard.prev()`}</code></pre>
          <p className="returns">Returns: <code>Promise&lt;boolean&gt;</code></p>
        </div>

        <div className="method">
          <h3><code>goTo(stepId)</code></h3>
          <p>Jump to a specific step by ID.</p>
          <pre><code>{`const success = await wizard.goTo('address')`}</code></pre>
          <p className="returns">Returns: <code>Promise&lt;boolean&gt;</code></p>
        </div>

        <div className="method">
          <h3><code>goToIndex(index)</code></h3>
          <p>Jump to a specific step by index.</p>
          <pre><code>{`const success = await wizard.goToIndex(2)`}</code></pre>
          <p className="returns">Returns: <code>Promise&lt;boolean&gt;</code></p>
        </div>

        <div className="method">
          <h3><code>first()</code></h3>
          <p>Go to the first step.</p>
          <pre><code>{`const success = await wizard.first()`}</code></pre>
          <p className="returns">Returns: <code>Promise&lt;boolean&gt;</code></p>
        </div>

        <div className="method">
          <h3><code>last()</code></h3>
          <p>Go to the last step.</p>
          <pre><code>{`const success = await wizard.last()`}</code></pre>
          <p className="returns">Returns: <code>Promise&lt;boolean&gt;</code></p>
        </div>

        <div className="method">
          <h3><code>skip()</code></h3>
          <p>Skip the current step (if allowed).</p>
          <pre><code>{`const success = await wizard.skip()`}</code></pre>
          <p className="returns">Returns: <code>Promise&lt;boolean&gt;</code></p>
        </div>

        <div className="method">
          <h3><code>complete()</code></h3>
          <p>Complete the wizard.</p>
          <pre><code>{`const success = await wizard.complete()`}</code></pre>
          <p className="returns">Returns: <code>Promise&lt;boolean&gt;</code></p>
        </div>

        <div className="method">
          <h3><code>restart()</code></h3>
          <p>Reset wizard to initial state.</p>
          <pre><code>{`wizard.restart()`}</code></pre>
          <p className="returns">Returns: <code>void</code></p>
        </div>
      </section>

      <section className="api-section">
        <h2>State Methods</h2>

        <div className="method">
          <h3><code>getState()</code></h3>
          <p>Get the current wizard state.</p>
          <pre><code>{`const state = wizard.getState()
// { currentStep, data, progress, isComplete, ... }`}</code></pre>
          <p className="returns">Returns: <code>WizardState&lt;TData&gt;</code></p>
        </div>

        <div className="method">
          <h3><code>getData()</code></h3>
          <p>Get all wizard data.</p>
          <pre><code>{`const data = wizard.getData()`}</code></pre>
          <p className="returns">Returns: <code>TData</code></p>
        </div>

        <div className="method">
          <h3><code>setData(data)</code></h3>
          <p>Set wizard data (merges with existing).</p>
          <pre><code>{`wizard.setData({ firstName: 'John' })`}</code></pre>
          <p className="returns">Returns: <code>void</code></p>
        </div>

        <div className="method">
          <h3><code>setField(field, value)</code></h3>
          <p>Set a single field value.</p>
          <pre><code>{`wizard.setField('email', 'john@example.com')`}</code></pre>
          <p className="returns">Returns: <code>void</code></p>
        </div>
      </section>

      <section className="api-section">
        <h2>Validation Methods</h2>

        <div className="method">
          <h3><code>isValid()</code></h3>
          <p>Check if current step is valid.</p>
          <pre><code>{`const valid = wizard.isValid()`}</code></pre>
          <p className="returns">Returns: <code>boolean</code></p>
        </div>

        <div className="method">
          <h3><code>getErrors()</code></h3>
          <p>Get validation errors for current step.</p>
          <pre><code>{`const errors = wizard.getErrors()
// { email: 'Invalid email' }`}</code></pre>
          <p className="returns">Returns: <code>ValidationErrors | null</code></p>
        </div>

        <div className="method">
          <h3><code>clearErrors()</code></h3>
          <p>Clear all validation errors.</p>
          <pre><code>{`wizard.clearErrors()`}</code></pre>
          <p className="returns">Returns: <code>void</code></p>
        </div>

        <div className="method">
          <h3><code>validate()</code></h3>
          <p>Manually trigger validation for current step.</p>
          <pre><code>{`const errors = await wizard.validate()`}</code></pre>
          <p className="returns">Returns: <code>Promise&lt;ValidationErrors | null&gt;</code></p>
        </div>
      </section>

      <section className="api-section">
        <h2>Event Methods</h2>

        <div className="method">
          <h3><code>on(event, callback)</code></h3>
          <p>Subscribe to an event.</p>
          <pre><code>{`wizard.on('step:change', ({ step, direction }) => {
  console.log('Moved to', step.title)
})`}</code></pre>
          <p className="returns">Returns: <code>{'() => void'}</code> (unsubscribe function)</p>
        </div>

        <div className="method">
          <h3><code>off(event, callback)</code></h3>
          <p>Unsubscribe from an event.</p>
          <pre><code>{`const handler = ({ step }) => console.log(step)
wizard.on('step:enter', handler)
wizard.off('step:enter', handler)`}</code></pre>
          <p className="returns">Returns: <code>void</code></p>
        </div>
      </section>

      <section className="api-section">
        <h2>Events</h2>
        <table>
          <thead>
            <tr>
              <th>Event</th>
              <th>Payload</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>step:change</code></td>
              <td><code>{`{ step, direction, prevStep }`}</code></td>
              <td>Fired when step changes</td>
            </tr>
            <tr>
              <td><code>step:enter</code></td>
              <td><code>{`{ step, direction }`}</code></td>
              <td>Fired when entering a step</td>
            </tr>
            <tr>
              <td><code>step:leave</code></td>
              <td><code>{`{ step, direction }`}</code></td>
              <td>Fired when leaving a step</td>
            </tr>
            <tr>
              <td><code>data:change</code></td>
              <td><code>{`{ data, changes }`}</code></td>
              <td>Fired when data changes</td>
            </tr>
            <tr>
              <td><code>validation:success</code></td>
              <td><code>{`{ step }`}</code></td>
              <td>Fired when validation passes</td>
            </tr>
            <tr>
              <td><code>validation:error</code></td>
              <td><code>{`{ step, errors }`}</code></td>
              <td>Fired when validation fails</td>
            </tr>
            <tr>
              <td><code>complete</code></td>
              <td><code>{`{ data }`}</code></td>
              <td>Fired when wizard completes</td>
            </tr>
            <tr>
              <td><code>restart</code></td>
              <td><code>{}</code></td>
              <td>Fired when wizard restarts</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section className="api-section">
        <h2>StepDefinition</h2>
        <p className="description">Configuration object for each step.</p>
        <table>
          <thead>
            <tr>
              <th>Property</th>
              <th>Type</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>id</code></td>
              <td><code>string</code></td>
              <td>Unique step identifier (required)</td>
            </tr>
            <tr>
              <td><code>title</code></td>
              <td><code>string</code></td>
              <td>Step title (required)</td>
            </tr>
            <tr>
              <td><code>description</code></td>
              <td><code>string</code></td>
              <td>Step description</td>
            </tr>
            <tr>
              <td><code>icon</code></td>
              <td><code>string</code></td>
              <td>Step icon (emoji or component)</td>
            </tr>
            <tr>
              <td><code>validate</code></td>
              <td><code>ValidationRules</code></td>
              <td>Validation rules</td>
            </tr>
            <tr>
              <td><code>condition</code></td>
              <td><code>{'(data, context) => boolean'}</code></td>
              <td>Show/hide step condition</td>
            </tr>
            <tr>
              <td><code>disabled</code></td>
              <td><code>{'boolean | (data) => boolean'}</code></td>
              <td>Disable step</td>
            </tr>
            <tr>
              <td><code>canSkip</code></td>
              <td><code>{'boolean | (data) => boolean'}</code></td>
              <td>Allow skipping step</td>
            </tr>
            <tr>
              <td><code>beforeEnter</code></td>
              <td><code>{'(data, wizard) => boolean | Promise<boolean>'}</code></td>
              <td>Hook before entering step</td>
            </tr>
            <tr>
              <td><code>onEnter</code></td>
              <td><code>{'(data, wizard, direction) => void'}</code></td>
              <td>Hook when entering step</td>
            </tr>
            <tr>
              <td><code>beforeLeave</code></td>
              <td><code>{'(data, wizard, direction) => BeforeLeaveResult'}</code></td>
              <td>Hook before leaving step</td>
            </tr>
            <tr>
              <td><code>onLeave</code></td>
              <td><code>{'(data, wizard, direction) => void'}</code></td>
              <td>Hook when leaving step</td>
            </tr>
            <tr>
              <td><code>nextStep</code></td>
              <td><code>{'string | (data) => string'}</code></td>
              <td>Next step ID override</td>
            </tr>
            <tr>
              <td><code>prevStep</code></td>
              <td><code>{'string | (data) => string'}</code></td>
              <td>Previous step ID override</td>
            </tr>
            <tr>
              <td><code>branches</code></td>
              <td><code>Record&lt;string, Branch&gt;</code></td>
              <td>Conditional branching</td>
            </tr>
            <tr>
              <td><code>meta</code></td>
              <td><code>Record&lt;string, unknown&gt;</code></td>
              <td>Custom metadata</td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  )
}

export default ApiDocs
