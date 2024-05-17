import { Button, Modal } from 'react-bootstrap';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import ICategoria from '../../../types/ICategoria';
import CategoriaService from '../../../services/CategoriaService';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux';
import { toggleModal } from '../../../redux/slices/Modal';

interface ModalCategoriaProps {
    getCategories: () => void;
    categoryToEdit?: ICategoria;
}

const ModalCategoria: React.FC<ModalCategoriaProps> = ({ getCategories, categoryToEdit }) => {
    const categoriaService = new CategoriaService();
    const url = import.meta.env.VITE_API_URL;

    const initialValues: ICategoria = categoryToEdit
        ? categoryToEdit
        : {
            id: 0,
            denominacion: '',
            articulos: [],
            subCategorias: [],
        };


    const modal = useAppSelector((state) => state.modal.modal);
    const dispatch = useAppDispatch();

    const handleClose = () => {
        dispatch(toggleModal({ modalName: 'modal' }));
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
                <Modal.Title>{categoryToEdit ? 'Editar Categoría' : 'Agregar Categoría'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Formik
                    validationSchema={Yup.object({
                        denominacion: Yup.string().required('Campo requerido')
                    })}
                    initialValues={initialValues}
                    onSubmit={async (values: ICategoria) => {
                        try {
                            if (categoryToEdit) {
                                await categoriaService.put(url + 'api/categoria', values.id.toString(), values);
                                console.log('Categoría actualizada correctamente.');
                            } else {
                                await categoriaService.post(url + 'api/categoria', values);
                                console.log('Categoría agregada correctamente.');
                            }
                            getCategories();
                            handleClose();
                        } catch (error) {
                            console.error('Error al realizar la operación:', error);
                        }
                    }}
                >
                    {() => (
                        <>
                            <Form autoComplete="off">
                                <div className="mb-4">
                                    <label htmlFor="denominacion">Nombre:</label>
                                    <Field name="denominacion" type="text" placeholder="Nombre de la Categoría" className="form-control mt-2" />
                                    <ErrorMessage name="denominacion" className="error-message" component="div" />
                                </div>
                                <div className="d-flex justify-content-end">
                                    <Button variant="outline-success" type="submit" className="custom-button">
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

export default ModalCategoria;