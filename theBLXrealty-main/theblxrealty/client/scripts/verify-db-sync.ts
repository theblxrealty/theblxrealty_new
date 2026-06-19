/**
 * Run: npx tsx scripts/verify-db-sync.ts
 * Checks which database Prisma connects to and whether priceUnit exists.
 */
import { prisma } from '../lib/prisma'

function maskUrl(url: string | undefined): string {
  if (!url) return '(not set)'
  try {
    const u = new URL(url.replace(/^prisma\+postgres:/, 'https:').replace(/^prisma:/, 'https:'))
    return `${u.protocol}//${u.hostname}${u.port ? ':' + u.port : ''}${u.pathname}`
  } catch {
    return url.slice(0, 30) + '...'
  }
}

async function main() {
  console.log('\n=== Prisma ↔ Database connection check ===\n')
  console.log('DATABASE_URL host:', maskUrl(process.env.DATABASE_URL))
  console.log('DIRECT_URL host:  ', maskUrl(process.env.DIRECT_URL))
  console.log(
    '\nNote: Prisma is NOT a separate database. It uses these URLs to talk to PostgreSQL (Supabase).\n' +
      'If Supabase Table Editor shows priceUnit but this script says NO, your .env URLs point to a different database.\n'
  )

  if (!process.env.DIRECT_URL) {
    console.log('⚠️  DIRECT_URL is not set. Migrations and Prisma Studio use DATABASE_URL only.')
    console.log('   Set DIRECT_URL to your Supabase direct URI (port 5432) from Supabase dashboard.\n')
  }

  try {
    const counts = await prisma.$queryRaw<{ total: bigint; active: bigint }[]>`
      SELECT
        COUNT(*)::bigint AS total,
        COUNT(*) FILTER (WHERE "isActive" = true)::bigint AS active
      FROM properties
    `
    console.log(
      `Properties in this database: ${counts[0]?.total ?? 0} total, ${counts[0]?.active ?? 0} active`
    )
    if (Number(counts[0]?.total ?? 0) === 0) {
      console.log(
        '⚠️  No properties in this database. Add them in admin or run: pnpm db:seed'
      )
    }

    const colCheck = await prisma.$queryRaw<
      { column_name: string; data_type: string }[]
    >`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = 'properties'
        AND column_name = 'priceUnit'
    `

    console.log('priceUnit column in connected DB:', colCheck.length > 0 ? 'YES ✅' : 'NO ❌')

    if (colCheck.length > 0) {
      console.log('  type:', colCheck[0].data_type)
    }

    const migrations = await prisma.$queryRaw<
      { migration_name: string; finished_at: Date | null }[]
    >`
      SELECT migration_name, finished_at
      FROM "_prisma_migrations"
      WHERE migration_name LIKE '%price_unit%'
      ORDER BY finished_at DESC
      LIMIT 5
    `

    console.log('\nPrisma migration history (price_unit):')
    if (migrations.length === 0) {
      console.log('  (no price_unit migration recorded — run: npx prisma migrate resolve --applied "20260527000000_add_price_unit")')
    } else {
      migrations.forEach((m) => {
        console.log(`  - ${m.migration_name} @ ${m.finished_at ?? 'pending'}`)
      })
    }

    try {
      const sample = await prisma.$queryRaw<
        { id: string; title: string; priceUnit: string | null }[]
      >`
        SELECT id, title, "priceUnit"
        FROM properties
        LIMIT 5
      `
      console.log('\nSample properties (id, title, priceUnit):')
      sample.forEach((r) =>
        console.log(`  - ${r.title?.slice(0, 40)} → priceUnit=${r.priceUnit ?? '(null)'}`)
      )
    } catch (e) {
      console.log('\nCould not SELECT priceUnit from properties:', (e as Error).message)
    }
  } finally {
    await prisma.$disconnect()
  }

  console.log('\n=== What to do ===')
  console.log('1. In Supabase → Settings → Database, copy the URI (direct, port 5432).')
  console.log('2. Set DIRECT_URL in Vercel + .env.local to that URI.')
  console.log('3. Set DATABASE_URL to the same Supabase DB (pooler 6543 or Prisma Accelerate linked to Supabase).')
  console.log('4. If column exists in Supabase but migration is missing, run:')
  console.log('   npx prisma migrate resolve --applied "20260527000000_add_price_unit"')
  console.log('')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
