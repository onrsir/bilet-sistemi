#!/bin/bash
echo "Installing dependencies..."
npm install

echo "Creating js directory if it doesn't exist..."
mkdir -p public/js

echo "Building React applications..."
npx webpack --mode production

echo "Build completed! You can now run the application with 'npm start'"
echo "Visit:"
echo "- http://localhost:3000 for the new homepage"
echo "- http://localhost:3000/ticket.html?id=TICKET_ID for the ticket view"
echo "- http://localhost:3000/admin.html for the admin panel" 