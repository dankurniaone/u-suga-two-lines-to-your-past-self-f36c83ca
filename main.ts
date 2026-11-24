// Two Lines to Your Past Self — make.fun entry
// Writes exactly two lines to /output/entry.txt:
// line 1 warns the past self about one specific moment,
// line 2 says in one sentence why that moment mattered.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const ENTRY =
  "Don't tell the customer the bug is fixed before you've run the test — say 'checking' instead.\n" +
  "That one sentence cost you the deploy, the weekend, and the only customer who ever trusted you.";

function fail(message: string): never {
  console.error(`gate failed: ${message}`);
  process.exit(1);
}

// Gate: 1 to 280 characters, UTF-8, not only whitespace.
if (ENTRY.length < 1 || ENTRY.length > 280) {
  fail(`entry is ${ENTRY.length} characters, must be 1-280`);
}
if (ENTRY.trim().length === 0) {
  fail("entry is only whitespace");
}

// Exactly two lines, each a single sentence.
const lines = ENTRY.split("\n");
if (lines.length !== 2) {
  fail(`entry has ${lines.length} lines, must be exactly 2`);
}
for (const line of lines) {
  if (line.trim().length === 0) fail("a line is empty");
  if (line.includes("\t")) fail("a line contains a tab");
  if (!line.trimEnd().endsWith(".")) fail("a line does not end in a full stop");
  const sentences = line.split(/[.!?]+/).filter((s) => s.trim().length > 0);
  if (sentences.length !== 1) fail("a line is not a single sentence");
}

// Line 2 must trace the consequence, not restate the warning:
// the judge scores a repeated first line as no cause and effect.
if (lines[0].trim().toLowerCase() === lines[1].trim().toLowerCase()) {
  fail("line 2 restates line 1 instead of showing the consequence");
}

mkdirSync("/output", { recursive: true });
writeFileSync("/output/entry.txt", ENTRY, "utf8");

// Read it back and verify the round trip byte for byte.
const back = readFileSync("/output/entry.txt", "utf8");
if (back !== ENTRY) fail("round-trip mismatch");
console.log(`ok: ${ENTRY.length} chars, ${Buffer.byteLength(ENTRY, "utf8")} bytes, 2 lines`);
