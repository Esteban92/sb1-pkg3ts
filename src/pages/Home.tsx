import React from 'react'
import { Link } from 'react-router-dom'
import { Plane, ShoppingBag } from 'lucide-react'

const Home: React.FC = () => {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-6">Bienvenido a TravelShare</h1>
      <p className="text-xl mb-8">Conectamos viajeros y compradores para envíos internacionales colaborativos</p>
      <div className="flex justify-center space-x-4">
        <Link to="/traveler" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded flex items-center">
          <Plane className="mr-2" />
          Soy Viajero
        </Link>
        <Link to="/buyer" className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded flex items-center">
          <ShoppingBag className="mr-2" />
          Soy Comprador
        </Link>
      </div>
    </div>
  )
}

export default Home