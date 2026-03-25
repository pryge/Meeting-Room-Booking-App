import User from './User';
import Room from './Room';
import Booking from './Booking';
import RoomUser from './RoomUser';


User.belongsToMany(Room, { through: RoomUser, as: 'rooms', foreignKey: 'userId' });
Room.belongsToMany(User, { through: RoomUser, as: 'users', foreignKey: 'roomId' });

Room.hasMany(Booking, { foreignKey: 'roomId' });
Booking.belongsTo(Room, { foreignKey: 'roomId' });

User.hasMany(Booking, { foreignKey: 'userId' });
Booking.belongsTo(User, { foreignKey: 'userId' });

export { User, Room, Booking, RoomUser };
