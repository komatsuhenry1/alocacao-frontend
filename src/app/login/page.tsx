"use client"
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Login() {
  const router = useRouter();

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   // Aqui você pode adicionar a lógica de login
  //   router.push("/");
  // };

  return (
    <main className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="border border-neutral-200 rounded-lg p-8 shadow-sm">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold text-neutral-900">Login</h1>
            <p className="text-neutral-500 text-sm mt-2">Entre na sua conta</p>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); router.push("/alocacao"); }} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-neutral-700">
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="joao@email.com"
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="senha" className="text-sm font-medium text-neutral-700">
                Senha
              </label>
              <Input
                id="senha"
                name="senha"
                type="password"
                placeholder="••••••••"
                className="w-full"
              />
            </div>

            <div className="flex justify-end">
              <Link href="#" className="text-sm text-neutral-500 hover:text-neutral-900">
                Esqueceu a senha?
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full bg-neutral-900 hover:bg-neutral-800 text-white"
            >
              Entrar
            </Button>
          </form>
        </div>
      </div>
    </main>
  );
}
