import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

class RoomUser extends Model {
  public roomId!: number;
  public userId!: number;
  public role!: string;
}

RoomUser.init(
  {
    roomId: { type: DataTypes.INTEGER, primaryKey: true },
    userId: { type: DataTypes.INTEGER, primaryKey: true },
    role: { type: DataTypes.STRING, defaultValue: 'User' },
  },
  { sequelize, modelName: 'RoomUser' }
);

export default RoomUser;
