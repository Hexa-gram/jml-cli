const os = require("os")
const ip = os.networkInterfaces().en0[1].address

console.log(`your ip is: ${ip}`)