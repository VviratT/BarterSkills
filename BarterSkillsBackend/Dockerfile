# Use official Node.js image
FROM node:18

# Create app directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app
COPY . .

# Expose the backend port (adjust if it's different)
EXPOSE 8000

# Start the app using your dev script
CMD ["npm", "run", "dev"]
