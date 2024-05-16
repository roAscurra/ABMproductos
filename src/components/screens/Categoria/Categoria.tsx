import { useCallback, useEffect, useState } from "react";
import { useAppDispatch } from "../../../hooks/redux";
import TableComponent from "../../ui/Table/Table";
import CategoriaService from "../../../services/CategoriaService";
import { setCategoria } from "../../../redux/slices/Categoria";
import { Box, Button, Container, Typography } from "@mui/material";
import { Add } from "@mui/icons-material";

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
            // onClick={handleAddProduct}
          >
            Categoria
          </Button>
        </Box>
     
        {/* Componente de tabla para mostrar los artículos manufacturados */}
        <TableComponent data={filteredData} columns={columns} 
        // handleOpenDeleteModal={handleOpenDeleteModal} handleOpenEditModal={handleOpenEditModal} 
        />


      </Container>
    </Box>  
    );
}
