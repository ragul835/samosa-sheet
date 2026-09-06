#!/usr/bin/env bash

set -Eeuo pipefail
umask 027

APP_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
RUNTIME_DIR="$APP_DIR/.run"
PID_FILE="$RUNTIME_DIR/production.pid"
LOG_FILE="$RUNTIME_DIR/production.log"
DEV_PID_FILE="$RUNTIME_DIR/development.pid"
DEV_LOG_FILE="$RUNTIME_DIR/development.log"
PORT="${PORT:-3000}"
DEV_PORT="${DEV_PORT:-3001}"
HOST="${HOST:-0.0.0.0}"

validate_port() {
  local name="$1" value="$2"
  if [[ ! "$value" =~ ^[0-9]+$ ]] || (( value < 1 || value > 65535 )); then
    echo "Error: $name must be a number between 1 and 65535." >&2
    exit 2
  fi
}

validate_port "PORT" "$PORT"
validate_port "DEV_PORT" "$DEV_PORT"

usage() {
  cat <<'EOF'
Usage: ./manage-service.sh [command]

Without a command, opens the interactive menu.

Commands:
  start      Build if needed, then start the production server
  stop       Gracefully stop the production server
  restart    Restart the production server
  status     Show process and HTTP health status
  logs       Follow production logs
  deploy     Install, check, build, and restart production
  install    Install locked dependencies with npm ci
  check      Run TypeScript validation
  build      Create the production static export
  dev-build  Validate development changes with a clean production build
  dev        Run the development server in the foreground (DEV_PORT=3001)
  dev-start  Start the development server in the background
  dev-stop   Stop the background development server
  dev-status Show background development server status
  dev-logs   Follow background development logs
EOF
}

require_environment() {
  [[ -f "$APP_DIR/package.json" ]] || { echo "Error: package.json not found in $APP_DIR" >&2; exit 1; }
  [[ -f "$APP_DIR/package-lock.json" ]] || { echo "Error: package-lock.json is required." >&2; exit 1; }
  for name in node npm setsid; do
    command -v "$name" >/dev/null 2>&1 || { echo "Error: required command '$name' is not installed." >&2; exit 1; }
  done
}

read_pid() {
  local pid=""
  [[ -f "$PID_FILE" ]] && IFS= read -r pid <"$PID_FILE"
  [[ "$pid" =~ ^[0-9]+$ ]] && printf '%s\n' "$pid"
}

is_running() {
  local pid cmdline
  pid="$(read_pid || true)"
  [[ -n "$pid" ]] || return 1
  kill -0 "$pid" 2>/dev/null || return 1
  [[ -r "/proc/$pid/cmdline" ]] || return 1
  cmdline="$(tr '\0' ' ' <"/proc/$pid/cmdline")"
  [[ "$cmdline" == *"scripts/static-server.mjs"* ]]
}

read_dev_pid() {
  local pid=""
  [[ -f "$DEV_PID_FILE" ]] && IFS= read -r pid <"$DEV_PID_FILE"
  [[ "$pid" =~ ^[0-9]+$ ]] && printf '%s\n' "$pid"
}

is_dev_running() {
  local pid cmdline
  pid="$(read_dev_pid || true)"
  [[ -n "$pid" ]] || return 1
  kill -0 "$pid" 2>/dev/null || return 1
  [[ -r "/proc/$pid/cmdline" ]] || return 1
  cmdline="$(tr '\0' ' ' <"/proc/$pid/cmdline")"
  [[ "$cmdline" == *"npm run dev"* || "$cmdline" == *"next dev"* ]]
}

http_healthy() {
  node -e '
    const http = require("node:http");
    const request = http.get({ host: "127.0.0.1", port: Number(process.argv[1]), path: "/healthz", timeout: 1000 }, response => {
      response.resume();
      process.exit(response.statusCode === 200 ? 0 : 1);
    });
    request.on("timeout", () => request.destroy());
    request.on("error", () => process.exit(1));
  ' "$PORT" >/dev/null 2>&1
}

http_dev_healthy() {
  node -e '
    const http = require("node:http");
    const request = http.get({ host: "127.0.0.1", port: Number(process.argv[1]), path: "/", timeout: 2000 }, response => {
      response.resume();
      process.exit(response.statusCode >= 200 && response.statusCode < 500 ? 0 : 1);
    });
    request.on("timeout", () => request.destroy());
    request.on("error", () => process.exit(1));
  ' "$DEV_PORT" >/dev/null 2>&1
}

port_is_available() {
  node -e '
    const net = require("node:net");
    const server = net.createServer();
    server.once("error", () => process.exit(1));
    server.listen(Number(process.argv[1]), "127.0.0.1", () => server.close(() => process.exit(0)));
  ' "$1" >/dev/null 2>&1
}

install_dependencies() {
  require_environment
  (cd "$APP_DIR" && npm ci)
}

check_app() {
  require_environment
  [[ -d "$APP_DIR/node_modules" ]] || install_dependencies
  (cd "$APP_DIR" && npm run lint)
}

build_app() {
  require_environment
  [[ -d "$APP_DIR/node_modules" ]] || install_dependencies
  (cd "$APP_DIR" && npm run build)
  [[ -f "$APP_DIR/out/index.html" ]] || { echo "Error: build did not create out/index.html." >&2; exit 1; }
  echo "Production build ready: $APP_DIR/out"
}

dev_build() {
  echo "Validating development changes..."
  check_app
  build_app
  echo "Development validation build passed."
}

start_service() {
  local pid
  require_environment
  mkdir -p "$RUNTIME_DIR"
  if is_running; then
    echo "Production server is already running (PID $(read_pid))."
    return
  fi

  rm -f "$PID_FILE"
  [[ -f "$APP_DIR/out/index.html" ]] || build_app
  : >"$LOG_FILE"
  (
    cd "$APP_DIR"
    nohup setsid env NODE_ENV=production HOST="$HOST" PORT="$PORT" STATIC_ROOT="$APP_DIR/out" \
      node scripts/static-server.mjs >>"$LOG_FILE" 2>&1 &
    printf '%s\n' "$!" >"$PID_FILE"
  )
  pid="$(read_pid)"

  for _ in {1..30}; do
    kill -0 "$pid" 2>/dev/null || break
    http_healthy && break
    sleep 0.5
  done

  if is_running && http_healthy; then
    echo "Production server started: http://localhost:$PORT (PID $(read_pid))."
    echo "Log: $LOG_FILE"
  else
    echo "Error: production server failed to become healthy. Last log lines:" >&2
    tail -n 20 "$LOG_FILE" >&2 || true
    kill -- "-$pid" 2>/dev/null || kill "$pid" 2>/dev/null || true
    rm -f "$PID_FILE"
    exit 1
  fi
}

stop_service() {
  local pid
  if ! is_running; then
    rm -f "$PID_FILE"
    echo "Production server is not running."
    return
  fi

  pid="$(read_pid)"
  kill -- "-$pid" 2>/dev/null || kill "$pid" 2>/dev/null || true
  for _ in {1..40}; do
    kill -0 "$pid" 2>/dev/null || { rm -f "$PID_FILE"; echo "Production server stopped."; return; }
    sleep 0.25
  done
  kill -KILL -- "-$pid" 2>/dev/null || true
  rm -f "$PID_FILE"
  echo "Production server required a forced stop." >&2
}

status_service() {
  if is_running; then
    if http_healthy; then
      echo "Production server is healthy at http://localhost:$PORT (PID $(read_pid))."
      return
    fi
    echo "Production server process is running but its health check failed." >&2
    return 1
  fi
  rm -f "$PID_FILE"
  echo "Production server is not running."
  return 1
}

show_logs() {
  mkdir -p "$RUNTIME_DIR"
  touch "$LOG_FILE"
  tail -n 100 -f "$LOG_FILE"
}

deploy_app() {
  install_dependencies
  check_app
  build_app
  stop_service
  start_service
}

run_dev() {
  require_environment
  [[ -d "$APP_DIR/node_modules" ]] || install_dependencies
  if ! port_is_available "$DEV_PORT"; then
    echo "Error: development port $DEV_PORT is already in use." >&2
    echo "Stop the process using it or run: DEV_PORT=3002 ./manage-service.sh dev" >&2
    return 1
  fi
  echo "Starting development server at http://localhost:$DEV_PORT"
  (cd "$APP_DIR" && NEXT_DIST_DIR=.next-dev npm run dev -- --hostname "$HOST" --port "$DEV_PORT")
}

start_dev_service() {
  local pid
  require_environment
  mkdir -p "$RUNTIME_DIR"
  if is_dev_running; then
    echo "Development server is already running at http://localhost:$DEV_PORT (PID $(read_dev_pid))."
    return
  fi
  if ! port_is_available "$DEV_PORT"; then
    echo "Error: development port $DEV_PORT is already in use." >&2
    return 1
  fi

  rm -f "$DEV_PID_FILE"
  : >"$DEV_LOG_FILE"
  (
    cd "$APP_DIR"
    nohup setsid env NODE_ENV=development NEXT_DIST_DIR=.next-dev npm run dev -- --hostname "$HOST" --port "$DEV_PORT" \
      >>"$DEV_LOG_FILE" 2>&1 &
    printf '%s\n' "$!" >"$DEV_PID_FILE"
  )
  pid="$(read_dev_pid)"

  for _ in {1..60}; do
    kill -0 "$pid" 2>/dev/null || break
    http_dev_healthy && break
    sleep 0.5
  done

  if is_dev_running && http_dev_healthy; then
    echo "Development server started: http://localhost:$DEV_PORT (PID $(read_dev_pid))."
    echo "Log: $DEV_LOG_FILE"
  else
    echo "Error: development server failed to become healthy. Last log lines:" >&2
    tail -n 30 "$DEV_LOG_FILE" >&2 || true
    kill -- "-$pid" 2>/dev/null || kill "$pid" 2>/dev/null || true
    rm -f "$DEV_PID_FILE"
    return 1
  fi
}

stop_dev_service() {
  local pid
  if ! is_dev_running; then
    rm -f "$DEV_PID_FILE"
    echo "Development server is not running."
    return
  fi
  pid="$(read_dev_pid)"
  kill -- "-$pid" 2>/dev/null || kill "$pid" 2>/dev/null || true
  for _ in {1..40}; do
    kill -0 "$pid" 2>/dev/null || { rm -f "$DEV_PID_FILE"; echo "Development server stopped."; return; }
    sleep 0.25
  done
  kill -KILL -- "-$pid" 2>/dev/null || true
  rm -f "$DEV_PID_FILE"
  echo "Development server required a forced stop." >&2
}

status_dev_service() {
  if is_dev_running && http_dev_healthy; then
    echo "Development server is healthy at http://localhost:$DEV_PORT (PID $(read_dev_pid))."
    return
  fi
  rm -f "$DEV_PID_FILE"
  echo "Development server is not running."
  return 1
}

show_dev_logs() {
  mkdir -p "$RUNTIME_DIR"
  touch "$DEV_LOG_FILE"
  tail -n 100 -f "$DEV_LOG_FILE"
}

print_menu() {
  local state="stopped" dev_state="stopped"
  is_running && state="running on port $PORT"
  is_dev_running && dev_state="running on port $DEV_PORT"
  cat <<EOF

Samosa Sheet Website Manager
Production status: $state
Development status: $dev_state

  1) Start production website
  2) Stop production website
  3) Restart production website
  4) Check production health
  5) View production logs (Ctrl+C to return)
  6) Full production deploy
  7) Install dependencies
  8) Type-check project
  9) Build production website
 10) Start development server on port $DEV_PORT (background)
 11) Validate development build
 12) Stop development server
 13) Check development health
 14) View development logs (Ctrl+C to return)
  0) Exit
EOF
}

interactive_menu() {
  local choice
  while true; do
    print_menu
    printf '\nChoose an option [0-14]: '
    if ! IFS= read -r choice; then printf '\n'; return; fi
    case "$choice" in
      1) start_service ;;
      2) stop_service ;;
      3) stop_service; start_service ;;
      4) status_service || true ;;
      5) show_logs || true ;;
      6) deploy_app ;;
      7) install_dependencies ;;
      8) check_app ;;
      9) build_app ;;
      10) start_dev_service ;;
      11) dev_build ;;
      12) stop_dev_service ;;
      13) status_dev_service || true ;;
      14) show_dev_logs || true ;;
      0) echo "Goodbye."; return ;;
      *) echo "Invalid option. Enter a number from 0 to 14." ;;
    esac
  done
}

case "${1:-menu}" in
  menu) interactive_menu ;;
  start) start_service ;;
  stop) stop_service ;;
  restart) stop_service; start_service ;;
  status) status_service ;;
  logs) show_logs ;;
  deploy) deploy_app ;;
  install) install_dependencies ;;
  check) check_app ;;
  build) build_app ;;
  dev-build) dev_build ;;
  dev) run_dev ;;
  dev-start) start_dev_service ;;
  dev-stop) stop_dev_service ;;
  dev-status) status_dev_service ;;
  dev-logs) show_dev_logs ;;
  -h|--help|help) usage ;;
  *) echo "Unknown command: $1" >&2; usage >&2; exit 2 ;;
esac
