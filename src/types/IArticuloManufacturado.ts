import DataModel from "./DataModel";
import IArticuloManufacturadoDetalle from "./IArticuloManufacturadoDetalle";
import IImagen from "./IImagen";
import IUnidadMedida from "./IUnidadMedida";

interface IArticuloManufacturado extends DataModel<IArticuloManufacturado> {
    denominacion: string;
    precioVenta: number;
    imagenes: IImagen[];
    unidadMedida: IUnidadMedida;
    descripcion: string;
    tiempoEstimadoMinutos: number;
    preparacion: string;
    articuloManufacturadoDetalles: IArticuloManufacturadoDetalle[];
}

export default IArticuloManufacturado;