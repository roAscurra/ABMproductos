import { useCallback, useEffect, useState } from "react";
import { useAppDispatch } from "../../../hooks/redux";
import { setArticuloInsumo } from "../../../redux/slices/ArticuloInsumo";
import ArticuloInsumoService from "../../../services/ArticuloInsumoService";
import TableComponent from "../../ui/Table/Table";
import IUnidadMedida from "../../../types/IUnidadMedida";
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

export const Ingredientes = () => {

  const url = import.meta.env.VITE_API_URL;
  const dispatch = useAppDispatch();
  const articuloInsumoService = new ArticuloInsumoService();
  const [filteredData, setFilteredData] = useState<Row[]>([]);

  const fetchAriticulosInsumos = useCallback(async () => {
    try {
      const articulosInsumos = await articuloInsumoService.getAll(url + 'api/articuloInsumo');
      dispatch(setArticuloInsumo(articulosInsumos));
      setFilteredData(articulosInsumos);
    } catch (error) {
      console.error("Error al obtener los articulosInsumos:", error);
    }
  }, [dispatch, articuloInsumoService, url]);

  useEffect(() => {
    fetchAriticulosInsumos();
  }, [fetchAriticulosInsumos]);

  // Definición de las columnas para la tabla de artículos manufacturados
  const columns: Column[] = [
    { id: "id", label: "Id", renderCell: (rowData) => <span>{rowData.id}</span> },
    { id: "denominacion", label: "Nombre", renderCell: (rowData) => <span>{rowData.denominacion}</span> },
    { id: "precioVenta", label: "Precio Venta", renderCell: (rowData) => <span>{rowData.precioVenta}</span> },
    {
      id: "unidadMedida",
      label: "Unidad Medida",
      renderCell: (rowData) => {
        // Verifica si la unidad de medida está presente y si tiene la propiedad denominacion
        const unidadMedida: IUnidadMedida = rowData.unidadMedida;
        if (unidadMedida && unidadMedida.denominacion) {
          return <span>{unidadMedida.denominacion}</span>;
        } else {
          // Si la unidad de medida no está presente o no tiene denominacion, muestra un valor por defecto
          return <span>Sin unidad de medida</span>;
        }
      }
    },
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
            Ingredientes
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
            Ingrediente
          </Button>
        </Box>
     
        {/* Componente de tabla para mostrar los artículos manufacturados */}
        <TableComponent data={filteredData} columns={columns} 
        // handleOpenDeleteModal={handleOpenDeleteModal} handleOpenEditModal={handleOpenEditModal} 
        />


      </Container>
    </Box>    );
}
