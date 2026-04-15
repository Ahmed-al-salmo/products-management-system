import React from 'react';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import  Login from './auth/login';
import Departments from './components/departments/departments';
import Employees from './components/employees/employees';
import AddEmp from './components/employees/add-emp/addEmp';
import UpdateEmp from './components/employees/update-emp/updateEmp';
import AddDept from './components/departments/add-dept/addDept';
import UpdateDept from './components/departments/update-dept/updateDept';
import Managers from './components/managers/managers';
import Product from './components/products/product';
import Sold from './components/salesInfo/sold/sold';
import Debts from './components/salesInfo/debts/debts';
import Inventory from './components/salesInfo/inventory/inventory';
import ToDo from './components/todo/todo';
import './App.css'

function App() {
  

  return (
    <div className='w-full h-screen bg-blue-300 font-mono'>
      <div className='absolute left-[52%] translate-x-[-50%] text-2xl mt-3 text-fuchsia-400 p-3 rounded-full bg-gray-500/30'>Products Management System</div>
      <BrowserRouter>
        <Routes>
          {/* <Login /> */}
          {/* <Departments /> */}
          {/* <Employees /> */}
          {/* <AddEmp /> */}
          {/* <UpdateEmp /> */}
          
          <Route path='/' element={<Login />} />
          <Route path='/products/employees' element={<Employees />} />
          <Route path='/departments/products/update-emp' element={<UpdateEmp />} />
          <Route path='/departments/products/add-emp' element={<AddEmp />} />
          <Route path='/departments' element={<Departments />} />
          <Route path='/departments/add-dept' element={<AddDept />} />
          <Route path='/departments/update-dept' element={<UpdateDept />} />
          <Route path='/managers' element={<Managers />} />
          <Route path='/departments/products' element={<Product />} />
          <Route path='/products/sold' element={<Sold />} />
          <Route path='/products/debts' element={<Debts />} />
          <Route path='/products/inventory' element={<Inventory />} />
          <Route path='/products/todo' element={<ToDo />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
