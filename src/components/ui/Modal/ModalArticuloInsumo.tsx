import { Formik, Field, ErrorMessage, Form } from "formik";
import { Modal, Button } from "react-bootstrap";
import * as Yup from 'yup';
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import { toggleModal } from "../../../redux/slices/Modal";
import ArticuloInsumoService from "../../../services/ArticuloInsumoService";
import IArticuloInsumo from "../../../types/IArticuloInsumo";
import IUnidadMedida from "../../../types/IUnidadMedida";
import UnidadMedidaService from "../../../services/UnidadMedidaService";
import { useEffect, useState } from "react";


interface ModalArticuloInsumoProps {
  getArticulosInsumo: () => void;
  articuloToEdit?: IArticuloInsumo;
}

const ModalArticuloInsumo: React.FC<ModalArticuloInsumoProps> = ({ getArticulosInsumo, articuloToEdit }) => {

  const articuloInsumoService = new ArticuloInsumoService();
  const unidadService = new UnidadMedidaService();
  const [unidadesMedida, setUnidadesMedida] = useState<IUnidadMedida[]>([]);
  const url = import.meta.env.VITE_API_URL;


  const initialValues: IArticuloInsumo = articuloToEdit
    ? articuloToEdit
    : {
      id: 0,
      denominacion: "",
      precioVenta: 0,
      imagenes: [],
      unidadMedida: {
        id: 0,
        denominacion: "",
        eliminado: false
      },
      precioCompra: 0,
      stockActual: 0,
      stockMaximo: 0,
      esParaElaborar: false
    };

  const modal = useAppSelector((state) => state.modal.modal);
  const dispatch = useAppDispatch();

  const handleClose = () => {
    dispatch(toggleModal({ modalName: "modal" }));
  };

  const fetchUnidadesMedida = async () => {
    try {
      const unidades = await unidadService.getAll(url + 'api/unidadMedida');
      setUnidadesMedida(unidades);
    } catch (error) {
      console.error('Error al obtener las unidades de medida:', error);
    }
  };

  useEffect(() => {
    fetchUnidadesMedida();
  })

  return (
    <Modal
      id={"modal"}
      show={modal}
      onHide={handleClose}
      size={"lg"}
      backdrop="static"
      keyboard={false}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>{articuloToEdit ? "Editar Artículo de Insumo" : "Agregar Artículo de Insumo"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Formik
          validationSchema={Yup.object({
            denominacion: Yup.string().required("Campo requerido"),
            precioVenta: Yup.number().required("Campo requerido"),
            precioCompra: Yup.number().required("Campo requerido"),
            stockActual: Yup.number().required("Campo requerido"),
            stockMaximo: Yup.number().required("Campo requerido"),
            esParaElaborar: Yup.boolean().required("Campo requerido")
          })}
          initialValues={initialValues}
          onSubmit={async (values: IArticuloInsumo) => {
            try {
              if (articuloToEdit) {
                // Lógica para editar el artículo de insumo existente
                await articuloInsumoService.put(url + "api/articuloInsumo", values.id.toString(), values);
                console.log("Se ha actualizado correctamente.");
              } else {
                // Lógica para agregar un nuevo artículo de insumo
                await articuloInsumoService.post(url + "api/articuloInsumo", values);
                console.log("Se ha agregado correctamente.");
                console.log(values)
              }
              getArticulosInsumo();
              handleClose();
            } catch (error) {
              console.error("Error al realizar la operación:", error);
              console.log(values)
            }
          }}
        >
          {({ values, setFieldValue }) => (
            <>
              <Form autoComplete="off">
                <div className="mb-4">
                  <label htmlFor="denominacion">Denominación:</label>
                  <Field
                    name="denominacion"
                    type="text"
                    placeholder="Denominación"
                    className="form-control mt-2"
                  />
                  <ErrorMessage
                    name="denominacion"
                    className="error-message"
                    component="div"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="precioVenta">Precio de Venta:</label>
                  <Field
                    name="precioVenta"
                    type="number"
                    placeholder="Precio de Venta"
                    className="form-control mt-2"
                  />
                  <ErrorMessage
                    name="precioVenta"
                    className="error-message"
                    component="div"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="unidadMedida">Unidad de Medida:</label>
                  <Field
                    name="unidadMedida"
                    as="select"
                    className="form-control"
                    onChange={(event: { target: { value: string; }; }) => {
                      const selectedUnitId = parseInt(event.target.value);
                      const selectedUnidad = unidadesMedida.find((unidad) => unidad.id === selectedUnitId);

                      if (selectedUnidad) {
                        setFieldValue('unidadMedida', selectedUnidad);
                      } else {
                        console.error("No se encontró la unidad seleccionada");
                      }
                    }}
                    value={values.unidadMedida ? values.unidadMedida.id : ''}
                  >
                    <option value="">Seleccionar Unidad de Medida</option>
                    {unidadesMedida.map((unidad) => (
                      <option key={unidad.id} value={unidad.id}>
                        {unidad.denominacion}
                      </option>
                    ))}
                  </Field>

                  <ErrorMessage
                    name="unidadMedida"
                    className="error-message"
                    component="div"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="imagenes">Imagen:</label>
                  <Field
                    name="imagenes[0].url"
                    type="text"
                    placeholder="URL de la imagen"
                    className="form-control my-2"
                  />
                  <ErrorMessage
                    name="imagenes[0].url"
                    className="error-message"
                    component="div"
                  />
                </div>

                {/* Añade campos adicionales según los atributos de tu modelo de ArticuloInsumo */}
                <div className="d-flex justify-content-end">
                  <Button
                    variant="outline-success"
                    type="submit"
                    className="custom-button"
                  >
                    Enviar
                  </Button>
                </div>
              </Form>
            </>
          )}
        </Formik>
      </Modal.Body>
    </Modal>
  );
};

export default ModalArticuloInsumo;