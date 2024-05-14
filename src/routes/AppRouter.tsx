import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Ingredientes } from "../components/screens/Ingredientes/Ingredientes";


export const AppRouter = () => {
  return (
    <BrowserRouter>
        <Routes>
            <Route path="*" element={<Ingredientes />} />
        </Routes>
    </BrowserRouter>
  );
};