import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    // 1. LIMPIEZA (Borrar todo lo viejo)
    await prisma.saleItem.deleteMany({})
    await prisma.sale.deleteMany({})
    await prisma.product.deleteMany({})
    await prisma.user.deleteMany({})

    // 2. CREAR USUARIOS (Uno por uno para evitar errores)
    await prisma.user.create({
      data: { username: 'admin', password: 'admin', role: 'ADMIN' }
    })
    
    await prisma.user.create({
      data: { username: 'cajero', password: '1234', role: 'CAJERO' }
    })

    // 3. CREAR ROPA (Lista de productos)
    const inventario = [
        { name: 'Camiseta Oversize "Heavy" - Negra', description: 'Algodón 240g Premium', price: 1200, cost: 600, stock: 50, sku: 'TSH-BLK-001', category: 'Tops' },
        { name: 'Camiseta Oversize "Heavy" - Blanca', description: 'Algodón 240g Premium', price: 1200, cost: 600, stock: 45, sku: 'TSH-WHT-002', category: 'Tops' },
        { name: 'Jeans Baggy Y2K - Blue Wash', description: 'Corte ancho clásico 2000s', price: 2800, cost: 1400, stock: 20, sku: 'JNS-BLU-001', category: 'Bottoms' },
        { name: 'Jeans Carpenter - Negro', description: 'Bolsillos laterales cargo', price: 3100, cost: 1500, stock: 15, sku: 'JNS-BLK-002', category: 'Bottoms' },
        { name: 'Hoodie Graphic "No Signal"', description: 'Estampado en espalda', price: 3500, cost: 1800, stock: 10, sku: 'HOD-GRY-001', category: 'Tops' },
        { name: 'Gorra Trucker - Needyshop', description: 'Malla trasera negra', price: 900, cost: 300, stock: 30, sku: 'ACC-CAP-001', category: 'Accesorios' },
        { name: 'Sneakers Chunky "Cloud"', description: 'Suela plataforma alta', price: 4500, cost: 2200, stock: 8, sku: 'SHS-WHT-001', category: 'Calzado' },
        { name: 'Calcetines Pack x3', description: 'Blancos deportivos logo', price: 600, cost: 150, stock: 100, sku: 'ACC-SCK-001', category: 'Accesorios' },
        { name: 'Cinturón Industrial', description: 'Hebilla metálica seguridad', price: 800, cost: 200, stock: 25, sku: 'ACC-BLT-001', category: 'Accesorios' },
        { name: 'Crop Top Básico - Rosa', description: 'Estilo Baby Tee', price: 850, cost: 300, stock: 12, sku: 'TOP-PNK-001', category: 'Tops' },
    ]

    // Insertamos la ropa una por una (Bucle seguro)
    for (const prenda of inventario) {
        await prisma.product.create({ data: prenda })
    }

    return NextResponse.json({ message: '✅ ¡TIENDA LLENA! Base de datos reiniciada con éxito.' })
  } catch (error) {
    return NextResponse.json({ error: 'Error grave', details: String(error) }, { status: 500 })
  }
}