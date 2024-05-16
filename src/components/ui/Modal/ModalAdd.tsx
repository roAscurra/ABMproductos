import React, { useEffect, useState } from 'react';
import { Button, Modal, Row, Col } from 'react-bootstrap';
import { Formik, Form, Field, ErrorMessage, FieldArray } from 'formik';
import * as Yup from 'yup';
import IArticuloManufacturado from '../../../types/IArticuloManufacturado';
import articuloManufacturadoService from '../../../services/ArticuloManufacturadoService';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux';
import { toggleModal } from '../../../redux/slices/Modal';
import UnidadMedidaService from '../../../services/UnidadMedidaService';
import CategoriaService from '../../../services/CategoriaService';
import ArticuloInsumoService from '../../../services/ArticuloInsumoService';
import IUnidadMedida from '../../../types/IUnidadMedida';
import IArticuloInsumo from '../../../types/IArticuloInsumo';
import ICategoria from '../../../types/ICategoria';

interface ModalProductProps {
    getProducts: () => void;
    productToEdit?: IArticuloManufacturado;
}

const ModalProducto: React.FC<ModalProductProps> = ({ getProducts, productToEdit }) => {
    const productoService = new articuloManufacturadoService();
    const unidadService = new UnidadMedidaService();
    const insumoService = new ArticuloInsumoService();
    const categoriaService = new CategoriaService();
    const [unidadesMedida, setUnidadesMedida] = useState<IUnidadMedida[]>([]);
    const [insumos, setInsumos] = useState<IArticuloInsumo[]>([]);
    const [categorias, setCategoria] = useState<ICategoria[]>([]);
    const [selectedInsumo, setSelectedInsumo] = useState<number | null>(null);
    const url = import.meta.env.VITE_API_URL;

    const initialValues: IArticuloManufacturado = productToEdit
        ? productToEdit
        : {
            id: 0,
            denominacion: '',
            precioVenta: 0,
            imagenes: [],
            unidadMedida: {
                id: 0,
                eliminado: false,
                denominacion: '',
            },
            descripcion: '',
            tiempoEstimadoMinutos: 0,
            preparacion: '',
            articuloManufacturadoDetalles: [],

        };

    const modal = useAppSelector((state) => state.modal.modal);
    const dispatch = useAppDispatch();

    const handleClose = () => {
        dispatch(toggleModal({ modalName: 'modal' }));
    };

    const fetchArticuloInsumo = async () => {
        try {
            const articulosInsumos = await insumoService.getAll(url + 'api/articuloInsumo');
            setInsumos(articulosInsumos);
        } catch (error) {
            console.error("Error al obtener los insumos:", error);
        }
    };

    const fetchUnidadesMedida = async () => {
        try {
            const unidades = await unidadService.getAll(url + 'api/unidadMedida');
            setUnidadesMedida(unidades);
        } catch (error) {
            console.error('Error al obtener las unidades de medida:', error);
        }
    };

    const fetchCategorias = async () => {
        try {
            const categorias = await categoriaService.getAll(url + 'api/categoria');
            setCategoria(categorias);
        } catch (error) {
            console.error('Error al obtener las categorias:', error);
        }
    };

    useEffect(() => {
        fetchArticuloInsumo();
        fetchUnidadesMedida();
        fetchCategorias();
    }, []);

    const handleAddInsumo = (arrayHelpers: any) => {
        if (selectedInsumo !== null) {
            const insumo = insumos.find(insumo => insumo.id === selectedInsumo);
            if (insumo) {
                arrayHelpers.push({ id: insumo.id, denominacion: insumo.denominacion, cantidad: 1 });
                setSelectedInsumo(null);
            }
        }
    };


    return (
        <Modal
            id={'modal'}
            show={modal}
            onHide={handleClose}
            size={'lg'}
            backdrop="static"
            keyboard={false}
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title>{productToEdit ? 'Editar Producto' : 'Agregar Producto'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Formik
                    validationSchema={Yup.object({
                        denominacion: Yup.string().required('Campo requerido'),
                        precioVenta: Yup.number().required('Campo requerido'),
                        descripcion: Yup.string().required('Campo requerido'),
                        tiempoEstimadoMinutos: Yup.number().required('Campo requerido'),
                    })}
                    initialValues={initialValues}
                    onSubmit={async (values: IArticuloManufacturado) => {
                        try {
                            if (productToEdit) {
                                await productoService.put(
                                    url + 'api/producto',
                                    values.id.toString(),
                                    values
                                );
                                console.log('Se ha actualizado correctamente.');
                            } else {
                                await productoService.post(url + 'api/producto', values);
                                console.log('Se ha agregado correctamente.');
                            }
                            getProducts();
                            handleClose();
                        } catch (error) {
                            console.error('Error al realizar la operación:', error);
                            console.log(values)
                        }
                    }}

                >
                    {({ values, setFieldValue }) => (
                        <Form autoComplete="off">
                            <Row>
                                <Col>
                                    <label htmlFor="denominacion">Nombre:</label>
                                    <Field
                                        name="denominacion"
                                        type="text"
                                        placeholder="Nombre del Producto"
                                        className="form-control mt-2"
                                    />
                                    <ErrorMessage
                                        name="denominacion"
                                        className="error-message"
                                        component="div"
                                    />
                                    <label htmlFor="precioVenta">Precio de Venta:</label>
                                    <Field
                                        name="precioVenta"
                                        type="number"
                                        placeholder="Precio de Venta"
                                        className="form-control my-2"
                                    />
                                    <ErrorMessage
                                        name="precioVenta"
                                        className="error-message"
                                        component="div"
                                    />
                                    <label htmlFor="categoria">Categoria:</label>
                                    <Field
                                        name="categoria"
                                        as="select"
                                        className="form-control"
                                        onChange={(e: { target: { value: string; }; }) => {
                                            const categoriaId = parseInt(e.target.value);
                                            setFieldValue('categoria', categoriaId);
                                        }}
                                    >
                                        <option value="">Seleccionar Categoria</option>
                                        {categorias.map((categoria) => (
                                            <option key={categoria.id} value={categoria.id}>
                                                {categoria.denominacion}
                                            </option>
                                        ))}
                                    </Field>
                                    <ErrorMessage
                                        name="categoria"
                                        className="error-message"
                                        component="div"
                                    />
                                </Col>
                                <Col>
                                    <label htmlFor="descripcion">Descripción:</label>
                                    <Field
                                        name="descripcion"
                                        type="text"
                                        placeholder="Descripción"
                                        className="form-control mt-2"
                                    />
                                    <ErrorMessage
                                        name="descripcion"
                                        className="error-message"
                                        component="div"
                                    />
                                    <label htmlFor="tiempoEstimadoMinutos">Tiempo estimado en minutos:</label>
                                    <Field
                                        name="tiempoEstimadoMinutos"
                                        type="number"
                                        placeholder="Tiempo estimado en minutos"
                                        className="form-control my-2"
                                    />
                                    <ErrorMessage
                                        name="tiempoEstimadoMinutos"
                                        className="error-message"
                                        component="div"
                                    />
                                    <FieldArray
                                        name="articuloManufacturadoDetalles"
                                        render={arrayHelpers => (
                                            <div>
                                                <label htmlFor="articuloInsumo">Articulo Insumo:</label>
                                                <div className="d-flex">
                                                    <Field
                                                        as="select"
                                                        name="selectedInsumo"
                                                        className="form-control"
                                                        value={selectedInsumo || ''}
                                                        onChange={(e: { target: { value: any; }; }) => setSelectedInsumo(Number(e.target.value))}
                                                    >
                                                        <option value="">Seleccionar Articulo Insumo</option>
                                                        {insumos
                                                            .filter(insumo => !values.articuloManufacturadoDetalles.some(detalle => detalle.id === insumo.id))
                                                            .map(insumo => (
                                                                <option key={insumo.id} value={insumo.id}>
                                                                    {insumo.denominacion}
                                                                </option>
                                                            ))
                                                        }
                                                    </Field>
                                                    <Button
                                                        variant="outline-primary"
                                                        onClick={() => handleAddInsumo(arrayHelpers)}
                                                        className="ml-2"
                                                    >
                                                        Agregar
                                                    </Button>
                                                </div>
                                                <div className="mt-2">
                                                    {values.articuloManufacturadoDetalles.map((insumo, index) => (
                                                        <div key={index} className="d-flex justify-content-between align-items-center mt-2">
                                                            <span>{insumo.denominacion}</span>
                                                            <Field
                                                                name={`articuloManufacturadoDetalles.${index}.cantidad`}
                                                                type="number"
                                                                placeholder="Cantidad"
                                                                className="form-control ml-2"
                                                                style={{ width: '100px' }}
                                                            />
                                                            <Button
                                                                variant="outline-danger"
                                                                onClick={() => arrayHelpers.remove(index)}
                                                                className="ml-2"
                                                            >
                                                                Eliminar
                                                            </Button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    />
                                </Col>
                                <Col>
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
                                    <label htmlFor="unidadMedida">Unidad de Medida:</label>
                                    <Field
                                        name="unidadMedida"
                                        as="select"
                                        className="form-control"
                                        onChange={(event: { target: { value: string; }; }) => {
                                            const selectedUnitId = parseInt(event.target.value);
                                            const selectedUnidad = unidadesMedida.find((unidad) => unidad.id === selectedUnitId);

                                            if (selectedUnidad) {
                                                setFieldValue('unidadMedida', selectedUnidad
                                                );
                                            } else {
                                                console.error("No se encontró la unidad seleccionada");
                                            }
                                        }}
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
                                </Col>
                            </Row>
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
                    )}
                </Formik>
            </Modal.Body>
        </Modal>
    );
};

export default ModalProducto;
