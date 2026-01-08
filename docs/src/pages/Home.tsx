import './Home.css'

function Home() {
  return (
    <div className="page home">
      <div className="hero">
        <h1>WizardKit</h1>
        <p className="tagline">Zero-dependency multi-step wizard toolkit</p>
        <div className="badges">
          <span className="badge">TypeScript</span>
          <span className="badge">Tree-shakeable</span>
          <span className="badge">Zero Deps</span>
          <span className="badge">Framework Agnostic</span>
        </div>
      </div>

      <section className="features">
        <h2>Features</h2>
        <div className="feature-grid">
          <div className="feature">
            <h3>🚀 Lightweight</h3>
            <p>Core package is only 474 bytes minified</p>
          </div>
          <div className="feature">
            <h3>⚡ Zero Dependencies</h3>
            <p>Built from scratch with vanilla TypeScript</p>
          </div>
          <div className="feature">
            <h3>🎯 Type Safe</h3>
            <p>Full TypeScript support with generics</p>
          </div>
          <div className="feature">
            <h3>🌳 Tree-shakeable</h3>
            <p>ESM output with full tree-shaking support</p>
          </div>
          <div className="feature">
            <h3>📝 Validation</h3>
            <p>Built-in validation with custom rules</p>
          </div>
          <div className="feature">
            <h3>💾 Persistence</h3>
            <p>Auto-save with localStorage/sessionStorage</p>
          </div>
          <div className="feature">
            <h3>🔀 Conditional Steps</h3>
            <p>Show/hide steps based on data</p>
          </div>
          <div className="feature">
            <h3>🎨 Framework Support</h3>
            <p>React, Vue, and Svelte adapters</p>
          </div>
        </div>
      </section>

      <section className="installation">
        <h2>Installation</h2>
        <pre><code>npm install @oxog/wizardkit</code></pre>
        <pre><code>pnpm add @oxog/wizardkit</code></pre>
        <pre><code>yarn add @oxog/wizardkit</code></pre>
      </section>

      <section className="quick-start">
        <h2>Quick Start</h2>
        <pre><code>{`import { createWizard } from '@oxog/wizardkit'

const wizard = createWizard({
  steps: [
    { id: 'personal', title: 'Personal Info' },
    { id: 'address', title: 'Address' },
    { id: 'confirm', title: 'Confirm' },
  ],
})

// Navigate
wizard.next()
wizard.prev()
wizard.goTo('address')

// Get state
const { currentStep, data, progress } = wizard.getState()
`}</code></pre>
      </section>

      <section className="bundle-sizes">
        <h2>Bundle Sizes</h2>
        <table>
          <thead>
            <tr>
              <th>Package</th>
              <th>Size</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Core</td>
              <td>474 B</td>
            </tr>
            <tr>
              <td>React Adapter</td>
              <td>8.3 KB</td>
            </tr>
            <tr>
              <td>Vue Adapter</td>
              <td>2.8 KB</td>
            </tr>
            <tr>
              <td>Svelte Adapter</td>
              <td>1.1 KB</td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  )
}

export default Home
