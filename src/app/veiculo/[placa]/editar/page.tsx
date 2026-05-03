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

const API_URL = "http://localhost:5103/api/v1/Veiculo";

export default function VeiculoEdit() {
  const router = useRouter();
  const params = useParams();
  const { placa } = params;

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

  useEffect(() => {
    if (placa) {
      fetch(`${API_URL}/buscar/${placa}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.status && data.dados) {
            setFormData({
              placa: data.dados.placa,
              modelo: data.dados.modelo,
              marca: data.dados.marca,
              ano: data.dados.ano,
              cor: data.dados.cor,
              categoriaId: data.dados.categoriaId,
              imagemUrl: data.dados.imagemUrl,
              status: data.dados.status,
            });
            if (data.mensagem) toast.success(data.mensagem);
          } else {
            toast.error(data.mensagem || "Erro ao carregar");
          }
        })
        .catch((err) => console.error(err));
    }
  }, [placa]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseInt(value) || 0 : value,
    }));
  };

  const handleSave = async () => {
    try {
      const res = await fetch(`${API_URL}/editar/${placa}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
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
      router.push("/veiculo");
    } catch (error) {
      console.error("Erro ao salvar:", error);
      toast.error("Erro interno ao salvar");
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <Button variant="ghost" className="mb-4" onClick={() => router.push("/veiculo")}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Editar Veículo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2"><Label htmlFor="placa">Placa</Label><Input id="placa" name="placa" value={formData.placa} onChange={handleChange} disabled /></div>
          <div className="space-y-2"><Label htmlFor="modelo">Modelo</Label><Input id="modelo" name="modelo" value={formData.modelo} onChange={handleChange} /></div>
          <div className="space-y-2"><Label htmlFor="marca">Marca</Label><Input id="marca" name="marca" value={formData.marca} onChange={handleChange} /></div>
          <div className="space-y-2"><Label htmlFor="ano">Ano</Label><Input id="ano" name="ano" type="number" value={formData.ano} onChange={handleChange} /></div>
          <div className="space-y-2"><Label htmlFor="cor">Cor</Label><Input id="cor" name="cor" value={formData.cor} onChange={handleChange} /></div>
          <div className="space-y-2"><Label htmlFor="categoriaId">ID da Categoria</Label><Input id="categoriaId" name="categoriaId" type="number" value={formData.categoriaId} onChange={handleChange} /></div>
          <div className="space-y-2"><Label htmlFor="imagemUrl">URL da Imagem</Label><Input id="imagemUrl" name="imagemUrl" value={formData.imagemUrl} onChange={handleChange} /></div>

          <div className="pt-6">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className="w-full"><Save className="mr-2 h-4 w-4" /> Salvar Alterações</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirmar Alteração</AlertDialogTitle>
                  <AlertDialogDescription>Tem certeza que deseja salvar as alterações deste veículo?</AlertDialogDescription>
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
