# Build
FROM node:9.5.0

RUN mkdir /build
WORKDIR /build

COPY nodejs/package.json nodejs/package-lock.json ./
RUN npm install

# Run
FROM node:9.5.0

WORKDIR /project
COPY --from=0 /build .
COPY . .
