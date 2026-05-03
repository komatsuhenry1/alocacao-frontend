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
import { Eye, Pencil, Trash2, Plus, CheckCircle } from "lucide-react";
import { toast } from "sonner";

interface Alocacao {
  id: number;
  clienteId: number;
  carroPlaca: string;
  dataRetirada: string;
  dataPrevDevolucao: string;
  valorTotal: number;
  status: number; // 0 = Ativo, 1 = Finalizado (depende do enum, mas assumimos algo numérico)
}

const API_URL = "http://localhost:5103/api/v1/Alocacao";

export default function AlocacaoList() {
  const [alocacoes, setAlocacoes] = useState<Alocacao[]>([]);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);
  const [itemToBaixa, setItemToBaixa] = useState<number | null>(null);
  const router = useRouter();

  const fetchAlocacoes = async () => {
    try {
      const res = await fetch(`${API_URL}/listar_todos`);
      const data = await res.json();
      if (data.status) {
        setAlocacoes(data.dados);
        if (data.mensagem) toast.success(data.mensagem);
      } else {
        toast.error(data.mensagem || "Erro ao buscar alocações");
      }
    } catch (error) {
      console.error("Erro ao buscar alocações:", error);
    }
  };

  useEffect(() => {
    fetchAlocacoes();
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
      fetchAlocacoes();
    } catch (error) {
      console.error("Erro ao deletar alocação:", error);
    } finally {
      setItemToDelete(null);
    }
  };

  const handleBaixa = async () => {
    if (itemToBaixa === null) return;
    try {
      const res = await fetch(`${API_URL}/baixa/${itemToBaixa}`, { method: "PUT" });
      const data = await res.json();
      if (data.status) {
        toast.success(data.mensagem);
      } else {
        toast.error(data.mensagem || "Erro ao dar baixa");
      }
      fetchAlocacoes();
    } catch (error) {
      console.error("Erro ao dar baixa:", error);
    } finally {
      setItemToBaixa(null);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <Button onClick={() => router.back()} variant="outline">Voltar</Button>
      <div className="flex justify-between items-center mb-6 mt-10">
        <h1 className="text-2xl font-bold">Alocações</h1>
        <Button onClick={() => router.push("/alocacao/criar")}>
          <Plus className="mr-2 h-4 w-4" /> Nova Alocação
        </Button>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Cliente ID</TableHead>
              <TableHead>Placa</TableHead>
              <TableHead>Retirada</TableHead>
              <TableHead>Prev. Devolução</TableHead>
              <TableHead>Valor Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {alocacoes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center">
                  Nenhuma alocação encontrada.
                </TableCell>
              </TableRow>
            ) : (
              alocacoes.map((aloc) => (
                <TableRow key={aloc.id}>
                  <TableCell>{aloc.id}</TableCell>
                  <TableCell>{aloc.clienteId}</TableCell>
                  <TableCell>{aloc.carroPlaca}</TableCell>
                  <TableCell>{new Date(aloc.dataRetirada).toLocaleDateString("pt-BR")}</TableCell>
                  <TableCell>{new Date(aloc.dataPrevDevolucao).toLocaleDateString("pt-BR")}</TableCell>
                  <TableCell>
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(aloc.valorTotal)}
                  </TableCell>
                  <TableCell>
                    {aloc.status === 1 ? "Ativo" : aloc.status === 2 ? "Concluído" : aloc.status === 3 ? "Cancelado" : aloc.status}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="icon" onClick={() => setItemToBaixa(aloc.id)} title="Dar Baixa">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Confirmar Baixa</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tem certeza que deseja dar baixa nesta alocação? Esta ação marca o veículo como devolvido.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel onClick={() => setItemToBaixa(null)}>Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={handleBaixa} className="bg-green-600 hover:bg-green-700">Confirmar Baixa</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                    <Button variant="outline" size="icon" onClick={() => router.push(`/alocacao/${aloc.id}`)} title="Visualizar">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => router.push(`/alocacao/${aloc.id}/editar`)} title="Editar">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="icon" onClick={() => setItemToDelete(aloc.id)} title="Excluir">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Excluir Alocação</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tem certeza que deseja excluir esta alocação?
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