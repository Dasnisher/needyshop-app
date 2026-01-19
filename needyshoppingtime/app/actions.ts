// @ts-nocheck
"use server"

import { PrismaClient } from "@prisma/client"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { cookies } from "next/headers"

const prisma = new PrismaClient()

// 1. LOGIN + PONCHE DE ENTRADA AUTOMÁTICO
export async function loginAction(prevState: any, formData: FormData) {
  const username = formData.get("username") as string
  const password = formData.get("password") as string

  const user = await prisma.user.findUnique({
    where: { username }
  })

  if (!user || user.password !== password) {
    return { error: "Usuario o contraseña incorrectos" }
  }

  // --- LÓGICA DE ASISTENCIA (CHECK-IN) ---
  const hoy = new Date()
  const inicioDia = new Date(hoy.setHours(0,0,0,0))
  
  // Verificamos si ya entró hoy
  const poncheAbierto = await prisma.attendance.findFirst({
    where: {
      userId: user.id,
      checkIn: { gte: inicioDia },
      checkOut: null
    }
  })

  // Si no ha entrado hoy, registramos la entrada
  if (!poncheAbierto) {
    await prisma.attendance.create({
      data: { userId: user.id }
    })
  }

  // Guardamos cookie de sesión
  const cookieStore = await cookies()
  cookieStore.set("user_id", user.id.toString())

  if (user.role === "ADMIN") {
    redirect("/admin")
  } else {
    redirect("/pos")
  }
}

// 2. LOGOUT + PONCHE DE SALIDA
export async function logoutAction() {
  const cookieStore = await cookies()
  const userId = cookieStore.get("user_id")?.value

  if (userId) {
    // Buscamos su última entrada sin salida
    const ultimoPonche = await prisma.attendance.findFirst({
      where: { userId: parseInt(userId), checkOut: null },
      orderBy: { checkIn: 'desc' }
    })

    // Si existe, marcamos la hora de salida
    if (ultimoPonche) {
      await prisma.attendance.update({
        where: { id: ultimoPonche.id },
        data: { checkOut: new Date() }
      })
    }
  }

  // Borramos sesión y mandamos al login
  cookieStore.delete("user_id")
  redirect("/")
}

// 3. OBTENER PRODUCTOS
export async function getProducts() {
  const products = await prisma.product.findMany({
    orderBy: { name: 'asc' }
  })
  return products
}

// 4. CREAR PRODUCTO (BOLIVAR AGREGA INVENTARIO)
export async function crearProducto(formData: FormData) {
  const name = formData.get("name") as string
  const sku = formData.get("sku") as string
  const category = formData.get("category") as string
  const price = parseFloat(formData.get("price") as string)
  const cost = parseFloat(formData.get("cost") as string)
  const stock = parseInt(formData.get("stock") as string)

  await prisma.product.create({
    data: { name, sku, category, price, cost, stock }
  })
  revalidatePath('/admin')
  revalidatePath('/pos')
}

// 5. CREAR VENTA (DESCUENTA STOCK)
export async function crearVenta(items: any[], total: number, paymentMethod: string) {
  try {
    // Registrar la venta
    await prisma.sale.create({
      data: {
        total,
        paymentMethod,
        items: {
          create: items.map((item: any) => ({
            productId: item.id,
            quantity: 1,
            price: item.price
          }))
        }
      }
    })

    // Restar del inventario
    for (const item of items) {
      await prisma.product.update({
        where: { id: item.id },
        data: { stock: { decrement: 1 } }
      })
    }

    revalidatePath('/admin')
    revalidatePath('/pos')
    return { success: true }
  } catch (error) {
    return { success: false, message: "Error en venta" }
  }
}

// 6. CREAR USUARIO
export async function crearUsuario(formData: FormData) {
  const username = formData.get("username") as string
  const password = formData.get("password") as string
  const role = formData.get("role") as string

  await prisma.user.create({
    data: { username, password, role }
  })
  revalidatePath('/admin/users')
}

// 7. ELIMINAR USUARIO
export async function eliminarUsuario(formData: FormData) {
  const id = parseInt(formData.get('id') as string)
  await prisma.user.delete({ where: { id } })
  revalidatePath('/admin/users')
}

// 8. ELIMINAR PRODUCTO
export async function eliminarProducto(formData: FormData) {
  const id = parseInt(formData.get('id') as string)
  if (!id) return

  await prisma.saleItem.deleteMany({ where: { productId: id } })
  await prisma.product.delete({ where: { id } })

  revalidatePath('/admin')
  revalidatePath('/pos')
}