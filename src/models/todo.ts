import sequelize from '../db'
import {DataTypes, Model} from '@sequelize/core'

export class ToDo extends Model {}

ToDo.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING, // VARCHAR(255)
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('todo', 'in-progress', 'done'),
    defaultValue: 'todo',
  },
}, {
  sequelize,
  modelName: 'todo'
});
