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
