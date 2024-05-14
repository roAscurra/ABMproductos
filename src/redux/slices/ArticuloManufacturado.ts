import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import IArticuloManufacturado from '../../types/IArticuloManufacturado';

interface IInitialState {
  articuloManufacturado: IArticuloManufacturado[];
}

const initialState: IInitialState = {
  articuloManufacturado: [],
}

export const articuloManufacturadoSlice = createSlice({
  name: 'articuloManufacturadoState',
  initialState,
  reducers: {
    setArticuloManufacturado: (state, action: PayloadAction<IArticuloManufacturado[]>) => {
      state.articuloManufacturado = action.payload;
    },
    resetArticuloManufacturado: (state) => {
      state.articuloManufacturado = [];
    }
  },
})

export const { setArticuloManufacturado, resetArticuloManufacturado } = articuloManufacturadoSlice.actions;

export default articuloManufacturadoSlice.reducer;