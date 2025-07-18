FROM node:18-alpine
WORKDIR /usr/src/app

# Copy only package definitions, install deps
COPY package*.json ./
RUN npm install

# Copy the rest of your backend code
COPY . .

# expose and start
EXPOSE 8000
CMD ["node", "app.js"]   # or "npm", "start" if you use an npm start script