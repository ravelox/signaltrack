#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

require_command() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "Missing required command: $1" >&2
    exit 1
  fi
}

copy_if_missing() {
  local source_file="$1"
  local target_file="$2"

  if [ ! -f "$target_file" ]; then
    cp "$source_file" "$target_file"
    echo "Created $(basename "$target_file") from $(basename "$source_file")"
  fi
}

require_command pnpm

echo "Bootstrapping SignalTrack..."

copy_if_missing "$ROOT_DIR/backend/.env.example" "$ROOT_DIR/backend/.env"
copy_if_missing "$ROOT_DIR/frontend/.env.example" "$ROOT_DIR/frontend/.env.local"

echo "Installing backend dependencies..."
pnpm install --dir "$ROOT_DIR/backend"

echo "Installing frontend dependencies..."
pnpm install --dir "$ROOT_DIR/frontend"

cat <<'EOF'

Bootstrap complete.

Next steps:
1. Start backend infrastructure: cd backend && docker compose up -d
2. Run the backend API: cd backend && pnpm dev:api
3. Run the frontend app: cd frontend && pnpm dev

Optional:
- Run the backend worker: cd backend && pnpm dev:worker
- Disable frontend mocks in frontend/.env.local when testing the live backend
EOF
