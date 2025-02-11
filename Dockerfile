# Usa a imagem base do Node 18 no Alpine
FROM node:18-alpine3.17

# Define o diretório de trabalho
WORKDIR /usr/src/app

# Instala python3, make, g++, Java (openjdk17) e quaisquer outros pacotes necessários
# build-base instala um conjunto de ferramentas como make, gcc, g++, etc.
# Se você precisar apenas de JRE (para rodar aplicações Java), use openjdk17-jre
# Caso precise compilar algo em Java, use openjdk17
RUN apk add --no-cache \
    python3 \
    build-base \
    openjdk17 \
    && ln -sf python3 /usr/bin/python

# A partir do Node 16+, podemos usar o Corepack para gerenciar o pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copia os arquivos do projeto
COPY . .

# Instala as dependências usando pnpm
RUN pnpm install

# Se seu projeto precisar de build
RUN pnpm run build

# Expõe a porta da aplicação
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["pnpm", "run", "start"]
