# Use an official Node.js runtime as the base image
FROM node:18-alpine AS build

WORKDIR /app/

COPY ../shared ./shared

# Set the working directory inside the container
WORKDIR /app/backend

# Copy package.json and package-lock.json
COPY package*.json .

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the application using tsc
RUN npm run build

# Use a lighter version of Node.js to run the built application
FROM node:18-alpine AS production

# Set the working directory inside the container
WORKDIR /app

# Copy only the build output and necessary files
COPY --from=build /app/backend/dist ./dist
COPY --from=build /app/backend/package*.json ./

COPY migrations ./migrations

# Install production dependencies only
RUN npm install --production
RUN mkdir -p /app/data
RUN npx knex migrate:latest

# Expose the application port (adjust if necessary)
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start"]
