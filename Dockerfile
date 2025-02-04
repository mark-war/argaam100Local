# Use the official Node.js image from the Docker Hub
FROM node:18-slim

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json (if you have one)
COPY package*.json ./

# Grant the "node" user permissions to the working directory
RUN chown -R node:node /app

# Switch to the "node" user
USER node

# Install dependencies
RUN npm install

# Copy application source code
COPY --chown=node:node . .

# Expose the port the app will run on
EXPOSE 3000

# Command to run the app inside the container
CMD ["npm", "run", "dev"]
