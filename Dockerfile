# Usa una imagen base de Node.js
FROM node:18

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos de tu aplicación al contenedor
COPY package*.json ./
RUN npm install

# Copia el resto de los archivos
COPY . .

# Expone el puerto en el que tu aplicación escucha
EXPOSE 3001

RUN npm rebuild bcrypt --build-from-source
RUN npm run build

# Comando para iniciar tu aplicación
CMD [ "npm", "run", "start:dev" ]
