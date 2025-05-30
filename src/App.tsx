// import { useState } from "react";
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import AboutUs from "./pages/AboutUs/AboutUsPage";
import CentralizeManagement from "./pages/ServicesAndSolutions/CentralizeManagement";
import Multimedia from "./pages/ServicesAndSolutions/Multimedia";
import DataManagement from "./pages/ServicesAndSolutions/DataManagement";
import DigitalTransformation from "./pages/ServicesAndSolutions/DigitalTransformation";
import DataCenter from "./pages/ServicesAndSolutions/DataCenter";
// import Contact from "./pages/Contact";
import NAS from "./pages/NAS";
import MeetingRooms from "./pages/Meeting/MeetingRooms";
import Rebooking from "./pages/Meeting/Rebooking";
import BookingConfirm from "./pages/Meeting/BookingConfirm";
import CompanyEvents from "./pages/Community/CompanyEvents";
import Society from "./pages/Community/Society";
import Knowledge from "./pages/Community/Knowledge";
import MeetingRoomsBooking from "./pages/Meeting/MeetingRoomsBooking";
import NetworkSolution from "./pages/ServicesAndSolutions/NetworkSolution";
import BlogDetail from "./pages/Community/BlogDetail";
import KnowledgeDetail from "./pages/Community/KnowledgeDetail";
// import Test from "./pages/Services/Test";

function App() {
  // const [count, setCount] = useState(0);

  return (
    <>
      <Navbar />
      <main className="flex-grow-1 bg-black h-100 w-100">
        <Routes>
          <Route path="/" element={<AboutUs />} />
          <Route
            path="/services/centralize-management"
            element={<CentralizeManagement />}
          />
          <Route
            path="/services/multimedia-solution"
            element={<Multimedia />}
          />
          <Route
            path="/services/data-management"
            element={<DataManagement />}
          />
          <Route
            path="/services/digital-transformation"
            element={<DigitalTransformation />}
          />
          <Route path="/services/data-center" element={<DataCenter />} />
          <Route
            path="/services/network-solution"
            element={<NetworkSolution />}
          />
          {/* <Route path="/contact" element={<Contact />} /> */}
          <Route path="/nas" element={<NAS />} />
          <Route path="/meeting-rooms" element={<MeetingRooms />} />
          <Route
            path="/meeting-rooms-booking/:roomId"
            element={<MeetingRoomsBooking />}
          />
          <Route path="/rebooking" element={<Rebooking />} />
          <Route path="/booking-confirm" element={<BookingConfirm />} />
          <Route path="/community/company-events" element={<CompanyEvents />} />
          <Route path="/community/society" element={<Society />} />
          <Route path="/community/knowledge" element={<Knowledge />} />
          <Route path="/blog/doc/:documentId" element={<BlogDetail />} />
          <Route
            path="/community/knowledge/doc/:documentId"
            element={<KnowledgeDetail />}
          />
          {/* <Route path="/test" element={<Test />} /> */}
        </Routes>
      </main>
    </>
  );
}

export default App;
