import 'react-toastify/dist/ReactToastify.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from '@mui/material/styles'
import Home from './views/Home'
import React from 'react'

import { CustomToastContainer } from './components/CustomToastContainer'
import GlobalLayout from './components/GlobalLayout'
import ProjectDetailsForm from './components/ProjectDetailsForm'
import SiteBackgroundForm from './components/SiteBackgroundForm'
import RestorationAimsForm from './components/RestorationAimsForm/RestorationAimsForm'
import CausesOfDeclineForm from './components/CausesOfDeclineForm'
import theme from './styles/theme'

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalLayout>
        <CustomToastContainer />
        <Router>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/:siteId/form/project-details' element={<ProjectDetailsForm />} />
            <Route path='/:siteId/form/site-background' element={<SiteBackgroundForm />} />
            <Route path='/:siteId/form/restoration-aims' element={<RestorationAimsForm />} />
            <Route path='/:siteId/form/causes-of-decline' element={<CausesOfDeclineForm />} />
          </Routes>
        </Router>
      </GlobalLayout>
    </ThemeProvider>
  )
}

export default App
