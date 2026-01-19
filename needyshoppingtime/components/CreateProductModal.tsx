"use client"

import { useState } from "react"
import { crearProducto } from "@/app/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Loader2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export function CreateProductModal() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    // Llamamos al cerebro para guardar el producto
    await crearProducto(formData)
    setLoading(false)
    setOpen(false)
    // Opcional: una alerta o toast aquí
    // alert("Producto creado") 
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-black text-white hover:bg-zinc-800">
          <Plus className="mr-2 h-4 w-4" /> Nuevo Producto
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-white">
        <DialogHeader>
          <DialogTitle>Agregar Mercancía</DialogTitle>
        </DialogHeader>

        {/* El formulario envía los datos automáticamente con 'action' */}
        <form action={handleSubmit} className="grid gap-4 py-4">
          
          {/* Fila 1: Nombre y SKU */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre Producto</Label>
              <Input id="name" name="name" placeholder="Ej: Polo Oversize" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sku">Código (SKU)</Label>
              <Input id="sku" name="sku" placeholder="Ej: POL-001" required />
            </div>
          </div>

          {/* Fila 2: Categoría y Stock */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Categoría</Label>
              <select 
                name="category" 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                required
              >
                <option value="Ropa">Ropa</option>
                <option value="Calzado">Calzado</option>
                <option value="Accesorios">Accesorios</option>
                <option value="General">General</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="stock">Stock Inicial</Label>
              <Input id="stock" name="stock" type="number" placeholder="0" required />
            </div>
          </div>

          {/* Fila 3: Precios */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cost">Costo ($)</Label>
              <Input id="cost" name="cost" type="number" step="0.01" placeholder="0.00" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Precio Venta ($)</Label>
              <Input id="price" name="price" type="number" step="0.01" placeholder="0.00" required />
            </div>
          </div>

          <Button type="submit" disabled={loading} className="w-full mt-2 bg-black text-white">
            {loading ? <Loader2 className="animate-spin mr-2"/> : "Guardar en Inventario"}
          </Button>

        </form>
      </DialogContent>
    </Dialog>
  )
}