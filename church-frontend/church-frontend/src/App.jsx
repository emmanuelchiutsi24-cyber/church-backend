import { Routes, Route } from "react-router-dom";

// ================= COMPONENTS =================
import NavigationBar from "./components/Navbar";

// ================= PUBLIC PAGES =================
import Home from "./pages/Home";
import AboutUs from "./components/homepages/AboutUs";
import Leadership from "./components/homepages/Leadership";
import Deaneries from "./components/homepages/Deaneries";
import Ministries from "./components/homepages/Ministries";
import News from "./components/homepages/News";
import Gallery from "./components/homepages/Gallery";
import Contact from "./components/homepages/Contact";
import Events from "./components/homepages/Events";
import Podcast from "./components/homepages/Podcast";
import JoinUs from "./components/homepages/JoinUs";

// ================= PARISH PAGES =================
import Parishes from "./pages/Parishes";
import ParishDetails from "./pages/ParishDetails";
import AboutParish from "./admin/pages/AboutParish";
import DeaneryDetails from "./pages/DeaneryDetails";
import ParishEvent from "./components/parish/EventSection";

// ================= PARISH ADMIN AUTH =================
import ProtectedRoute from "./admin/auth/ProtectedRoute";
import AdminRegister from "./admin/auth/AdminRegister";
import AdminLogin from "./admin/auth/AdminLogin";
import WaitingApproval from "./admin/auth/WaitingApproval";

// ================= PARISH ADMIN =================
import AdminDashboard from "./admin/AdminDashboard";
import Profile from "./admin/pages/Profile";
import ParishProfile from "./admin/pages/ParishProfile";
import AdminEvents from "./admin/pages/Events";
import Announcements from "./admin/pages/Announcements";
import AdminGallery from "./admin/pages/Gallery";
import Podcasts from "./admin/pages/Podcasts";
import Executive from "./admin/pages/Executive";
import Documents from "./admin/pages/Documents";

// ================= SUPER ADMIN =================
import SuperAdminLayout from "./components/superadmin/SuperAdminLayout";
import SuperAdminLogin from "./components/superadmin/SuperAdminLogin";
import SuperDashboard from "./components/superadmin/SuperDashboard";
import About from "./components/superadmin/About";
import Auth from "./components/superadmin/Auth";
import SuperContact from "./components/superadmin/Contact";
import SuperDeaneries from "./components/superadmin/Deaneries";
import SuperParishes from "./components/superadmin/Parishes";
import SuperEvents from "./components/superadmin/Events";
import SuperGallery from "./components/superadmin/Gallery";
import SuperLeadership from "./components/superadmin/Leadershipp";
import SuperMinistries from "./components/superadmin/Ministries";
import SuperNews from "./components/superadmin/News";

// ================= APP =================
function App() {
  return (
    <Routes>
      {/* ================= PUBLIC WEBSITE ================= */}
      
      {/* Main Pages */}
      <Route path="/" element={<><NavigationBar /><Home /></>} />
      <Route path="/about" element={<><NavigationBar /><AboutUs /></>} />
      <Route path="/leadership" element={<><NavigationBar /><Leadership /></>} />
      <Route path="/ministries" element={<><NavigationBar /><Ministries /></>} />
      <Route path="/news" element={<><NavigationBar /><News /></>} />
      <Route path="/gallery" element={<><NavigationBar /><Gallery /></>} />
      <Route path="/contact" element={<><NavigationBar /><Contact /></>} />
      <Route path="/join" element={<><NavigationBar /><JoinUs /></>} />

      {/* Archdiocese Content */}
      <Route path="/events" element={<><NavigationBar /><Events /></>} />
      <Route path="/podcast" element={<><NavigationBar /><Podcast /></>} />

      {/* Parish List & Details */}
      <Route path="/parishes" element={<><NavigationBar /><Parishes /></>} />
      <Route path="/parishes/:slug" element={<><NavigationBar /><ParishDetails /></>} />
      <Route path="/parishes/:slug/about" element={<><NavigationBar /><AboutParish /></>} />
      
      {/* Deanery List & Details */}
      <Route path="/deaneries" element={<><NavigationBar /><Deaneries /></>} />
      <Route path="/deaneries/:id" element={<><NavigationBar /><DeaneryDetails /></>} />

      {/* Parish Events (Database) */}
      <Route path="/parish/events" element={<><NavigationBar /><ParishEvent /></>} />

      {/* ================= AUTH ================= */}
      <Route path="/admin/register" element={<AdminRegister />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/waiting" element={<WaitingApproval />} />

      {/* ================= PARISH ADMIN ================= */}
      <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/admin/parish" element={<ProtectedRoute><ParishProfile /></ProtectedRoute>} />
      <Route path="/admin/events" element={<ProtectedRoute><AdminEvents /></ProtectedRoute>} />
      <Route path="/admin/eventsection" element={<ProtectedRoute><AdminEvents /></ProtectedRoute>} />
      <Route path="/admin/announcements" element={<ProtectedRoute><Announcements /></ProtectedRoute>} />
      <Route path="/admin/gallery" element={<ProtectedRoute><AdminGallery /></ProtectedRoute>} />
      <Route path="/admin/podcasts" element={<ProtectedRoute><Podcasts /></ProtectedRoute>} />
      <Route path="/admin/executive" element={<ProtectedRoute><Executive /></ProtectedRoute>} />
      <Route path="/admin/documents" element={<ProtectedRoute><Documents /></ProtectedRoute>} />

      {/* ================= SUPER ADMIN ================= */}
      <Route path="/superadmin/login" element={<SuperAdminLogin />} />
      
      <Route path="/superadmin" element={<SuperAdminLayout />}>
        <Route index element={<SuperDashboard />} />
        <Route path="dashboard" element={<SuperDashboard />} />
        <Route path="about" element={<About />} />
        <Route path="auth" element={<Auth />} />
        <Route path="contact" element={<SuperContact />} />
        <Route path="deaneries" element={<SuperDeaneries />} />
        <Route path="parishes" element={<SuperParishes />} />
        <Route path="events" element={<SuperEvents />} />
        <Route path="gallery" element={<SuperGallery />} />
        <Route path="leadership" element={<SuperLeadership />} />
        <Route path="ministries" element={<SuperMinistries />} />
        <Route path="news" element={<SuperNews />} />
      </Route>

      {/* ================= 404 ================= */}
      <Route path="*" element={<h1>Page Not Found</h1>} />
    </Routes>
  );
}

export default App;