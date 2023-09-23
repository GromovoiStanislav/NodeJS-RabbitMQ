const fs = require('node:fs');
const crypto = require('crypto');

// Генерация закрытого и открытого ключей
const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
  modulusLength: 2048,
  publicKeyEncoding: {
    type: 'pkcs1',
    format: 'pem',
  },
  privateKeyEncoding: {
    type: 'pkcs1',
    format: 'pem',
  },
});

// Сохранение открытого ключа в файл
fs.writeFileSync('publicKey.pem', publicKey);

// Сохранение закрытого ключа в файл
fs.writeFileSync('privateKey.pem', privateKey);

console.log('Открытый ключ сохранен в publicKey.pem');
console.log('Закрытый ключ сохранен в privateKey.pem');
