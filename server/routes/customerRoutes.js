const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');
const authMiddleware = require('../middleware/authMiddleware');

// Naya customer add karo
router.post('/', authMiddleware, async (req, res) => {
  try {
    const newCustomer = new Customer({
      ...req.body,
      user: req.userId,
    });
    const savedCustomer = await newCustomer.save();
    res.status(201).json(savedCustomer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Sare customers dekho
router.get('/', authMiddleware, async (req, res) => {
  try {
    const customers = await Customer.find({ user: req.userId }).sort({ createdAt: -1 });
    res.json(customers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Ek customer delete karo
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const deleted = await Customer.findOneAndDelete({
      _id: req.params.id,
      user: req.userId,
    });
    if (!deleted) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.json({ message: 'Customer deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;