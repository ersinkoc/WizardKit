import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { ThemeProvider } from './components/ThemeProvider'
import { Layout } from './components/layout/Layout'
import { Home } from './pages/Home'
import { Introduction } from './pages/docs/Introduction'
import { Installation } from './pages/docs/Installation'
import { QuickStart } from './pages/docs/QuickStart'
import { Configuration } from './pages/docs/Configuration'
import { Steps } from './pages/docs/Steps'
import { Navigation } from './pages/docs/Navigation'
import { Data } from './pages/docs/Data'
import { Validation } from './pages/docs/Validation'
import { Events } from './pages/docs/Events'
import { Persistence } from './pages/docs/Persistence'
import { React as ReactDocs } from './pages/docs/React'
import { Vue } from './pages/docs/Vue'
import { Svelte } from './pages/docs/Svelte'
import { Examples } from './pages/Examples'
import { Playground } from './pages/Playground'
import { CreateWizard } from './pages/api/CreateWizard'
import { WizardInstance } from './pages/api/WizardInstance'
import { StepDefinition } from './pages/api/StepDefinition'
import { Types } from './pages/api/Types'
import { NotFound } from './pages/NotFound'
import { Faq } from './pages/Faq'

// Placeholder pages for API
function ApiOverview() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-4">API Reference</h1>
      <p className="text-muted-foreground mb-8">Complete API documentation coming soon...</p>
      <div className="space-y-4">
        <a href="/api/create-wizard" className="block p-4 rounded-lg border border-border hover:bg-accent transition-colors">
          <h3 className="font-semibold">createWizard()</h3>
          <p className="text-sm text-muted-foreground">Create a new wizard instance</p>
        </a>
        <a href="/api/wizard-instance" className="block p-4 rounded-lg border border-border hover:bg-accent transition-colors">
          <h3 className="font-semibold">Wizard Instance</h3>
          <p className="text-sm text-muted-foreground">Wizard methods and properties</p>
        </a>
        <a href="/api/step-definition" className="block p-4 rounded-lg border border-border hover:bg-accent transition-colors">
          <h3 className="font-semibold">Step Definition</h3>
          <p className="text-sm text-muted-foreground">Step configuration options</p>
        </a>
        <a href="/api/types" className="block p-4 rounded-lg border border-border hover:bg-accent transition-colors">
          <h3 className="font-semibold">TypeScript Types</h3>
          <p className="text-sm text-muted-foreground">Available TypeScript types</p>
        </a>
      </div>
    </div>
  )
}

function ExamplesPage() {
  return <Examples />
}

function PlaygroundPage() {
  return <Playground />
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout showSidebar={false} />,
    children: [
      {
        index: true,
        element: <Home />,
      },
    ],
  },
  {
    path: '/docs',
    element: <Layout showSidebar={true} />,
    children: [
      { index: true, element: <Introduction /> },
      { path: 'introduction', element: <Introduction /> },
      { path: 'installation', element: <Installation /> },
      { path: 'quick-start', element: <QuickStart /> },
      { path: 'configuration', element: <Configuration /> },
      { path: 'steps', element: <Steps /> },
      { path: 'navigation', element: <Navigation /> },
      { path: 'data', element: <Data /> },
      { path: 'validation', element: <Validation /> },
      { path: 'events', element: <Events /> },
      { path: 'persistence', element: <Persistence /> },
      { path: 'react', element: <ReactDocs /> },
      { path: 'vue', element: <Vue /> },
      { path: 'svelte', element: <Svelte /> },
    ],
  },
  {
    path: '/api',
    element: <Layout showSidebar={true} />,
    children: [
      { index: true, element: <ApiOverview /> },
      { path: 'create-wizard', element: <CreateWizard /> },
      { path: 'wizard-instance', element: <WizardInstance /> },
      { path: 'step-definition', element: <StepDefinition /> },
      { path: 'types', element: <Types /> },
    ],
  },
  {
    path: '/examples',
    element: <Layout showSidebar={true} />,
    children: [
      { index: true, element: <ExamplesPage /> },
    ],
  },
  {
    path: '/playground',
    element: <Layout showSidebar={false} />,
    children: [
      { index: true, element: <PlaygroundPage /> },
    ],
  },
  {
    path: '/faq',
    element: <Layout showSidebar={false} />,
    children: [
      { index: true, element: <Faq /> },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
])

function App() {
  return (
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  )
}

export default App
