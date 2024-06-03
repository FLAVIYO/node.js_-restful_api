# Invicta Backend Assignment

This is a Node.js RESTful API built with TypeScript and MongoDB. The project is structured to handle user and task management and is documented using Swagger.

## Table of Contents
- [Installation](#installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Environment Variables](#environment-variables)

## Installation

1. **Clone the repository:**
   ```sh
   git clone https://github.com/FLAVIYO/node.js_-restful_api.git
   cd invicta-backend-assignment


2. **Install dependencies::**
   ```sh
   npm install


3. **Set up environment variables:::**
   Create a .env file in the root directory and add the following:
   ```sh
   MONGO_URI=mongodb://localhost:27017/invicta-backend-assignment
   # MONGO_URI=mongodb+srv://userName:Password@cluster0.85atme3.mongodb.net/?retryWrites=true&w=majority&appName=ClusterNmae
   PORT=
   MONGO_URI_TEST=mongodb://localhost:27017/test-database

4. **Start the server:**
   ```sh
   npm run dev
   

## Usage

The server will start on http://localhost:portNo

API endpoints will be available under http://localhost:portNo/api.

## API Documentation

Swagger UI is set up for API documentation.

Visit http://localhost:portNo/api/docs to view and test the API endpoints.

## Environment Variables

The following environment variables need to be set in the .env file:

MONGO_URI: URI for connecting to the MongoDB database.Can be local or cloud server like atlas

PORT: Port number for the server to listen on .

## Testing

 **Run the tset:**
   ```sh
   npm test