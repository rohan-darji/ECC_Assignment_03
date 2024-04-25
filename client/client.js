const net = require("net");
const fs = require("fs");
const crypto = require("crypto");


const HOST = process.argv[2] || "localhost";
const PORT = process.argv[3] || 8090;


const clientSocket = new net.Socket();


clientSocket.connect(PORT, HOST, () => {
  console.log(`Connected to the server on port ${PORT}`);


  clientSocket.write("Hello server, please send me the randomly generated file.");
});


clientSocket.on("data", (data) => {
  console.log("Received file data:", data.toString());

  // Calculate checksum of received data
  const checksum = crypto.createHash("md5").update(data).digest("hex");

  fs.writeFileSync("/app/clientdata/random_sentence.txt", data);
  console.log(`Received file with checksum: ${checksum}`);

  clientSocket.write("Thank you for the file!");

  // Close the connection after a delay
  setTimeout(() => {
    console.log("Closing the connection after 2 minutes");
    clientSocket.end();
  }, 120000);
});

// Handle end of connection
clientSocket.on("end", () => {
  console.log("Disconnected from the server");
});

// Handle connection errors
clientSocket.on("error", (err) => {
  console.error("Connection error:", err);
});
