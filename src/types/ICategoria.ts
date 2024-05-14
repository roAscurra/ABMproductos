import DataModel from "./DataModel";

interface ICategoria extends DataModel<ICategoria>{
    denominacion: string,
    articulos: [],
    subCategorias: ICategoria[]
}

export default ICategoria;