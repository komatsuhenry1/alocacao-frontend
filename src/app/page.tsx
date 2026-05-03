"use client"
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
// import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";

export default function Cadastro() {
  const router = useRouter();

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   // Aqui você pode adicionar a lógica de cadastro
  //   router.push("/login");
  // };

  return (
    <main className="min-h-screen bg-white flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="border border-neutral-200 rounded-lg p-8 shadow-sm">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold text-neutral-900">Cadastro</h1>
            <p className="text-neutral-500 text-sm mt-2">Crie sua conta para começar</p>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); router.push("/login"); }} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="nome" className="text-sm font-medium text-neutral-700">
                Nome
              </label>
              <Input
                id="nome"
                name="nome"
                type="text"
                placeholder="João Silva"
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="cpf" className="text-sm font-medium text-neutral-700">
                CPF
              </label>
              <Input
                id="cpf"
                name="cpf"
                type="text"
                placeholder="000.000.000-00"
                className="w-full"
              />
            </div>

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

            <div className="space-y-2">
              <label htmlFor="dataDeNascimento" className="text-sm font-medium text-neutral-700">
                Data de Nascimento
              </label>
              <Input
                id="dataDeNascimento"
                name="dataDeNascimento"
                type="date"
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="telefone" className="text-sm font-medium text-neutral-700">
                Telefone
              </label>
              <Input
                id="telefone"
                name="telefone"
                type="tel"
                placeholder="(11) 99999-9999"
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="endereco" className="text-sm font-medium text-neutral-700">
                Endereço
              </label>
              <Input
                id="endereco"
                name="endereco"
                type="text"
                placeholder="Rua A, 123"
                className="w-full"
              />
            </div>

            {/* <div className="flex items-center gap-2">
              <Checkbox id="ativo" name="ativo" defaultChecked />
              <label htmlFor="ativo" className="text-sm text-neutral-700">
                Conta ativa
              </label>
            </div> */}

            <Button
              type="submit"
              className="w-full bg-neutral-900 hover:bg-neutral-800 text-white"
            >
              Cadastrar
            </Button>
          </form>
        </div>
      </div>
    </main>
  );
}
