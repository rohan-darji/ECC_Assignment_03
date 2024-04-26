# ENGR-E 516: Engineering Cloud Computing
# ASSIGNMENT 03: Dockers and Containers

# Name: Rohan Vasantbhai Darji
Email: rdarji@iu.edu  
UID: 2001270724

## Github Link:
[ECC_Assignment_03](https://github.com/rohan-darji/ECC_Assignment_03)

## Instructions to run the code:

### Instructions for using Docker build and docker run:

1.  Clone the github repository
2.  Install docker desktop and run the docker desktop
3.  Navigate to the server and client folder and run the commands mentioned in the below screenshots
4.  Verify the results in the docker desktop

### Instructions for using `docker-compose.yml`

1.  Clone the github repository
2.  Install docker desktop and run the docker desktop
3.  Run `docker-compose up -d`
4.  Verify the result in the docker desktop

## Docker Desktop

### For the current assignment, I have downloaded the Docker Desktop. It sets up the Docker daemons on my computer.

![Untitled](https://github.com/rohan-darji/ECC_Assignment_03/blob/main/Images/docker.png)

### For the client and server, I am using Node.js hence, I pulled the image from the DockerHub as per the command `docker pull node`

![Untitled](https://github.com/rohan-darji/ECC_Assignment_03/blob/main/Images/01.png)

## As per the requirements for this assignment, I created the two volumes: 1. `servervol` and 2. `clientvol`

### - `servervol` is for the server to store data

![Untitled](https://github.com/rohan-darji/ECC_Assignment_03/blob/main/Images/02.png)

### - `clientvol` is for the client to store data

![Untitled](https://github.com/rohan-darji/ECC_Assignment_03/blob/main/Images/03.png)

## Code for the `server.js` is given below:

```jsx
const net = require("net");
const fs = require("fs");
const crypto = require("crypto");


const HOST = process.argv[2] || "localhost";
const PORT = process.argv[3] || 8090;

const randomSentences = [
  // around 20 random sentences
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

```

## Code for the `client.js` is given below:

```jsx
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

```

## Testing the code on the local machine in order to check if the code is working properly or not

![Untitled](https://github.com/rohan-darji/ECC_Assignment_03/blob/main/Images/05.png)

### `random_sentence.txt` file which the client has received from the server

![Untitled](https://github.com/rohan-darji/ECC_Assignment_03/blob/main/Images/06.png)
- From the above image we can verify that the code is working properly and the client is able to receive the file sent from the server.

## Now, to run the code on the docker, we need to write the Dockerfiles for both the server and client.

## `Dockerfile` for `server.js`

```docker
# Use the official Node.js 14.17.0 image
FROM node:14.17.0-alpine

# Set working directory inside the container
WORKDIR /app

# Copy server.js to the working directory
COPY server.js /app/server.js

# create a dir for serverdata
RUN mkdir /app/serverdata

EXPOSE 8090

# Command to run the server
CMD ["node", "server.js" , "0.0.0.0", "8090"]

```

## `Dockerfile` for `client.js`

```docker
# Use the official Node.js 14.17.0 image
FROM node:14.17.0-alpine

# Set working directory inside the container
WORKDIR /app

# Copy client.js to the working directory
COPY client.js /app/client.js

# Create a directory for the client
RUN mkdir /app/clientdata

# Command to run the client
CMD ["node", "client.js", "server", "8090"]

```

## For building the docker image run the following commands in the terminal

### server image build status

![Untitled](https://github.com/rohan-darji/ECC_Assignment_03/blob/main/Images/07.png)

### client image build status

![Untitled](https://github.com/rohan-darji/ECC_Assignment_03/blob/main/Images/08.png)

### Images of Client and Server

![Untitled](https://github.com/rohan-darji/ECC_Assignment_03/blob/main/Images/docker_02.png)
As we can see the images of both Server and Client have been created in the docker desktop using the commands as mentioned in the assignment.

## Next is creating the container and running on docker

### server run command

![Untitled](https://github.com/rohan-darji/ECC_Assignment_03/blob/main/Images/09.png)

### client run command

![Untitled](https://github.com/rohan-darji/ECC_Assignment_03/blob/main/Images/10.png)

### Running containers in docker

![Untitled](https://github.com/rohan-darji/ECC_Assignment_03/blob/main/Images/docker_03.png)
As we can see the containers of server and client have been created.

### Logs of server

![Untitled](https://github.com/rohan-darji/ECC_Assignment_03/blob/main/Images/docker_04.png)
- From the logs, we can see that the file was generated and sent to the client.
- For convenience purpose I have used the randomSentence array to send random sentence in the text file to the client.

### Logs of client

![Untitled](https://github.com/rohan-darji/ECC_Assignment_03/blob/main/Images/docker_05.png)
- Here, we can see the file is received from the server.

## Checking the output file in the volumes

### `servervol`

![Untitled](https://github.com/rohan-darji/ECC_Assignment_03/blob/main/Images/docker_06.png)
Here, we can see that the output file was stored in the servervol and the `random_sentence.txt` is also visible.

### `clientvol`

![Untitled](https://github.com/rohan-darji/ECC_Assignment_03/blob/main/Images/docker_07.png)
We can also see the same random sentence stored in the clientvol which is received from the server.

#### To ease the verify process of the output file sent from server to client, I used the random sentence instead of the random data of 1kb. But we can also perform the same transfer of file from server to client using the random data of 1kd by usin gthe following function in the `server.js`.

```jsx
const FILE_SIZE = 1024; // 1KB

// Function to generate random data of specified length
const generateRandomData = (length) => {
  return crypto.randomBytes(length);
};

const randomData = generateRandomData(FILE_SIZE)
```

#### Now to confirm both the containers are running on the same network i.e., `rohan`, we use the command `docker inspect rohan`

![Untitled](https://github.com/rohan-darji/ECC_Assignment_03/blob/main/Images/11.png)
In the above image, we can see that both the containers are running on the same network `rohan`

## Automating the entire process of creating docker containers and running them

### To automate this process we first create a `docker-compose.yml` file in the root directory

```docker
version: "3"

services:
  server:
    build:
      context: ./server
      dockerfile: Dockerfile
    networks:
      - rohan
    volumes:
      - servervol:/app/serverdata

  client:
    build:
      context: ./client
      dockerfile: Dockerfile
    volumes:
      - clientvol:/app/clientdata
    networks:
      - rohan

volumes:
  servervol:
  clientvol:

networks:
  rohan:
```

### Running the docker-compose.yml using the command `docker-compose up -d`

![Untitled](https://github.com/rohan-darji/ECC_Assignment_03/blob/main/Images/12.png)

### Client and Server images created

![Untitled](https://github.com/rohan-darji/ECC_Assignment_03/blob/main/Images/docker_08.png)

### Client and Server volumes created

![Untitled](https://github.com/rohan-darji/ECC_Assignment_03/blob/main/Images/docker_09.png)

### Containers created under the assignment_03

![Untitled](https://github.com/rohan-darji/ECC_Assignment_03/blob/main/Images/docker_10.png)

### Logs of server

![Untitled](https://github.com/rohan-darji/ECC_Assignment_03/blob/main/Images/docker_11.png)

### Logs of client

![Untitled](https://github.com/rohan-darji/ECC_Assignment_03/blob/main/Images/docker_12.png)

### Output file `random_sentence.txt` which was sent from server to client stored in servervol

![Untitled](https://github.com/rohan-darji/ECC_Assignment_03/blob/main/Images/docker_13.png)

### Output file `random_sentence.txt` sent from server to client stored in clientvol

![Untitled](https://github.com/rohan-darji/ECC_Assignment_03/blob/main/Images/docker_14.png)

# _____________________THE END_____________________
