FROM node:18-alpine

# Cria diretório de trabalho
WORKDIR /usr/src/app

# Copia package.json  e instala dependências
COPY package*.json ./
RUN npm ci --only=production

# Copia somente a pasta da aplicação para manter a imagem enxuta
COPY app/ ./app/

ENV NODE_ENV=production
ENV PORT=3000


EXPOSE 3000

# Inicia o servidor
CMD ["node", "app/index.js"]
