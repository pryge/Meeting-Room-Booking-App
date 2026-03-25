import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

class Room extends Model {
  public id!: number;
  public name!: string;
  public description!: string;
}

Room.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },
  },
  { sequelize, modelName: 'Room' }
);

export default Room;
