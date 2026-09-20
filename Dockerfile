FROM node:24-alpine
WORKDIR /app
COPY package.json ./
COPY server ./server
COPY dist ./dist
RUN mkdir /app/data && chown node:node /app/data
ENV HOST=0.0.0.0 PORT=4174 DATA_DIR=/app/data
USER node
EXPOSE 4174
CMD ["node", "server/index.mjs"]
