#!/bin/bash

# Setup script for Groq API key

echo "Setting up Groq API key..."

if [ -z "$1" ]; then
    echo "Usage: ./setup-groq.sh YOUR_GROQ_API_KEY"
    echo ""
    echo "Get your API key from: https://console.groq.com/keys"
    exit 1
fi

GROQ_KEY="$1"

# Update .env file
cd backend
if [ -f .env ]; then
    # Replace GROQ_API_KEY if it exists, otherwise add it
    if grep -q "GROQ_API_KEY" .env; then
        sed -i '' "s|GROQ_API_KEY=.*|GROQ_API_KEY=$GROQ_KEY|" .env
    else
        echo "GROQ_API_KEY=$GROQ_KEY" >> .env
    fi
    echo "✓ Updated backend/.env with GROQ_API_KEY"
else
    echo "GROQ_API_KEY=$GROQ_KEY" > .env
    echo "MONGODB_URI=mongodb://localhost:27017/movie-ai" >> .env
    echo "PORT=3001" >> .env
    echo "FRONTEND_URL=http://localhost:5173" >> .env
    echo "✓ Created backend/.env with GROQ_API_KEY"
fi

echo ""
echo "Setup complete! You can now start the backend with:"
echo "  cd backend && npm start"
