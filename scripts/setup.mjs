// One-command setup for the ACE Contracting platform.
// Cross-platform (Windows / macOS / Linux) — run with: npm run setup
//
// 1. Creates a .env file (from .env.example) if one doesn't exist yet
// 2. Creates the database tables
// 3. Loads the demo users and sample data
//
// Safe to run multiple times.

import { existsSync, copyFileSync, writeFileSync } from "node:fs";
import { execSync } from "node:child_process";

const DEFAULT_ENV = `DATABASE_URL="file:./dev.db"
AUTH_SECRET="local-development-secret-change-me-in-production"
SESSION_HOURS=12
`;

function run(label, cmd) {
  process.stdout.write(`\n▶ ${label}…\n`);
  execSync(cmd, { stdio: "inherit" });
}

console.log("════════════════════════════════════════════");
console.log("  ACE Contracting — first-time setup");
console.log("════════════════════════════════════════════");

// Step 1 — environment file
if (existsSync(".env")) {
  console.log("\n✓ .env already exists — keeping it.");
} else if (existsSync(".env.example")) {
  copyFileSync(".env.example", ".env");
  console.log("\n✓ Created .env from .env.example");
} else {
  writeFileSync(".env", DEFAULT_ENV);
  console.log("\n✓ Created .env with default settings");
}

// Step 2 — database tables
run("Creating the database", "npx prisma db push");

// Step 3 — demo data
run("Loading demo users and sample data", "npx tsx prisma/seed.ts");

console.log("\n════════════════════════════════════════════");
console.log("  ✅ Setup complete!");
console.log("");
console.log("  Now run:   npm run dev");
console.log("  Then open: http://localhost:3000");
console.log("");
console.log("  Log in with:");
console.log("    admin@acecontracting.ae   /  Admin@1234");
console.log("════════════════════════════════════════════\n");
