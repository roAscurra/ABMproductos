import DataModel from "./DataModel";
import IArticuloManufacturadoDetalle from "./IArticuloManufacturadoDetalle";
import IImagenArticulo from "./IImagenArticulo";
import IUnidadMedida from "./IUnidadMedida";

interface IArticuloManufacturado extends DataModel<IArticuloManufacturado> {
    denominacion: string;
    precioVenta: number;
    imagenes: IImagenArticulo[];
    unidadMedida: IUnidadMedida;
    descripcion: string;
    tiempoEstimadoMinutos: number;
    preparacion: string;
    articuloManufacturadoDetalles: IArticuloManufacturadoDetalle[];

}

export default IArticuloManufacturado;