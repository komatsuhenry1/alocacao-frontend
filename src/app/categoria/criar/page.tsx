"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save } from "lucide-react";
import { toast } from "sonner";

const API_URL = "http://localhost:5103/api/v1/Categoria";

export default function CategoriaCriar() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    valorDiaria: 0,
    ativo: true,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : type === "number" ? parseFloat(value) : value,
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/criar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
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
      router.push("/categoria");
    } catch (error) {
      console.error("Erro ao criar:", error);
      toast.error("Erro interno ao criar");
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <Button variant="ghost" className="mb-4" onClick={() => router.push("/categoria")}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Nova Categoria</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome</Label>
              <Input id="nome" name="nome" value={formData.nome} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="descricao">Descrição</Label>
              <Input id="descricao" name="descricao" value={formData.descricao} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="valorDiaria">Valor Diária</Label>
              <Input id="valorDiaria" name="valorDiaria" type="number" step="0.01" value={formData.valorDiaria} onChange={handleChange} required />
            </div>
            <div className="flex items-center space-x-2 mt-4">
              <input
                type="checkbox"
                id="ativo"
                name="ativo"
                checked={formData.ativo}
                onChange={handleChange}
                className="w-4 h-4"
              />
              <Label htmlFor="ativo">Ativo</Label>
            </div>

            <div className="pt-6">
              <Button type="submit" className="w-full">
                <Save className="mr-2 h-4 w-4" /> Criar Categoria
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
