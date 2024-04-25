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
