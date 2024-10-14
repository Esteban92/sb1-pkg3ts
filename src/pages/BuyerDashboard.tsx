import React from 'react'
import { Link } from 'react-router-dom'
import { Search, ShoppingBag } from 'lucide-react'

const BuyerDashboard: React.FC = () => {
  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Panel de Comprador</h2>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Mis Solicitudes</h3>
          {/* Aquí iría una lista de solicitudes del comprador */}
          <Link to="/search-routes" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded flex items-center justify-center mt-4">
            <Search className="mr-2" />
            Buscar Rutas Disponibles
          </Link>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Productos Deseados</h3>
          {/* Aquí iría una lista de productos deseados */}
          <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded flex items-center justify-center mt-4">
            <ShoppingBag className="mr-2" />
            Agregar Producto
          </button>
        </div>
      </div>
    </div>
  )
}

export default BuyerDashboard