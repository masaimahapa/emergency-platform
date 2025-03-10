import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Routes, Route, Outlet } from 'react-router';
import Dashboard from '@/pages/dashboard.tsx';
import Emergencies from '@/pages/emergencies.tsx';
import Emergency from '@/pages/emergency.tsx';
import Layout from '@/components/layout.tsx';
import RespondersPage from '@/pages/responders.tsx';
import NotFound from './components/not-found';
import ResponderDetailsPage from '@/pages/responder-details-page';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout><Outlet /></Layout>}>
          <Route index element={<Dashboard />} />
          <Route path="emergencies" >
            <Route index element={<Emergencies />} />
            <Route path=":id" element={<Emergency />} />
          </Route>
          <Route path="responders"  >
            <Route index element={<RespondersPage />} />
            <Route path=":id" element={<ResponderDetailsPage />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
