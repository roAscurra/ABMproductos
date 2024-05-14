import DataModel from "./DataModel";
import IImagen from "./IImagen";
import IUnidadMedida from "./IUnidadMedida";

interface IArticuloInsumo extends DataModel<IArticuloInsumo>{
    id: number;
    denominacion: string;
    precioVenta: number;
    imagenes: IImagen [];
    unidadMedida: IUnidadMedida;
    precioCompra: number;
    stockActual: number;
    stockMaximo: number;
    esParaElaborar: boolean;
}

export default IArticuloInsumo;