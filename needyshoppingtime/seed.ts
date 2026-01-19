const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Creando usuarios...")

  // 1. Crear Admin
  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: { 
      username: 'admin', 
      password: '123', // <--- ESTA ES LA CLAVE
      role: 'ADMIN' 
    },
  })
  
  // 2. Crear Cajero
  const cajero = await prisma.user.upsert({
    where: { username: 'cajero' },
    update: {},
    create: { 
      username: 'cajero', 
      password: '123', 
      role: 'CAJERO' 
    },
  })

  console.log('✅ Usuarios creados: admin/123 y cajero/123')
}

main()
  .then(async () => { await prisma.$disconnect() })
  .catch(async (e) => { 
    console.error(e)
    await prisma.$disconnect() 
  })