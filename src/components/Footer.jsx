import React from 'react';
import styled from 'styled-components';
import { Database, Github, Mail } from 'lucide-react';

const CONTACT_EMAIL = 'shahtajkhalid1@gmail.com';

const FooterContainer = styled.footer`
  background: var(--bg-surface);
  border-top: 1px solid var(--border-default);
  padding: var(--space-6) var(--space-6);
  margin-top: auto;
`;

const FooterInner = styled.div`
  max-width: 72rem;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  @media (min-width: 768px) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
`;

const FooterBrand = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-2);
  .icon {
    color: var(--accent-primary);
  }
  span {
    font-family: var(--font-display);
    font-weight: 600;
    font-size: var(--text-base);
    color: var(--text-primary);
  }
`;

const FooterCopy = styled.p`
  font-size: var(--text-sm);
  color: var(--text-secondary);
  margin: 0;
`;

const FooterLinks = styled.div`
  display: flex;
  gap: var(--space-3);
  flex-wrap: wrap;
`;

const FooterLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--text-sm);
  color: var(--text-secondary);
  text-decoration: none;
  transition: var(--transition-default);
  &:hover {
    color: var(--accent-primary);
  }
`;

const Footer = () => {
  return (
    <FooterContainer>
      <FooterInner>
        <FooterBrand>
          <Database size={20} className="icon" />
          <span>Data Playground</span>
        </FooterBrand>
        <FooterCopy>Built with privacy in mind. Your data never leaves your browser.</FooterCopy>
        <FooterLinks>
          <FooterLink href="https://github.com/Shahtaj-Khalid/DataPlayground" target="_blank" rel="noopener noreferrer">
            <Github size={16} /> GitHub
          </FooterLink>
          <FooterLink href={`mailto:${CONTACT_EMAIL}`}>
            <Mail size={16} /> Contact
          </FooterLink>
        </FooterLinks>
      </FooterInner>
    </FooterContainer>
  );
};

export default Footer;
