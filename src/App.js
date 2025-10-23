import './App.css';
import { BrowserRouter as Router, Routes, Route, useLocation,} from 'react-router-dom';

import Home from './Components/Home';
import Navbar from './Components/Navbar';
import Blog from './Components/Blog';
import About from './Components/AboutUs';
import Login from './Components/Login';
import ProtectedRoute from './Components/ProtectedRoute';
import Owner from './Components/Owner';
import Admin from './Components/Admin';
import Blogger from './Components/Blogger';
import Gallery from './Components/Gallery';
import Event from './Components/Event';
import BlogHistory from './Components/BlogHistory';
import EventDetails from './Components/EventDetails';


// import PartnershipSection from './Components/PartnershipSection';

function Layout({ children }) {
  const location = useLocation();
  const path = location.pathname.toLowerCase();

  // Hide navbar on these routes
  const hideNavbarPaths = [
    '/login',
    '/owner',
    '/admin',
    '/blogger',
  
  ];

  const showNavbar = !hideNavbarPaths.includes(path);

  return (
    <>
      {showNavbar && <Navbar />}
      {children}
    </>
  );
}

function App() {
  return (
    <div className="App">
      <Router>
        <Layout>
          <Routes>
            {/* ✅ Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/aboutus" element={<About />} />
            <Route path="/event" element={<Event />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/bloghistory/:id" element={<BlogHistory />} />
            <Route path="/gallery" element={<Gallery />} />
            {/* <Route path="/partnershipsection" element={<PartnershipSection />} /> */}
            <Route path="/login" element={<Login />} />
            <Route path="/event-details" element={<EventDetails />} />

            {/* ✅ Protected Routes */}
            <Route
              path="/owner"
              element={
                <ProtectedRoute allowedRoles={['owner']}>
                  <Owner />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <Admin />
                </ProtectedRoute>
              }
            />
            <Route
              path="/blogger"
              element={
                <ProtectedRoute allowedRoles={['blogger']}>
                  <Blogger />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Layout>
      </Router>
    </div>
  );
}

export default App;
