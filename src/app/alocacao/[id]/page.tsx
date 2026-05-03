"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

interface Alocacao {
  id: number;
  clienteId: number;
  carroPlaca: string;
  dataRetirada: string;
  dataPrevDevolucao: string;
  valorTotal: number;
  status: number;
  criadoEm: string;
}

const API_URL = "http://localhost:5103/api/v1/Alocacao";

export default function AlocacaoView() {
  const [alocacao, setAlocacao] = useState<Alocacao | null>(null);
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  useEffect(() => {
    if (id) {
      fetch(`${API_URL}/buscar/${id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.status) {
            setAlocacao(data.dados);
            if (data.mensagem) toast.success(data.mensagem);
          } else {
            toast.error(data.mensagem || "Erro ao buscar detalhes");
          }
        })
        .catch((err) => console.error(err));
    }
  }, [id]);

  if (!alocacao) return <div className="p-8 text-center">Carregando...</div>;

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <Button variant="ghost" className="mb-4" onClick={() => router.push("/alocacao")}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Detalhes da Alocação</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div><span className="font-semibold text-gray-500">ID:</span><p className="text-lg">{alocacao.id}</p></div>
          <div><span className="font-semibold text-gray-500">Cliente ID:</span><p className="text-lg">{alocacao.clienteId}</p></div>
          <div><span className="font-semibold text-gray-500">Placa do Veículo:</span><p className="text-lg">{alocacao.carroPlaca}</p></div>
          <div>
            <span className="font-semibold text-gray-500">Data de Retirada:</span>
            <p className="text-lg">{new Date(alocacao.dataRetirada).toLocaleString("pt-BR")}</p>
          </div>
          <div>
            <span className="font-semibold text-gray-500">Data Prevista de Devolução:</span>
            <p className="text-lg">{new Date(alocacao.dataPrevDevolucao).toLocaleString("pt-BR")}</p>
          </div>
          <div>
            <span className="font-semibold text-gray-500">Valor Total:</span>
            <p className="text-lg">
              {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(alocacao.valorTotal)}
            </p>
          </div>
          <div><span className="font-semibold text-gray-500">Status:</span><p className="text-lg">{alocacao.status === 0 ? "Ativo" : alocacao.status === 1 ? "Finalizado" : alocacao.status}</p></div>
          <div>
            <span className="font-semibold text-gray-500">Criado em:</span>
            <p className="text-lg">{new Date(alocacao.criadoEm).toLocaleString("pt-BR")}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
