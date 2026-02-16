import React from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Wrapper = styled.div`
  text-align: center;
  padding: var(--space-16, 64px) var(--space-10);
  animation: ${fadeIn} 0.4s ease-out;
`;

const IconWrap = styled.div`
  width: 72px;
  height: 72px;
  margin: 0 auto var(--space-6);
  border-radius: var(--radius-xl);
  background: var(--accent-primary-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--accent-primary);
`;

const Title = styled.h3`
  font-size: var(--text-lg);
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--space-2);
`;

const Description = styled.p`
  font-size: var(--text-base);
  color: var(--text-secondary);
  max-width: 400px;
  margin: 0 auto;
  line-height: 1.5;
`;

export function EmptyState({ icon: Icon, title, description, children }) {
  return (
    <Wrapper>
      {Icon && (
        <IconWrap>
          <Icon size={32} strokeWidth={1.5} />
        </IconWrap>
      )}
      {title && <Title>{title}</Title>}
      {description && <Description>{description}</Description>}
      {children && <div style={{ marginTop: 24 }}>{children}</div>}
    </Wrapper>
  );
}

export default EmptyState;
