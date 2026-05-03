"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

interface Cliente {
  id: number;
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
  endereco: string;
  dataDeNascimento: string;
  criadoEm: string;
}

const API_URL = "http://localhost:5103/api/v1/Cliente";

export default function ClienteView() {
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  useEffect(() => {
    if (id) {
      fetch(`${API_URL}/buscar/${id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.status) {
            setCliente(data.dados);
            if (data.mensagem) toast.success(data.mensagem);
          } else {
            toast.error(data.mensagem || "Erro ao buscar detalhes");
          }
        })
        .catch((err) => console.error(err));
    }
  }, [id]);

  if (!cliente) return <div className="p-8 text-center">Carregando...</div>;

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <Button variant="ghost" className="mb-4" onClick={() => router.push("/cliente")}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Detalhes do Cliente</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div><span className="font-semibold text-gray-500">ID:</span><p className="text-lg">{cliente.id}</p></div>
          <div><span className="font-semibold text-gray-500">Nome:</span><p className="text-lg">{cliente.nome}</p></div>
          <div><span className="font-semibold text-gray-500">CPF:</span><p className="text-lg">{cliente.cpf}</p></div>
          <div><span className="font-semibold text-gray-500">Email:</span><p className="text-lg">{cliente.email}</p></div>
          <div><span className="font-semibold text-gray-500">Telefone:</span><p className="text-lg">{cliente.telefone}</p></div>
          <div><span className="font-semibold text-gray-500">Endereço:</span><p className="text-lg">{cliente.endereco}</p></div>
          <div>
            <span className="font-semibold text-gray-500">Data de Nascimento:</span>
            <p className="text-lg">{new Date(cliente.dataDeNascimento).toLocaleDateString("pt-BR")}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
