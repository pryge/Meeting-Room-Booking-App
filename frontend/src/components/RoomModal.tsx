import React, { useState, useEffect } from 'react';
import { X, Layout, Users, Loader2 } from 'lucide-react';
import api from '../api';

interface RoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  room?: any;
}

const RoomModal: React.FC<RoomModalProps> = ({ isOpen, onClose, onSuccess, room }) => {
  const [name, setName] = useState('');
  const [capacity, setCapacity] = useState<number>(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (room) {
      setName(room.name);
      setCapacity(room.capacity);
    } else {
      setName('');
      setCapacity(10);
    }
  }, [room, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (room) {
        await api.put(`/rooms/${room.id}`, { name, capacity });
      } else {
        await api.post('/rooms', { name, capacity });
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save room');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-md bg-white/90 backdrop-blur-2xl rounded-[3rem] border border-white shadow-2xl overflow-hidden p-10 animate-in fade-in zoom-in duration-300">
        <button 
          onClick={onClose}
          className="absolute top-8 right-8 p-2 text-slate-400 hover:text-slate-900 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="mb-10 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-indigo-200">
            <Layout className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            {room ? 'Edit Room' : 'Add New Room'}
          </h2>
          <p className="text-slate-500 font-medium mt-2">
            Configure the space details for your team.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-rose-50 border border-rose-100 text-rose-600 px-5 py-3 rounded-2xl text-xs font-bold text-center">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 ml-1">Room Name</label>
              <input 
                type="text" 
                required
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-slate-900 font-bold focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none"
                placeholder="e.g. Innovation Hub"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 ml-1">Capacity (People)</label>
              <div className="relative">
                <input 
                  type="number" 
                  required
                  min="1"
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-slate-900 font-bold focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none"
                  value={capacity}
                  onChange={(e) => setCapacity(parseInt(e.target.value))}
                />
                <Users className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
              </div>
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-slate-200 hover:bg-indigo-600 hover:shadow-indigo-200 active:scale-95 transition-all duration-500 flex items-center justify-center gap-3 disabled:opacity-50 mt-10"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (room ? 'Update Room' : 'Create Room')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RoomModal;
