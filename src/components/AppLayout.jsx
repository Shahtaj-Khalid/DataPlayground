import React from 'react';
import styled from 'styled-components';
import { Outlet } from 'react-router-dom';
import TopBar from './TopBar';
import Sidebar from './Sidebar';
import Footer from './Footer';

const LayoutWrap = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: var(--bg-app);
`;

const BodyWrap = styled.div`
  display: flex;
  flex: 1;
  min-height: 0;
`;

const ContentWrap = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
`;

const Main = styled.main`
  flex: 1;
  overflow: auto;
  padding: var(--space-8) var(--space-8) var(--space-12);
`;

const AppLayout = () => {
  return (
    <LayoutWrap>
      <TopBar />
      <BodyWrap>
        <Sidebar />
        <ContentWrap>
          <Main>
            <Outlet />
          </Main>
          <Footer />
        </ContentWrap>
      </BodyWrap>
    </LayoutWrap>
  );
};

export default AppLayout;
