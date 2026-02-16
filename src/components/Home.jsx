import React, { useState, useRef, useEffect, useCallback } from 'react';
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
  justify-content: center;
  gap: 6px;
  min-height: 44px;
  padding: var(--space-3) var(--space-8);
  background: var(--accent-primary);
  color: var(--text-inverse);
  font-size: var(--text-xs);
  font-weight: 600;
  border-radius: var(--radius-full);
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
  justify-content: center;
  gap: var(--space-4);
  min-height: 56px;
  padding: 18px 56px;
  background: var(--accent-primary);
  color: var(--text-inverse);
  font-size: var(--text-base);
  font-weight: 600;
  border-radius: 9999px;
  text-decoration: none;
  box-shadow: var(--shadow-glow);
  transition: var(--transition-default);
  white-space: nowrap;

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
  container-type: inline-size;
  container-name: hero-right;
  @media (min-width: 1024px) {
    margin: 0;
    max-width: none;
  }
`;

const LOGO_SIZE = 120;

const HeroVisual = styled.div`
  position: relative;
  margin-bottom: var(--space-4);
  min-height: 200px;
  display: none;
  @media (min-width: 768px) {
    display: block;
  }
`;

const LogoPlayArea = styled.div`
  position: relative;
  width: 100%;
  height: 200px;
  animation: ${float} 5s ease-in-out infinite;
`;

const LogoDraggable = styled.div`
  position: absolute;
  width: ${LOGO_SIZE}px;
  height: ${LOGO_SIZE}px;
  cursor: grab;
  user-select: none;
  touch-action: none;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  &:active {
    cursor: grabbing;
  }
`;

const logoPopKeyframes = keyframes`
  0% { transform: scale(1); }
  40% { transform: scale(1.2); }
  70% { transform: scale(0.95); }
  100% { transform: scale(1); }
`;

const LogoImageWrap = styled.div`
  position: relative;
  width: ${LOGO_SIZE}px;
  height: ${LOGO_SIZE}px;
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    pointer-events: none;
    animation: ${(p) => (p.$pop ? logoPopKeyframes : 'none')} 0.4s ease;
  }
`;

const TapReactionBubble = styled.div`
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%) translateY(0);
  margin-bottom: 8px;
  padding: 6px 12px;
  background: var(--accent-primary);
  color: var(--text-inverse);
  font-size: 13px;
  font-weight: 700;
  border-radius: 9999px;
  white-space: nowrap;
  box-shadow: var(--shadow-md);
  animation: floatUp 0.6s ease forwards;
  pointer-events: none;
  z-index: 3;
  @keyframes floatUp {
    0% { opacity: 1; transform: translateX(-50%) translateY(0) scale(0.8); }
    100% { opacity: 0; transform: translateX(-50%) translateY(-28px) scale(1.1); }
  }
`;

const LogoHint = styled.p`
  margin-top: var(--space-2);
  font-size: 7px;
  color: var(--text-tertiary);
  text-align: center;
  font-style: italic;
`;

const TapBadge = styled.div`
  position: absolute;
  bottom: -4px;
  right: -4px;
  min-width: 24px;
  height: 24px;
  padding: 0 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--accent-primary);
  color: var(--text-inverse);
  font-size: 11px;
  font-weight: 700;
  border-radius: 9999px;
  box-shadow: var(--shadow-sm);
`;

const LogoGlow = styled.div`
  position: absolute;
  inset: -12px;
  background: rgba(29, 173, 142, 0.06);
  border-radius: 16px;
  filter: blur(24px);
  z-index: -1;
  pointer-events: none;
`;

const WinOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1001;
  animation: fadeIn 0.25s ease;
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const WinCard = styled.div`
  background: var(--bg-surface);
  padding: var(--space-10);
  border-radius: var(--radius-2xl);
  box-shadow: var(--shadow-xl);
  text-align: center;
  max-width: 320px;
  animation: pop 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
  @keyframes pop {
    from { opacity: 0; transform: scale(0.9) translateY(10px); }
    to { opacity: 1; transform: scale(1) translateY(0); }
  }
`;

const WinTitle = styled.div`
  font-size: var(--text-2xl);
  font-weight: 700;
  color: var(--accent-primary);
  margin-bottom: var(--space-2);
`;

const WinSub = styled.div`
  font-size: var(--text-sm);
  color: var(--text-secondary);
  margin-bottom: var(--space-6);
`;

const WinDismiss = styled.button`
  padding: var(--space-3) var(--space-6);
  background: var(--accent-primary);
  color: var(--text-inverse);
  border: none;
  border-radius: var(--radius-full);
  font-size: var(--text-sm);
  font-weight: 600;
  cursor: pointer;
  &:hover {
    filter: brightness(1.05);
  }
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  width: 100%;
  max-width: 28rem;
  /* Gap scales with container (HeroRight) width: even on laptop and monitor */
  gap: clamp(10px, 2.5cqi, 24px);

  @media (min-width: 768px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    max-width: none;
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
  font-size: var(--text-xs);
  color: var(--text-tertiary);
`;

const FeatureGridHintIcon = styled.span`
  display: inline-flex;
  animation: ${hintBounce} 1.5s ease-in-out infinite;
`;

const SupportNote = styled.p`
  margin: var(--space-4) 0 0;
  font-size: var(--text-xs);
  color: var(--text-tertiary);
  text-align: center;
  line-height: 1.5;
  max-width: 28rem;
  a {
    color: var(--text-secondary);
    text-decoration: none;
    border-bottom: 1px solid var(--border-default);
    transition: var(--transition-default);
    &:hover {
      color: var(--accent-primary);
      border-bottom-color: var(--accent-primary);
    }
  }
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

  const [logoPos, setLogoPos] = useState({ x: 0, y: 40 });
  const [tapCount, setTapCount] = useState(0);
  const [wonMessage, setWonMessage] = useState(null);
  const [logoPop, setLogoPop] = useState(false);
  const [tapReaction, setTapReaction] = useState(null);
  const logoAreaRef = useRef(null);
  const dragRef = useRef({ isDragging: false, startX: 0, startY: 0, startLogoX: 0, startLogoY: 0, startedOnLogo: false });
  const tapCountRef = useRef(0);
  const MILESTONE_MSGS = { 10: '10! 🎉', 20: '20! 🔥', 30: '30! ✨', 40: '40! 💪', 50: '50! 🏆' };

  tapCountRef.current = tapCount;

  useEffect(() => {
    const el = logoAreaRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = Math.max(0, (rect.width - LOGO_SIZE) / 2);
    const y = Math.max(0, (rect.height - LOGO_SIZE) / 2);
    setLogoPos({ x, y });
  }, []);

  const clampLogo = useCallback((x, y) => {
    const el = logoAreaRef.current;
    if (!el) return { x, y };
    const rect = el.getBoundingClientRect();
    return {
      x: Math.max(0, Math.min(rect.width - LOGO_SIZE, x)),
      y: Math.max(0, Math.min(rect.height - LOGO_SIZE, y)),
    };
  }, []);

  const handleLogoPointerDown = (e) => {
    e.preventDefault();
    dragRef.current = {
      isDragging: false,
      startX: e.clientX ?? e.touches?.[0]?.clientX,
      startY: e.clientY ?? e.touches?.[0]?.clientY,
      startLogoX: logoPos.x,
      startLogoY: logoPos.y,
      startedOnLogo: true,
    };
  };

  useEffect(() => {
    const onMove = (e) => {
      const clientX = e.clientX ?? e.touches?.[0]?.clientX;
      const clientY = e.clientY ?? e.touches?.[0]?.clientY;
      const { startX, startY, startLogoX, startLogoY } = dragRef.current;
      const dx = clientX - startX;
      const dy = clientY - startY;
      if (!dragRef.current.isDragging && (Math.abs(dx) > 5 || Math.abs(dy) > 5)) {
        dragRef.current.isDragging = true;
      }
      if (dragRef.current.isDragging) {
        if (e.cancelable) e.preventDefault();
        setLogoPos((prev) => clampLogo(startLogoX + dx, startLogoY + dy));
      }
    };
    const onUp = () => {
      const { isDragging, startedOnLogo } = dragRef.current;
      if (startedOnLogo && !isDragging) {
        setLogoPop(true);
        setTimeout(() => setLogoPop(false), 450);
        const next = tapCountRef.current + 1;
        const msg = MILESTONE_MSGS[next] ?? `+${next}`;
        setTapReaction({ key: Date.now(), msg });
        setTimeout(() => setTapReaction(null), 650);
        setTapCount((c) => {
          const next = c + 1;
          if (next === 10) setWonMessage(10);
          if (next === 50) setWonMessage(50);
          return next;
        });
      }
      dragRef.current = { isDragging: false, startX: 0, startY: 0, startLogoX: 0, startLogoY: 0, startedOnLogo: false };
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('touchmove', onMove, { passive: false });
    window.addEventListener('touchend', onUp);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onUp);
    };
  }, [clampLogo]);

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
            <LogoPlayArea ref={logoAreaRef}>
              <LogoDraggable
                style={{ left: logoPos.x, top: logoPos.y }}
                onPointerDown={handleLogoPointerDown}
              >
                <LogoImageWrap $pop={logoPop}>
                  <img src="/data-playground-logo.svg" alt="Data Playground" draggable={false} />
                  {tapReaction && (
                    <TapReactionBubble key={tapReaction.key}>{tapReaction.msg}</TapReactionBubble>
                  )}
                  {tapCount > 0 && <TapBadge>{tapCount}</TapBadge>}
                </LogoImageWrap>
                <LogoGlow />
              </LogoDraggable>
            </LogoPlayArea>
            <LogoHint>bored? try clicking (or dragging) the logo :)</LogoHint>
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
              <MousePointer2 size={15} />
            </FeatureGridHintIcon>
            hover or click to know more
          </FeatureGridHint>
          <SupportNote>
            We currently support CSV, XLS, and XLSX files only. To request more formats or suggest changes,{' '}
            <a href={GITHUB_FEATURE_REQUEST_URL} target="_blank" rel="noopener noreferrer">
              request a feature
            </a>{' '}
            or{' '}
            <a href="#" onClick={(e) => { e.preventDefault(); handleCopyEmail(); }}>contact us</a>.
          </SupportNote>
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

      {wonMessage !== null && (
        <WinOverlay onClick={() => setWonMessage(null)}>
          <WinCard onClick={(e) => e.stopPropagation()}>
            <WinTitle>
              {wonMessage === 10 ? '🎉 Keep Going!' : '🏆 Legend! 50 taps!'}
            </WinTitle>
            <WinSub>
              {wonMessage === 10
                ? '10 taps — you\'re on fire!'
                : '50 taps — you\'re the WINNER at the data playground today!'}
            </WinSub>
            <WinDismiss type="button" onClick={() => setWonMessage(null)}>
              Awesome
            </WinDismiss>
          </WinCard>
        </WinOverlay>
      )}
    </PageWrap>
  );
};

export default Home;
