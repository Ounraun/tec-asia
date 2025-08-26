import "bootstrap/dist/css/bootstrap.min.css";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import { lazy, Suspense } from "react";

// import AboutUs from "./pages/AboutUs/AboutUsPage";
const AboutUs = lazy(() => import("./pages/AboutUs/AboutUsPage"));
// import CentralizeManagement from "./pages/ServicesAndSolutions/CentralizeManagement";
const CentralizeManagement = lazy(
  () => import("./pages/ServicesAndSolutions/CentralizeManagement")
);
// import Multimedia from "./pages/ServicesAndSolutions/Multimedia";
const Multimedia = lazy(
  () => import("./pages/ServicesAndSolutions/Multimedia")
);
// import DataManagement from "./pages/ServicesAndSolutions/DataManagement";
const DataManagement = lazy(
  () => import("./pages/ServicesAndSolutions/Multimedia")
);
// import DigitalTransformation from "./pages/ServicesAndSolutions/DigitalTransformation";
const DigitalTransformation = lazy(
  () => import("./pages/ServicesAndSolutions/DigitalTransformation")
);
// import DataCenter from "./pages/ServicesAndSolutions/DataCenter";
const DataCenter = lazy(
  () => import("./pages/ServicesAndSolutions/DataCenter")
);

// import NAS from "./pages/NAS";
const NAS = lazy(() => import("./pages/NAS"));
// import MeetingRooms from "./pages/Meeting/MeetingRooms";
const MeetingRooms = lazy(() => import("./pages/Meeting/MeetingRooms"));
// import Rebooking from "./pages/Meeting/Rebooking";
const Rebooking = lazy(() => import("./pages/Meeting/Rebooking"));
// import BookingConfirm from "./pages/Meeting/BookingConfirm";
const BookingConfirm = lazy(() => import("./pages/Meeting/BookingConfirm"));
// import CompanyEvents from "./pages/Community/CompanyEvents";
const CompanyEvents = lazy(() => import("./pages/Community/CompanyEvents"));
// import Society from "./pages/Community/Society";
const Society = lazy(() => import("./pages/Community/Society"));
// import Knowledge from "./pages/Community/Knowledge";
const Knowledge = lazy(() => import("./pages/Community/Knowledge"));
// import MeetingRoomsBooking from "./pages/Meeting/MeetingRoomsBooking";
const MeetingRoomsBooking = lazy(
  () => import("./pages/Meeting/MeetingRoomsBooking")
);
const NetworkSolution = lazy(
  () => import("./pages/ServicesAndSolutions/NetworkSolution")
);
const BlogDetail = lazy(() => import("./pages/Community/BlogDetail"));
const KnowledgeDetail = lazy(() => import("./pages/Community/KnowledgeDetail"));

const Fallback = () => <div className="text-light p-4">Loading…</div>;
function App() {
  return (
    <>
      <Navbar />
      <main className="flex-grow-1 bg-black h-100 w-100">
        <Suspense fallback={<Fallback />}>
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
            <Route
              path="/community/company-events"
              element={<CompanyEvents />}
            />
            <Route path="/community/society" element={<Society />} />
            <Route path="/community/knowledge" element={<Knowledge />} />
            <Route path="/blog/doc/:documentId" element={<BlogDetail />} />
            <Route
              path="/community/knowledge/doc/:documentId"
              element={<KnowledgeDetail />}
            />
            {/* <Route path="/test" element={<Test />} /> */}
          </Routes>
        </Suspense>
      </main>
    </>
  );
}

export default App;
