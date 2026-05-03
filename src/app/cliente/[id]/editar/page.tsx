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

const API_URL = "http://localhost:5103/api/v1/Cliente";

export default function ClienteEdit() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [formData, setFormData] = useState({
    nome: "",
    cpf: "",
    email: "",
    senha: "",
    dataDeNascimento: "",
    telefone: "",
    endereco: "",
  });

  useEffect(() => {
    if (id) {
      fetch(`${API_URL}/buscar/${id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.status && data.dados) {
            setFormData({
              nome: data.dados.nome,
              cpf: data.dados.cpf,
              email: data.dados.email,
              senha: data.dados.senha,
              dataDeNascimento: data.dados.dataDeNascimento.split("T")[0],
              telefone: data.dados.telefone,
              endereco: data.dados.endereco,
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
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const payload = { ...formData, dataDeNascimento: new Date(formData.dataDeNascimento).toISOString() };
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
      router.push("/cliente");
    } catch (error) {
      console.error("Erro ao salvar:", error);
      toast.error("Erro interno ao salvar");
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <Button variant="ghost" className="mb-4" onClick={() => router.push("/cliente")}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Editar Cliente</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2"><Label htmlFor="nome">Nome</Label><Input id="nome" name="nome" value={formData.nome} onChange={handleChange} /></div>
          <div className="space-y-2"><Label htmlFor="cpf">CPF</Label><Input id="cpf" name="cpf" value={formData.cpf} onChange={handleChange} /></div>
          <div className="space-y-2"><Label htmlFor="email">Email</Label><Input id="email" name="email" value={formData.email} onChange={handleChange} /></div>
          <div className="space-y-2"><Label htmlFor="senha">Senha</Label><Input id="senha" name="senha" type="password" value={formData.senha} onChange={handleChange} /></div>
          <div className="space-y-2"><Label htmlFor="dataDeNascimento">Data de Nascimento</Label><Input id="dataDeNascimento" name="dataDeNascimento" type="date" value={formData.dataDeNascimento} onChange={handleChange} /></div>
          <div className="space-y-2"><Label htmlFor="telefone">Telefone</Label><Input id="telefone" name="telefone" value={formData.telefone} onChange={handleChange} /></div>
          <div className="space-y-2"><Label htmlFor="endereco">Endereço</Label><Input id="endereco" name="endereco" value={formData.endereco} onChange={handleChange} /></div>

          <div className="pt-6">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className="w-full"><Save className="mr-2 h-4 w-4" /> Salvar Alterações</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirmar Alteração</AlertDialogTitle>
                  <AlertDialogDescription>Tem certeza que deseja salvar as alterações deste cliente?</AlertDialogDescription>
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
