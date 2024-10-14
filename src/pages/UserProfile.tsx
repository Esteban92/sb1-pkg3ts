import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { Star, User } from 'lucide-react';

interface Review {
  _id: string;
  reviewer: {
    _id: string;
    name: string;
  };
  rating: number;
  comment: string;
  createdAt: string;
}

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  role: string;
  rating: number;
}

const UserProfile: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const { user: currentUser } = useAuth();

  useEffect(() => {
    fetchUserProfile();
    fetchReviews();
  }, [userId]);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/users/${userId}`);
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/reviews/user/${userId}`);
      setReviews(response.data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/reviews', {
        reviewed: userId,
        rating: newReview.rating,
        comment: newReview.comment
      });
      setNewReview({ rating: 5, comment: '' });
      fetchReviews();
      fetchUserProfile();
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  if (!user) {
    return <div>Cargando perfil...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white shadow-md rounded p-6 mb-6">
        <div className="flex items-center mb-4">
          <User className="w-16 h-16 text-gray-400 mr-4" />
          <div>
            <h2 className="text-2xl font-bold">{user.name}</h2>
            <p className="text-gray-600">{user.role === 'traveler' ? 'Viajero' : 'Comprador'}</p>
          </div>
        </div>
        <div className="flex items-center mb-4">
          <Star className="text-yellow-400 mr-1" />
          <span className="font-bold">{user.rating?.toFixed(1) || 'N/A'}</span>
          <span className="text-gray-600 ml-1">({reviews.length} reseñas)</span>
        </div>
      </div>

      {currentUser && currentUser._id !== userId && (
        <div className="bg-white shadow-md rounded p-6 mb-6">
          <h3 className="text-xl font-bold mb-4">Dejar una reseña</h3>
          <form onSubmit={handleSubmitReview}>
            <div className="mb-4">
              <label className="block mb-2">Calificación</label>
              <select
                value={newReview.rating}
                onChange={(e) => setNewReview({ ...newReview, rating: parseInt(e.target.value) })}
                className="w-full p-2 border rounded"
              >
                {[5, 4, 3, 2, 1].map((rating) => (
                  <option key={rating} value={rating}>{rating} estrellas</option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block mb-2">Comentario</label>
              <textarea
                value={newReview.comment}
                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                className="w-full p-2 border rounded"
                rows={3}
                required
              ></textarea>
            </div>
            <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
              Enviar Reseña
            </button>
          </form>
        </div>
      )}

      <div className="bg-white shadow-md rounded p-6">
        <h3 className="text-xl font-bold mb-4">Reseñas</h3>
        {reviews.length === 0 ? (
          <p>No hay reseñas aún.</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review._id} className="border-b pb-4">
                <div className="flex items-center mb-2">
                  <Star className="text-yellow-400 mr-1" />
                  <span className="font-bold mr-2">{review.rating}</span>
                  <span className="text-gray-600">{review.reviewer.name}</span>
                </div>
                <p>{review.comment}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {new Date(review.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;