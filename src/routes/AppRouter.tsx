import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Ingredientes } from "../components/screens/Ingredientes/Ingredientes";
import { BarraMenu } from "../components/ui/BarraMenu/BarraMenu";
import { Categoria } from "../components/screens/Categoria/Categoria";
import { Productos } from "../components/screens/Productos/Productos";


export const AppRouter = () => {
  return (
    <BrowserRouter>
        <Routes>
            <Route path="*" element={<><BarraMenu /></>} />
            <Route path="/ingredientes" element={<><BarraMenu /> <Ingredientes /></>}  />
            <Route path="/categorias" element={<><BarraMenu /> <Categoria /></>}  />
            <Route path="/productos" element={<><BarraMenu /> <Productos /></>}  />
        </Routes>
    </BrowserRouter>
  );
};