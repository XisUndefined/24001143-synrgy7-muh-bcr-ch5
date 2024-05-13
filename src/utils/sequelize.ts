import { Dialect } from "sequelize";
import { Sequelize } from "sequelize-typescript";
import { User } from "../model/User.js";
import { Car } from "../model/Car.js";
import { Order } from "../model/Order.js";
import { Category } from "../model/Category.js";

export const sequelize = new Sequelize({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT as string),
  database: process.env.DB_DATABASE,
  dialect: process.env.DB_CONNECTION as Dialect,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  models: [User, Car, Order, Category],
});

// One-To-Many Relationship (Category > Car)
Car.belongsTo(Category, { foreignKey: "category_id" });
Category.hasMany(Car, { foreignKey: "category_id" });

// One-To-Many Relationship (Car > Order)
Order.belongsTo(Car, { foreignKey: "car_id" });
Car.hasMany(Order, { foreignKey: "car_id" });

// One-To-Many Relationship (User > Order)
Order.belongsTo(Car, { foreignKey: "user_id" });
User.hasMany(Order, { foreignKey: "user_id" });

export const syncModels = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connection established successfully.");

    await sequelize.sync({ force: true });
    console.log("All models were synchronized succesfully.");
  } catch (error) {
    console.error("Unable to connect to the database or sync: ", error);
  }
};
