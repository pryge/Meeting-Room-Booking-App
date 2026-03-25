import React from 'react';
import { Users, Layout } from 'lucide-react';
import { Link } from 'react-router-dom';

interface RoomCardProps {
  room: {
    id: number;
    name: string;
    capacity: number;
    status: 'available' | 'busy';
  };
}

const RoomCard: React.FC<RoomCardProps> = ({ room }) => {
  const images = [
    'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1431540015161-0bf868a2d407?auto=format&fit=crop&q=80&w=800',
  ];
  const imageUrl = images[room.id % images.length];

  return (
    <div className="group relative bg-white/70 backdrop-blur-2xl rounded-[2.5rem] overflow-hidden border border-white shadow-2xl shadow-slate-200/50 hover:shadow-indigo-200/50 transition-all duration-700 hover:-translate-y-3">
      <div className="relative h-72 overflow-hidden m-4 rounded-[2rem]">
        <img 
          src={imageUrl} 
          alt={room.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 right-4 group-hover:scale-110 transition-transform duration-500">
          <span className={`px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl ${
            room.status === 'available' 
              ? 'bg-emerald-500 text-white shadow-emerald-200' 
              : 'bg-rose-500 text-white shadow-rose-200'
          }`}>
            {room.status}
          </span>
        </div>
      </div>

      <div className="p-10 pt-4 space-y-8">
        <div className="flex items-center">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-200 mr-5 group-hover:rotate-6 transition-transform">
                <Layout className="w-7 h-7 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-none">
                {room.name}
              </h3>
              <p className="text-slate-400 text-xs font-black uppercase tracking-widest mt-2 flex items-center gap-2">
                <Users className="w-3 h-3 text-indigo-500" />
                {room.capacity} PEOPLE MAX
              </p>
            </div>
        </div>

        <Link 
          to={`/room/${room.id}`}
          className="flex items-center justify-center w-full py-5 bg-slate-900 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-slate-200 hover:bg-indigo-600 hover:shadow-indigo-200 active:scale-95 transition-all duration-500"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default RoomCard;
