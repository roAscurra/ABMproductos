import { useCallback, useEffect, useState } from "react";
import { useAppDispatch } from "../../../hooks/redux";
import { setArticuloInsumo } from "../../../redux/slices/ArticuloInsumo";
import ArticuloInsumoService from "../../../services/ArticuloInsumoService";
import TableComponent from "../../ui/Table/Table";
import IUnidadMedida from "../../../types/IUnidadMedida";
import { Box, Button, Container, Typography } from "@mui/material";
import { Add } from "@mui/icons-material";
import IArticuloInsumo from "../../../types/IArticuloInsumo";
import { toggleModal } from "../../../redux/slices/Modal";
import ModalArticuloInsumo from "../../ui/Modal/ModalArticuloInsumo";
import ModalDeleteArticuloInsumo from "../../ui/Modal/ModalDeleteArticuloInsumo";

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
  const [articuloToEdit, setArticuloToEdit] = useState<IArticuloInsumo | null>(
    null
  );
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);


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


  const handleOpenDeleteModal = (rowData: Row) => {
    setArticuloToEdit({
      id: rowData.id,
      denominacion: rowData.denominacion,
      precioVenta: rowData.precioVenta,
      imagenes: rowData.imagenes,
      precioCompra: rowData.precioCompra,
      stockActual: rowData.stockActual,
      stockMaximo: rowData.stockMaximo,
      esParaElaborar: rowData.esParaElaborar,
      unidadMedida: rowData.unidadMedida?.denominacion,
      eliminado: rowData.eliminado
    });
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    try {
      if (articuloToEdit && articuloToEdit.id) {
        await articuloInsumoService.delete(
          url + "api/articuloInsumo",
          articuloToEdit.id.toString()
        );
        console.log("Artículo de insumo eliminado correctamente.");
        handleCloseDeleteModal();
        fetchAriticulosInsumos();
      } else {
        console.error(
          "No se puede eliminar el artículo de insumo porque no se proporcionó un ID válido."
        );
      }
    } catch (error) {
      console.error("Error al eliminar el artículo de insumo:", error);
    }
  };

  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false);
  };


  const handleAddArticuloInsumo = () => {
    setArticuloToEdit(null);
    dispatch(toggleModal({ modalName: "modal" }));
  };

  const handleOpenEditModal = (rowData: Row) => {
    setArticuloToEdit({
      id: rowData.id,
      denominacion: rowData.denominacion,
      precioVenta: rowData.precioVenta,
      imagenes: rowData.imagenes,
      precioCompra: rowData.precioCompra,
      stockActual: rowData.stockActual,
      stockMaximo: rowData.stockMaximo,
      esParaElaborar: rowData.esParaElaborar,
      unidadMedida: rowData.unidadMedida?.denominacion,
      eliminado: rowData.eliminado
    });
    dispatch(toggleModal({ modalName: "modal" }));
  };




  // Definición de las columnas para la tabla de artículos manufacturados
  const columns: Column[] = [
    { id: "id", label: "Id", renderCell: (rowData) => <span>{rowData.id}</span> },
    { id: "denominacion", label: "Nombre", renderCell: (rowData) => <span>{rowData.denominacion}</span> },
    { id: "precioCompra", label: "Precio Compra", renderCell: (rowData) => <span>{rowData.precioCompra}</span> },
    { id: "precioVenta", label: "Precio Venta", renderCell: (rowData) => <span>{rowData.precioVenta}</span> },
    { id: "esParaElaborar", label: "Es para elaborar", renderCell: (rowData) => <span>{rowData.esParaElaborar ? "Sí" : "No"}</span> },
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
    {
      id: "imagenes",
      label: "Imágenes",
      renderCell: (rowData) => {
        const imagenes = rowData.imagenes;
        if (imagenes && imagenes.length > 0) {
          return (
            <div style={{ display: 'flex', gap: '5px' }}>
              {imagenes.map((imagen: any, index: number) => (
                <img key={index} src={imagen.url} alt={`Imagen ${index + 1}`} style={{ width: '100px', height: 'auto' }} />
              ))}
            </div>
          );
        } else {
          return <span>No hay imágenes disponibles</span>;
        }
      }
    },

  ];
  {/*  
  


  { id: "stockActual", label: "Stock Actual", renderCell: (rowData) => <>{rowData.stockActual}</> },
  { id: "stockMaximo", label: "Stock Maximo", renderCell: (rowData) => <>{rowData.stockMaximo}</> },
*/}

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
            onClick={handleAddArticuloInsumo}
          >
            Ingrediente
          </Button>
        </Box>

        {/* Componente de tabla para mostrar los artículos manufacturados */}
        <TableComponent
          data={filteredData}
          columns={columns}
          handleOpenDeleteModal={handleOpenDeleteModal}
          handleOpenEditModal={handleOpenEditModal}
        />

        <ModalDeleteArticuloInsumo
          show={deleteModalOpen}
          onHide={handleCloseDeleteModal}
          articuloInsumo={articuloToEdit}
          onDelete={handleDelete}
        />
        <ModalArticuloInsumo
          getArticulosInsumo={fetchAriticulosInsumos}
          articuloToEdit={articuloToEdit !== null ? articuloToEdit : undefined}
        />


      </Container>
    </Box>);
}
