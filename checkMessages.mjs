import { Client } from 'yapople';
import env from 'dotenv';
import { Message } from './models/Message.mjs'

env.config();

const client = new Client({
  host: 'pop.gmail.com',
  port:  995,
  tls: true,
  mailparser: true,
  username: process.env.USERNAME,
  password: process.env.PASSWORD,
});


const checkMessages = async () => {
	try {
	    await client.connect();
	    const messages = await client.retrieveAll();
	    await client.quit();
	    return messages.map(m => {
	        return Message.create(m)
        });
    } catch (e) {
    	console.error(e);
    }
};

export default checkMessages;
