# Build
FROM node:9.5.0

# Build dir
RUN mkdir /build
WORKDIR /build

# Install deps
COPY package.json .
RUN npm install

# Run
FROM node:9.5.0

COPY --from=0 /build /build/

WORKDIR /tmp/project

COPY . .
