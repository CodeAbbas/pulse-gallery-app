# Base image
FROM node:20-alpine

# Create app directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy project files
COPY . .
ARG COSMOS_ENDPOINT
ARG COSMOS_KEY
ARG AZURE_STORAGE_CONNECTION_STRING

# Set Environment Variables for the build process
ENV COSMOS_ENDPOINT=$COSMOS_ENDPOINT
ENV COSMOS_KEY=$COSMOS_KEY
ENV AZURE_STORAGE_CONNECTION_STRING=$AZURE_STORAGE_CONNECTION_STRING

# Now run the build
RUN npm run build

# Expose application port
EXPOSE 3000

# Start production server
CMD ["npm", "start"]