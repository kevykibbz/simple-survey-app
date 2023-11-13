import React,{Suspense} from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Preloader from "../Components/Preloader/Preloader"
import './App.css';


const NoPage=React.lazy(()=>import("../Components/404/404"))
const Home=React.lazy(()=>import("../Components/Home/Home"))


function App() {


  return (
    <Suspense  fallback={<Preloader/>}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<NoPage />} />
        </Routes>
      </BrowserRouter>
    </Suspense>
  );
}

export default App;
