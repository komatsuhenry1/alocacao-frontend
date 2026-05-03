"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

const API_URL = "http://localhost:5103/api/v1/Alocacao";

export default function AlocacaoEdit() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [formData, setFormData] = useState({
    clienteId: 0,
    carroPlaca: "",
    dataRetirada: "",
    dataPrevDevolucao: "",
    status: 0,
  });

  useEffect(() => {
    if (id) {
      fetch(`${API_URL}/buscar/${id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.status && data.dados) {
            setFormData({
              clienteId: data.dados.clienteId,
              carroPlaca: data.dados.carroPlaca,
              dataRetirada: data.dados.dataRetirada.split("T")[0],
              dataPrevDevolucao: data.dados.dataPrevDevolucao.split("T")[0],
              status: data.dados.status,
            });
            if (data.mensagem) toast.success(data.mensagem);
          } else {
            toast.error(data.mensagem || "Erro ao carregar");
          }
        })
        .catch((err) => console.error(err));
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSave = async () => {
    try {
      const payload = {
        ...formData,
        dataRetirada: new Date(formData.dataRetirada).toISOString(),
        dataPrevDevolucao: new Date(formData.dataPrevDevolucao).toISOString(),
      };
      const res = await fetch(`${API_URL}/editar/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || data.status === false) {
        if (data.errors) {
          const messages = Object.values(data.errors).flat().join(", ");
          toast.error(messages);
        } else {
          toast.error(data.mensagem || data.title || "Erro ao salvar");
        }
        return;
      }
      toast.success(data.mensagem || "Salvo com sucesso!");
      router.push("/alocacao");
    } catch (error) {
      console.error("Erro ao salvar:", error);
      toast.error("Erro interno ao salvar");
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <Button variant="ghost" className="mb-4" onClick={() => router.push("/alocacao")}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Editar Alocação</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2"><Label htmlFor="clienteId">Cliente ID</Label><Input id="clienteId" name="clienteId" type="number" value={formData.clienteId} onChange={handleChange} /></div>
          <div className="space-y-2"><Label htmlFor="carroPlaca">Placa do Veículo</Label><Input id="carroPlaca" name="carroPlaca" value={formData.carroPlaca} onChange={handleChange} /></div>
          <div className="space-y-2"><Label htmlFor="dataRetirada">Data de Retirada</Label><Input id="dataRetirada" name="dataRetirada" type="date" value={formData.dataRetirada} onChange={handleChange} /></div>
          <div className="space-y-2"><Label htmlFor="dataPrevDevolucao">Data Prevista de Devolução</Label><Input id="dataPrevDevolucao" name="dataPrevDevolucao" type="date" value={formData.dataPrevDevolucao} onChange={handleChange} /></div>

          <div className="pt-6">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className="w-full"><Save className="mr-2 h-4 w-4" /> Salvar Alterações</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirmar Alteração</AlertDialogTitle>
                  <AlertDialogDescription>Tem certeza que deseja salvar as alterações desta alocação?</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={handleSave}>Confirmar e Salvar</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
