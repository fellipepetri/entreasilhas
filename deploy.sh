#!/usr/bin/env bash
set -euo pipefail

SSH_TARGET="${SSH_TARGET:-squidadmin@100.102.20.80}"
REMOTE_DIR="${REMOTE_DIR:-/home/squidadmin/dev/entre-as-ilhas}"
SERVICE_NAME="${SERVICE_NAME:-site}"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SSH_CONTROL_DIR="$(mktemp -d)"
SSH_CONTROL_PATH="${SSH_CONTROL_DIR}/ssh_mux_%h_%p_%r"
SSH_OPTS=(
  -o ControlMaster=auto
  -o "ControlPath=${SSH_CONTROL_PATH}"
  -o ControlPersist=10m
)
RSYNC_SSH="ssh -o ControlMaster=auto -o ControlPath=${SSH_CONTROL_PATH} -o ControlPersist=10m"

cleanup() {
  ssh "${SSH_OPTS[@]}" -O exit "${SSH_TARGET}" >/dev/null 2>&1 || true
  rm -rf "${SSH_CONTROL_DIR}"
}
trap cleanup EXIT

if ! command -v rsync >/dev/null 2>&1; then
  echo "Erro: rsync nao encontrado na maquina local." >&2
  exit 1
fi

if ! command -v ssh >/dev/null 2>&1; then
  echo "Erro: ssh nao encontrado na maquina local." >&2
  exit 1
fi

echo "Abrindo conexao SSH reutilizavel com ${SSH_TARGET}..."
ssh -fN "${SSH_OPTS[@]}" "${SSH_TARGET}"

echo "Criando diretorio remoto: ${SSH_TARGET}:${REMOTE_DIR}"
ssh "${SSH_OPTS[@]}" "${SSH_TARGET}" "mkdir -p '${REMOTE_DIR}'"

echo "Sincronizando projeto para o servidor..."
rsync -az --delete -e "${RSYNC_SSH}" \
  --exclude='node_modules' \
  --exclude='.next' \
  --exclude='.git' \
  --exclude='npm-debug.log*' \
  --exclude='yarn-debug.log*' \
  --exclude='yarn-error.log*' \
  --exclude='pnpm-debug.log*' \
  "${SCRIPT_DIR}/" "${SSH_TARGET}:${REMOTE_DIR}/"

echo "Executando docker compose no servidor..."
ssh "${SSH_OPTS[@]}" "${SSH_TARGET}" "cd '${REMOTE_DIR}' && docker compose up -d --build"

echo "Status dos containers:"
ssh "${SSH_OPTS[@]}" "${SSH_TARGET}" "cd '${REMOTE_DIR}' && docker compose ps"

echo "Logs recentes do servico ${SERVICE_NAME}:"
ssh "${SSH_OPTS[@]}" "${SSH_TARGET}" "cd '${REMOTE_DIR}' && docker compose logs --tail=120 '${SERVICE_NAME}'"
