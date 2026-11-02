#!/usr/bin/env bash
#
# Run the claims gate if it is reachable.
#
# This repo is versioned separately from the monorepo around it, so on Netlify
# the checkout is THIS folder alone and ../../scripts/ does not exist. A build
# command that assumes otherwise fails, which is exactly what happened on
# 2 Nov 2026: the first push carrying the gate broke the deploy outright.
#
# Skipping here is safe and not a loophole. The gate's job is to catch the
# author before the commit, and the author is always in the monorepo where the
# gate is present and hard. Netlify only ever builds source that already got
# past it.
set -euo pipefail
GATE="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." 2>/dev/null && pwd)/scripts/claims-gate.sh"

if [ -f "$GATE" ]; then
  exec bash "$GATE" live-site
fi
echo "claims gate: not in this checkout (standalone repo); it runs in the monorepo before the commit"
