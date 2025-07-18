FROM node:18-alpine
WORKDIR /usr/src/app

COPY BarterSkillsBackend/package*.json ./
RUN npm install

COPY BarterSkillsBackend/ ./
CMD ["npm", "start"]
