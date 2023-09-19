function fibonacci(n) {
  return new Promise((resolve, reject) => {
    let a = 0,
      b = 1;
    for (let i = 0; i < n; i++) {
      let c = a + b;
      a = b;
      b = c;
    }
    resolve(a);
  });
}

module.exports = fibonacci;
