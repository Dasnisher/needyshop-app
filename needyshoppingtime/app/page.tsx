"use client"

import { useFormState } from "react-dom" 
import { loginAction } from "./actions"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Store, User, KeyRound } from "lucide-react"

const initialState = {
  error: null as string | null,
}

export default function LoginPage() {
  // @ts-ignore
  const [state, formAction] = useFormState(loginAction, initialState)

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-100 p-4">
      <Card className="w-full max-w-md shadow-2xl border-0">
        <CardHeader className="space-y-1 text-center pb-8 pt-10">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-black rounded-full">
              <Store className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">NEEDYSHOP</CardTitle>
          <CardDescription className="text-zinc-500">
            Ingrese sus credenciales oficiales
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form action={formAction} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Usuario</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
                <Input name="username" placeholder="admin" className="pl-10 h-11" required />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
                <Input type="password" name="password" className="pl-10 h-11" required />
              </div>
            </div>

            {state?.error && (
              <div className="p-3 rounded bg-red-50 text-red-600 text-sm font-medium text-center border border-red-100">
                {state.error}
              </div>
            )}

            <Button type="submit" className="w-full h-11 bg-black hover:bg-zinc-800 text-base mt-2">
              Iniciar Sesión
            </Button>
          </form>
        </CardContent>
        
        <CardFooter className="flex justify-center border-t p-6 bg-zinc-50/50">
          <p className="text-xs text-zinc-400">
            Conectado a Base de Datos (SQLite)
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}