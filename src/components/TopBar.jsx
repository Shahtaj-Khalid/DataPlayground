import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

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
  gap: var(--space-2);
  text-decoration: none;
  color: var(--text-primary);
  font-family: var(--font-display);
  font-size: var(--text-lg);
  font-weight: 700;
  letter-spacing: -0.02em;
  transition: var(--transition-default);

  &:hover {
    color: var(--accent-primary);
  }
`;

const LogoIcon = styled.img`
  width: 32px;
  height: 32px;
  display: block;
`;

const TopBar = () => {
  return (
    <TopBarEl>
      <TopBarInner>
        <LogoLink to="/">
          <LogoIcon src="/data-playground-logo.svg" alt="Data Playground" />
          Data Playground
        </LogoLink>
      </TopBarInner>
    </TopBarEl>
  );
};

export default TopBar;
