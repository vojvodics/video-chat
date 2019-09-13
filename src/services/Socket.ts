import io from 'socket.io-client';

const baseURL = process.env.REACT_APP_BACKEND_URL as string;

export default io(baseURL);
