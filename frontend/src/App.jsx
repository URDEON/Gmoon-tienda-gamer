import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import RutaAdmin from './components/RutaAdmin'
import Inicio from './pages/Inicio'
import Productos from './pages/Productos'
import ProductoDetalle from './pages/ProductoDetalle'
import Carrito from './pages/Carrito'
import Checkout from './pages/Checkout'
import Ofertas from './pages/Ofertas'
import ResultadoPago from './pages/ResultadoPago'
import IniciarSesion from './pages/IniciarSesion'
import Registrar from './pages/Registrar'
import PanelAdmin from './pages/PanelAdmin'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Inicio />} />
        <Route path="/productos" element={<Productos />} />
        <Route path="/producto/:id" element={<ProductoDetalle />} />
        <Route path="/carrito" element={<Carrito />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/pago/:estado" element={<ResultadoPago />} />
        <Route path="/ofertas" element={<Ofertas />} />
        <Route path="/iniciar-sesion" element={<IniciarSesion />} />
        <Route path="/registrar" element={<Registrar />} />
        <Route
          path="/admin"
          element={
            <RutaAdmin>
              <PanelAdmin />
            </RutaAdmin>
          }
        />
      </Route>
    </Routes>
  )
}

export default App