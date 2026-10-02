#!/usr/bin/env sh
# Named volume node_modules thường root:root — chown cho HOST_UID rồi hạ quyền (setpriv) trước khi chạy pnpm/next.
set -eu

UID_NUM="${HOST_UID:-1000}"
GID_NUM="${HOST_GID:-1000}"

if [ "$(id -u)" = "0" ] && [ -d /workspace/portal/node_modules ]; then
  cur="$(stat -c '%u:%g' /workspace/portal/node_modules 2>/dev/null || echo 0:0)"
  if [ "$cur" != "${UID_NUM}:${GID_NUM}" ]; then
    chown -R "${UID_NUM}:${GID_NUM}" /workspace/portal/node_modules
  fi
  exec setpriv --reuid="${UID_NUM}" --regid="${GID_NUM}" --init-groups -- "$@"
fi

exec "$@"
