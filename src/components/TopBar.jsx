import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Database } from 'lucide-react';

const TOP_BAR_HEIGHT = 56;

const TopBarEl = styled.header`
  width: 100%;
  min-height: ${TOP_BAR_HEIGHT}px;
  background: var(--bg-surface);
  border-bottom: 1px solid var(--border-default);
  position: sticky;
  top: 0;
  z-index: 100;
`;

const TopBarInner = styled.div`
  display: flex;
  align-items: center;
  padding: var(--space-4) var(--space-6);
  max-width: 100%;
`;

export { TOP_BAR_HEIGHT };

const LogoLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: var(--space-3);
  text-decoration: none;
  color: var(--text-primary);
  font-size: var(--text-xl);
  font-weight: 700;
  letter-spacing: -0.03em;
  transition: color 0.2s ease;

  &:hover {
    color: var(--accent-primary);
  }
`;

const LogoIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: var(--radius-md);
  background: var(--accent-primary-muted);
  color: var(--accent-primary);
`;

const TopBar = () => {
  return (
    <TopBarEl>
      <TopBarInner>
        <LogoLink to="/">
          <LogoIcon>
            <Database size={20} strokeWidth={2} />
          </LogoIcon>
          Data Playground
        </LogoLink>
      </TopBarInner>
    </TopBarEl>
  );
};

export default TopBar;
