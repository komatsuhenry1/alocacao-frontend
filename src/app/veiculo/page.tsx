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

const API_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/Veiculo`;

export default function VeiculoList() {
  const [veiculos, setVeiculos] = useState<Veiculo[]>([]);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const router = useRouter();

  const fetchVeiculos = async () => {
    try {
      const res = await fetch(`${API_URL}/listar_todos`);
      const data = await res.json();
      if (data.status) {
        setVeiculos(data.dados);
        if (data.mensagem) toast.success(data.mensagem);
      } else {
        toast.error(data.mensagem || "Erro ao buscar veículos");
      }
    } catch (error) {
      console.error("Erro ao buscar veículos:", error);
    }
  };

  useEffect(() => {
    fetchVeiculos();
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
      fetchVeiculos();
    } catch (error) {
      console.error("Erro ao deletar veículo:", error);
    } finally {
      setItemToDelete(null);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <Button onClick={() => router.back()} variant="outline">Voltar</Button>
      <div className="flex justify-between items-center mb-6 mt-10">
        <h1 className="text-2xl font-bold">Veículos</h1>
        <Button onClick={() => router.push("/veiculo/criar")}>
          <Plus className="mr-2 h-4 w-4" /> Novo Veículo
        </Button>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Placa</TableHead>
              <TableHead>Modelo</TableHead>
              <TableHead>Marca</TableHead>
              <TableHead>Ano</TableHead>
              <TableHead>Cor</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {veiculos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  Nenhum veículo encontrado.
                </TableCell>
              </TableRow>
            ) : (
              veiculos.map((v) => (
                <TableRow key={v.placa}>
                  <TableCell>{v.placa}</TableCell>
                  <TableCell>{v.modelo}</TableCell>
                  <TableCell>{v.marca}</TableCell>
                  <TableCell>{v.ano}</TableCell>
                  <TableCell>{v.cor}</TableCell>
                  <TableCell>{STATUS_LABEL[v.status] ?? v.status}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="outline" size="icon" onClick={() => router.push(`/veiculo/${v.placa}`)} title="Visualizar">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => router.push(`/veiculo/${v.placa}/editar`)} title="Editar">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="icon" onClick={() => setItemToDelete(v.placa)} title="Excluir">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Excluir Veículo</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tem certeza que deseja excluir este veículo?
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