FROM node:16-alpine
WORKDIR /backend
COPY package.json ./
COPY package-lock.json ./
COPY ./ ./
RUN npm install --save
# RUN npm ci 
EXPOSE 5000
CMD npx nodemon start