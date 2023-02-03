FROM node:16

RUN npm install -g nodemon

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ENV DATABASE_URL=mongodb+srv://dileepa:Dileepa123@todocluster.nvulqfv.mongodb.net/?retryWrites=true&w=majority

EXPOSE 5000

CMD [ "npm", "run", "dev" ]