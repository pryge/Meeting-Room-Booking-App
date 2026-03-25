import React from 'react';
import { useParams } from 'react-router-dom';

const RoomDetailsPage: React.FC = () => {
  const { id } = useParams();
  return (
    <div className="p-8">
      <h1>Room Details: {id}</h1>
    </div>
  );
};

export default RoomDetailsPage; 
