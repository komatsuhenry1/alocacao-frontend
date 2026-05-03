"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save } from "lucide-react";
import { toast } from "sonner";

const API_URL = "http://localhost:5103/api/v1/Veiculo";

export default function VeiculoCriar() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    placa: "",
    modelo: "",
    marca: "",
    ano: 0,
    cor: "",
    categoriaId: 0,
    imagemUrl: "",
    status: 1,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseInt(value) || 0 : value,
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
      router.push("/veiculo");
    } catch (error) {
      console.error("Erro ao criar:", error);
      toast.error("Erro interno ao criar");
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <Button variant="ghost" className="mb-4" onClick={() => router.push("/veiculo")}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Novo Veículo</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-2"><Label htmlFor="placa">Placa</Label><Input id="placa" name="placa" value={formData.placa} onChange={handleChange} required /></div>
            <div className="space-y-2"><Label htmlFor="modelo">Modelo</Label><Input id="modelo" name="modelo" value={formData.modelo} onChange={handleChange} required /></div>
            <div className="space-y-2"><Label htmlFor="marca">Marca</Label><Input id="marca" name="marca" value={formData.marca} onChange={handleChange} required /></div>
            <div className="space-y-2"><Label htmlFor="ano">Ano</Label><Input id="ano" name="ano" type="number" value={formData.ano} onChange={handleChange} required /></div>
            <div className="space-y-2"><Label htmlFor="cor">Cor</Label><Input id="cor" name="cor" value={formData.cor} onChange={handleChange} required /></div>
            <div className="space-y-2"><Label htmlFor="categoriaId">ID da Categoria</Label><Input id="categoriaId" name="categoriaId" type="number" value={formData.categoriaId} onChange={handleChange} required /></div>
            <div className="space-y-2"><Label htmlFor="imagemUrl">URL da Imagem</Label><Input id="imagemUrl" name="imagemUrl" value={formData.imagemUrl} onChange={handleChange} required /></div>

            <div className="pt-6">
              <Button type="submit" className="w-full"><Save className="mr-2 h-4 w-4" /> Criar Veículo</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
