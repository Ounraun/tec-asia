import React, { ReactNode, useEffect, useState, ChangeEvent } from "react";
import { useParams, useNavigate, Link, useLocation } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.min.css";
import styles from "./MeetingRoomsBooking.module.css";
import ParticlesComponent from "../../components/Particles/Particles";

interface Booking {
  description: ReactNode;
  subject: ReactNode;
  contact_name: ReactNode;
  contact_phone: ReactNode;
  contact_email: ReactNode;
  end_time: string;
  start_time: string;
  date: string;
  booked_by: ReactNode;
  meeting_room: any;
  id: number;
  purpose: string;
  email?: {
    data: {
      id: number;
      attributes: {
        email: string;
      };
    }[];
  };
  documentId: string;
}

interface RoomDetails {
  name: string;
  description: string;
  min: number;
  max: number;
}

// ต้องมี interface สำหรับข้อมูลที่จะส่งไป Strapi
interface BookingFormData {
  subject: string; // หัวข้อการประชุม
  description: string; // รายละเอียด
  contact_email: string; // อีเมล์ผู้จอง
  contact_name: string; // ชื่อผู้จอง
  contact_phone?: string; // เบอร์ติดต่อ
  participants: string[]; // อีเมล์ผู้เข้าร่วม
  date: string; // วันที่จอง
  start_time: string; // เวลาเริ่ม
  end_time: string; // เวลาสิ้นสุด
  meeting_room: string; // ID ห้องประชุม
}

const getWeekDates = (date?: Date) => {
  const today = date || new Date();
  const currentDay = today.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  const monday = new Date(today);

  // ถ้าวันนี้เป็นวันอาทิตย์ (0) ให้ถอยกลับไป 6 วัน
  // ถ้าเป็นวันอื่นๆ ให้ถอยกลับไปจนถึงวันจันทร์
  const daysToMonday = currentDay === 0 ? 6 : currentDay - 1;
  monday.setDate(today.getDate() - daysToMonday);

  // ตั้งเวลาเป็น 00:00:00
  monday.setHours(0, 0, 0, 0);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  // ตั้งเวลาเป็น 23:59:59
  sunday.setHours(23, 59, 59, 999);

  return { monday, sunday };
};

const formatDate = (date: Date) => {
  return date.toLocaleDateString("th-TH", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

// เพิ่มฟังก์ชันสำหรับสร้างตัวเลือกเวลา
const generateTimeOptions = () => {
  const times: string[] = [];
  for (let hour = 7; hour <= 20; hour++) {
    const formattedHour = hour.toString().padStart(2, "0");
    times.push(`${formattedHour}:00`);
  }
  return times;
};

// เพิ่มฟังก์ชันสำหรับตรวจสอบเวลาที่เลือก
const validateTimeSelection = (start: string, end: string): boolean => {
  const startHour = parseInt(start.split(":")[0]);
  const endHour = parseInt(end.split(":")[0]);
  const startMinute = parseInt(start.split(":")[1]);
  const endMinute = parseInt(end.split(":")[1]);

  // แปลงเป็นนาทีเพื่อเปรียบเทียบ
  const startTime = startHour * 60 + startMinute;
  const endTime = endHour * 60 + endMinute;
  const minTime = 7 * 60; // 07:00
  const maxTime = 20 * 60; // 20:00

  return startTime >= minTime && endTime <= maxTime && startTime < endTime;
};

const MeetingRoomsBooking: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [roomDetails, setRoomDetails] = useState<RoomDetails | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [weekDates, setWeekDates] = useState<{ monday: Date; sunday: Date }>(
    getWeekDates()
  );
  const [currentDisplayedWeek, setCurrentDisplayedWeek] = useState<{
    monday: Date;
    sunday: Date;
  }>(getWeekDates());
  const [refreshKey, setRefreshKey] = useState(0);
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");
  const [timeError, setTimeError] = useState<string | null>(null);
  const [formData, setFormData] = useState<BookingFormData>({
    subject: "",
    description: "",
    contact_email: "",
    contact_name: "",
    contact_phone: "",
    participants: [""],
    date: "",
    start_time: "",
    end_time: "",
    meeting_room: roomId || "",
  });
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [isViewMode, setIsViewMode] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingBookingId, setEditingBookingId] = useState<number | null>(null);
  const [editingBookingDocId, setEditingBookingDocId] = useState<string | null>(
    null
  );

  const apiUrl = import.meta.env.VITE_API_URL;

  const parseTimeString = (dateStr: string, timeStr: string | undefined) => {
    if (!timeStr) return new Date();

    console.log("Parsing date and time:", { dateStr, timeStr });

    const [hours, minutes] = timeStr.split(":");
    const [year, month, day] = dateStr.split("-");
    const date = new Date(
      parseInt(year),
      parseInt(month) - 1,
      parseInt(day),
      parseInt(hours),
      parseInt(minutes),
      0,
      0
    );

    console.log("Parsed date:", date);
    return date;
  };

  // const getDayOfWeek = (date: Date) => {
  //   const days = [
  //     "Sunday",
  //     "Monday",
  //     "Tuesday",
  //     "Wednesday",
  //     "Thursday",
  //     "Friday",
  //     "Saturday",
  //   ];
  //   return days[date.getDay()];
  // };

  // const refreshData = () => {
  //   setLoading(true);
  //   setRefreshKey((prev) => prev + 1);
  // };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const roomDetails: RoomDetails = {
      name: params.get("name") || "",
      description: params.get("description") || "",
      min: parseInt(params.get("min") || "0"),
      max: parseInt(params.get("max") || "0"),
    };
    setRoomDetails(roomDetails);
  }, [location.search]);

  const fetchBookings = async () => {
    try {
      const formatDateForAPI = (date: Date) => {
        return date.toISOString().split("T")[0];
      };

      const startDate = formatDateForAPI(currentDisplayedWeek.monday);
      const endDate = formatDateForAPI(currentDisplayedWeek.sunday);

      const apiEndpoint = `${apiUrl}/api/bookings?filters[date][$gte]=${startDate}&filters[date][$lte]=${endDate}&populate=*`;
      console.log("กำลังดึงข้อมูลการจองจาก API:", {
        endpoint: apiEndpoint,
        startDate,
        endDate,
        currentDisplayedWeek: {
          monday: currentDisplayedWeek.monday.toISOString(),
          sunday: currentDisplayedWeek.sunday.toISOString(),
        },
      });

      const response = await fetch(apiEndpoint);

      if (!response.ok) {
        throw new Error("ไม่สามารถโหลดข้อมูลการจองได้");
      }

      const data = await response.json();
      console.log("ข้อมูลการจองที่ได้จาก API:", data);

      if (data.data) {
        const filteredBookings = data.data.filter(
          (booking: Booking) =>
            !booking.meeting_room ||
            (booking.meeting_room && booking.meeting_room.documentId === roomId)
        );
        console.log("ข้อมูลการจองหลังจากกรอง:", {
          totalBookings: filteredBookings.length,
          bookings: filteredBookings,
        });
        setBookings(filteredBookings);
      } else {
        console.log("ไม่พบข้อมูลการจอง");
        setBookings([]);
      }
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setError(
        err instanceof Error ? err.message : "เกิดข้อผิดพลาดในการโหลดข้อมูล"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (roomId) {
      const fetchData = async () => {
        try {
          console.log("Week dates changed:", {
            monday: currentDisplayedWeek.monday.toISOString(),
            sunday: currentDisplayedWeek.sunday.toISOString(),
            refreshKey: refreshKey,
          });

          setLoading(true);
          await fetchBookings();
        } catch (error) {
          console.error("Error in fetchData:", error);
        }
      };

      fetchData();
    }
  }, [
    roomId,
    currentDisplayedWeek.monday.toISOString(),
    currentDisplayedWeek.sunday.toISOString(),
    apiUrl,
    refreshKey,
  ]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        fetchBookings();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", fetchBookings);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", fetchBookings);
    };
  }, []);

  const handlePreviousWeek = () => {
    setLoading(true);
    const newMonday = new Date(currentDisplayedWeek.monday);
    newMonday.setDate(currentDisplayedWeek.monday.getDate() - 7);
    newMonday.setHours(0, 0, 0, 0);

    const newSunday = new Date(newMonday);
    newSunday.setDate(newMonday.getDate() + 6);
    newSunday.setHours(23, 59, 59, 999);

    console.log("Changing to previous week:", {
      newMonday: newMonday.toISOString(),
      newSunday: newSunday.toISOString(),
    });

    setCurrentDisplayedWeek({ monday: newMonday, sunday: newSunday });
    setWeekDates({ monday: newMonday, sunday: newSunday });
  };

  const handleNextWeek = () => {
    setLoading(true);
    const newMonday = new Date(currentDisplayedWeek.monday);
    newMonday.setDate(currentDisplayedWeek.monday.getDate() + 7);
    newMonday.setHours(0, 0, 0, 0);

    const newSunday = new Date(newMonday);
    newSunday.setDate(newMonday.getDate() + 6);
    newSunday.setHours(23, 59, 59, 999);

    console.log("Changing to next week:", {
      newMonday: newMonday.toISOString(),
      newSunday: newSunday.toISOString(),
    });

    setCurrentDisplayedWeek({ monday: newMonday, sunday: newSunday });
    setWeekDates({ monday: newMonday, sunday: newSunday });
  };

  // แก้ไขฟังก์ชัน handleStartTimeChange
  const handleStartTimeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStartTime = e.target.value;
    setStartTime(newStartTime);

    if (endTime && !validateTimeSelection(newStartTime, endTime)) {
      setTimeError(
        "กรุณาเลือกเวลาระหว่าง 07:00 - 20:00 และเวลาเริ่มต้นต้องน้อยกว่าเวลาสิ้นสุด"
      );
    } else {
      setTimeError(null);
    }
  };

  // แก้ไขฟังก์ชัน handleEndTimeChange
  const handleEndTimeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newEndTime = e.target.value;
    setEndTime(newEndTime);

    if (startTime && !validateTimeSelection(startTime, newEndTime)) {
      setTimeError(
        "กรุณาเลือกเวลาระหว่าง 07:00 - 20:00 และเวลาเริ่มต้นต้องน้อยกว่าเวลาสิ้นสุด"
      );
    } else {
      setTimeError(null);
    }
  };

  // สร้างตัวเลือกเวลา
  const timeOptions = generateTimeOptions();

  // ฟังก์ชันจัดการการเปลี่ยนแปลงข้อมูลในฟอร์ม
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ฟังก์ชันจัดการผู้เข้าร่วม
  const handleParticipantChange = (index: number, value: string) => {
    const newParticipants = [...formData.participants];
    newParticipants[index] = value;
    setFormData((prev) => ({
      ...prev,
      participants: newParticipants,
    }));
  };

  // เพิ่มฟังก์ชันตรวจสอบอีเมล์
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // ตรวจสอบข้อมูลที่จำเป็น
  const validateRequiredFields = (): boolean => {
    if (
      !formData.subject ||
      !formData.description ||
      !formData.contact_email ||
      !formData.contact_name
    ) {
      setError("กรุณากรอกข้อมูลให้ครบถ้วน");
      return false;
    }

    if (!selectedDate || !startTime || !endTime) {
      setError("กรุณาเลือกวันที่และเวลาให้ครบถ้วน");
      return false;
    }

    return true;
  };

  // ตรวจสอบรูปแบบอีเมล์
  const validateEmails = (): boolean => {
    console.log("Validating emails:", {
      contact_email: formData.contact_email,
      participants: formData.participants,
    });

    if (!validateEmail(formData.contact_email)) {
      setError("รูปแบบอีเมล์ผู้จองไม่ถูกต้อง");
      return false;
    }

    // กรองเฉพาะอีเมล์ที่ไม่ว่างเปล่า
    const filledParticipants = formData.participants.filter(
      (email) => email.trim() !== ""
    );
    console.log("Filled participants:", filledParticipants);

    // ถ้าไม่มีผู้เข้าร่วม ให้ผ่านการตรวจสอบ
    if (filledParticipants.length === 0) {
      return true;
    }

    // ตรวจสอบรูปแบบอีเมล์ของผู้เข้าร่วมที่กรอกข้อมูล
    const invalidParticipants = filledParticipants.filter(
      (email) => !validateEmail(email)
    );

    console.log("Invalid participants:", invalidParticipants);

    if (invalidParticipants.length > 0) {
      setError(
        `รูปแบบอีเมล์ผู้เข้าร่วมไม่ถูกต้อง: ${invalidParticipants.join(", ")}`
      );
      return false;
    }

    return true;
  };

  // ตรวจสอบความถูกต้องของเวลา
  const validateTime = (): boolean => {
    const startHour = parseInt(startTime.split(":")[0]);
    const endHour = parseInt(endTime.split(":")[0]);

    if (startHour < 7 || endHour > 20) {
      setError("เวลาจองต้องอยู่ระหว่าง 07:00 - 20:00 น.");
      return false;
    }

    if (startTime >= endTime) {
      setError("เวลาเริ่มต้นต้องน้อยกว่าเวลาสิ้นสุด");
      return false;
    }

    return true;
  };

  // ตรวจสอบการจองซ้ำ
  const validateBookingOverlap = (): boolean => {
    const selectedDateStr = selectedDate?.toISOString().split("T")[0];

    console.log("กำลังตรวจสอบการจองซ้ำ:", {
      วันที่เลือก: selectedDateStr,
      เวลาเริ่ม: startTime,
      เวลาสิ้นสุด: endTime,
      การจองทั้งหมด: bookings,
      กำลังแก้ไขการจอง: {
        id: editingBookingId,
        documentId: editingBookingDocId,
      },
    });

    const overlappingBooking = bookings.find((booking) => {
      // ข้ามการตรวจสอบถ้าเป็นการจองเดียวกันที่กำลังแก้ไข
      if (booking.documentId === editingBookingDocId) {
        console.log("ข้ามการตรวจสอบการจองที่กำลังแก้ไข:", {
          id: booking.id,
          documentId: booking.documentId,
        });
        return false;
      }

      if (booking.date !== selectedDateStr) return false;

      const bookingStart = booking.start_time;
      const bookingEnd = booking.end_time;

      const isOverlap =
        (startTime >= bookingStart && startTime < bookingEnd) ||
        (endTime > bookingStart && endTime <= bookingEnd) ||
        (startTime <= bookingStart && endTime >= bookingEnd);

      if (isOverlap) {
        console.log("พบการจองที่ซ้ำซ้อน:", {
          การจองที่ซ้ำ: {
            id: booking.id,
            วันที่: booking.date,
            เวลาเริ่ม: bookingStart,
            เวลาสิ้นสุด: bookingEnd,
            หัวข้อ: booking.subject,
          },
          การจองที่ต้องการ: {
            วันที่: selectedDateStr,
            เวลาเริ่ม: startTime,
            เวลาสิ้นสุด: endTime,
          },
        });
      }

      return isOverlap;
    });

    if (overlappingBooking) {
      setError("มีการจองในช่วงเวลานี้แล้ว");
      return false;
    }

    return true;
  };

  // รวมการตรวจสอบทั้งหมด
  const validateForm = (): boolean => {
    setError(null);

    if (!validateRequiredFields()) return false;
    if (!validateEmails()) return false;
    if (!validateTime()) return false;
    if (!validateBookingOverlap()) return false;

    return true;
  };

  // ฟังก์ชันสำหรับส่งข้อมูล
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const filteredParticipants = formData.participants.filter(
        (email) => email.trim() !== ""
      );

      const bookingDate = selectedDate?.toISOString().split("T")[0];
      const bookingData = {
        data: {
          date: bookingDate,
          start_time: `${startTime}:00.000`,
          end_time: `${endTime}:00.000`,
          subject: formData.subject,
          description: formData.description,
          contact_email: formData.contact_email,
          contact_name: formData.contact_name,
          contact_phone: formData.contact_phone || "",
          meeting_room: roomId,
          email: filteredParticipants.map((email) => ({ email })),
        },
      };

      console.log("กำลังส่งข้อมูลการจองไปยัง API:", bookingData);

      const response = await fetch(`${apiUrl}/api/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || "การจองไม่สำเร็จ");
      }

      // const responseData = await response.json();
      // console.log("การจองสำเร็จ ข้อมูลที่ได้รับ:", responseData);

      // window.alert("จองห้องประชุมสำเร็จ");
      navigate("/booking-confirm");

      // อัพเดท currentDisplayedWeek ให้ตรงกับสัปดาห์ที่จอง
      if (selectedDate) {
        const bookingWeek = getWeekDates(selectedDate);
        console.log("อัพเดทสัปดาห์ที่แสดง:", {
          วันที่จอง: selectedDate.toISOString(),
          สัปดาห์ใหม่: {
            monday: bookingWeek.monday.toISOString(),
            sunday: bookingWeek.sunday.toISOString(),
          },
        });
        setCurrentDisplayedWeek(bookingWeek);
        setWeekDates(bookingWeek);
      }

      // รีเซ็ตฟอร์มก่อนดึงข้อมูลใหม่
      setFormData({
        subject: "",
        description: "",
        contact_email: "",
        contact_name: "",
        contact_phone: "",
        participants: [""],
        date: "",
        start_time: "",
        end_time: "",
        meeting_room: roomId || "",
      });
      setSelectedDate(null);
      setStartTime("");
      setEndTime("");
      setError(null);
      setShowBookingForm(false);

      // ตั้งค่า loading เป็น true
      setLoading(true);

      // เพิ่ม refreshKey เพื่อกระตุ้นการรีเฟรชข้อมูล
      setRefreshKey((prev) => prev + 1);
    } catch (error) {
      console.error("Error submitting booking:", error);
      window.alert(
        error instanceof Error
          ? error.message
          : "เกิดข้อผิดพลาดในการจอง กรุณาลองใหม่อีกครั้ง"
      );
    }
  };

  const isBooked = (date: Date, hour: number): boolean => {
    if (!bookings) return false;

    const checkDate = new Date(date);
    checkDate.setHours(hour, 0, 0, 0);

    return bookings.some((booking) => {
      const bookingStart = new Date(booking.start_time);
      const bookingEnd = new Date(booking.end_time);
      return checkDate >= bookingStart && checkDate < bookingEnd;
    });
  };

  const handleCellClick = (
    date: Date,
    hour: number,
    existingBooking?: Booking
  ) => {
    if (existingBooking) {
      console.log("ข้อมูลการจองที่เลือก:", {
        id: existingBooking.id,
        documentId: existingBooking.documentId,
        ข้อมูลทั้งหมด: existingBooking,
      });

      setEditingBookingDocId(existingBooking.documentId);
      setEditingBookingId(existingBooking.id);
      // เพิ่ม console.log เพื่อแสดง endpoint
      console.log("Endpoint ที่ใช้ในการดึงข้อมูล:", {
        API_URL: apiUrl,
        BOOKING_ID: existingBooking.id,
        FULL_ENDPOINT: `${apiUrl}/api/bookings/${existingBooking.id}?populate=*`,
        วิธีการเรียกใช้: "GET",
        พารามิเตอร์: {
          populate: "*",
          id: existingBooking.id,
        },
      });

      // แสดงข้อมูลการจองที่คลิก
      console.log("ข้อมูลการจองที่เลือก:", {
        id: existingBooking.id,
        วันที่: existingBooking.date,
        เวลาเริ่ม: existingBooking.start_time,
        เวลาสิ้นสุด: existingBooking.end_time,
        หัวข้อ: existingBooking.subject,
        รายละเอียด: existingBooking.description,
        ผู้จอง: existingBooking.contact_name,
        อีเมล์ผู้จอง: existingBooking.contact_email,
        เบอร์โทร: existingBooking.contact_phone,
        ห้องประชุม: existingBooking.meeting_room,
        booked_by: existingBooking.booked_by,
        ผู้เข้าร่วม:
          existingBooking.email?.data?.map(
            (p: { id: number; attributes: { email: string } }) =>
              p.attributes.email
          ) || [],
        ข้อมูลอีเมลดิบ: existingBooking.email,
      });

      setIsViewMode(true);
      setIsEditMode(false);
      setSelectedDate(new Date(existingBooking.date));

      const formatTime = (time: string) => {
        // ถ้าเวลามาในรูปแบบ ISO หรือมี T
        if (time.includes("T")) {
          const date = new Date(time);
          return `${String(date.getHours()).padStart(2, "0")}:${String(
            date.getMinutes()
          ).padStart(2, "0")}`;
        }

        // ถ้าเวลามาในรูปแบบ HH:mm:ss.SSS
        if (time.includes(".")) {
          return time.split(".")[0].substring(0, 5);
        }

        // ถ้าเวลามาในรูปแบบ HH:mm:ss
        if (time.includes(":") && time.split(":").length === 3) {
          return time.substring(0, 5);
        }

        // ถ้าเวลามาในรูปแบบ HH:mm
        return time
          .split(":")
          .map((num) => num.padStart(2, "0"))
          .join(":");
      };

      const formattedStartTime = formatTime(existingBooking.start_time);
      const formattedEndTime = formatTime(existingBooking.end_time);

      setStartTime(formattedStartTime);
      setEndTime(formattedEndTime);

      // แปลงวันที่ให้อยู่ในรูปแบบที่อ่านง่าย
      const formattedDate = new Date(existingBooking.date).toLocaleDateString(
        "th-TH",
        {
          year: "numeric",
          month: "long",
          day: "numeric",
          weekday: "long",
        }
      );

      // ดึงข้อมูลอีเมลผู้เข้าร่วม
      //  // const participantEmails = existingBooking.email?.map((p: { email: any; }) => p.email) || [];
      console.log("ตรวจสอบข้อมูล email:", {
        email: existingBooking.email,
        isArray: Array.isArray(existingBooking.email),
      });

      const participantEmails = Array.isArray(existingBooking.email)
        ? existingBooking.email.map((p) => p.email)
        : [];

      console.log("รายชื่ออีเมลผู้เข้าร่วม:", participantEmails);

      setFormData({
        subject: String(existingBooking.subject || ""),
        description: String(existingBooking.description || ""),
        contact_email: String(existingBooking.contact_email || ""),
        contact_name: String(existingBooking.contact_name || ""),
        contact_phone: String(existingBooking.contact_phone || ""),
        participants: participantEmails,
        date: formattedDate,
        start_time: formattedStartTime,
        end_time: formattedEndTime,
        meeting_room: roomId || "",
      });

      console.log("ข้อมูลทั้งหมดใน formData:", {
        หัวข้อการประชุม: String(existingBooking.subject || ""),
        รายละเอียด: String(existingBooking.description || ""),
        อีเมล์ผู้จอง: String(existingBooking.contact_email || ""),
        ชื่อผู้จอง: String(existingBooking.contact_name || ""),
        เบอร์โทร: String(existingBooking.contact_phone || ""),
        ผู้เข้าร่วม:
          existingBooking.email?.data?.map((p) => ({
            id: p.id,
            email: p.attributes.email,
          })) || [],
        จำนวนผู้เข้าร่วม: existingBooking.email?.data?.length || 0,
        วันที่: formattedDate,
        เวลาเริ่ม: formattedStartTime,
        เวลาสิ้นสุด: formattedEndTime,
        ห้องประชุม: roomId || "",
        ข้อมูลดิบ: {
          ...existingBooking,
          email_data: existingBooking.email?.data,
          email_attributes: existingBooking.email?.data?.map(
            (p) => p.attributes
          ),
        },
      });

      console.log("ข้อมูลผู้เข้าร่วมที่จะแสดงในฟอร์ม:", {
        จำนวนผู้เข้าร่วม: existingBooking.email?.data?.length || 0,
        รายชื่อผู้เข้าร่วม:
          existingBooking.email?.data?.map((p) => ({
            id: p.id,
            email: p.attributes.email,
          })) || [],
        ข้อมูลอีเมลดิบ: existingBooking.email,
        ข้อมูลอีเมลที่เข้าถึงได้: {
          data_1: existingBooking.email?.data,
          data_2: existingBooking.email && existingBooking.email.data,
          data_3: existingBooking.email?.data ?? [],
          data_4: existingBooking.email?.data || [],
          data_5: existingBooking.email?.data
            ? [...existingBooking.email.data]
            : [],
          data_6: existingBooking.email?.data
            ? JSON.parse(JSON.stringify(existingBooking.email.data || []))
            : [],
          data_7: existingBooking.email?.data
            ? Array.from(existingBooking.email.data)
            : [],
        },
      });

      setShowBookingForm(true);

      setTimeout(() => {
        const formElement = document.getElementById("bookingForm");
        formElement?.scrollIntoView({ behavior: "smooth" });
      }, 100);
      return;
    }

    setEditingBookingId(null);
    setIsEditMode(false);
    // เคลียร์ข้อมูลฟอร์มก่อน
    setFormData({
      subject: "",
      description: "",
      contact_email: "",
      contact_name: "",
      contact_phone: "",
      participants: [""],
      date: "",
      start_time: "",
      end_time: "",
      meeting_room: roomId || "",
    });

    setIsViewMode(false);
    if (isBooked(date, hour)) return;

    const selectedDate = new Date(date);
    selectedDate.setHours(hour);
    setSelectedDate(selectedDate);
    setStartTime(hour.toString().padStart(2, "0") + ":00");
    setEndTime((hour + 1).toString().padStart(2, "0") + ":00");
    setShowBookingForm(true);

    setTimeout(() => {
      const formElement = document.getElementById("bookingForm");
      formElement?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleCloseForm = () => {
    setShowBookingForm(false);
    setSelectedDate(null);
    setStartTime("");
    setEndTime("");
    setIsViewMode(false);
    setIsEditMode(false);
    setFormData({
      subject: "",
      description: "",
      contact_email: "",
      contact_name: "",
      contact_phone: "",
      participants: [""],
      date: "",
      start_time: "",
      end_time: "",
      meeting_room: roomId || "",
    });
  };

  // เพิ่มฟังก์ชันสำหรับเปิดโหมดแก้ไข
  const handleEditClick = () => {
    console.log("เข้าสู่โหมดแก้ไข:", {
      กำลังแก้ไขการจองID: editingBookingId,
      ข้อมูลปัจจุบัน: {
        หัวข้อ: formData.subject,
        รายละเอียด: formData.description,
        วันที่: selectedDate,
        เวลาเริ่ม: startTime,
        เวลาสิ้นสุด: endTime,
        ผู้จอง: formData.contact_name,
        อีเมล์ผู้จอง: formData.contact_email,
        ผู้เข้าร่วม: formData.participants,
      },
    });
    setIsViewMode(false);
    setIsEditMode(true);
  };

  // เพิ่มฟังก์ชันสำหรับการอัพเดทการจอง
  const handleUpdateBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("เริ่มกระบวนการอัพเดทการจอง:", {
      ID: editingBookingId,
      DocumentID: editingBookingDocId,
      ฟอร์มผ่านการตรวจสอบ: validateForm(),
      ข้อมูลฟอร์ม: formData,
    });

    if (!validateForm() || !editingBookingDocId) {
      console.log("การตรวจสอบฟอร์มไม่ผ่าน:", {
        validateForm: validateForm(),
        editingBookingDocId,
        formErrors: error,
      });
      return;
    }

    try {
      const filteredParticipants = formData.participants.filter(
        (email) => email.trim() !== ""
      );

      const bookingDate = selectedDate?.toISOString().split("T")[0];
      const bookingData = {
        data: {
          date: bookingDate,
          start_time: `${startTime}:00.000`,
          end_time: `${endTime}:00.000`,
          subject: formData.subject,
          description: formData.description,
          contact_email: formData.contact_email,
          contact_name: formData.contact_name,
          contact_phone: formData.contact_phone || "",
          meeting_room: roomId,
          email: filteredParticipants.map((email) => ({ email })),
        },
      };

      const updateEndpoint = `${apiUrl}/api/bookings/${editingBookingDocId}`;

      console.log("กำลังส่งข้อมูลอัพเดทไปที่ API:", {
        ID: editingBookingId,
        DocumentID: editingBookingDocId,
        Endpoint: updateEndpoint,
        Method: "PUT",
        Headers: {
          "Content-Type": "application/json",
        },
        ข้อมูลที่ส่ง: bookingData,
      });

      const response = await fetch(updateEndpoint, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("การอัพเดทไม่สำเร็จ:", {
          status: response.status,
          statusText: response.statusText,
          errorData,
        });
        throw new Error(errorData.error?.message || "การอัพเดทไม่สำเร็จ");
      }

      const responseData = await response.json();
      console.log("อัพเดทการจองสำเร็จ:", {
        ข้อมูลที่ได้รับ: responseData,
        สถานะ: "สำเร็จ",
      });

      window.alert("อัพเดทการจองห้องประชุมสำเร็จ");

      // รีเซ็ตฟอร์มและโหมดการแก้ไข
      setIsEditMode(false);
      setEditingBookingId(null);
      setEditingBookingDocId(null);
      setShowBookingForm(false);
      setFormData({
        subject: "",
        description: "",
        contact_email: "",
        contact_name: "",
        contact_phone: "",
        participants: [""],
        date: "",
        start_time: "",
        end_time: "",
        meeting_room: roomId || "",
      });

      // รีเฟรชข้อมูล
      setRefreshKey((prev) => prev + 1);
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการอัพเดท:", {
        error,
        message: error instanceof Error ? error.message : "ไม่ทราบสาเหตุ",
      });
      window.alert(
        error instanceof Error
          ? error.message
          : "เกิดข้อผิดพลาดในการอัพเดท กรุณาลองใหม่อีกครั้ง"
      );
    }
  };

  if (loading) {
    return (
      <div className={styles.meetingRoomsContainer}>
        <div className={styles.loading}>กำลังโหลดข้อมูล...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.meetingRoomsContainer}>
        <div className={styles.error}>{error}</div>
      </div>
    );
  }

  const roomDetail = bookings.length > 0 ? bookings[0].meeting_room : null;

  const renderBookingTable = () => {
    const { monday, sunday } = weekDates;
    const days = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];

    const isTimeOverlap = (
      bookingStart: string,
      bookingEnd: string,
      cellHour: number
    ) => {
      const start = parseInt(bookingStart.split(":")[0]);
      const end = parseInt(bookingEnd.split(":")[0]);
      return cellHour >= start && cellHour < end;
    };

    const formatDateToString = (date: Date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    const bookingsByDate = bookings.reduce(
      (acc: { [key: string]: Booking[] }, booking) => {
        if (!acc[booking.date]) {
          acc[booking.date] = [];
        }
        acc[booking.date].push(booking);
        return acc;
      },
      {}
    );

    const isPastDate = (date: Date) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return date < today;
    };

    return (
      <div className={styles.bookingTableContainer}>
        <ParticlesComponent className={styles.particlesBackground} />
        <div className={styles.bookingTable}>
          <div className={styles.weekNavigation}>
            <button onClick={handlePreviousWeek} className={styles.navButton}>
              &lt; สัปดาห์ก่อนหน้า
            </button>
            <span className={styles.weekRange}>
              {formatDate(monday)} - {formatDate(sunday)}
            </span>
            <button onClick={handleNextWeek} className={styles.navButton}>
              สัปดาห์ถัดไป &gt;
            </button>
          </div>
          <table>
            <thead>
              <tr>
                <th>เวลา</th>
                {days.map((day, index) => {
                  const date = new Date(monday);
                  date.setDate(monday.getDate() + index);
                  return (
                    <th key={day}>
                      {day}
                      <br />
                      {formatDate(date)}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 13 }, (_, i) => {
                const startHour = 7 + i;
                const endHour = startHour + 1;
                const timeSlot = `${String(startHour).padStart(
                  2,
                  "0"
                )}:00 - ${String(endHour).padStart(2, "0")}:00`;

                return (
                  <tr key={timeSlot}>
                    <td>{timeSlot}</td>
                    {days.map((day, index) => {
                      const currentDate = new Date(monday);
                      currentDate.setDate(monday.getDate() + index);
                      const dateStr = formatDateToString(currentDate);
                      const todayBookings = bookingsByDate[dateStr] || [];
                      const booking = todayBookings.find((b) =>
                        isTimeOverlap(b.start_time, b.end_time, startHour)
                      );

                      const isPast = isPastDate(currentDate);

                      return (
                        <td
                          key={`${day}-${dateStr}-${startHour}`}
                          className={`${
                            booking ? styles.booked : styles.available
                          } ${
                            !isPast && !booking
                              ? styles.clickable
                              : booking
                              ? styles.clickableBooked
                              : ""
                          }`}
                          onClick={() =>
                            !isPast &&
                            (booking
                              ? handleCellClick(currentDate, startHour, booking)
                              : handleCellClick(currentDate, startHour))
                          }
                          style={{
                            cursor: isPast ? "not-allowed" : "pointer",
                            opacity: isPast ? 0.5 : 1,
                          }}
                          title={
                            booking
                              ? `${booking.subject} (${booking.start_time}-${booking.end_time})`
                              : isPast
                              ? "ไม่สามารถจองวันในอดีตได้"
                              : "คลิกเพื่อจอง"
                          }
                        >
                          {booking ? (
                            <div className={styles.bookingInfo}>
                              <div>{booking.subject}</div>
                              <div>{booking.description}</div>
                            </div>
                          ) : (
                            <div className={styles.available}>
                              {isPast ? "ไม่สามารถจอง" : "ว่าง"}
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.meetingRoomsContainer}>
      <h1 className={styles.pageTitle}>
        จองห้องประชุม: {roomDetails?.name || "ไม่ระบุชื่อห้อง"}
      </h1>

      {renderBookingTable()}

      {!showBookingForm && (
        <div className={styles.selectTimePrompt}>
          กรุณาเลือกช่วงเวลาที่ต้องการจองจากตารางด้านบน
        </div>
      )}

      {showBookingForm && (
        <div id="bookingForm" className={styles.bookingForm}>
          <div className={styles.formHeader}>
            <h2>
              {isViewMode
                ? "ข้อมูลการจอง"
                : isEditMode
                ? "แก้ไขการจอง"
                : "จองห้องประชุม"}
            </h2>
            <div className={styles.formActions}>
              {isViewMode && (
                <button
                  className={styles.editButton}
                  onClick={handleEditClick}
                  aria-label="แก้ไขการจอง"
                >
                  แก้ไข
                </button>
              )}
              <button
                className={styles.closeButton}
                onClick={handleCloseForm}
                aria-label="ปิดฟอร์ม"
              >
                ×
              </button>
            </div>
          </div>
          <form onSubmit={isEditMode ? handleUpdateBooking : handleSubmit}>
            <div className={styles.dateTimeContainer}>
              <div className={styles.formGroup}>
                <label>วันที่จอง</label>
                <DatePicker
                  selected={selectedDate}
                  onChange={(date) => !isViewMode && setSelectedDate(date)}
                  dateFormat="dd/MM/yyyy"
                  minDate={new Date()}
                  placeholderText="เลือกวันที่"
                  className={styles.datePicker}
                  required
                  disabled={isViewMode}
                />
              </div>

              <div className={`${styles.formGroup} ${styles.timeGroup}`}>
                <label>เวลาที่จอง</label>
                <div className={styles.timeInputs}>
                  <select
                    value={startTime}
                    onChange={handleStartTimeChange}
                    className={styles.timeSelect}
                    required
                    disabled={isViewMode}
                  >
                    <option value="">เลือกเวลาเริ่มต้น</option>
                    {timeOptions.map((time) => (
                      <option key={`start-${time}`} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                  <span className={styles.timeSeparator}>ถึง</span>
                  <select
                    value={endTime}
                    onChange={handleEndTimeChange}
                    className={styles.timeSelect}
                    required
                    disabled={isViewMode}
                  >
                    <option value="">เลือกเวลาสิ้นสุด</option>
                    {timeOptions.map((time) => (
                      <option
                        key={`end-${time}`}
                        value={time}
                        disabled={!!startTime && time <= startTime}
                      >
                        {time}
                      </option>
                    ))}
                  </select>
                </div>
                {timeError && (
                  <div className={styles.errorMessage}>{timeError}</div>
                )}
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>หัวข้อการประชุม</label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                placeholder="หัวข้อ"
                className={styles.subjectInput}
                required
                readOnly={isViewMode}
              />
            </div>

            <div className={styles.formGroup}>
              <label>รายละเอียด</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="รายละเอียดการประชุม"
                className={styles.detailsInput}
                rows={4}
                required
                readOnly={isViewMode}
              />
            </div>

            <div className={styles.formGroup}>
              <label>อีเมล์</label>
              <input
                type="email"
                name="contact_email"
                value={formData.contact_email}
                onChange={handleInputChange}
                placeholder="กรอกอีเมล์"
                className={styles.emailInput}
                required
                readOnly={isViewMode}
              />
            </div>

            <div className={styles.formGroup}>
              <label>ชื่อผู้จอง</label>
              <input
                type="text"
                name="contact_name"
                value={formData.contact_name}
                onChange={handleInputChange}
                placeholder="กรอกชื่อ-นามสกุล"
                required
                readOnly={isViewMode}
              />
            </div>

            <div className={styles.formGroup}>
              <label>อีเมล์ผู้เข้าร่วม</label>
              {isViewMode ? (
                formData.participants && formData.participants.length > 0 ? (
                  <div className={styles.participantsList}>
                    <div className={styles.participantsHeader}>
                      <span>รายชื่อผู้เข้าร่วมทั้งหมด</span>
                      <span className={styles.participantsCount}>
                        {formData.participants.length} คน
                      </span>
                    </div>
                    {formData.participants.map((email, index) => (
                      <div key={index} className={styles.participantEmail}>
                        {email}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className={styles.noParticipants}>
                    <span>ไม่มีผู้เข้าร่วมการประชุม</span>
                  </div>
                )
              ) : (
                <>
                  {formData.participants.map((email, index) => (
                    <input
                      key={index}
                      type="email"
                      value={email}
                      onChange={(e) =>
                        handleParticipantChange(index, e.target.value)
                      }
                      placeholder="กรอกอีเมล์"
                      className={styles.emailInput}
                    />
                  ))}
                  <button
                    type="button"
                    className={styles.addMore}
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        participants: [...prev.participants, ""],
                      }))
                    }
                  >
                    + เพิ่มผู้เข้าร่วม
                  </button>
                </>
              )}
            </div>
            <div className="w-100 text-center">
              {!isViewMode && (
                <>
                  {error && <div className={styles.errorMessage}>{error}</div>}
                  <button type="submit" className={styles.confirmBooking}>
                    {isEditMode ? "บันทึกการเปลี่ยนแปลง" : "ยืนยันการจอง"}
                  </button>
                </>
              )}
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default MeetingRoomsBooking;
