import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import IArticuloInsumo from '../../types/IArticuloInsumo';

interface InitialState {
  ArticuloInsumo: IArticuloInsumo[]; 
}

const initialState: InitialState = {
    ArticuloInsumo: [],
}

export const ArticulosInsumoSlice = createSlice({
  name: 'ArticuloInsumoState',
  initialState,
  reducers: {
    setArticuloInsumo: (state, action: PayloadAction<IArticuloInsumo[]>) => {
       state.ArticuloInsumo = action.payload;
    },
    resetUsuario: (state) => {
      state.ArticuloInsumo = [];
    }
  },
})

export const { setArticuloInsumo, resetUsuario } = ArticulosInsumoSlice.actions;

export default ArticulosInsumoSlice.reducer;
