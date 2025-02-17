@echo off

:: Install dependencies
npm install

:: Create .env file if it doesn't exist
if not exist .env (
  echo Creating .env file...
  echo PORT=3001>> .env
  echo SUBNET=192.168.1.>> .env
  echo SSH_USERNAME=your-ssh-username>> .env
  echo SSH_PASSWORD=your-ssh-password>> .env
  echo .env file created. Please update it with your configuration.
) else (
  echo .env file already exists.
)

echo Setup complete. You can now run the software using 'npm run dev'.
