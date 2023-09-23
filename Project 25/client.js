const WebSocket = require('ws');
const jwt = require('jsonwebtoken');
const fs = require('fs');


const jwtKey = fs.readFileSync('privateKey.pem', 'utf8'); 


const userId = process.argv[2];
if (!userId) {
	console.error('Не указан пользовательский идентификатор.');
	process.exit(1);
}


const payload = {
	sub: userId
};
const signOptions = {
	algorithm: 'RS256',
	expiresIn: '1h', 
};
const token = jwt.sign(payload, jwtKey, signOptions);


const ws = new WebSocket('ws://localhost:8000'); 

ws.on('open', () => {
	console.log('Соединение установлено.');

	const authMessage = {
		type: 'auth',
		token: token,
	};

	ws.send(JSON.stringify(authMessage));
});

ws.on('message', (data) => {
	console.log('Получено сообщение от сервера:', data.toString('utf8'));
});

ws.on('close', () => {
	console.log('Соединение закрыто.');
});

ws.on('error', (error) => {
	console.error('Произошла ошибка:', error.message);
});