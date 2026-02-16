import React from 'react';
import styled from 'styled-components';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Upload, BarChart3, Search, Merge, FileSearch } from 'lucide-react';

const SidebarEl = styled.aside`
  width: 260px;
  min-width: 260px;
  background: var(--bg-surface);
  border-right: 1px solid var(--border-default);
  display: flex;
  flex-direction: column;
  position: sticky;
  top: 0;
  left: 0;
  align-self: flex-start;
  height: calc(100vh - 56px);
`;

const NavBlock = styled.nav`
  flex: 1;
  padding: var(--space-4) var(--space-3);
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const Tab = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  color: ${(p) => (p.$active ? 'var(--accent-primary)' : 'var(--text-secondary)')};
  text-decoration: none;
  font-size: var(--text-sm);
  font-weight: 500;
  border-radius: var(--radius-md);
  transition: color 0.15s ease, background 0.15s ease;
  border-left: 3px solid ${(p) => (p.$active ? 'var(--accent-primary)' : 'transparent')};

  &:hover {
    color: var(--text-primary);
    background: var(--border-subtle);
  }

  &.active {
    color: var(--accent-primary);
    background: var(--accent-primary-muted);
    border-left-color: var(--accent-primary);
  }
`;

const TabLabel = styled.span`
  flex: 1;
`;

const Sidebar = () => {
  const location = useLocation();

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const tabs = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/upload', label: 'Upload', icon: Upload },
    { path: '/visualize', label: 'Visualize', icon: BarChart3 },
    { path: '/query', label: 'Query', icon: Search },
    { path: '/merge', label: 'Merge', icon: Merge },
    { path: '/analyze', label: 'Analyze', icon: FileSearch },
  ];

  return (
    <SidebarEl>
      <NavBlock>
        {tabs.map(({ path, label, icon: Icon }) => (
          <Tab
            key={path}
            to={path}
            $active={isActive(path)}
            className={isActive(path) ? 'active' : ''}
          >
            <Icon size={20} strokeWidth={1.8} />
            <TabLabel>{label}</TabLabel>
          </Tab>
        ))}
      </NavBlock>
    </SidebarEl>
  );
};

export default Sidebar;
