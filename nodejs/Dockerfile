# Build
FROM node:9.5.0

RUN mkdir /build
WORKDIR /build

COPY test/unit/package.json .
RUN npm install

# Run
FROM node:9.5.0

COPY --from=0 /build /build/

WORKDIR /project

COPY . .
