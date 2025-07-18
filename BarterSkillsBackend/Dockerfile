FROM node:18-alpine
WORKDIR /usr/src/app

# install deps
COPY package*.json ./
RUN npm install

# copy all code and build
COPY . .
CMD ["node", "src/index.js"]  # or "npm run start", depending on your startup script
