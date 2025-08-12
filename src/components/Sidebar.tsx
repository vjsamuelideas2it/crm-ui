import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { 
  HomeIcon, 
  UsersIcon, 
  UserPlusIcon, 
  ClipboardDocumentListIcon,
  Squares2X2Icon,
} from '@heroicons/react/24/outline'

const navigation = [
  { name: 'Dashboard', href: '/', icon: HomeIcon },
  { name: 'Customers', href: '/customers', icon: UsersIcon },
  { name: 'Leads', href: '/leads', icon: UserPlusIcon },
  { name: 'Work Items', href: '/work-items', icon: ClipboardDocumentListIcon },
  { name: 'Kanban', href: '/kanban', icon: Squares2X2Icon },
]

const Sidebar = () => {
  const location = useLocation()
  const { user } = useAuth()

  return (
    <div className="sidebar">
      <div className="sidebar__header">
        <h1>CRM Dashboard</h1>
      </div>
      <nav className="sidebar__nav">
        <div className="sidebar__nav-container">
          {navigation
            .concat(user?.role?.name === 'Admin' || user?.role?.name === 'ADMIN' ? [{ name: 'Users', href: '/users', icon: UsersIcon }] : [])
            .map((item) => {
            const isActive = location.pathname === item.href
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`sidebar__nav-link ${
                  isActive ? 'sidebar__nav-link--active' : 'sidebar__nav-link--inactive'
                }`}
              >
                <item.icon />
                {item.name}
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}

export default Sidebar 