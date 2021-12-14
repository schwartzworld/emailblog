import { Client } from 'yapople';
import env from 'dotenv';

env.config();

const client = new Client({
  host: 'pop.gmail.com',
  port:  995,
  tls: true,
  mailparser: true,
  username: process.env.USERNAME,
  password: process.env.PASSWORD,
});

const isRealMessage = (message) => {
	const first3 = message.subject.slice(0, 3);
	console.log({first3});
	return first3 === 'xyz';
}

const checkMessages = async () => {
	try {
	    await client.connect();
	    const messages = await client.retrieveAll();
	    await client.quit();
	    return messages.filter(isRealMessage);
    } catch (e) {
    	console.error(e);
    }
};

export default checkMessages;
