// @ts-nocheck
import { PrismaClient } from "@prisma/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, Package, LogOut, ArrowLeft } from "lucide-react"
import Link from "next/link"

const prisma = new PrismaClient()

export default async function SalesReport() {
  
  // 1. BUSCAR VENTAS
  const ventas = await prisma.sale.findMany({
    orderBy: { date: 'desc' }, // Usamos 'date' que es lo que tiene tu BD
    include: {
      items: {
        include: { product: true }
      }
    }
  })

  // 2. CALCULAR TOTAL
  const totalVentas = ventas.reduce((sum, venta) => sum + Number(venta.total), 0)

  return (
    <div className="flex h-screen bg-zinc-100">
      
      {/* SIDEBAR */}
      <aside className="w-64 bg-black text-white flex flex-col hidden md:flex">
        <div className="p-6 border-b border-zinc-800">
          <h2 className="text-xl font-bold tracking-tight">NEEDYSHOP</h2>
          <p className="text-xs text-zinc-500">Panel Administrativo</p>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/admin">
            <Button variant="ghost" className="w-full justify-start text-zinc-400 hover:text-white">
                <Package className="mr-3 h-5 w-5" /> Inventario
            </Button>
          </Link>
          <Button variant="secondary" className="w-full justify-start bg-zinc-800 text-white">
            <LayoutDashboard className="mr-3 h-5 w-5" /> Reporte Ventas
          </Button>
          <Link href="/admin/users">
            <Button variant="ghost" className="w-full justify-start text-zinc-400 hover:text-white">
                <Package className="mr-3 h-5 w-5" /> Empleados
            </Button>
          </Link>
        </nav>
        <div className="p-4 border-t border-zinc-800">
          <Link href="/">
            <Button variant="ghost" className="w-full justify-start text-red-400">
                <LogOut className="mr-3 h-5 w-5" /> Cerrar Sesión
            </Button>
          </Link>
        </div>
      </aside>

      {/* CONTENIDO */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="md:hidden">
                <ArrowLeft className="h-6 w-6"/>
            </Link>
            <h1 className="text-xl font-bold">Historial de Ventas</h1>
          </div>
          <div className="bg-green-100 text-green-800 px-4 py-1 rounded-full font-bold text-sm border border-green-200">
            Total: ${totalVentas.toLocaleString()}
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6">
          <Card>
            <CardHeader className="border-b bg-zinc-50/50">
              <CardTitle>Transacciones Recientes ({ventas.length})</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="relative w-full overflow-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-zinc-100 text-zinc-500 font-medium border-b">
                    <tr>
                      <th className="p-4">ID / Fecha</th>
                      <th className="p-4">Productos</th>
                      <th className="p-4">Método</th>
                      <th className="p-4 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {ventas.map((venta) => (
                      <tr key={venta.id} className="hover:bg-zinc-50">
                        <td className="p-4">
                          <p className="font-mono text-xs text-zinc-500">#{venta.id.slice(0, 8)}</p>
                          <p className="text-zinc-600 font-medium mt-1">
                            {new Date(venta.date).toLocaleDateString()}
                          </p>
                          <p className="text-xs text-zinc-400">
                            {new Date(venta.date).toLocaleTimeString()}
                          </p>
                        </td>
                        <td className="p-4">
                          <div className="flex flex-col gap-1">
                            {venta.items.map((item, i) => (
                              <span key={i} className="text-xs font-medium">
                                {item.quantity}x {item.product ? item.product.name : 'Producto Borrado'}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded text-xs border font-medium ${
                            venta.paymentMethod === 'EFECTIVO' 
                              ? 'bg-green-50 text-green-700 border-green-200' 
                              : 'bg-blue-50 text-blue-700 border-blue-200'
                          }`}>
                            {venta.paymentMethod}
                          </span>
                        </td>
                        <td className="p-4 text-right font-bold text-base">
                          ${Number(venta.total).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}