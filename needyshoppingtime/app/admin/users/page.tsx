// @ts-nocheck
import { PrismaClient } from "@prisma/client"
import { eliminarUsuario } from "@/app/actions"
import { CreateUserModal } from "@/components/CreateUserModal"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LayoutDashboard, Package, LogOut, ArrowLeft, Users, Trash2 } from "lucide-react"
import Link from "next/link"

const prisma = new PrismaClient()

export default async function UsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { username: 'asc' }
  })

  return (
    <div className="flex h-screen bg-zinc-100">
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
          <Link href="/admin/sales">
            <Button variant="ghost" className="w-full justify-start text-zinc-400 hover:text-white">
                <LayoutDashboard className="mr-3 h-5 w-5" /> Reporte Ventas
            </Button>
          </Link>
          <Button variant="secondary" className="w-full justify-start bg-zinc-800 text-white">
             <Users className="mr-3 h-5 w-5" /> Empleados
          </Button>
        </nav>
        <div className="p-4 border-t border-zinc-800">
          <Link href="/">
            <Button variant="ghost" className="w-full justify-start text-red-400">
                <LogOut className="mr-3 h-5 w-5" /> Cerrar Sesión
            </Button>
          </Link>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="md:hidden">
                <ArrowLeft className="h-6 w-6"/>
            </Link>
            <h1 className="text-xl font-bold">Gestión de Personal</h1>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-4 border-b">
              <div>
                <CardTitle>Usuarios ({users.length})</CardTitle>
                <p className="text-sm text-zinc-500">Administra quién tiene acceso.</p>
              </div>
              <CreateUserModal />
            </CardHeader>
            <CardContent className="p-0">
              <table className="w-full text-sm text-left">
                <thead className="bg-zinc-100 text-zinc-500 font-medium">
                  <tr>
                    <th className="p-4">Usuario</th>
                    <th className="p-4">Rol</th>
                    <th className="p-4">Contraseña</th>
                    <th className="p-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-zinc-50">
                      <td className="p-4 font-bold">{user.username}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${user.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                            {user.role}
                        </span>
                      </td>
                      <td className="p-4 text-zinc-400 font-mono">••••••</td>
                      <td className="p-4 text-right">
                        {/* FORMULARIO ANTIBALAS CON INPUT OCULTO */}
                        <form action={eliminarUsuario}>
                            <input type="hidden" name="id" value={user.id} />
                            <Button variant="ghost" size="icon" className="text-red-400 hover:bg-red-50 hover:text-red-600">
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </form>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}