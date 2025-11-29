require('dotenv').config()
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient({ log: ['error'] })

async function main() {
  const now = new Date()
  const y = now.getFullYear()
  const m = now.getMonth()
  const periodStart = new Date(y, m, 1)
  const periodEnd = new Date(y, m + 1, 0)
  const isLastDay = now.getDate() === periodEnd.getDate()

  const force = process.argv.includes('--force')
  const dry = process.argv.includes('--dry')
  if (!isLastDay && !force) {
    console.log('skip: not last day of month')
    return
  }

  const users = await prisma.user.findMany({ select: { id: true } })
  let created = 0
  for (const u of users) {
    const existing = await prisma.invoice.findFirst({ where: { userId: u.id, periodStart, periodEnd } })
    if (existing) continue
    const companiesCount = await prisma.company.count({ where: { userId: u.id, isActive: true } })
    const amount = companiesCount * 20
    if (dry) {
      console.log(JSON.stringify({ userId: u.id, periodStart, periodEnd, activeCompanies: companiesCount, amount }))
      created++
      continue
    }
    await prisma.invoice.create({
      data: {
        userId: u.id,
        periodStart,
        periodEnd,
        activeCompanies: companiesCount,
        amount,
        status: 'PENDING',
      },
    })
    created++
  }
  console.log(`created: ${created}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

