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

const API_URL = "http://localhost:5103/api/v1/Categoria";

export default function CategoriaEdit() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    valorDiaria: 0,
    ativo: true,
  });

  useEffect(() => {
    if (id) {
      fetch(`${API_URL}/buscar/${id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.status && data.dados) {
            setFormData({
              nome: data.dados.nome,
              descricao: data.dados.descricao,
              valorDiaria: data.dados.valorDiaria,
              ativo: data.dados.ativo,
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
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : type === "number" ? parseFloat(value) : value,
    }));
  };

  const handleSave = async () => {
    try {
      const res = await fetch(`${API_URL}/editar/${id}`, {
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
      router.push("/categoria");
    } catch (error) {
      console.error("Erro ao salvar:", error);
      toast.error("Erro interno ao salvar");
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <Button variant="ghost" className="mb-4" onClick={() => router.push("/categoria")}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Editar Categoria</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome</Label>
            <Input id="nome" name="nome" value={formData.nome} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição</Label>
            <Input id="descricao" name="descricao" value={formData.descricao} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="valorDiaria">Valor Diária</Label>
            <Input id="valorDiaria" name="valorDiaria" type="number" step="0.01" value={formData.valorDiaria} onChange={handleChange} />
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
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className="w-full">
                  <Save className="mr-2 h-4 w-4" /> Salvar Alterações
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirmar Alteração</AlertDialogTitle>
                  <AlertDialogDescription>
                    Tem certeza que deseja salvar as alterações desta categoria?
                  </AlertDialogDescription>
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
