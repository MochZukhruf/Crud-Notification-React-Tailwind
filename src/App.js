  import './App.css';
  import { Navbar } from './components/Navbar';
  import { Footer } from './components/Footer';
  import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
  import Home from './pages/Home';
  import { Table } from './components/Table';
import { Hero } from './components/Hero';
  

  function App() {
  
    return (
      <><Router>
        <div className="App">
          <Navbar />
        <Routes>
          <Route path = "/" element={<Home/>} />
          <Route path='/edit/:id_data' element={<Hero/>}/>
          <Route path = "/table" element={<Table/>}/>
          
        </Routes>
        <Footer />
        </div>
        </Router></>
      
    );
  }

  export default App;
