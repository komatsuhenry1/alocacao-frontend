"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
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

const API_URL = "http://localhost:5103/api/v1/Veiculo";

export default function VeiculoView() {
  const [veiculo, setVeiculo] = useState<Veiculo | null>(null);
  const router = useRouter();
  const params = useParams();
  const { placa } = params;

  useEffect(() => {
    if (placa) {
      fetch(`${API_URL}/buscar/${placa}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.status) {
            setVeiculo(data.dados);
            if (data.mensagem) toast.success(data.mensagem);
          } else {
            toast.error(data.mensagem || "Erro ao buscar detalhes");
          }
        })
        .catch((err) => console.error(err));
    }
  }, [placa]);

  if (!veiculo) return <div className="p-8 text-center">Carregando...</div>;

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <Button variant="ghost" className="mb-4" onClick={() => router.push("/veiculo")}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Detalhes do Veículo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div><span className="font-semibold text-gray-500">Placa:</span><p className="text-lg">{veiculo.placa}</p></div>
          <div><span className="font-semibold text-gray-500">Modelo:</span><p className="text-lg">{veiculo.modelo}</p></div>
          <div><span className="font-semibold text-gray-500">Marca:</span><p className="text-lg">{veiculo.marca}</p></div>
          <div><span className="font-semibold text-gray-500">Ano:</span><p className="text-lg">{veiculo.ano}</p></div>
          <div><span className="font-semibold text-gray-500">Cor:</span><p className="text-lg">{veiculo.cor}</p></div>
          <div><span className="font-semibold text-gray-500">ID da Categoria:</span><p className="text-lg">{veiculo.categoriaId}</p></div>
          <div><span className="font-semibold text-gray-500">Status:</span><p className="text-lg">{veiculo.status}</p></div>
        </CardContent>
      </Card>
    </div>
  );
}
