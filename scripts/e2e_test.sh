#!/usr/bin/env bash

if [ -z "${BASH_VERSION:-}" ]; then
  exec bash "$0" "$@"
fi

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

LOG_DIR="$ROOT_DIR/logs"
mkdir -p "$LOG_DIR"
LOG_FILE="$LOG_DIR/e2e_test_$(date +%F_%H-%M-%S).log"

exec > >(tee -a "$LOG_FILE") 2>&1

echo "=== e2e_test.sh started at $(date '+%F %T') ==="
echo "Log file: $LOG_FILE"

if ! command -v pnpm >/dev/null 2>&1; then
  echo "FATAL: pnpm is required but not found in PATH."
  exit 1
fi

if [ -f "$ROOT_DIR/.env" ]; then
  set -a
  # shellcheck disable=SC1091
  source "$ROOT_DIR/.env"
  set +a
fi

E2E_PORT="${E2E_PORT:-3005}"
export E2E_PORT
export PLAYWRIGHT_BASE_URL="${PLAYWRIGHT_BASE_URL:-http://127.0.0.1:${E2E_PORT}}"

echo "Base URL: $PLAYWRIGHT_BASE_URL"
echo "E2E port: $E2E_PORT"

API_URL="${NEXT_PUBLIC_API_URL:-http://127.0.0.1:4000}"
echo "API URL: $API_URL"

if [ "${E2E_REQUIRE_API:-0}" = "1" ]; then
  echo ""
  echo "--- Prerequisite: API /api/health (E2E_REQUIRE_API=1) ---"
  if ! curl -sf "${API_URL}/api/health" >/dev/null; then
    echo "FATAL: API is not reachable at ${API_URL}/api/health"
    exit 1
  fi
  echo "API health: OK"
else
  echo "Skipping API health check (set E2E_REQUIRE_API=1 to enforce)."
fi

echo ""
echo "--- Playwright E2E tests -> playwright-report/ ---"
rm -rf "$ROOT_DIR/playwright-report" "$ROOT_DIR/test-results"

set +e
pnpm exec playwright test "$@"
PLAYWRIGHT_EXIT=$?
set -e

if [ -f "$ROOT_DIR/playwright-report/index.html" ]; then
  echo "Report: playwright-report/index.html"
fi

echo "=== e2e_test.sh finished (exit $PLAYWRIGHT_EXIT) at $(date '+%F %T') ==="
exit "$PLAYWRIGHT_EXIT"
