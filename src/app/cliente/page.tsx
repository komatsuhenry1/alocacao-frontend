"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { Eye, Pencil, Trash2, Plus } from "lucide-react";
import { toast } from "sonner";

interface Cliente {
  id: number;
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
}

const API_URL = "http://localhost:5103/api/v1/cliente";

export default function ClienteList() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);
  const router = useRouter();

  const fetchClientes = async () => {
    try {
      const res = await fetch(`${API_URL}/listar_todos`);
      const data = await res.json();
      if (data.status) {
        setClientes(data.dados);
        if (data.mensagem) toast.success(data.mensagem);
      } else {
        toast.error(data.mensagem || "Erro ao buscar clientes");
      }
    } catch (error) {
      console.error("Erro ao buscar clientes:", error);
    }
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  const handleDelete = async () => {
    if (itemToDelete === null) return;
    try {
      const res = await fetch(`${API_URL}/deletar/${itemToDelete}`, { method: "DELETE" });
      const data = await res.json();
      if (data.status) {
        toast.success(data.mensagem);
      } else {
        toast.error(data.mensagem || "Erro ao deletar");
      }
      fetchClientes();
    } catch (error) {
      console.error("Erro ao deletar cliente:", error);
    } finally {
      setItemToDelete(null);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <Button onClick={() => router.back()} variant="outline">Voltar</Button>
      <div className="flex justify-between items-center mb-6 mt-10">
        <h1 className="text-2xl font-bold">Clientes</h1>
        <Button onClick={() => router.push("/cliente/criar")}>
          <Plus className="mr-2 h-4 w-4" /> Novo Cliente
        </Button>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>CPF</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clientes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  Nenhum cliente encontrado.
                </TableCell>
              </TableRow>
            ) : (
              clientes.map((cli) => (
                <TableRow key={cli.id}>
                  <TableCell>{cli.id}</TableCell>
                  <TableCell>{cli.nome}</TableCell>
                  <TableCell>{cli.cpf}</TableCell>
                  <TableCell>{cli.email}</TableCell>
                  <TableCell>{cli.telefone}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="outline" size="icon" onClick={() => router.push(`/cliente/${cli.id}`)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => router.push(`/cliente/${cli.id}/editar`)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="icon" onClick={() => setItemToDelete(cli.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Excluir Cliente</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tem certeza que deseja excluir este cliente?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel onClick={() => setItemToDelete(null)}>Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">Excluir</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}