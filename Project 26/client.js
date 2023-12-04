import io from 'socket.io-client';

// Connect to the Socket.io server
const socket = io('http://localhost:3000');

// Handle events
socket.on('new_message', (message) => {
  console.log('New message:', message);
  // Handle the new message as needed
});

// Handle disconnect event
socket.on('disconnect', () => {
  console.log('Disconnected from the server');
});

// Handle connect event
socket.on('connect', () => {
  console.log('Connected to the server');
});

// Handle any errors
socket.on('error', (error) => {
  console.error('Socket error:', error);
});
