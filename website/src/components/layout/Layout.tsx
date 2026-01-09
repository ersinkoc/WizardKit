import { Outlet } from 'react-router-dom'
import { Header } from './Header'
import { Sidebar } from './Sidebar'
import { Footer } from './Footer'
import { cn } from '@/lib/utils'

interface LayoutProps {
  showSidebar?: boolean
  className?: string
}

export function Layout({ showSidebar = true, className }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex">
        {showSidebar && <Sidebar className="hidden lg:block" />}
        <main className={cn('flex-1 min-w-0', className)}>
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  )
}
