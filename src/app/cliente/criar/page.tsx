"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save } from "lucide-react";
import { toast } from "sonner";

const API_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/Cliente`;

export default function ClienteCriar() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    nome: "",
    cpf: "",
    email: "",
    senha: "",
    dataDeNascimento: "",
    telefone: "",
    endereco: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = { ...formData, dataDeNascimento: new Date(formData.dataDeNascimento).toISOString() };
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
      router.push("/cliente");
    } catch (error) {
      console.error("Erro ao criar:", error);
      toast.error("Erro interno ao criar");
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <Button variant="ghost" className="mb-4" onClick={() => router.push("/cliente")}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Novo Cliente</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-2"><Label htmlFor="nome">Nome</Label><Input id="nome" name="nome" value={formData.nome} onChange={handleChange} required /></div>
            <div className="space-y-2"><Label htmlFor="cpf">CPF</Label><Input id="cpf" name="cpf" value={formData.cpf} onChange={handleChange} required /></div>
            <div className="space-y-2"><Label htmlFor="email">Email</Label><Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required /></div>
            <div className="space-y-2"><Label htmlFor="senha">Senha</Label><Input id="senha" name="senha" type="password" value={formData.senha} onChange={handleChange} required /></div>
            <div className="space-y-2"><Label htmlFor="dataDeNascimento">Data de Nascimento</Label><Input id="dataDeNascimento" name="dataDeNascimento" type="date" value={formData.dataDeNascimento} onChange={handleChange} required /></div>
            <div className="space-y-2"><Label htmlFor="telefone">Telefone</Label><Input id="telefone" name="telefone" value={formData.telefone} onChange={handleChange} required /></div>
            <div className="space-y-2"><Label htmlFor="endereco">Endereço</Label><Input id="endereco" name="endereco" value={formData.endereco} onChange={handleChange} required /></div>

            <div className="pt-6">
              <Button type="submit" className="w-full"><Save className="mr-2 h-4 w-4" /> Criar Cliente</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
