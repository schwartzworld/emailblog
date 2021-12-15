import {DataTypes, Model, Sequelize} from "sequelize";

export const sequelize = new Sequelize('sqlite:messages.db');

export class DBMessage extends Model {}

DBMessage.init({
    html: DataTypes.STRING,
    text: DataTypes.STRING,
    subject: DataTypes.STRING,
    date: DataTypes.DATE,
    fromName: DataTypes.STRING,
    fromEmail: DataTypes.STRING,
    toName: DataTypes.STRING,
    toEmail: DataTypes.STRING,
    uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4 // Or DataTypes.UUIDV1
    },
    attachment_id: DataTypes.STRING
}, { sequelize, modelName: 'message' });
