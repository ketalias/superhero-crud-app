import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import NavBar from './components/NavBar';
import HeroDetail from './pages/HeroDetail';
import AdminCreateHero from './pages/AdminCreateHero';

function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/heroes/:id" element={<HeroDetail />} />
        <Route path="/admin" element={<AdminCreateHero />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
