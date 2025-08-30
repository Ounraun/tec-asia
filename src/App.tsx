import "bootstrap/dist/css/bootstrap.min.css";
import { Routes, Route, Navigate } from "react-router-dom"; // ⬅️ เพิ่ม Navigate
import Navbar from "./components/Navbar";
import { lazy, Suspense } from "react";

const AboutUs = lazy(() => import("./pages/AboutUs/AboutUsPage"));
const CentralizeManagement = lazy(
  () => import("./pages/ServicesAndSolutions/CentralizeManagement")
);
const Multimedia = lazy(
  () => import("./pages/ServicesAndSolutions/Multimedia")
);
// ⛏️ แก้บั๊กเดิม: DataManagement ถูก import ไปที่ Multimedia
const DataManagement = lazy(
  () => import("./pages/ServicesAndSolutions/DataManagement")
);
const DigitalTransformation = lazy(
  () => import("./pages/ServicesAndSolutions/DigitalTransformation")
);
const DataCenter = lazy(
  () => import("./pages/ServicesAndSolutions/DataCenter")
);
const NAS = lazy(() => import("./pages/NAS"));
const MeetingRooms = lazy(() => import("./pages/Meeting/MeetingRooms"));
const Rebooking = lazy(() => import("./pages/Meeting/Rebooking")); // ตำแหน่งตามโปรเจกต์คุณ
const BookingConfirm = lazy(() => import("./pages/Meeting/BookingConfirm"));
const CompanyEvents = lazy(() => import("./pages/Community/CompanyEvents"));
const Society = lazy(() => import("./pages/Community/Society"));
const Knowledge = lazy(() => import("./pages/Community/Knowledge"));
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
            <Route path="/nas" element={<NAS />} />

            <Route path="/meeting-rooms" element={<MeetingRooms />} />
            <Route
              path="/meeting-rooms-booking/:roomId"
              element={<MeetingRoomsBooking />}
            />

            {/* ⬇️ เปลี่ยนให้ Rebooking รับ documentId */}
            <Route path="/rebooking/:docId" element={<Rebooking />} />
            {/* เข้าทางเดิม /rebooking ให้รีไดเรกต์ไปเลือกห้องหรือหน้าอื่น */}
            <Route
              path="/rebooking"
              element={<Navigate to="/meeting-rooms" replace />}
            />

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
          </Routes>
        </Suspense>
      </main>
    </>
  );
}

export default App;
