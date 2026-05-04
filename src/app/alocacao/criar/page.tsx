"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save } from "lucide-react";
import { toast } from "sonner";

const API_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/Alocacao`;

export default function AlocacaoCriar() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    clienteId: 0,
    carroPlaca: "",
    dataRetirada: "",
    dataPrevDevolucao: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        dataRetirada: new Date(formData.dataRetirada).toISOString(),
        dataPrevDevolucao: new Date(formData.dataPrevDevolucao).toISOString(),
      };
      const res = await fetch(`${API_URL}/criar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || data.status === false) {
        if (data.errors) {
          const messages = Object.values(data.errors).flat().join(", ");
          toast.error(messages);
        } else {
          toast.error(data.mensagem || data.title || "Erro ao criar");
        }
        return;
      }
      toast.success(data.mensagem || "Criado com sucesso!");
      router.push("/alocacao");
    } catch (error) {
      console.error("Erro ao criar:", error);
      toast.error("Erro interno ao criar");
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <Button variant="ghost" className="mb-4" onClick={() => router.push("/alocacao")}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Nova Alocação</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-2"><Label htmlFor="clienteId">Cliente ID</Label><Input id="clienteId" name="clienteId" type="number" value={formData.clienteId} onChange={handleChange} required /></div>
            <div className="space-y-2"><Label htmlFor="carroPlaca">Placa do Veículo</Label><Input id="carroPlaca" name="carroPlaca" value={formData.carroPlaca} onChange={handleChange} required /></div>
            <div className="space-y-2"><Label htmlFor="dataRetirada">Data de Retirada</Label><Input id="dataRetirada" name="dataRetirada" type="date" value={formData.dataRetirada} onChange={handleChange} required /></div>
            <div className="space-y-2"><Label htmlFor="dataPrevDevolucao">Data Prevista de Devolução</Label><Input id="dataPrevDevolucao" name="dataPrevDevolucao" type="date" value={formData.dataPrevDevolucao} onChange={handleChange} required /></div>

            <div className="pt-6">
              <Button type="submit" className="w-full"><Save className="mr-2 h-4 w-4" /> Criar Alocação</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
