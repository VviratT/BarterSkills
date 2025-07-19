# Use Node 18
FROM node:18

# Where your code lives inside the container:
WORKDIR /usr/src/app

# First copy only package manifests, install deps
COPY BarterSkillsBackend/package*.json ./
RUN npm install

# Then copy the rest of your application
COPY BarterSkillsBackend/ ./

# Build (if you have a build step; remove if not)
# RUN npm run build

# Expose your port
ARG PORT=8000
ENV PORT=${PORT}
EXPOSE ${PORT}

# Use your dev script or start script
CMD ["npm", "run", "dev"]
