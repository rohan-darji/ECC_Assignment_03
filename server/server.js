const net = require("net");
const fs = require("fs");
const crypto = require("crypto");


const HOST = process.argv[2] || "localhost";
const PORT = process.argv[3] || 8090;

const randomSentences = [
  "The quick brown fox jumps over the lazy dog.",
  "Tomorrow is another day filled with endless possibilities.",
  "She sells seashells by the seashore.",
  "The sun sets behind the mountains, painting the sky in hues of orange and pink.",
  "Time flies like an arrow; fruit flies like a banana.",
  "Life is like a box of chocolates; you never know what you're gonna get.",
  "The early bird catches the worm, but the second mouse gets the cheese.",
  "In the midst of chaos, there is also opportunity.",
  "Beauty is in the eye of the beholder.",
  "Every cloud has a silver lining.",
  "The road to success is always under construction.",
  "When life gives you lemons, make lemonade.",
  "Don't cry because it's over, smile because it happened.",
  "A journey of a thousand miles begins with a single step.",
  "You miss 100% of the shots you don't take.",
  "The only way to do great work is to love what you do.",
  "All that glitters is not gold.",
  "Actions speak louder than words.",
  "It's better to be hated for what you are than loved for what you are not.",
  "What doesn't kill you makes you stronger."
];

const getRandomSentence = () => {
  const randomIndex = Math.floor(Math.random() * randomSentences.length);
  return randomSentences[randomIndex];
};


const FILE_SIZE = 1024; // 1KB

// Function to generate random data of specified length
const generateRandomData = (length) => {
  return crypto.randomBytes(length);
};

// const randomData = generateRandomData(FILE_SIZE)



// Create a TCP server
const server = net.createServer((socket) => {
  console.log(`Client connected from ${socket.remoteAddress}:${socket.remotePort}`);

  const randomSentence = getRandomSentence();
  const randomData = Buffer.from(randomSentence);

  // Calculate checksum of random data
  const checksum = crypto.createHash("md5").update(randomData).digest("hex");

  // Write random data to file
  fs.writeFile("/app/serverdata/random_sentence.txt", randomData, (err) => {
    if (err) {
      console.error("Error writing file:", err);
      socket.end();
    } else {
      console.log("Random data written to random_file.txt");

      // Send file content to client
      fs.readFile("/app/serverdata/random_sentence.txt", (err, fileData) => {
        if (err) {
          console.error("Error reading file:", err);
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
