import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookingService } from '../services/booking.service';
import { Booking } from '../types';
import { Loader2, Calendar, Trash2, MapPin, Users, Layout } from 'lucide-react';
import { format } from 'date-fns';

const MyBookingsPage: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchBookings = async () => {
    try {
      const response = await BookingService.getMyBookings();
      if (response.status === 'success' && response.data) {
        setBookings(response.data.bookings || []);
      } else {
        setError(response.message || 'Failed to load your bookings');
      }
    } catch (err) {
      setError('Failed to load your bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancel = async (id: number) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    
    try {
      const response = await BookingService.cancelBooking(id);
      if (response.status === 'success') {
        setBookings(bookings.filter(b => b.id !== id));
      } else {
        alert(response.message || 'Failed to cancel booking');
      }
    } catch (err) {
      alert('Failed to cancel booking');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 pb-40">
      <header className="mb-20 text-center">
        <h1 className="text-5xl font-black text-slate-900 sm:text-7xl tracking-tighter leading-tight">
          Your <br />
          <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent italic">
            Reservations
          </span>
        </h1>
        <p className="mt-6 text-xl text-slate-500 max-w-2xl mx-auto font-medium">
          Manage your upcoming meetings, check schedules and coordinate with your team.
        </p>
      </header>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
        </div>
      ) : error ? (
        <div className="max-w-md mx-auto bg-red-50 border border-red-200 text-red-600 p-6 rounded-3xl text-center font-bold">
          {error}
        </div>
      ) : bookings.length === 0 ? (
        <div className="text-center py-24 bg-slate-50/50 rounded-3xl border-4 border-dashed border-slate-100">
          <p className="text-slate-400 text-xl font-bold">You have no active bookings.</p>
          <Link
            to="/"
            className="mt-6 inline-block text-indigo-600 hover:text-indigo-500 font-black uppercase tracking-widest text-sm underline decoration-2 underline-offset-8"
          >
            Browse Rooms
          </Link>
        </div>
      ) : (
        <div className="grid gap-8">
          {bookings.map((booking) => (
            <div key={booking.id} className="bg-white/70 backdrop-blur-2xl p-8 rounded-[2.5rem] border border-white shadow-2xl shadow-slate-200/50 flex flex-col md:flex-row md:items-center gap-8 group">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-xl shadow-indigo-200">
                <Layout className="w-10 h-10 text-white" />
              </div>
              
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-3">
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-none group-hover:text-indigo-600 transition-colors">
                        {booking.Room?.name || 'Meeting Room'}
                    </h3>
                    <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                        Confirmed
                    </span>
                </div>
                <div className="flex flex-wrap items-center gap-6 pt-2">
                    <div className="flex items-center gap-2 text-slate-400 text-xs font-black uppercase tracking-widest">
                        <Calendar className="w-4 h-4 text-indigo-500" />
                        {booking.startTime && format(new Date(booking.startTime), 'MMM dd, yyyy • HH:mm')} - {booking.endTime && format(new Date(booking.endTime), 'HH:mm')}
                    </div>
                    <div className="flex items-center gap-2 text-slate-400 text-xs font-black uppercase tracking-widest">
                        <Users className="w-4 h-4 text-indigo-500" />
                        {booking.Room?.capacity || 0} People
                    </div>
                    <div className="flex items-center gap-2 text-slate-400 text-xs font-black uppercase tracking-widest">
                        <MapPin className="w-4 h-4 text-indigo-500" />
                        Floor 2
                    </div>
                </div>
                {booking.description && (
                    <p className="text-slate-500 font-medium pt-2 italic">"{booking.description}"</p>
                )}
              </div>

              <div className="pt-6 md:pt-0">
                <button 
                  onClick={() => handleCancel(booking.id)}
                  className="flex items-center justify-center gap-2 px-8 py-4 bg-rose-50 text-rose-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all active:scale-95 border border-rose-100"
                >
                  <Trash2 className="w-4 h-4" />
                  Cancel
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookingsPage;

