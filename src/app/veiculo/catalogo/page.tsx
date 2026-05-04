"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { toast } from "sonner";

interface Veiculo {
  placa: string;
  modelo: string;
  marca: string;
  ano: number;
  cor: string;
  categoriaId: number;
  status: number;
}

const STATUS_LABEL: Record<number, { label: string; className: string }> = {
  1: { label: "Disponível", className: "bg-green-100 text-green-700" },
  2: { label: "Alugado", className: "bg-yellow-100 text-yellow-700" },
  3: { label: "Inativo", className: "bg-red-100 text-red-700" },
};

const TOTAL_IMAGES = 6;

function getImageIndex(placa: string): number {
  let hash = 0;
  for (let i = 0; i < placa.length; i++) {
    hash = (hash + placa.charCodeAt(i)) % TOTAL_IMAGES;
  }
  return hash + 1; // 1 to 6
}

const API_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/Veiculo`;

export default function VeiculoCatalogo() {
  const [veiculos, setVeiculos] = useState<Veiculo[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch(`${API_URL}/listar_todos`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status) {
          setVeiculos(data.dados);
        } else {
          toast.error(data.mensagem || "Erro ao buscar veículos");
        }
      })
      .catch(() => toast.error("Erro ao conectar com o servidor"))
      .finally(() => setLoading(false));
  }, []);

  const filtered = veiculos.filter(
    (v) =>
      v.modelo.toLowerCase().includes(search.toLowerCase()) ||
      v.marca.toLowerCase().includes(search.toLowerCase()) ||
      v.placa.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold">Catálogo de Veículos</h1>
          <p className="text-sm text-gray-500 mt-1">
            {veiculos.length} veículo{veiculos.length !== 1 ? "s" : ""} disponível{veiculos.length !== 1 ? "is" : ""}
          </p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar por modelo, marca ou placa..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-lg border bg-gray-100 animate-pulse h-72" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-lg">Nenhum veículo encontrado.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((veiculo) => {
            const imgIndex = getImageIndex(veiculo.placa);
            const status = STATUS_LABEL[veiculo.status] ?? { label: "Desconhecido", className: "bg-gray-100 text-gray-600" };
            return (
              <div
                key={veiculo.placa}
                onClick={() => router.push(`/veiculo/${veiculo.placa}`)}
                className="group border rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition-shadow bg-white"
              >
                {/* Imagem */}
                <div className="relative h-48 overflow-hidden bg-gray-100">
                  <img
                    src={`/veiculo${imgIndex}.jpg`}
                    alt={`${veiculo.marca} ${veiculo.modelo}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className={`absolute top-2 right-2 text-xs font-semibold px-2 py-0.5 rounded-full ${status.className}`}>
                    {status.label}
                  </span>
                </div>

                {/* Conteúdo */}
                <div className="p-4">
                  <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">{veiculo.marca}</p>
                  <h2 className="text-base font-semibold text-gray-900 mt-0.5">{veiculo.modelo}</h2>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-sm text-gray-500">{veiculo.ano} · {veiculo.cor}</span>
                    <span className="text-xs font-mono bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                      {veiculo.placa}
                    </span>
                  </div>
                  <Button
                    size="sm"
                    className="w-full mt-4"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/veiculo/${veiculo.placa}`);
                    }}
                  >
                    Ver detalhes
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
