"use client"

import { useState } from "react"
import { crearUsuario } from "@/app/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { UserPlus, Loader2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export function CreateUserModal() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    // Llamamos a la acción del servidor
    await crearUsuario(formData)
    setLoading(false)
    setOpen(false)
    // Opcional: alert("Usuario creado")
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          <UserPlus className="mr-2 h-4 w-4" /> Nuevo Empleado
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle>Registrar Nuevo Empleado</DialogTitle>
        </DialogHeader>
        
        {/* El formulario envía los datos automáticamente */}
        <form action={handleSubmit} className="grid gap-4 py-4">
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Usuario
            </Label>
            <Input
              id="username"
              name="username"
              placeholder="Ej: cajero1"
              className="col-span-3"
              required
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="password" className="text-right">
              Clave
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="****"
              className="col-span-3"
              required
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="role" className="text-right">
              Rol
            </Label>
            <select 
              name="role" 
              className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              required
            >
                <option value="CAJERO">Cajero (Ventas)</option>
                <option value="ADMIN">Administrador (Total)</option>
            </select>
          </div>

          <Button type="submit" disabled={loading} className="bg-black text-white hover:bg-zinc-800 w-full mt-4">
            {loading ? <Loader2 className="animate-spin mr-2"/> : "Guardar Usuario"}
          </Button>
          
        </form>
      </DialogContent>
    </Dialog>
  )
}