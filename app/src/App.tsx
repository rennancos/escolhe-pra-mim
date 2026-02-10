import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from '@/context/AppContext';
import { Header, Footer } from '@/components/custom';
import { Home, Results, Watchlist, Watched, Login, Register } from '@/pages';
import { Toaster } from '@/components/ui/sonner';

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="flex min-h-screen flex-col bg-background">
          <Header />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/results" element={<Results />} />
              <Route path="/watchlist" element={<Watchlist />} />
              <Route path="/watched" element={<Watched />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
      <Toaster position="bottom-right" />
    </AppProvider>
  );
}

export default App;
