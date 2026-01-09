export const PACKAGE_NAME = '@oxog/wizardkit'
export const GITHUB_REPO = 'ersinkoc/wizardkit'
export const NPM_PACKAGE = '@oxog/wizardkit'
export const VERSION = '1.0.0'
export const DESCRIPTION = 'Zero-dependency multi-step wizard toolkit with conditional steps, branching logic, and form integration'
export const DOMAIN = 'wizardkit.oxog.dev'

// Navigation items
export const NAV_ITEMS = [
  { name: 'Docs', href: '/docs' },
  { name: 'API', href: '/api' },
  { name: 'Examples', href: '/examples' },
  { name: 'FAQ', href: '/faq' },
  { name: 'Playground', href: '/playground' },
] as const

// Sidebar navigation
export const DOCS_NAV = [
  {
    title: 'Getting Started',
    items: [
      { name: 'Introduction', href: '/docs/introduction' },
      { name: 'Installation', href: '/docs/installation' },
      { name: 'Quick Start', href: '/docs/quick-start' },
    ],
  },
  {
    title: 'Core Concepts',
    items: [
      { name: 'Wizard Configuration', href: '/docs/configuration' },
      { name: 'Step Definition', href: '/docs/steps' },
      { name: 'Navigation', href: '/docs/navigation' },
      { name: 'Data Management', href: '/docs/data' },
      { name: 'Validation', href: '/docs/validation' },
      { name: 'Events', href: '/docs/events' },
      { name: 'Persistence', href: '/docs/persistence' },
    ],
  },
  {
    title: 'Framework Integrations',
    items: [
      { name: 'React', href: '/docs/react' },
      { name: 'Vue', href: '/docs/vue' },
      { name: 'Svelte', href: '/docs/svelte' },
    ],
  },
] as const

export const API_NAV = [
  {
    title: 'API Reference',
    items: [
      { name: 'Overview', href: '/api' },
      { name: 'createWizard', href: '/api/create-wizard' },
      { name: 'Wizard Instance', href: '/api/wizard-instance' },
      { name: 'Step Definition', href: '/api/step-definition' },
      { name: 'Types', href: '/api/types' },
    ],
  },
] as const
