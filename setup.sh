#!/bin/bash

# Install dependencies
npm install

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
  echo "Creating .env file..."
  cat <<EOT >> .env
PORT=3001
SUBNET=192.168.1.
SSH_USERNAME=your-ssh-username
SSH_PASSWORD=your-ssh-password
EOT
  echo ".env file created. Please update it with your configuration."
else
  echo ".env file already exists."
fi

echo "Setup complete. You can now run the software using 'npm run dev'."
