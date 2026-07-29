#!/usr/bin/env node
/**
 * Bulk-replace Tailwind class tokens in src (except index.css).
 * Order: longer / more specific tokens first.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.join(__dirname, "..", "src");
const SKIP = new Set(["index.css"]);
const EXTS = new Set([".tsx", ".ts", ".css"]);

/** Escape for RegExp */
function esc(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Match utility as whole class token (may have /opacity after).
 * Negative lookahead prevents matching longer suffixes like text-dark-75 when looking for text-dark.
 */
function tokenRe(old) {
  if (old === "text-dark") {
    return new RegExp(`text-dark(?![A-Za-z0-9_-])`, "g");
  }
  if (old === "bg-card" || old === "bg-muted") {
    return new RegExp(`${esc(old)}(?![A-Za-z0-9_-])`, "g");
  }
  if (old.includes("/")) {
    return new RegExp(esc(old), "g");
  }
  return new RegExp(`${esc(old)}(?![A-Za-z0-9_-])`, "g");
}

const replacements = [
  ["placeholder:text-muted-foreground", "placeholder:text-placeholder"],
  ["text-muted-foreground", "text-helper"],
  ["text-primary-foreground", "text-light"],
  ["hover:text-foreground", "hover:text-light"],
  ["text-foreground", "text-light"],
  ["bg-background", "bg-surface-hard"],
  ["bg-card", "bg-surface"],
  ["border-border", "border-light-10"],
  ["bg-muted", "bg-secondary"],
  ["hover:border-dark-25", "hover:border-light-25"],
  ["hover:bg-dark-10", "hover:bg-light-10"],
  ["border-dark-25", "border-light-25"],
  ["border-dark-10", "border-light-10"],
  ["bg-dark-25", "bg-light-25"],
  ["bg-dark-10", "bg-light-10"],
  ["bg-dark-5", "bg-light-5"],
  ["text-dark-75", "text-light-75"],
  ["text-dark-50", "text-light-50"],
  ["text-dark-25", "text-light-25"],
  ["text-dark-10", "text-light-10"],
  ["text-dark", "text-light"],
  ["card-foreground", "light"],
  ["dark-25/40", "light-25/40"],
  ["dark-25/20", "light-25/20"],
];

const extra = [
  [new RegExp(`dark-10(?![A-Za-z0-9_-])`, "g"), "light-10", "dark-10 -> light-10"],
];

const finalFix = [
  [
    /placeholder:text-helper/g,
    "placeholder:text-placeholder",
    "placeholder:text-helper -> placeholder:text-placeholder",
  ],
];

function walk(dir, out = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      if (ent.name === "node_modules") continue;
      walk(full, out);
    } else if (EXTS.has(path.extname(ent.name)) && !SKIP.has(ent.name)) {
      out.push(full);
    }
  }
  return out;
}

const counts = new Map();
const filesChanged = [];

function bump(label) {
  counts.set(label, (counts.get(label) || 0) + 1);
}

const files = walk(SRC);
for (const file of files) {
  let text = fs.readFileSync(file, "utf8");
  const original = text;

  for (const [old, neu] of replacements) {
    const re = tokenRe(old);
    const label = `${old} -> ${neu}`;
    text = text.replace(re, () => {
      bump(label);
      return neu;
    });
  }

  for (const [re, neu, label] of extra) {
    text = text.replace(re, () => {
      bump(label);
      return neu;
    });
  }

  for (const [re, neu, label] of finalFix) {
    text = text.replace(re, () => {
      bump(label);
      return neu;
    });
  }

  if (text !== original) {
    fs.writeFileSync(file, text, "utf8");
    filesChanged.push(path.relative(path.join(SRC, ".."), file));
  }
}

console.log("=== REPLACEMENT COUNTS ===");
let total = 0;
const sorted = [...counts.entries()].sort((a, b) => b[1] - a[1]);
for (const [label, n] of sorted) {
  console.log(`  ${String(n).padStart(4)}  ${label}`);
  total += n;
}
console.log(`TOTAL replacements: ${total}`);
console.log(`Files changed: ${filesChanged.length}`);
for (const f of filesChanged) console.log(`  - ${f}`);
