import express from 'express';
import Route from '../models/Route.js';

const router = express.Router();

// Get all routes
router.get('/', async (req, res) => {
  try {
    const routes = await Route.find().populate('traveler', 'name');
    res.json(routes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new route
router.post('/', async (req, res) => {
  const route = new Route(req.body);
  try {
    const newRoute = await route.save();
    res.status(201).json(newRoute);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get a specific route
router.get('/:id', getRoute, (req, res) => {
  res.json(res.route);
});

// Update a route
router.patch('/:id', getRoute, async (req, res) => {
  if (req.body.origin != null) {
    res.route.origin = req.body.origin;
  }
  if (req.body.destination != null) {
    res.route.destination = req.body.destination;
  }
  // Update other fields as needed

  try {
    const updatedRoute = await res.route.save();
    res.json(updatedRoute);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a route
router.delete('/:id', getRoute, async (req, res) => {
  try {
    await res.route.remove();
    res.json({ message: 'Route deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Middleware to get a route by ID
async function getRoute(req, res, next) {
  let route;
  try {
    route = await Route.findById(req.params.id);
    if (route == null) {
      return res.status(404).json({ message: 'Route not found' });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }

  res.route = route;
  next();
}

export default router;