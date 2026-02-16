import React from 'react';
import styled from 'styled-components';
import { Github, Mail, Heart } from 'lucide-react';

// Set your email here for the Contact button
const CONTACT_EMAIL = 'your-email@example.com';

const FooterContainer = styled.footer`
  background: var(--bg-surface);
  border-top: 1px solid var(--border-default);
  padding: var(--space-10) var(--space-6) var(--space-8);
  margin-top: auto;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const FooterTop = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-10);
  margin-bottom: var(--space-8);
  align-items: start;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const FooterSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
`;

const FooterTitle = styled.h3`
  font-size: var(--text-md);
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--space-2);
`;

const FooterText = styled.p`
  color: var(--text-secondary);
  font-size: var(--text-sm);
  line-height: 1.6;
  margin: 0;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: var(--space-3);
  flex-wrap: wrap;
`;

const FooterButton = styled.a`
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-5);
  background: var(--border-subtle);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  color: var(--text-secondary);
  text-decoration: none;
  font-size: var(--text-sm);
  font-weight: 500;
  transition: border-color 0.15s ease, color 0.15s ease, transform 0.15s ease;

  &:hover {
    border-color: var(--accent-primary);
    color: var(--text-primary);
    transform: translateY(-1px);
  }
`;

const FooterBottom = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--space-4);
  padding-top: var(--space-8);
  border-top: 1px solid var(--border-default);
`;

const Copyright = styled.p`
  color: var(--text-tertiary);
  font-size: var(--text-xs);
  margin: 0;
`;

const Footer = () => {
  return (
    <FooterContainer>
      <FooterContent>
        <FooterTop>
          <FooterSection>
            <FooterTitle>Data Playground</FooterTitle>
            <FooterText>
              Privacy-first data analysis tool. Process, visualize, and analyze your data entirely in your browser.
            </FooterText>
          </FooterSection>

          <FooterSection>
            <FooterTitle>Privacy & Security</FooterTitle>
            <FooterText>
              All data processing happens client-side. No servers, no uploads, no tracking. Your data stays in your browser.
            </FooterText>
          </FooterSection>
        </FooterTop>

        <FooterBottom>
          <Copyright>
            © {new Date().getFullYear()} Data Playground. Made with <Heart size={14} style={{ display: 'inline', color: 'var(--accent-error)' }} /> for privacy-conscious users.
          </Copyright>
          <ButtonRow>
            <FooterButton href="https://github.com" target="_blank" rel="noopener noreferrer">
              <Github size={18} />
              GitHub
            </FooterButton>
            <FooterButton href={`mailto:${CONTACT_EMAIL}`} target="_blank" rel="noopener noreferrer">
              <Mail size={18} />
              Contact
            </FooterButton>
          </ButtonRow>
        </FooterBottom>
      </FooterContent>
    </FooterContainer>
  );
};

export default Footer;
