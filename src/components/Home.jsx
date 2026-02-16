import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Lock,
  Upload,
  BarChart3,
  Search,
  GitMerge,
  ShieldCheck,
  Zap,
  Sparkles,
  Github,
  Mail,
  MousePointer2,
} from 'lucide-react';

const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
`;

const pulseSoft = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
`;

const iconWiggle = keyframes`
  0% { transform: rotate(0deg) scale(1); }
  25% { transform: rotate(-10deg) scale(1.15); }
  75% { transform: rotate(10deg) scale(1.15); }
  100% { transform: rotate(0deg) scale(1); }
`;

const coverRipple = keyframes`
  0% { opacity: 0; transform: scale(0.8); }
  50% { opacity: 1; transform: scale(1.05); }
  100% { opacity: 0; transform: scale(1.1); }
`;

const hintBounce = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-3px); }
`;

const PageWrap = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--gradient-hero);
  overflow-x: hidden;
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-3) var(--space-6);
  flex-shrink: 0;
  max-width: 100%;
  @media (min-width: 768px) {
    padding: var(--space-3) var(--space-10);
  }
  @media (min-width: 1280px) {
    max-width: min(1440px, 92vw);
    margin: 0 auto;
    width: 100%;
    padding: var(--space-4) var(--space-10);
  }
  @media (min-width: 1600px) {
    max-width: min(1600px, 90vw);
    padding: var(--space-4) var(--space-12);
  }
`;

const LogoWrap = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-2);
`;

const LogoIcon = styled.img`
  width: 32px;
  height: 32px;
  display: block;
`;

const LogoText = styled.span`
  font-family: var(--font-display);
  font-weight: 700;
  font-size: var(--text-base);
  color: var(--text-primary);
`;

const NavRight = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-2);
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin-left: var(--space-2);
`;

const NavLinkItem = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: var(--text-xs);
  color: var(--text-secondary);
  text-decoration: none;
  transition: var(--transition-default);

  &:hover {
    color: var(--accent-primary);
  }
`;

const NavButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: var(--text-xs);
  color: var(--text-secondary);
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  font-family: inherit;
  transition: var(--transition-default);

  &:hover {
    color: var(--accent-primary);
  }
`;

const Toast = styled.div`
  position: fixed;
  bottom: var(--space-10);
  left: 50%;
  transform: translateX(-50%);
  padding: var(--space-3) var(--space-5);
  background: var(--text-primary);
  color: var(--text-inverse);
  font-size: var(--text-sm);
  font-weight: 500;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
  z-index: 1000;
  animation: fadeIn 0.2s ease;
  @keyframes fadeIn {
    from { opacity: 0; transform: translateX(-50%) translateY(8px); }
    to { opacity: 1; transform: translateX(-50%) translateY(0); }
  }
`;

const PrivateBadge = styled.div`
  display: none;
  align-items: center;
  gap: 4px;
  font-size: var(--text-xs);
  color: var(--text-secondary);
  margin-right: var(--space-1);
  @media (min-width: 640px) {
    display: flex;
  }
`;

const GetStartedBtn = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: var(--space-3) var(--space-6);
  min-height: 36px;
  background: var(--accent-primary);
  color: var(--text-inverse);
  font-size: var(--text-xs);
  font-weight: 500;
  border-radius: var(--radius-md);
  text-decoration: none;
  box-shadow: var(--shadow-glow);
  transition: var(--transition-default);
  &:hover {
    filter: brightness(1.05);
    transform: translateY(-1px);
  }
`;

const Main = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: var(--space-4) var(--space-6) var(--space-4);
  min-height: 0;
  width: 100%;
  max-width: 100%;
  @media (min-width: 1024px) {
    flex-direction: row;
    align-items: center;
    justify-content: center;
    padding: var(--space-8) var(--space-10);
    gap: var(--space-10);
    max-width: min(1440px, 92vw);
    margin: 0 auto;
  }
  @media (min-width: 1600px) {
    max-width: min(1600px, 90vw);
    padding: var(--space-10) var(--space-12);
    gap: var(--space-12);
  }
`;

const HeroLeft = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-width: 0;
  max-width: 40rem;
  margin: 0 auto;
  @media (min-width: 1024px) {
    margin: 0;
    max-width: none;
  }
`;

const Badge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: 4px var(--space-3);
  border-radius: var(--radius-full);
  background: rgba(29, 173, 142, 0.12);
  color: var(--accent-primary);
  font-size: var(--text-xs);
  font-weight: 500;
  margin-bottom: var(--space-4);
  width: fit-content;
`;

const BadgeDot = styled.span`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--accent-primary);
  animation: ${pulseSoft} 3s ease-in-out infinite;
`;

const Headline = styled.h1`
  font-family: var(--font-display);
  font-size: clamp(2.25rem, 4vw, 3.5rem);
  font-weight: 700;
  line-height: 1.1;
  color: var(--text-primary);
  margin-bottom: var(--space-3);
  letter-spacing: -0.02em;
  @media (min-width: 1600px) {
    font-size: clamp(2.5rem, 3.5vw, 4rem);
  }
`;

const GradientPrimary = styled.span`
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const GradientWarm = styled.span`
  background: var(--gradient-warm);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Subtitle = styled.p`
  font-size: var(--text-md);
  color: var(--text-secondary);
  max-width: 28rem;
  margin-bottom: var(--space-5);
  line-height: 1.6;
`;

const BtnRow = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: var(--space-4);
  flex-wrap: wrap;
`;

const BtnPrimary = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-5) var(--space-10);
  background: var(--accent-primary);
  color: var(--text-inverse);
  font-size: var(--text-sm);
  font-weight: 600;
  border-radius: 12px;
  text-decoration: none;
  box-shadow: var(--shadow-glow);
  transition: var(--transition-default);
  &:hover {
    filter: brightness(1.05);
    transform: translateY(-1px);
  }
`;

const DotsRow = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-4);
  font-size: var(--text-xs);
  color: var(--text-secondary);
  flex-wrap: wrap;
`;

const DotItem = styled.span`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const Dot = styled.span`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: ${(p) => p.$color || 'var(--accent-primary)'};
`;

const HeroRight = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 0;
  max-width: 36rem;
  width: 100%;
  margin: 0 auto;
  @media (min-width: 1024px) {
    margin: 0;
    max-width: none;
  }
`;

const HeroVisual = styled.div`
  position: relative;
  margin-bottom: var(--space-4);
  display: none;
  @media (min-width: 768px) {
    display: block;
    animation: ${float} 5s ease-in-out infinite;
  }
`;

const HeroImage = styled.div`
  width: 100%;
  max-width: 8rem;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  img {
    width: 100%;
    height: auto;
    object-fit: contain;
  }
`;

const HeroImageGlow = styled.div`
  position: absolute;
  inset: -12px;
  background: rgba(29, 173, 142, 0.06);
  border-radius: 16px;
  filter: blur(24px);
  z-index: -1;
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-3);
  width: 100%;
  max-width: 28rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    max-width: none;
  }
  @media (min-width: 1280px) {
    gap: var(--space-4);
  }
  @media (min-width: 1600px) {
    gap: var(--space-5);
  }
`;

const FeatureCard = styled.div`
  position: relative;
  padding: var(--space-4);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(0, 0, 0, 0.08);
  @media (min-width: 1280px) {
    padding: var(--space-5);
  }
  @media (min-width: 1600px) {
    padding: var(--space-6);
  }
  box-shadow: ${(p) => (p.$active ? '0 0 20px rgba(29, 173, 142, 0.25)' : 'var(--shadow-soft)')};
  text-align: center;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
  transform: scale(1) translateY(0);
  overflow: hidden;
  ${(p) => p.$clicked && 'box-shadow: 0 0 0 2px rgba(29, 173, 142, 0.5), var(--shadow-soft);'}

  &:hover {
    transform: scale(1.08) translateY(-4px);
    box-shadow: 0 0 20px rgba(29, 173, 142, 0.25);
  }

  &:active {
    transform: scale(0.96) translateY(-2px);
  }
`;

const FeatureCardCover = styled.div`
  position: absolute;
  inset: 0;
  border-radius: 12px;
  border: 2px solid rgba(29, 173, 142, 0.2);
  pointer-events: none;
  animation: ${coverRipple} 0.8s ease-out;
`;

const FeatureCardIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto var(--space-2);
  background: ${(p) => p.$bg || 'rgba(29, 173, 142, 0.12)'};
  color: ${(p) => p.$color || 'var(--accent-primary)'};
  transition: transform 0.3s ease;

  ${FeatureCard}:hover & {
    animation: ${iconWiggle} 0.5s ease-in-out;
  }
`;

const FeatureCardTitle = styled.h3`
  font-family: var(--font-display);
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 2px;
`;

const FeatureCardDesc = styled.p`
  font-size: var(--text-xs);
  color: var(--text-secondary);
  line-height: 1.3;
  overflow: hidden;
  max-height: ${(p) => (p.$show ? '60px' : '0')};
  opacity: ${(p) => (p.$show ? 1 : 0)};
  transition: max-height 0.25s ease, opacity 0.2s ease;
`;

const FeatureGridHint = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-top: var(--space-3);
  font-size: 10px;
  color: var(--text-tertiary);
`;

const FeatureGridHintIcon = styled.span`
  display: inline-flex;
  animation: ${hintBounce} 1.5s ease-in-out infinite;
`;

const BottomBar = styled.footer`
  flex-shrink: 0;
  padding: var(--space-2) var(--space-6) var(--space-3);
  border-top: 1px solid rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: var(--space-2);
  max-width: 100%;
  @media (min-width: 768px) {
    padding: var(--space-2) var(--space-10);
  }
  @media (min-width: 1280px) {
    max-width: min(1440px, 92vw);
    margin: 0 auto;
    width: 100%;
    padding: var(--space-3) var(--space-10);
  }
  @media (min-width: 1600px) {
    max-width: min(1600px, 90vw);
    padding: var(--space-3) var(--space-12);
  }
`;

const BottomLogo = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--text-secondary);
  .icon {
    color: var(--accent-primary);
  }
  span {
    font-family: var(--font-display);
    font-weight: 500;
    font-size: var(--text-xs);
    color: var(--text-primary);
  }
`;

const BottomCopy = styled.p`
  font-size: 10px;
  color: var(--text-secondary);
  margin: 0;
`;

const BottomRight = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-4);
`;

const BottomContactBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: var(--text-xs);
  color: var(--text-secondary);
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  font-family: inherit;
  transition: var(--transition-default);

  &:hover {
    color: var(--accent-primary);
  }
`;

const CONTACT_EMAIL = 'shahtajkhalid1@gmail.com';

const features = [
  {
    icon: Upload,
    title: 'Drag & Drop',
    description: 'Import CSV, JSON, Excel instantly',
    color: 'var(--accent-primary)',
    bg: 'rgba(29, 173, 142, 0.12)',
  },
  {
    icon: BarChart3,
    title: 'Visualize',
    description: 'Beautiful charts, zero config',
    color: 'var(--accent-secondary)',
    bg: 'rgba(232, 185, 35, 0.12)',
  },
  {
    icon: Search,
    title: 'Query',
    description: 'SQL-like filtering & aggregation',
    color: 'var(--accent-accent)',
    bg: 'rgba(155, 125, 219, 0.12)',
  },
  {
    icon: GitMerge,
    title: 'Merge',
    description: 'Smart joins across datasets',
    color: 'var(--accent-primary)',
    bg: 'rgba(29, 173, 142, 0.12)',
  },
  {
    icon: ShieldCheck,
    title: 'Private',
    description: 'Everything stays on your device',
    color: 'var(--accent-secondary)',
    bg: 'rgba(232, 185, 35, 0.12)',
  },
  {
    icon: Zap,
    title: 'Fast',
    description: 'In-browser engine, instant results',
    color: 'var(--accent-accent)',
    bg: 'rgba(155, 125, 219, 0.12)',
  },
];

const GITHUB_FEATURE_REQUEST_URL = 'https://github.com/Shahtaj-Khalid/DataPlayground/issues/new?labels=enhancement&template=feature_request.md&title=Feature%20request%3A%20';

const Home = () => {
  const [activeFeature, setActiveFeature] = useState(null);
  const [clickedFeature, setClickedFeature] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT_EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${CONTACT_EMAIL}`;
    }
  };

  return (
    <PageWrap>
      <Nav>
        <LogoWrap>
          <LogoIcon src="/data-playground-logo.svg" alt="Data Playground" />
          <LogoText>Data Playground</LogoText>
        </LogoWrap>
        <NavRight>
          <PrivateBadge>
            <Lock size={12} />
            <span>100% Private</span>
          </PrivateBadge>
          <GetStartedBtn to="/upload">
            Get Started
            <ArrowRight size={14} />
          </GetStartedBtn>
          <NavLinks>
            <NavLinkItem
              href="https://github.com/Shahtaj-Khalid/DataPlayground"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github size={14} /> GitHub
            </NavLinkItem>
            <NavLinkItem href={GITHUB_FEATURE_REQUEST_URL} target="_blank" rel="noopener noreferrer">
              Request new features
            </NavLinkItem>
          </NavLinks>
        </NavRight>
      </Nav>

      <Main>
        <HeroLeft>
          <Badge>
            <BadgeDot />
            Privacy-first analytics
          </Badge>
          <Headline>
            Your data, <GradientPrimary>your rules,</GradientPrimary>
            <br />
            your <GradientWarm>playground.</GradientWarm>
          </Headline>
          <Subtitle>
            Upload, visualize, query, and merge datasets — all in your browser.
            No servers, no data storage. Just pure analysis.
          </Subtitle>
          <BtnRow>
            <BtnPrimary to="/upload">
              Start Exploring
              <ArrowRight size={16} />
            </BtnPrimary>
          </BtnRow>
          <DotsRow>
            <DotItem>
              <Dot $color="var(--accent-primary)" />
              No sign-up
            </DotItem>
            <DotItem>
              <Dot $color="var(--accent-secondary)" />
              Works offline
            </DotItem>
            <DotItem>
              <Dot $color="var(--accent-accent)" />
              Open source
            </DotItem>
          </DotsRow>
        </HeroLeft>

        <HeroRight>
          <HeroVisual>
            <HeroImage>
              <img src="/data-playground-logo.svg" alt="" style={{ width: 80, height: 80, objectFit: 'contain' }} />
            </HeroImage>
            <HeroImageGlow />
          </HeroVisual>
          <FeatureGrid>
            {features.map((f, i) => (
              <FeatureCard
                key={f.title}
                $active={activeFeature === i}
                $clicked={clickedFeature === i}
                onMouseEnter={() => setActiveFeature(i)}
                onMouseLeave={() => setActiveFeature(null)}
                onClick={() => setClickedFeature(clickedFeature === i ? null : i)}
              >
                {activeFeature === i && <FeatureCardCover />}
                <FeatureCardIcon $bg={f.bg} $color={f.color}>
                  <f.icon size={16} />
                </FeatureCardIcon>
                <FeatureCardTitle>{f.title}</FeatureCardTitle>
                <FeatureCardDesc $show={activeFeature === i || clickedFeature === i}>{f.description}</FeatureCardDesc>
              </FeatureCard>
            ))}
          </FeatureGrid>
          <FeatureGridHint>
            <FeatureGridHintIcon>
              <MousePointer2 size={12} />
            </FeatureGridHintIcon>
            hover or click to know more
          </FeatureGridHint>
        </HeroRight>
      </Main>

      <BottomBar>
        <BottomLogo>
          <Sparkles size={14} className="icon" />
          <span>Data Playground</span>
        </BottomLogo>
        <BottomCopy>Built with privacy in mind. Your data never leaves your browser.</BottomCopy>
        <BottomRight>
          <BottomContactBtn type="button" onClick={handleCopyEmail} title="Copy email address">
            <Mail size={12} /> {copied ? 'Copied!' : 'Contact'}
          </BottomContactBtn>
        </BottomRight>
      </BottomBar>

      {copied && <Toast>Email copied to clipboard</Toast>}
    </PageWrap>
  );
};

export default Home;
