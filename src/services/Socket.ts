import io from 'socket.io-client';

const baseURL = process.env.BE_URL || 'localhost:3001';

export default io(baseURL);
