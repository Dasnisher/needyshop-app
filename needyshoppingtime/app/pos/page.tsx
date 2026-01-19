// @ts-nocheck
"use client"

import { useState, useEffect } from "react"
import { getProducts, crearVenta, logoutAction } from "../actions"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Trash2, CreditCard, Banknote, LogOut, Printer, CheckCircle2, Loader2, ArrowLeft } from "lucide-react"

export default function POSPage() {
  const [productos, setProductos] = useState([])
  const [filtrados, setFiltrados] = useState([])
  const [carrito, setCarrito] = useState([])
  const [busqueda, setBusqueda] = useState("")
  const [cargando, setCargando] = useState(false)
  const [ticket, setTicket] = useState(null)

  const cargarInventario = () => {
    getProducts().then((data) => {
      setProductos(data)
      setFiltrados(data)
    })
  }

  useEffect(() => {
    cargarInventario()
  }, [])

  const handleSearch = (e) => {
    const texto = e.target.value.toLowerCase()
    setBusqueda(texto)
    const resultados = productos.filter(p => 
      p.name.toLowerCase().includes(texto) || 
      p.sku.toLowerCase().includes(texto)
    )
    setFiltrados(resultados)
  }

  const agregar = (prod) => {
    setCarrito([...carrito, prod])
    setBusqueda("")
    setFiltrados(productos)
  }

  const eliminar = (index) => {
    const nuevo = [...carrito]
    nuevo.splice(index, 1)
    setCarrito(nuevo)
  }

  const total = carrito.reduce((sum, item) => sum + Number(item.price), 0)

  const cobrar = async (metodo) => {
    if (carrito.length === 0) return
    setCargando(true)
    const resultado = await crearVenta(carrito, total, metodo)

    if (resultado.success) {
      setTicket({
        items: [...carrito],
        total: total,
        metodo: metodo,
        fecha: new Date().toLocaleString(),
        id: Math.floor(Math.random() * 100000)
      })
      setCarrito([])
      cargarInventario()
    } else {
      alert("❌ Error: " + resultado.message)
    }
    setCargando(false)
  }

  return (
    <div className="flex h-screen bg-zinc-100 overflow-hidden relative">
      
      {/* --- MODAL TICKET --- */}
      {ticket && (
        <div className="absolute inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-lg shadow-2xl overflow-hidden">
            <div className="bg-green-600 p-4 text-center text-white">
                <CheckCircle2 className="h-12 w-12 mx-auto mb-2" />
                <h2 className="text-xl font-bold">¡Venta Exitosa!</h2>
            </div>
            <div className="p-6 bg-zinc-50 text-sm font-mono border-b border-dashed border-zinc-300">
                <div className="text-center mb-4">
                    <p className="font-bold text-lg">NEEDYSHOP</p>
                    <p className="text-zinc-500">Ticket #{ticket.id}</p>
                </div>
                <div className="space-y-2 mb-4">
                    {ticket.items.map((item, i) => (
                        <div key={i} className="flex justify-between">
                            <span>1x {item.name}</span>
                            <span>${Number(item.price).toLocaleString()}</span>
                        </div>
                    ))}
                </div>
                <div className="border-t border-zinc-900 pt-2 flex justify-between font-bold text-lg">
                    <span>TOTAL</span>
                    <span>${ticket.total.toLocaleString()}</span>
                </div>
            </div>
            <div className="p-4 grid grid-cols-2 gap-3 bg-white">
                <Button variant="outline" onClick={() => window.print()} className="h-12">
                    <Printer className="mr-2 h-4 w-4"/> Imprimir
                </Button>
                <Button className="h-12 bg-black hover:bg-zinc-800" onClick={() => setTicket(null)}>
                    Nueva Venta
                </Button>
            </div>
          </div>
        </div>
      )}

      {/* --- IZQUIERDA: CATÁLOGO --- */}
      <div className="flex-1 flex flex-col p-4 gap-4 overflow-hidden">
        
        {/* BARRA SUPERIOR CON BOTÓN DE SALIDA */}
        <div className="flex gap-3 bg-white p-3 rounded-lg shadow-sm items-center">
            {/* AQUÍ ESTÁ EL BOTÓN DE SALIDA/PONCHE */}
            <form action={logoutAction}>
                <Button variant="destructive" className="bg-red-600 hover:bg-red-700 text-white font-bold">
                    <LogOut className="mr-2 h-4 w-4"/> MARCAR SALIDA
                </Button>
            </form>

            <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
                <Input 
                    placeholder="Buscar producto o escanear código..." 
                    className="pl-10 text-lg h-10 border-zinc-300" 
                    value={busqueda}
                    onChange={handleSearch}
                    autoFocus
                />
            </div>
        </div>

        {/* GRID DE PRODUCTOS */}
        <div className="flex-1 overflow-y-auto grid grid-cols-3 lg:grid-cols-4 gap-4 content-start pb-20">
          {filtrados.map((prod) => (
              <Card 
                key={prod.id} 
                className="cursor-pointer hover:shadow-lg hover:border-black transition-all border shadow-sm group" 
                onClick={() => agregar(prod)}
              >
                <CardContent className="p-4 flex flex-col h-full justify-between">
                  <div>
                    <h3 className="font-bold text-sm leading-tight mb-1 group-hover:text-blue-600">{prod.name}</h3>
                    <p className="text-xs text-zinc-500 mb-2 font-mono">{prod.sku}</p>
                  </div>
                  <div className="flex justify-between items-end mt-2">
                      <span className={`text-[10px] px-2 py-1 rounded font-bold ${prod.stock < 5 ? "bg-red-100 text-red-600" : "bg-zinc-100 text-zinc-600"}`}>
                        Stock: {prod.stock}
                      </span>
                      <span className="font-bold text-lg text-green-700">${Number(prod.price).toLocaleString()}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      </div>

      {/* --- DERECHA: TICKET --- */}
      <div className="w-96 bg-white border-l shadow-2xl flex flex-col z-10">
        <div className="p-6 bg-black text-white shadow-md">
          <h2 className="font-bold text-xl tracking-tight flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
            CAJA ABIERTA
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-zinc-50">
          {carrito.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-zinc-400 opacity-50 space-y-2">
                <Search className="h-12 w-12" />
                <p>Escanea un producto</p>
            </div>
          )}
          {carrito.map((item, i) => (
              <div key={i} className="flex justify-between items-center bg-white p-3 rounded shadow-sm border border-zinc-200">
                <div className="overflow-hidden">
                  <p className="font-medium text-sm truncate">{item.name}</p>
                  <p className="text-xs text-green-600 font-bold">${Number(item.price).toLocaleString()}</p>
                </div>
                <Button variant="ghost" size="icon" className="text-red-400 hover:bg-red-50 hover:text-red-600" onClick={() => eliminar(i)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
        </div>

        <div className="p-6 bg-white border-t space-y-4 shadow-[0_-5px_15px_-5px_rgba(0,0,0,0.1)]">
          <div className="flex justify-between text-3xl font-black text-zinc-900">
                <span>TOTAL</span>
                <span>${total.toLocaleString()}</span>
          </div>
          <div className="grid grid-cols-2 gap-3 pt-2">
            <Button className="h-14 text-lg bg-green-600 hover:bg-green-700 shadow font-bold" onClick={() => cobrar("EFECTIVO")} disabled={cargando || carrito.length === 0}>
                {cargando ? <Loader2 className="animate-spin" /> : <Banknote className="mr-2 h-6 w-6"/>} EFECTIVO
            </Button>
            <Button className="h-14 text-lg bg-blue-600 hover:bg-blue-700 shadow font-bold" onClick={() => cobrar("TARJETA")} disabled={cargando || carrito.length === 0}>
                {cargando ? <Loader2 className="animate-spin" /> : <CreditCard className="mr-2 h-6 w-6"/>} TARJETA
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}