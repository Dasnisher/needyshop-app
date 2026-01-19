// @ts-nocheck
import { PrismaClient } from "@prisma/client"
import { eliminarProducto } from "@/app/actions"
import { CreateProductModal } from "@/components/CreateProductModal"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LayoutDashboard, Package, LogOut, Users, DollarSign, AlertTriangle, ShoppingBag, Trash2, Clock } from "lucide-react"
import Link from "next/link"

const prisma = new PrismaClient()

export default async function AdminDashboard() {
  const productos = await prisma.product.findMany({ orderBy: { name: 'asc' } })
  const ventas = await prisma.sale.findMany()

  const totalDinero = ventas.reduce((sum, v) => sum + Number(v.total), 0)
  const productosBajoStock = productos.filter(p => p.stock < 5).length

  return (
    <div className="flex min-h-screen w-full bg-zinc-100">
      
      {/* BARRA LATERAL (SIDEBAR) FIJA */}
      <aside className="w-64 bg-black text-white flex-shrink-0 flex flex-col h-screen sticky top-0">
        <div className="p-6 border-b border-zinc-800">
          <h2 className="text-2xl font-black tracking-tight text-white">NEEDYSHOP</h2>
          <p className="text-xs text-zinc-500 mt-1">Panel de Control</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-3">
          {/* BOTONES DEL MENÚ */}
          <div className="bg-zinc-900 text-white flex items-center p-3 rounded-md cursor-default">
            <Package className="mr-3 h-5 w-5" />
            <span className="font-bold">Inventario</span>
          </div>

          <Link href="/admin/sales" className="flex items-center p-3 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-md transition-all">
             <LayoutDashboard className="mr-3 h-5 w-5" />
             <span>Reporte Ventas</span>
          </Link>

          <Link href="/admin/users" className="flex items-center p-3 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-md transition-all">
             <Users className="mr-3 h-5 w-5" />
             <span>Empleados</span>
          </Link>

          {/* BOTÓN ASISTENCIA DESTACADO */}
          <Link href="/admin/attendance" className="flex items-center p-3 text-yellow-400 hover:text-yellow-300 hover:bg-yellow-900/20 rounded-md transition-all border border-yellow-900/50">
             <Clock className="mr-3 h-5 w-5" />
             <span className="font-bold">Ver Asistencia</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-zinc-800">
          <Link href="/">
            <Button variant="destructive" className="w-full justify-start bg-red-900/50 text-red-200 hover:bg-red-900 hover:text-white">
                <LogOut className="mr-3 h-5 w-5" /> Cerrar Sesión
            </Button>
          </Link>
        </div>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-16 bg-white border-b flex items-center justify-between px-8 flex-shrink-0">
          <h1 className="text-xl font-bold">Gestión de Inventario</h1>
          <div className="bg-black text-white px-4 py-1 rounded-full text-xs font-bold">
            MODO ADMINISTRADOR
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 space-y-6">
          
          {/* TARJETAS DE INFORMACIÓN */}
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-zinc-500">Dinero Total</CardTitle>
                <DollarSign className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${totalDinero.toLocaleString()}</div>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-zinc-500">Poco Stock</CardTitle>
                <AlertTriangle className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{productosBajoStock} productos</div>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-zinc-500">Total Items</CardTitle>
                <ShoppingBag className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{productos.length} productos</div>
              </CardContent>
            </Card>
          </div>

          {/* TABLA DE PRODUCTOS */}
          <Card className="shadow-md border-0">
            <CardHeader className="flex flex-row items-center justify-between bg-zinc-50 border-b px-6 py-4">
              <div>
                <CardTitle>Productos en Tienda</CardTitle>
                <p className="text-sm text-zinc-500">Lista completa del inventario.</p>
              </div>
              <CreateProductModal />
            </CardHeader>
            <CardContent className="p-0">
              <div className="relative w-full overflow-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-zinc-100 text-zinc-600 font-semibold uppercase text-xs">
                    <tr>
                      <th className="p-4 pl-6">Nombre</th>
                      <th className="p-4">SKU</th>
                      <th className="p-4">Precio</th>
                      <th className="p-4">Stock</th>
                      <th className="p-4 text-right pr-6">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                    {productos.map((item) => (
                      <tr key={item.id} className="hover:bg-zinc-50 transition-colors">
                        <td className="p-4 pl-6 font-medium text-zinc-900">{item.name}</td>
                        <td className="p-4 text-zinc-500 font-mono">{item.sku}</td>
                        <td className="p-4 font-bold text-green-700">${Number(item.price).toLocaleString()}</td>
                        <td className="p-4">
                          <Badge variant="outline" className={item.stock < 5 ? "bg-red-50 text-red-700 border-red-200" : "bg-green-50 text-green-700 border-green-200"}>
                            {item.stock} uds.
                          </Badge>
                        </td>
                        <td className="p-4 pr-6 text-right">
                          <form action={eliminarProducto}>
                            <input type="hidden" name="id" value={item.id} />
                            <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-600 hover:bg-red-50">
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Borrar</span>
                            </Button>
                          </form>
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