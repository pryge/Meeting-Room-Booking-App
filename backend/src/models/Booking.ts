import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

class Booking extends Model {
  public id!: number;
  public roomId!: number;
  public userId!: number;
  public startTime!: Date;
  public endTime!: Date;
  public description!: string;
}

Booking.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    roomId: { type: DataTypes.INTEGER, allowNull: false },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    startTime: { type: DataTypes.DATE, allowNull: false },
    endTime: { type: DataTypes.DATE, allowNull: false },
    description: { type: DataTypes.STRING, allowNull: true },
  },
  { sequelize, modelName: 'Booking' }
);

export default Booking;
