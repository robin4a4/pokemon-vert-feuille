FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

COPY dist dist
COPY package*.json .
COPY migrations migrations

# Install production dependencies only
RUN npm install --production
RUN mkdir -p /app/data
RUN npx knex migrate:latest

# Expose the application port (adjust if necessary)
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start"]
