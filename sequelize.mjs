import {Sequelize} from "sequelize";

export const sequelize = new Sequelize('sqlite:messages.db');
