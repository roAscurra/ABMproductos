import { useCallback, useEffect, useState } from "react";
import { useAppDispatch } from "../../../hooks/redux";
import TableComponent from "../../ui/Table/Table";
import CategoriaService from "../../../services/CategoriaService";
import { setCategoria } from "../../../redux/slices/Categoria";
import { Box, Button, Container, Typography } from "@mui/material";
import { Add } from "@mui/icons-material";
import ICategoria from "../../../types/ICategoria";
import { toggleModal } from "../../../redux/slices/Modal";
import ModalCategoria from "../../ui/Modal/ModalCategoria";
import ModalEliminarCategoria from "../../ui/Modal/ModalEliminarCategoria";

interface Row {
  [key: string]: any;
}

interface Column {
  id: keyof Row;
  label: string;
  renderCell: (rowData: Row) => JSX.Element;
}

export const Categoria = () => {

  const url = import.meta.env.VITE_API_URL;
  const dispatch = useAppDispatch();
  const categoriaService = new CategoriaService();
  const [filteredData, setFilteredData] = useState<Row[]>([]);
  const [categoryToEdit, setCategoryToEdit] = useState<ICategoria | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);


  const fetchCategorias = useCallback(async () => {
    try {
      const categorias = await categoriaService.getAll(url + 'api/categoria');
      dispatch(setCategoria(categorias));
      setFilteredData(categorias);
    } catch (error) {
      console.error("Error al obtener las categorias:", error);
    }
  }, [dispatch, categoriaService, url]);

  useEffect(() => {
    fetchCategorias();
  }, [fetchCategorias]);

  const handleAddProduct = () => {
    setCategoryToEdit(null);
    dispatch(toggleModal({ modalName: "modal" }));
  };

  const handleOpenEditModal = (rowData: Row) => {
    setCategoryToEdit({
      id: rowData.id,
      denominacion: rowData.denominacion,
      articulos: rowData.articulos,
      subCategorias: rowData.subcategorias
    });
    dispatch(toggleModal({ modalName: 'modal' }));
  };


  const handleOpenDeleteModal = (rowData: Row) => {
    setCategoryToEdit({
      id: rowData.id,
      denominacion: rowData.denominacion,
      articulos: rowData.articulos,
      subCategorias: rowData.subcategorias
    });
    setDeleteModalOpen(true);
  };


  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false); // Utiliza el estado directamente para cerrar la modal de eliminación
  };

  const handleDelete = async () => {
    try {
      if (categoryToEdit && categoryToEdit.id) {
        await categoriaService.delete(url + 'api/categoria', categoryToEdit.id.toString());
        console.log('Se ha eliminado correctamente.');
        handleCloseDeleteModal(); // Cerrar el modal de eliminación
        fetchCategorias(); // Refrescar la lista de productos
      } else {
        console.error('No se puede eliminar la categoria porque no se proporcionó un ID válido.');
      }
    } catch (error) {
      console.error('Error al eliminar la categoria:', error);
    }
  };


  // Definición de las columnas para la tabla de artículos manufacturados
  const columns: Column[] = [
    { id: "id", label: "Id", renderCell: (rowData) => <span>{rowData.id}</span> },
    { id: "denominacion", label: "Nombre", renderCell: (rowData) => <span>{rowData.denominacion}</span> },
  ];

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        my: 2,
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            my: 1,
          }}
        >
          <Typography variant="h5" gutterBottom>
            Categorias
          </Typography>
          <Button
            sx={{
              bgcolor: "#000", // Terracota
              "&:hover": {
                bgcolor: "#808080", // Terracota más oscuro al pasar el mouse
              },
            }}
            variant="contained"
            startIcon={<Add />}
            onClick={handleAddProduct}
          >
            Categoria
          </Button>
        </Box>

        {/* Componente de tabla para mostrar los artículos manufacturados */}
        <TableComponent
          data={filteredData}
          columns={columns}
          handleOpenDeleteModal={handleOpenDeleteModal}
          handleOpenEditModal={handleOpenEditModal}
        />
        <ModalCategoria getCategories={fetchCategorias} categoryToEdit={categoryToEdit !== null ? categoryToEdit : undefined} />
        <ModalEliminarCategoria show={deleteModalOpen} onClose={handleCloseDeleteModal} categoria={categoryToEdit} onDelete={handleDelete} />

      </Container>
    </Box>
  );
}
