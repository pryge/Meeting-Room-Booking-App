import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { RoomService } from '../services/room.service';
import { Room } from '../types';
import RoomCard from '../components/RoomCard';
import RoomModal from '../components/RoomModal';
import { Loader2, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);

  const fetchRooms = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await RoomService.getRooms();
      if (response.status === 'success' && response.data) {
        setRooms(response.data.rooms);
      } else {
        setError(response.message || 'Failed to fetch rooms');
      }
    } catch (err) {
      setError('Не вдалося завантажити кімнати. Спробуйте пізніше.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 pb-40">
      <header className="mb-20 text-center">
        <h1 className="text-5xl font-black text-slate-900 sm:text-7xl tracking-tighter leading-tight">
          Find your perfect <br />
          <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent italic">
            Meeting Room
          </span>
        </h1>
        <p className="mt-6 text-xl text-slate-500 max-w-2xl mx-auto font-medium">
          Choose the best space for your team, collaborate efficiently and 
          book your next successful meeting in seconds.
        </p>

        {isAdmin && (
          <div className="mt-12 flex justify-center">
            <button 
              onClick={() => { setEditingRoom(null); setIsModalOpen(true); }}
              className="flex items-center gap-3 px-10 py-5 bg-slate-900 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-slate-200 hover:bg-indigo-600 hover:shadow-indigo-200 active:scale-95 transition-all duration-500"
            >
              <Plus className="w-5 h-5" />
              Add New Room
            </button>
          </div>
        )}
      </header>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
        </div>
      ) : error ? (
        <div className="max-w-md mx-auto bg-red-50 border border-red-200 text-red-600 p-6 rounded-3xl text-center font-bold">
          {error}
        </div>
      ) : (
        <>
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
            {rooms.map((room) => (
              <RoomCard 
                key={room.id} 
                room={{
                  ...room,
                  status: room.status || 'available'
                }} 
                onEdit={(r) => { setEditingRoom(r); setIsModalOpen(true); }}
                onDelete={fetchRooms}
              />
            ))}
          </div>

          <RoomModal 
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSuccess={fetchRooms}
            room={editingRoom}
          />

          {rooms.length === 0 && (
            <div className="text-center py-24 bg-slate-50/50 rounded-3xl border-4 border-dashed border-slate-100">
              <p className="text-slate-400 text-xl font-bold">No rooms available yet.</p>
              <Link
                to="/"
                className="mt-6 inline-block text-indigo-600 hover:text-indigo-500 font-black uppercase tracking-widest text-sm underline decoration-2 underline-offset-8"
              >
                Contact Admin
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default DashboardPage;

