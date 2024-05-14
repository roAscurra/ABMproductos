import DataModel from "./DataModel";
import IArticuloInsumo from "./ICategoria";

interface IArticuloManufacturadoDetalle extends  DataModel<IArticuloManufacturadoDetalle> {
    cantidad: number;
    articuloInsumo: IArticuloInsumo;
}

export default IArticuloManufacturadoDetalle;