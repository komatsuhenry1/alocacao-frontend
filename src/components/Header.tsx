"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  // Não mostrar o header nas páginas de login, cadastro e tela inicial sem autenticação
  if (pathname === "/login" || pathname === "/cadastro" || pathname === "/") {
    return null;
  }

  return (
    <header className="bg-neutral-900 text-white shadow-md">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link href="/alocacao" className="text-lg font-bold tracking-tight hover:text-neutral-300">
            Alocação de Veículos
          </Link>
          
          <nav className="hidden md:flex space-x-6">
            <Link 
              href="/veiculo" 
              className={`hover:text-neutral-300 transition-colors ${pathname.startsWith("/veiculo") && pathname !== "/veiculo/catalogo" ? "font-semibold text-white" : "text-neutral-400"}`}
            >
              Veículos
            </Link>
            <Link 
              href="/veiculo/catalogo" 
              className={`hover:text-neutral-300 transition-colors ${pathname === "/veiculo/catalogo" ? "font-semibold text-white" : "text-neutral-400"}`}
            >
              Catálogo
            </Link>
            <Link 
              href="/alocacao" 
              className={`hover:text-neutral-300 transition-colors ${pathname.startsWith("/alocacao") ? "font-semibold text-white" : "text-neutral-400"}`}
            >
              Alocações
            </Link>
            <Link 
              href="/cliente" 
              className={`hover:text-neutral-300 transition-colors ${pathname.startsWith("/cliente") ? "font-semibold text-white" : "text-neutral-400"}`}
            >
              Clientes
            </Link>
            <Link 
              href="/categoria" 
              className={`hover:text-neutral-300 transition-colors ${pathname.startsWith("/categoria") ? "font-semibold text-white" : "text-neutral-400"}`}
            >
              Categorias
            </Link>
          </nav>
        </div>

        <div>
          <Link href="/login" className="text-sm font-medium text-neutral-400 hover:text-white transition-colors">
            Sair
          </Link>
        </div>
      </div>
    </header>
  );
}
