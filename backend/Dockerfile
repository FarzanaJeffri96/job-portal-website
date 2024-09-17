# Use the official Node.js image from the Docker Hub
FROM node:22

# Copy package.json and install dependencies
COPY package.json ./
RUN npm install
RUN npm install cors

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Command to run the application
CMD ["node", "index.js"]
