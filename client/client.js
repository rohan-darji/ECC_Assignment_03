const net = require("net");
const fs = require("fs");
const crypto = require("crypto");


const HOST = process.argv[2] || "localhost";
const PORT = process.argv[3] || 8090;


const clientSocket = new net.Socket();


clientSocket.connect(PORT, HOST, () => {
  console.log(`Connected to the server on port ${PORT}`);


  clientSocket.write("Hello Server!");
});


clientSocket.on("data", (data) => {

  // Calculate checksum of received data
  const checksum = crypto.createHash("md5").update(data).digest("hex");

  fs.writeFileSync("/app/clientdata/random_file.txt", data);
  console.log(`Received file from server with checksum: ${checksum}`);

  clientSocket.write("File received. Thank You!");

  // Close the connection after a delay
  setTimeout(() => {
    console.log("Connection closed after timeout!!");
    clientSocket.end();
  }, 240000);
});

// Handle end of connection
clientSocket.on("end", () => {
  console.log("Disconnected from the server");
});

// Handle connection errors
clientSocket.on("error", (err) => {
  console.error("Connection error:", err);
});
