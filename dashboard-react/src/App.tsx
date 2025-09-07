import React from 'react';
import Container from '@mui/material/Container';
import Dashboard from './components/Dashboard';

function App() {
  return (
    <Container maxWidth="lg" sx={{ pt: 4 }}>
      <Dashboard />
    </Container>
  );
}

export default App;