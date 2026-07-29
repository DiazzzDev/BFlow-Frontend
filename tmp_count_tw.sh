#!/bin/bash
cd /home/jose/projects/BFlow-Frontend
tokens=(
  text-foreground
  bg-background
  text-muted-foreground
  bg-muted
  bg-card
  border-border
  text-label
  text-helper
  text-placeholder
  text-dark
  bg-dark
  border-dark
  bg-surface
  text-primary-foreground
  bg-primary-dark
  text-primary
  border-primary
  ring-primary
  bg-secondary
  text-danger
  text-success
  text-info
  text-warning
  item-nav
  shadow-custom
  primary-15
  primary-25
  dark-10
  dark-25
  dark-50
  dark-75
  surface-hard
  surface-95
  card-foreground
  muted-foreground
  placeholder:text-
)

echo '=== FREQUENCY COUNTS ==='
for t in "${tokens[@]}"; do
  count=$(rg -o --glob '*.tsx' --glob '*.css' -F "$t" src 2>/dev/null | wc -l)
  printf '%s\t%s\n' "$count" "$t"
done | sort -t$'\t' -k1 -nr

echo ''
echo '=== UNIQUE dark-* class tokens ==='
rg -o --glob '*.tsx' --glob '*.css' -P '\bdark-[a-zA-Z0-9./\[\]]+' src 2>/dev/null | sort -u

echo ''
echo '=== UNIQUE surface-* class tokens ==='
rg -o --glob '*.tsx' --glob '*.css' -P '\bsurface-[a-zA-Z0-9./\[\]]+' src 2>/dev/null | sort -u

echo ''
echo '=== UNIQUE classes containing dark- ==='
rg -o --glob '*.tsx' --glob '*.css' -P '[\w:/\[\]%-]*dark-[a-zA-Z0-9./\[\]]+' src 2>/dev/null | sort -u

echo ''
echo '=== UNIQUE classes containing surface- ==='
rg -o --glob '*.tsx' --glob '*.css' -P '[\w:/\[\]%-]*surface-[a-zA-Z0-9./\[\]]+' src 2>/dev/null | sort -u
