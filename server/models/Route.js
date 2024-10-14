import mongoose from 'mongoose';

const stopSchema = new mongoose.Schema({
  location: String,
  date: Date
});

const routeSchema = new mongoose.Schema({
  traveler: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  origin: String,
  destination: String,
  departureDate: Date,
  arrivalDate: Date,
  stops: [stopSchema],
  status: { type: String, enum: ['active', 'completed', 'cancelled'], default: 'active' }
});

export default mongoose.model('Route', routeSchema);