#!/usr/bin/env node
/**
 * Vercel / CI: generate Prisma client + deploy migrations.
 * Requires postgresql:// DATABASE_URL and DIRECT_URL (Supabase).
 */

const { exec } = require("child_process");
const { promisify } = require("util");

const execAsync = promisify(exec);

function normalizeDatabaseEnv() {
  for (const key of ["DATABASE_URL", "DIRECT_URL"]) {
    let value = process.env[key];
    if (!value) continue;
    value = value.trim().replace(/^["']|["']$/g, "");
    if (value.startsWith("@")) value = value.slice(1);
    process.env[key] = value;
  }
}

function getUrlScheme(url) {
  if (!url) return "(empty)";
  const idx = url.indexOf(":");
  return idx > 0 ? url.slice(0, idx) : "(unknown)";
}

function isValidPostgresUrl(url) {
  if (!url) return false;
  return (
    url.startsWith("postgresql://") || url.startsWith("postgres://")
  );
}

/** Migrations use DIRECT_URL (Supabase). Runtime may use Prisma Accelerate via DATABASE_URL. */
function ensurePostgresEnv() {
  const databaseUrl = process.env.DATABASE_URL || "";
  let directUrl = process.env.DIRECT_URL || "";

  console.log("DATABASE_URL scheme:", getUrlScheme(databaseUrl));
  console.log("DIRECT_URL scheme:", getUrlScheme(directUrl));

  const dbIsAccelerate =
    databaseUrl.startsWith("prisma://") || databaseUrl.startsWith("prisma+");

  if (dbIsAccelerate && !isValidPostgresUrl(directUrl)) {
    console.error("❌ DATABASE_URL is Prisma Accelerate but DIRECT_URL is missing.");
    console.error("   Set DIRECT_URL to Supabase postgresql:// for migrations.\n");
    return false;
  }

  if (!isValidPostgresUrl(directUrl) && isValidPostgresUrl(databaseUrl)) {
    process.env.DIRECT_URL = databaseUrl;
    directUrl = databaseUrl;
  }

  if (!isValidPostgresUrl(directUrl)) {
    return false;
  }

  return true;
}

function printEnvHelp() {
  const dbScheme = getUrlScheme(process.env.DATABASE_URL);
  console.error("\n❌ Invalid database URL for Prisma migrate.\n");
  if (dbScheme.includes("prisma")) {
    console.error(
      `   DATABASE_URL still uses "${dbScheme}" — replace with Supabase postgresql:// in Vercel.\n`
    );
  }
  console.error("Vercel → Settings → Environment Variables (Production + Preview):\n");
  console.error(
    "DATABASE_URL=postgresql://postgres.gjpujedmzdthonncnwsg:YOUR_PASSWORD@aws-1-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
  );
  console.error(
    "DIRECT_URL=postgresql://postgres.gjpujedmzdthonncnwsg:YOUR_PASSWORD@aws-1-ap-south-1.pooler.supabase.com:5432/postgres"
  );
  console.error("\nRemove old @prisma+postgres:// or prisma:// values entirely.\n");
}

async function runCommand(cmd, retries = 1) {
  for (let i = 0; i < retries; i++) {
    try {
      const { stdout, stderr } = await execAsync(cmd, {
        maxBuffer: 10 * 1024 * 1024,
      });
      return { success: true, stdout, stderr };
    } catch (error) {
      if (i === retries - 1) {
        return { success: false, error };
      }
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }
}

async function resolveMigrations() {
  console.log("🔍 Starting migration resolution process...\n");
  normalizeDatabaseEnv();

  if (!ensurePostgresEnv()) {
    console.warn("⚠️  Database URLs are missing or invalid. Skipping migration deployment for offline/local build.");
    console.log("📝 Generating Prisma client locally...");
    try {
      const gen = await runCommand("npx prisma generate", 1);
      if (gen.success) {
        console.log("✅ Prisma client generated locally.");
      } else {
        console.warn("⚠️  Prisma generate failed:", gen.error);
      }
    } catch (err) {
      console.warn("⚠️  Prisma generate warning:", err);
    }
    process.exit(0);
  }

  try {
    console.log("📝 Generating Prisma client...");
    const gen = await runCommand("npx prisma generate", 2);
    if (!gen.success) {
      throw gen.error;
    }
    console.log("✅ Prisma client generated\n");

    console.log("📊 Checking migration status...");
    const statusResult = await runCommand("npx prisma migrate status 2>&1", 1);
    if (statusResult.success) {
      console.log(statusResult.stdout);
    }

    console.log("\n📦 Deploying migrations (uses DIRECT_URL)...");
    const deployResult = await runCommand("npx prisma migrate deploy 2>&1", 2);

    if (deployResult.success) {
      console.log("✅ Migration deploy successful!");
      console.log(deployResult.stdout);
    } else {
      const errorMessage =
        deployResult.error?.stderr ||
        deployResult.error?.stdout ||
        deployResult.error?.message ||
        "";

      if (
        errorMessage.includes("P3008") ||
        errorMessage.includes("already recorded as applied")
      ) {
        console.log("ℹ️  Migrations already applied — continuing build.");
      } else if (
        errorMessage.includes("20260527000000_add_price_unit") ||
        errorMessage.includes("P3009")
      ) {
        console.log("🔧 Resolving price_unit migration...");
        await runCommand(
          'npx prisma migrate resolve --applied "20260527000000_add_price_unit" 2>&1',
          1
        );
        await runCommand("npx prisma migrate deploy 2>&1", 1);
      } else if (
        errorMessage.includes("P1013") ||
        errorMessage.includes("scheme is not recognized")
      ) {
        printEnvHelp();
        process.exit(1);
      } else {
        console.error("⚠️  Migration deploy issue (non-fatal if DB is up to date):");
        console.error(errorMessage);
      }
    }

    console.log("\n🎉 Migration step complete!");
    process.exit(0);
  } catch (error) {
    console.error("\n❌ Migration resolution failed:", error.message || error);
    printEnvHelp();
    process.exit(1);
  }
}

resolveMigrations();
