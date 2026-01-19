// @ts-nocheck
import { PrismaClient } from "@prisma/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

const prisma = new PrismaClient()

export default async function AttendancePage() {
  const registros = await prisma.attendance.findMany({
    orderBy: { checkIn: 'desc' },
    include: { user: true }
  })

  return (
    <div className="min-h-screen bg-zinc-100 p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* CABECERA CON BOTÓN ATRÁS */}
        <div className="flex items-center gap-4">
            <Link href="/admin">
                <div className="bg-white p-2 rounded-full shadow hover:bg-zinc-50 cursor-pointer transition-transform hover:scale-105">
                    <ArrowLeft className="h-6 w-6 text-black"/>
                </div>
            </Link>
            <div>
                <h1 className="text-3xl font-black tracking-tight">Registro de Asistencia</h1>
                <p className="text-zinc-500">Control de entradas y salidas del personal.</p>
            </div>
        </div>

        {/* TABLA PRINCIPAL */}
        <Card className="shadow-lg border-0">
            <CardHeader className="bg-black text-white rounded-t-lg">
                <CardTitle>Bitácora de Ponches</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <table className="w-full text-left">
                    <thead className="bg-zinc-50 text-zinc-500 font-bold text-xs uppercase border-b">
                        <tr>
                            <th className="p-5">Empleado</th>
                            <th className="p-5">Fecha</th>
                            <th className="p-5">Hora Entrada</th>
                            <th className="p-5">Hora Salida</th>
                            <th className="p-5 text-center">Estado Actual</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100 text-sm">
                        {registros.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="p-10 text-center text-zinc-400">
                                    No hay registros de asistencia todavía.
                                </td>
                            </tr>
                        ) : (
                            registros.map((reg) => (
                                <tr key={reg.id} className="hover:bg-zinc-50">
                                    <td className="p-5 font-bold text-lg">{reg.user.username}</td>
                                    <td className="p-5 text-zinc-500">
                                        {new Date(reg.checkIn).toLocaleDateString()}
                                    </td>
                                    <td className="p-5 text-green-700 font-mono font-bold text-base">
                                        {new Date(reg.checkIn).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                    </td>
                                    <td className="p-5 text-red-700 font-mono font-bold text-base">
                                        {reg.checkOut 
                                            ? new Date(reg.checkOut).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) 
                                            : <span className="text-zinc-300">--:--</span>
                                        }
                                    </td>
                                    <td className="p-5 text-center">
                                        {reg.checkOut ? (
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-zinc-100 text-zinc-800">
                                                Finalizado
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 animate-pulse border border-green-200">
                                                <span className="w-2 h-2 mr-2 bg-green-600 rounded-full"></span>
                                                Activo
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </CardContent>
        </Card>
      </div>
    </div>
  )
}