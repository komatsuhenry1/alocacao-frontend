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

interface Categoria {
  id: number;
  nome: string;
  descricao: string;
  valorDiaria: number;
  ativo: boolean;
}

const API_URL = "https://api-locadora-dev.nicebay-5f61446e.centralus.azurecontainerapps.io/api/v1/Categoria";

export default function CategoriaList() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);
  const router = useRouter();

  const fetchCategorias = async () => {
    try {
      const res = await fetch(`${API_URL}/listar_todos`);
      const data = await res.json();
      if (data.status) {
        setCategorias(data.dados);
        if (data.mensagem) toast.success(data.mensagem);
      } else {
        toast.error(data.mensagem || "Erro ao buscar categorias");
      }
    } catch (error) {
      console.error("Erro ao buscar categorias:", error);
    }
  };

  useEffect(() => {
    fetchCategorias();
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
      fetchCategorias();
    } catch (error) {
      console.error("Erro ao deletar categoria:", error);
    } finally {
      setItemToDelete(null);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <Button onClick={() => router.back()} variant="outline">Voltar</Button>
      <div className="flex justify-between items-center mb-6 mt-10">
        <h1 className="text-2xl font-bold">Categorias</h1>
        <Button onClick={() => router.push("/categoria/criar")}>
          <Plus className="mr-2 h-4 w-4" /> Nova Categoria
        </Button>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Valor Diária</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categorias.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  Nenhuma categoria encontrada.
                </TableCell>
              </TableRow>
            ) : (
              categorias.map((cat) => (
                <TableRow key={cat.id}>
                  <TableCell>{cat.id}</TableCell>
                  <TableCell>{cat.nome}</TableCell>
                  <TableCell>
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(cat.valorDiaria)}
                  </TableCell>
                  <TableCell>{cat.ativo ? "Ativo" : "Inativo"}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => router.push(`/categoria/${cat.id}`)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => router.push(`/categoria/${cat.id}/editar`)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => setItemToDelete(cat.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Excluir Categoria</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tem certeza que deseja excluir esta categoria? Esta ação não pode ser desfeita.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel onClick={() => setItemToDelete(null)}>
                            Cancelar
                          </AlertDialogCancel>
                          <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                            Excluir
                          </AlertDialogAction>
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