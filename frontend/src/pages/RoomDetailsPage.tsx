import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../api";
import { useAuth } from "../context/AuthContext";
import { Loader2, Calendar, Users, Layout, MapPin } from "lucide-react";

const RoomDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [room, setRoom] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState("");
  const [bookingMsg, setBookingMsg] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [description, setDescription] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const response = await api.get(`/rooms/${id}`);
        setRoom(response.data);
      } catch (err) {
        console.error("Failed to fetch room", err);
        setError("Room not found or error loading data");
      } finally {
        setLoading(false);
      }
    };
    fetchRoom();
  }, [id]);

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setBookingLoading(true);
    setBookingMsg(null);
    const payload = {
      roomId: Number(id),
      startTime,
      endTime,
      description,
    };
    console.log("Sending booking payload:", payload);

    try {
      await api.post("/bookings", payload);
      setBookingMsg({ type: "success", text: "Booking created successfully!" });
      setTimeout(() => navigate("/my-bookings"), 2000); //-
    } catch (err: any) {
      console.error("Booking error response:", err.response?.data);
      setBookingMsg({
        type: "error",
        text:
          err.response?.data?.details ||
          err.response?.data?.message ||
          "Failed to create booking",
      });
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-40">
        <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
      </div>
    );
  }

  if (error || !room) {
    return (
      <div className="text-center py-20 px-4">
        <h2 className="text-4xl font-black text-slate-900 tracking-tighter mb-4">
          {error || "Room Not Found"}
        </h2>
        <Link
          to="/"
          className="mt-4 px-10 py-4 bg-indigo-600 text-white rounded-[2rem] font-black shadow-xl shadow-indigo-200 hover:bg-slate-900 transition-all active:scale-95 inline-block text-sm uppercase tracking-widest"
        >
          Return Home
        </Link>
      </div>
    );
  }

  return (
    <article className="max-w-4xl mx-auto px-4 py-20 pb-40">
      <Link
        to="/"
        className="inline-flex items-center text-xs font-black text-indigo-600 hover:text-white hover:bg-indigo-600 transition-all mb-12 bg-indigo-50 px-8 py-3 rounded-full active:scale-95 uppercase tracking-widest"
      >
        ← Back to Gallery
      </Link>

      <header className="mb-16">
        <h1 className="text-5xl md:text-8xl font-black text-slate-900 leading-tight tracking-tighter mb-10">
          {room.name}
        </h1>

        <div className="flex flex-col sm:flex-row sm:items-center p-10 bg-white/70 backdrop-blur-2xl rounded-[3rem] border border-white shadow-2xl shadow-slate-200/50">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-xl font-black text-white mr-6 shadow-xl shadow-indigo-200 mb-6 sm:mb-0">
            <Layout className="w-10 h-10" />
          </div>
          <div className="flex-1">
            <p className="text-slate-900 font-black text-2xl leading-none tracking-tight">
              Conference Room
            </p>
            <div className="flex items-center gap-4 mt-3">
              <p className="text-slate-400 text-xs font-black uppercase tracking-widest flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-500" />
                {room.capacity} PEOPLE
              </p>
              <div className="h-4 w-px bg-slate-100"></div>
              <p className="text-slate-400 text-xs font-black uppercase tracking-widest flex items-center gap-2">
                <MapPin className="w-4 h-4 text-indigo-500" />
                Floor 2
              </p>
            </div>
          </div>
          <div className="mt-8 sm:mt-0 sm:ml-auto text-left sm:text-right">
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2">
              Current Status
            </p>
            <div
              className={`inline-flex px-6 py-2 rounded-2xl font-black text-xs uppercase tracking-widest text-white shadow-lg ${
                room.status === "available"
                  ? "bg-emerald-500 shadow-emerald-100"
                  : "bg-rose-500 shadow-rose-100"
              }`}
            >
              {room.status || "Available"}
            </div>
          </div>
        </div>
      </header>

      <div className="grid md:grid-cols-3 gap-10">
        <div className="md:col-span-2 prose prose-2xl max-w-none">
          <div className="text-slate-600 leading-relaxed font-medium text-2xl space-y-6">
            <p>
              Experience the pinnacle of collaboration in {room.name}. This
              state-of-the-art meeting space is designed to foster creativity
              and productivity.
            </p>
            <p>
              Equipped with ultra-fast Wi-Fi, 4K display systems, and ergonomic
              seating, it provides everything you need for a successful session.
            </p>
          </div>

          {isAdmin && (
            <div className="mt-16 p-10 bg-indigo-50/50 rounded-[2.5rem] border border-indigo-100">
              <h4 className="text-xl font-black text-slate-900 mb-2">
                Invite Team Member
              </h4>
              <p className="text-slate-500 text-sm font-medium mb-6">
                Add someone to this room by their email address.
              </p>
              <div className="flex gap-3">
                <input
                  type="email"
                  placeholder="colleague@example.com"
                  className="flex-1 bg-white border border-indigo-100 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 outline-none transition-all"
                />
                <button className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-900 transition-all active:scale-95 shadow-xl shadow-indigo-200">
                  Invite
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl shadow-indigo-100 flex flex-col min-h-[500px]">
          <div className="mb-8">
            <Calendar className="w-12 h-12 text-indigo-400 mb-6" />
            <h3 className="text-3xl font-black tracking-tight mb-2">
              Book Now
            </h3>
            <p className="text-slate-400 font-medium text-lg leading-snug">
              Select your preferred time slot to reserve {room.name}.
            </p>
          </div>

          <form
            onSubmit={handleBooking}
            className="space-y-6 flex-1 flex flex-col"
          >
            {bookingMsg && (
              <div
                className={`p-4 rounded-2xl text-xs font-bold ${
                  bookingMsg.type === "success"
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                    : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                }`}
              >
                {bookingMsg.text}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2 ml-1">
                  Start Time
                </label>
                <input
                  type="datetime-local"
                  required
                  className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-5 py-3.5 text-white font-bold focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2 ml-1">
                  End Time
                </label>
                <input
                  type="datetime-local"
                  required
                  className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-5 py-3.5 text-white font-bold focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2 ml-1">
                  Purpose / Description
                </label>
                <textarea
                  className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-5 py-3.5 text-white font-bold focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none h-24 resize-none"
                  placeholder="Briefly describe the meeting purpose"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>

            <div className="mt-auto pt-6">
              <button
                type="submit"
                disabled={bookingLoading}
                className="w-full py-5 bg-gradient-to-r from-indigo-500 to-violet-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:from-indigo-400 hover:to-violet-500 transition-all active:scale-95 shadow-xl shadow-indigo-500/20 disabled:opacity-50"
              >
                {bookingLoading ? "Processing..." : "Confirm Reservation"}
              </button>
            </div>
          </form>
        </div>
      </div>

      <footer className="mt-20 pt-10 border-t border-slate-100">
        <p className="text-slate-400 text-sm font-black italic tracking-tight">
          Thank you for choosing {room.name} for your meetings.
        </p>
      </footer>
    </article>
  );
};

export default RoomDetailsPage;
