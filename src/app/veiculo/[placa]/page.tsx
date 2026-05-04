"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ArrowLeft, Pencil, Plus } from "lucide-react";
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

const STATUS_LABEL: Record<number, string> = {
  1: "Disponível",
  2: "Alugado",
  3: "Inativo",
};

function getImageIndex(placa: string): number {
  let hash = 0;
  for (let i = 0; i < placa.length; i++) {
    hash = (hash + placa.charCodeAt(i)) % 6;
  }
  return hash + 1; // 1 to 6
}

const VEICULO_API = `${process.env.NEXT_PUBLIC_API_BASE_URL}/Veiculo`;
const ALOCACAO_API = `${process.env.NEXT_PUBLIC_API_BASE_URL}/Alocacao`;

export default function VeiculoView() {
  const [veiculo, setVeiculo] = useState<Veiculo | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [alocacaoForm, setAlocacaoForm] = useState({
    clienteId: 0,
    dataRetirada: "",
    dataPrevDevolucao: "",
  });

  const router = useRouter();
  const params = useParams();
  const { placa } = params;

  useEffect(() => {
    if (!placa) return;
    fetch(`${VEICULO_API}/buscar/${placa}`)
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
  }, [placa]);

  const handleAlocacaoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setAlocacaoForm((prev) => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) || 0 : value,
    }));
  };

  const handleCriarAlocacao = async () => {
    setSubmitting(true);
    try {
      const payload = {
        clienteId: alocacaoForm.clienteId,
        carroPlaca: veiculo?.placa,
        dataRetirada: new Date(alocacaoForm.dataRetirada).toISOString(),
        dataPrevDevolucao: new Date(alocacaoForm.dataPrevDevolucao).toISOString(),
      };
      const res = await fetch(`${ALOCACAO_API}/criar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || data.status === false) {
        toast.error(data.mensagem || data.title || "Erro ao criar locação");
        return;
      }
      toast.success(data.mensagem || "Locação criada com sucesso!");
      setDialogOpen(false);
      setAlocacaoForm({ clienteId: 0, dataRetirada: "", dataPrevDevolucao: "" });
    } catch {
      toast.error("Erro interno ao criar locação");
    } finally {
      setSubmitting(false);
    }
  };

  if (!veiculo) return <div className="p-8 text-center">Carregando...</div>;

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <Button variant="ghost" className="mb-4" onClick={() => router.push("/veiculo")}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
      </Button>

      <Card>
        <div className="h-56 overflow-hidden rounded-t-lg bg-gray-100">
          <img
            src={`/veiculo${getImageIndex(veiculo.placa)}.jpg`}
            alt={`${veiculo.marca} ${veiculo.modelo}`}
            className="w-full h-full object-cover"
          />
        </div>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Detalhes do Veículo</CardTitle>
          <Button variant="outline" size="sm" onClick={() => router.push(`/veiculo/${veiculo.placa}/editar`)}>
            <Pencil className="mr-2 h-4 w-4" /> Editar
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div><span className="font-semibold text-gray-500">Placa:</span><p className="text-lg">{veiculo.placa}</p></div>
          <div><span className="font-semibold text-gray-500">Modelo:</span><p className="text-lg">{veiculo.modelo}</p></div>
          <div><span className="font-semibold text-gray-500">Marca:</span><p className="text-lg">{veiculo.marca}</p></div>
          <div><span className="font-semibold text-gray-500">Ano:</span><p className="text-lg">{veiculo.ano}</p></div>
          <div><span className="font-semibold text-gray-500">Cor:</span><p className="text-lg">{veiculo.cor}</p></div>
          <div><span className="font-semibold text-gray-500">ID da Categoria:</span><p className="text-lg">{veiculo.categoriaId}</p></div>
          <div><span className="font-semibold text-gray-500">Status:</span><p className="text-lg">{STATUS_LABEL[veiculo.status] ?? veiculo.status}</p></div>

          <div className="pt-4">
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="w-full">
                  <Plus className="mr-2 h-4 w-4" /> Criar Locação
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Nova Locação</DialogTitle>
                  <DialogDescription>
                    Locação para <strong>{veiculo.marca} {veiculo.modelo}</strong> — placa <strong>{veiculo.placa}</strong>
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-2">
                  <div className="space-y-2">
                    <Label htmlFor="clienteId">Cliente ID</Label>
                    <Input
                      id="clienteId"
                      name="clienteId"
                      type="number"
                      value={alocacaoForm.clienteId || ""}
                      onChange={handleAlocacaoChange}
                      placeholder="Ex: 1"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dataRetirada">Data de Retirada</Label>
                    <Input
                      id="dataRetirada"
                      name="dataRetirada"
                      type="date"
                      value={alocacaoForm.dataRetirada}
                      onChange={handleAlocacaoChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dataPrevDevolucao">Data Prevista de Devolução</Label>
                    <Input
                      id="dataPrevDevolucao"
                      name="dataPrevDevolucao"
                      type="date"
                      value={alocacaoForm.dataPrevDevolucao}
                      onChange={handleAlocacaoChange}
                    />
                  </div>
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
                  <Button
                    onClick={handleCriarAlocacao}
                    disabled={submitting || !alocacaoForm.clienteId || !alocacaoForm.dataRetirada || !alocacaoForm.dataPrevDevolucao}
                  >
                    {submitting ? "Criando..." : "Confirmar Locação"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
