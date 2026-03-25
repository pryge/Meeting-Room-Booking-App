import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api";
import { Loader2, Calendar, Users, Layout, MapPin } from "lucide-react";

const RoomDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [room, setRoom] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
            <div className={`inline-flex px-6 py-2 rounded-2xl font-black text-xs uppercase tracking-widest text-white shadow-lg ${
                room.status === 'available' ? 'bg-emerald-500 shadow-emerald-100' : 'bg-rose-500 shadow-rose-100'
            }`}>
              {room.status || 'Available'}
            </div>
          </div>
        </div>
      </header>

      <div className="grid md:grid-cols-3 gap-10">
        <div className="md:col-span-2 prose prose-2xl max-w-none">
            <div className="text-slate-600 leading-relaxed font-medium text-2xl space-y-6">
                <p>
                    Experience the pinnacle of collaboration in {room.name}. This state-of-the-art 
                    meeting space is designed to foster creativity and productivity.
                </p>
                <p>
                    Equipped with ultra-fast Wi-Fi, 4K display systems, and ergonomic seating, 
                    it provides everything you need for a successful session.
                </p>
            </div>
        </div>

        <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl shadow-indigo-100 flex flex-col justify-between min-h-[400px]">
            <div>
                <Calendar className="w-12 h-12 text-indigo-400 mb-6" />
                <h3 className="text-3xl font-black tracking-tight mb-4">Book Now</h3>
                <p className="text-slate-400 font-medium text-lg leading-snug">
                    Reserve this space instantly for your next meeting. 
                </p>
            </div>
            
            <button className="w-full py-5 bg-gradient-to-r from-indigo-500 to-violet-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:from-indigo-400 hover:to-violet-500 transition-all active:scale-95 shadow-xl shadow-indigo-500/20 mt-10">
                Confirm Reservation
            </button>
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
