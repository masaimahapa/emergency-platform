import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Routes, Route } from 'react-router';
import Dashboard from '@/pages/dashboard.tsx';
import Emergencies from '@/pages/emergencies.tsx';
import Emergency from '@/pages/emergency.tsx';
import Layout from '@/components/layout.tsx';
import RespondersPage from '@/pages/responders.tsx';
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="emergencies" >
          <Route index element={<Emergencies />} />
          <Route path=":id" element={<Emergency />} />

        </Route>
        <Route path="responders" element={<RespondersPage />} />
      </Routes>
      </Layout>
    </BrowserRouter>
  </StrictMode>,
)
