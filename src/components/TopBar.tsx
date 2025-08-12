import { useEffect, useMemo, useState, useRef } from 'react';
import { BellIcon, MagnifyingGlassIcon, UserCircleIcon, ChevronDownIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';
import { useLeads } from '../hooks/useLeads';
import { useUsers } from '../hooks/useUsers';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const TopBar = () => {
  const { user, logout } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [openSearch, setOpenSearch] = useState(false);
  const navigate = useNavigate();
  const { leads } = useLeads();
  const { users } = useUsers();
  const searchRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully', { duration: 2000 });
    setIsUserMenuOpen(false);
  };

  const toggleUserMenu = () => setIsUserMenuOpen(!isUserMenuOpen);
  const handleMenuBlur = () => { setTimeout(() => setIsUserMenuOpen(false), 150); };

  type SearchResult = { id: number; name: string; subtitle?: string; type: 'lead' | 'user' };
  const results = useMemo<SearchResult[]>(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();

    const leadResults: SearchResult[] = leads
      .filter(l => l.name.toLowerCase().includes(q) || (l.email || '').toLowerCase().includes(q) || (l.phone || '').toLowerCase().includes(q))
      .slice(0, 8)
      .map(l => ({ id: l.id, name: l.name, subtitle: l.email || l.phone, type: 'lead' }));

    const userResults: SearchResult[] = users
      .filter(u => u.name.toLowerCase().includes(q) || (u.email || '').toLowerCase().includes(q))
      .slice(0, 8)
      .map(u => ({ id: u.id, name: u.name, subtitle: u.email, type: 'user' }));

    return [...leadResults, ...userResults].slice(0, 10);
  }, [query, leads, users]);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!searchRef.current) return;
      if (!searchRef.current.contains(e.target as Node)) setOpenSearch(false);
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  const goToLead = (id: number) => {
    setOpenSearch(false);
    setQuery('');
    navigate(`/leads/${id}`);
  };

  const goToUser = (id: number) => {
    setOpenSearch(false);
    setQuery('');
    navigate(`/users/${id}`);
  };

  return (
    <header className="topbar">
      <div className="topbar__container">
        <div className="topbar__search-container" ref={searchRef}>
          <div className="search-wrapper search-wrapper--dropdown">
            <div className="search-input-wrapper" onFocus={() => setOpenSearch(true)}>
              <div className="search-icon"><MagnifyingGlassIcon /></div>
              <input type="text" placeholder="Search customers, leads and users." value={query} onChange={(e) => setQuery(e.target.value)} />
            </div>
            {openSearch && (
              <div className="search-dropdown">
                {results.length === 0 ? (
                  <div className="search-dropdown__empty">No results</div>
                ) : (
                  <ul className="search-dropdown__list">
                    {results.map(r => (
                      <li key={`${r.type}-${r.id}`}>
                        <button className="search-result" onClick={() => (r.type === 'user' ? goToUser(r.id) : goToLead(r.id))}>
                          <div className="search-result__title">{r.name}{' '}
                            <span style={{ fontWeight: 500, color: '#6b7280', marginLeft: 6, fontSize: '0.8rem' }}>· {r.type === 'user' ? 'User' : 'Lead'}</span>
                          </div>
                          {r.subtitle && <div className="search-result__subtitle">{r.subtitle}</div>}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        </div>
        
        <div className="topbar__actions">
          <button className="notification-btn"><BellIcon /></button>
          
          <div className="user-menu" onBlur={handleMenuBlur}>
            <div className="user-info">
              <p className="user-name">{user?.name || 'User'}</p>
              <p className="user-role">{user?.role?.name || 'Role'}</p>
            </div>
            <button className="user-avatar" onClick={toggleUserMenu} aria-expanded={isUserMenuOpen} aria-haspopup="true">
              <UserCircleIcon />
              <ChevronDownIcon className="dropdown-icon" />
            </button>
            {isUserMenuOpen && (
              <div className="user-dropdown">
                <div className="user-dropdown__header">
                  <div className="user-avatar-large"><UserCircleIcon /></div>
                  <div>
                    <p className="dropdown-user-name">{user?.name}</p>
                    <p className="dropdown-user-email">{user?.email}</p>
                    <p className="dropdown-user-role">{user?.role?.name}</p>
                  </div>
                </div>
                <div className="user-dropdown__divider"></div>
                <button className="user-dropdown__item logout-btn" onClick={handleLogout}>
                  <ArrowRightOnRectangleIcon className="logout-icon" />
                  <span>Sign out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopBar; 