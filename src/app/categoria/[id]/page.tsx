"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

interface Categoria {
  id: number;
  nome: string;
  descricao: string;
  valorDiaria: number;
  ativo: boolean;
}

const API_URL = "http://localhost:5103/api/v1/Categoria";

export default function CategoriaView() {
  const [categoria, setCategoria] = useState<Categoria | null>(null);
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  useEffect(() => {
    if (id) {
      fetch(`${API_URL}/buscar/${id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.status) {
            setCategoria(data.dados);
            if (data.mensagem) toast.success(data.mensagem);
          } else {
            toast.error(data.mensagem || "Erro ao buscar detalhes");
          }
        })
        .catch((err) => console.error(err));
    }
  }, [id]);

  if (!categoria) {
    return <div className="p-8 text-center">Carregando...</div>;
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <Button variant="ghost" className="mb-4" onClick={() => router.push("/categoria")}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Detalhes da Categoria</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <span className="font-semibold text-gray-500">ID:</span>
            <p className="text-lg">{categoria.id}</p>
          </div>
          <div>
            <span className="font-semibold text-gray-500">Nome:</span>
            <p className="text-lg">{categoria.nome}</p>
          </div>
          <div>
            <span className="font-semibold text-gray-500">Descrição:</span>
            <p className="text-lg">{categoria.descricao}</p>
          </div>
          <div>
            <span className="font-semibold text-gray-500">Valor da Diária:</span>
            <p className="text-lg">
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(categoria.valorDiaria)}
            </p>
          </div>
          <div>
            <span className="font-semibold text-gray-500">Status:</span>
            <p className="text-lg">{categoria.ativo ? "Ativo" : "Inativo"}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
