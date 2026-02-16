import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Upload, BarChart3, Search, Merge, FileSearch, Shield, Zap, Lock, ArrowRight } from 'lucide-react';

const HomeContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--space-10) var(--space-6);
`;

const HeroSection = styled.section`
  text-align: center;
  margin-bottom: var(--space-20);
`;

const FeaturesSection = styled.section`
  margin-bottom: var(--space-20);
`;

const HeroTitle = styled.h1`
  font-size: clamp(2.25rem, 4vw, 3.5rem);
  font-weight: 800;
  color: var(--text-primary);
  margin-bottom: var(--space-6);
  letter-spacing: -0.03em;
`;

const HeroSubtitle = styled.p`
  font-size: var(--text-xl);
  color: var(--text-secondary);
  margin-bottom: var(--space-10);
  max-width: 560px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
`;

const CTAButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-4) var(--space-8);
  background: var(--accent-primary);
  color: var(--text-inverse);
  font-size: var(--text-md);
  font-weight: 600;
  border-radius: var(--radius-lg);
  text-decoration: none;
  transition: background 0.2s ease, transform 0.15s ease, box-shadow 0.2s ease;
  box-shadow: var(--shadow-md);

  &:hover {
    background: var(--accent-primary-hover);
    transform: translateY(-1px);
    box-shadow: var(--shadow-lg);
  }
`;

const SectionTitle = styled.h2`
  font-size: var(--text-3xl);
  font-weight: 700;
  color: var(--text-primary);
  text-align: center;
  margin-bottom: var(--space-12);
  letter-spacing: -0.02em;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: var(--space-6);
  margin-bottom: var(--space-12);
`;

const FeatureCard = styled(Link)`
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: var(--radius-2xl);
  padding: var(--space-8);
  text-decoration: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
  cursor: pointer;
  box-shadow: var(--shadow-sm);

  &:hover {
    border-color: var(--accent-primary);
    box-shadow: var(--shadow-md);
    transform: translateY(-2px);
  }
`;

const FeatureIcon = styled.div`
  width: 56px;
  height: 56px;
  border-radius: var(--radius-xl);
  background: var(--accent-primary-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--space-5);
  color: var(--accent-primary);
`;

const FeatureTitle = styled.h3`
  font-size: var(--text-lg);
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--space-3);
`;

const FeatureDescription = styled.p`
  font-size: var(--text-base);
  color: var(--text-secondary);
  line-height: 1.6;
`;

const PrivacySection = styled.section`
  background: var(--bg-surface);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-2xl);
  padding: var(--space-12);
  margin-bottom: var(--space-16);
  box-shadow: var(--shadow-sm);
`;

const PrivacyTitle = styled.h2`
  font-size: var(--text-2xl);
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: var(--space-6);
  display: flex;
  align-items: center;
  gap: var(--space-4);
`;

const PrivacyContent = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: var(--space-8);
`;

const PrivacyItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: var(--space-4);
`;

const PrivacyIcon = styled.div`
  width: 44px;
  height: 44px;
  border-radius: var(--radius-lg);
  background: var(--accent-primary-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--accent-primary);
  flex-shrink: 0;
`;

const PrivacyText = styled.div`
  flex: 1;
`;

const PrivacyItemTitle = styled.h3`
  font-size: var(--text-md);
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--space-2);
`;

const PrivacyItemDescription = styled.p`
  font-size: var(--text-sm);
  color: var(--text-secondary);
  line-height: 1.6;
`;

const InfoBox = styled.div`
  background: var(--accent-primary-muted);
  border: 1px solid var(--border-strong);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  margin-top: var(--space-8);
`;

const InfoText = styled.p`
  font-size: var(--text-sm);
  color: var(--text-secondary);
  line-height: 1.7;
  margin: 0;
`;

const Home = () => {
  const features = [
    {
      icon: <Upload size={28} />,
      title: 'Upload Files',
      description: 'Drag and drop CSV, XLS, or XLSX files. Your data is processed instantly in your browser.',
      path: '/upload'
    },
    {
      icon: <BarChart3 size={28} />,
      title: 'Visualize Data',
      description: 'Create beautiful charts and graphs. Bar, line, doughnut, and scatter plots with one click.',
      path: '/visualize'
    },
    {
      icon: <Search size={28} />,
      title: 'Query Data',
      description: 'Run SQL queries on your datasets. No database setup required - everything runs in your browser.',
      path: '/query'
    },
    {
      icon: <Merge size={28} />,
      title: 'Merge Datasets',
      description: 'Combine multiple files using different join types. Perfect for combining data from different sources.',
      path: '/merge'
    },
    {
      icon: <FileSearch size={28} />,
      title: 'Analyze Data',
      description: 'Get instant statistics and insights. Column types, missing values, and summary statistics.',
      path: '/analyze'
    }
  ];

  return (
    <HomeContainer>
      <HeroSection>
        <HeroTitle>Data Playground</HeroTitle>
        <HeroSubtitle>
          Your powerful, privacy-first data analysis tool. Upload, visualize, query, and merge datasets - all in your browser. No servers, no uploads, no data storage.
        </HeroSubtitle>
        <CTAButton to="/upload">
          Get Started
          <ArrowRight size={20} />
        </CTAButton>
      </HeroSection>

      <FeaturesSection>
        <SectionTitle>What You Can Do</SectionTitle>
        <FeaturesGrid>
          {features.map((feature, index) => (
            <FeatureCard key={index} to={feature.path}>
              <FeatureIcon>{feature.icon}</FeatureIcon>
              <FeatureTitle>{feature.title}</FeatureTitle>
              <FeatureDescription>{feature.description}</FeatureDescription>
            </FeatureCard>
          ))}
        </FeaturesGrid>
      </FeaturesSection>

      <PrivacySection>
        <PrivacyTitle>
          <Shield size={32} />
          Your Privacy Matters
        </PrivacyTitle>
        <PrivacyContent>
          <PrivacyItem>
            <PrivacyIcon>
              <Lock size={24} />
            </PrivacyIcon>
            <PrivacyText>
              <PrivacyItemTitle>100% Client-Side</PrivacyItemTitle>
              <PrivacyItemDescription>
                All processing happens in your browser. Your data never leaves your device.
              </PrivacyItemDescription>
            </PrivacyText>
          </PrivacyItem>
          <PrivacyItem>
            <PrivacyIcon>
              <Zap size={24} />
            </PrivacyIcon>
            <PrivacyText>
              <PrivacyItemTitle>Session-Only Storage</PrivacyItemTitle>
              <PrivacyItemDescription>
                Data is stored only in your browser's memory during your session. Refresh the page and it's gone.
              </PrivacyItemDescription>
            </PrivacyText>
          </PrivacyItem>
          <PrivacyItem>
            <PrivacyIcon>
              <Shield size={24} />
            </PrivacyIcon>
            <PrivacyText>
              <PrivacyItemTitle>No Backend Required</PrivacyItemTitle>
              <PrivacyItemDescription>
                No servers, no databases, no cloud storage. Everything runs locally using WebAssembly.
              </PrivacyItemDescription>
            </PrivacyText>
          </PrivacyItem>
        </PrivacyContent>
        <InfoBox>
          <InfoText>
            <strong>Complete privacy:</strong> Your files are never uploaded to any server. All processing happens in your browser. When you close the tab or refresh, data is cleared. No tracking, no storage, no access to your files.
          </InfoText>
        </InfoBox>
      </PrivacySection>
    </HomeContainer>
  );
};

export default Home;
