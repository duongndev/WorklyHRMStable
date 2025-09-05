import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {employeeApi} from '../../services/AdminApiService';

const initialState = {
  employees: [],
  employee: null,
  loading: false,
  error: null,
};

export const fetchEmployees = createAsyncThunk(
  'employee/fetchEmployees',
  async (_, {rejectWithValue}) => {
    try {
      const response = await employeeApi.get('/employee/all');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const fetchEmployeeById = createAsyncThunk(
  'employee/fetchEmployeeById',
  async (employeeId, {rejectWithValue}) => {
    try {
      const response = await employeeApi.get(`/employee/${employeeId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const createEmployee = createAsyncThunk(
  'employee/createEmployee',
  async (employeeData, {rejectWithValue}) => {
    try {
      const response = await employeeApi.post('/employee/create', employeeData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const updateEmployee = createAsyncThunk(
  'employee/updateEmployee',
  async ({employeeId, employeeData}, {rejectWithValue}) => {
    try {
      const response = await employeeApi.put(
        `/employee/${employeeId}/update`,
        employeeData,
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const deleteEmployee = createAsyncThunk(
  'employee/deleteEmployee',
  async (employeeId, {rejectWithValue}) => {
    try {
      await employeeApi.delete(`/employee/${employeeId}/delete`);
      return employeeId;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

const employeeSlice = createSlice({
  name: 'employee',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchEmployees.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.loading = false;
        state.employees = action.payload;
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchEmployeeById.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployeeById.fulfilled, (state, action) => {
        state.loading = false;
        state.employee = action.payload;
      })
      .addCase(fetchEmployeeById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createEmployee.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createEmployee.fulfilled, (state, action) => {
        state.loading = false;
        state.employees.push(action.payload);
      })
      .addCase(createEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateEmployee.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateEmployee.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.employees.findIndex(
          emp => emp._id === action.payload._id,
        );
        if (index !== -1) {
          state.employees[index] = action.payload;
        }
      })
      .addCase(updateEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteEmployee.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteEmployee.fulfilled, (state, action) => {
        state.loading = false;
        state.employees = state.employees.filter(
          emp => emp._id !== action.payload,
        );
      })
      .addCase(deleteEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default employeeSlice.reducer;