import { DataTypes } from "sequelize";
import db from "./db.js";

const Quote = db.define('Quote', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  quote: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  author: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Unknown',
  },
}, {
  timestamps: true
});

export default Quote;
