import React from 'react';
import styled from 'styled-components';
import { Link, useLocation } from 'react-router-dom';
import { Upload, BarChart3, Search, Merge, FileSearch } from 'lucide-react';

const HeaderContainer = styled.header`
  background: var(--bg-surface);
  border-bottom: 1px solid var(--border-default);
  padding: 0;
  position: sticky;
  top: 0;
  z-index: 100;
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--space-6);
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  gap: var(--space-3);
  text-decoration: none;
  color: var(--text-primary);
  font-size: var(--text-xl);
  font-weight: 700;
  padding: var(--space-5) 0;
  letter-spacing: -0.02em;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.9;
  }
`;

const Nav = styled.nav`
  display: flex;
  gap: 2px;
`;

const NavLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-4) var(--space-4);
  color: ${(p) => (p.$active ? 'var(--text-primary)' : 'var(--text-secondary)')};
  text-decoration: none;
  font-weight: 500;
  font-size: var(--text-sm);
  border-radius: var(--radius-md);
  transition: color 0.15s ease, background 0.15s ease;

  &:hover {
    color: var(--text-primary);
    background: var(--border-subtle);
  }
`;

const Header = () => {
  const location = useLocation();

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <HeaderContainer>
      <HeaderContent>
        <Logo to="/">
          <img src="/data-playground-logo.svg" alt="" width={28} height={28} />
          Data Playground
        </Logo>
        <Nav>
          <NavLink to="/upload" $active={isActive('/upload')}>
            <Upload size={17} strokeWidth={1.8} />
            Upload
          </NavLink>
          <NavLink to="/visualize" $active={isActive('/visualize')}>
            <BarChart3 size={17} strokeWidth={1.8} />
            Visualize
          </NavLink>
          <NavLink to="/query" $active={isActive('/query')}>
            <Search size={17} strokeWidth={1.8} />
            Query
          </NavLink>
          <NavLink to="/merge" $active={isActive('/merge')}>
            <Merge size={17} strokeWidth={1.8} />
            Merge
          </NavLink>
          <NavLink to="/analyze" $active={isActive('/analyze')}>
            <FileSearch size={17} strokeWidth={1.8} />
            Analyze
          </NavLink>
        </Nav>
      </HeaderContent>
    </HeaderContainer>
  );
};

export default Header;
