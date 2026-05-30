#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

ENV_FILE=".env"

if [ -f "$ENV_FILE" ]; then
  echo ".env file already exists. Skipping setup."
  echo "To reset, delete .env and re-run this script."
  exit 0
fi

echo "Creating .env file from .env.example..."
cp .env.example "$ENV_FILE"

AUTH_SECRET="$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")"

if [[ "$OSTYPE" == "darwin"* ]]; then
  sed -i '' "s/AUTH_SECRET=a-random-secret-string/AUTH_SECRET=$AUTH_SECRET/" "$ENV_FILE"
else
  sed -i "s/AUTH_SECRET=a-random-secret-string/AUTH_SECRET=$AUTH_SECRET/" "$ENV_FILE"
fi

echo ""
echo "  .env file created successfully."
echo ""
echo "  Next steps:"
echo "    1. Open .env and change ADMIN_PIN to a secure value you will remember."
echo "    2. Run:  docker compose up -d"
echo "    3. Visit http://localhost:3000"
echo ""
