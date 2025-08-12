import { ReactNode } from 'react'
import Sidebar from './Sidebar'
import TopBar from './TopBar'

interface LayoutProps {
  children: ReactNode
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="page">
      <div className="page__sidebar">
        <Sidebar />
      </div>
      <div className="page__main">
        <div className="page__topbar">
          <TopBar />
        </div>
        <main className="page__content">
          {children}
        </main>
      </div>
    </div>
  )
}

export default Layout 