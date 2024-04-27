const net = require("net");
const fs = require("fs");
const crypto = require("crypto");


const HOST = process.argv[2] || "localhost";
const PORT = process.argv[3] || 8090;


const FILE_SIZE = 1024; // 1KB

// Function to generate random data of specified length
const generateRandomData = (length) => {
  return crypto.randomBytes(length);
};

const randomData = generateRandomData(FILE_SIZE)


// Create a TCP server
const server = net.createServer((socket) => {
  console.log(`Client connected from ${socket.remoteAddress}:${socket.remotePort}`);

  // Calculate checksum of random data
  const checksum = crypto.createHash("md5").update(randomData).digest("hex");

  // Write random data to file
  fs.writeFile("/app/serverdata/random_file.txt", randomData, (err) => {
    if (err) {
      console.error("Error while writing the file:", err);
      socket.end();
    } else {
      console.log("Random data has been written to random_file.txt");

      // Send file content to client
      fs.readFile("/app/serverdata/random_file.txt", (err, fileData) => {
        if (err) {
          console.error("Error reading the file:", err);
          socket.end();
        } else {
          socket.write(fileData);
          console.log(`Sent file to client ${socket.remoteAddress}:${socket.remotePort} with checksum: ${checksum}`);
          socket.end();
        }
      });
    }
  });

  // Handle socket events
  socket.on("end", () => {
    console.log(`Client ${socket.remoteAddress}:${socket.remotePort} disconnected`);
  });

  socket.on("error", (err) => {
    console.error("Socket error:", err);
  });
});

// Handle server events
server.on("error", (err) => {
  console.error("Server error:", err);
});

// Start the server
server.listen(PORT, HOST, () => {
  console.log(`Server started on ${HOST}:${PORT}`);
});
