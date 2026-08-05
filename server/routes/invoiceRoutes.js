const express = require('express');
const router = express.Router();
const Invoice = require('../models/Invoice');
const authMiddleware = require('../middleware/authMiddleware');

// Nayi invoice add karo
 router.post('/', authMiddleware, async (req, res) => {
  try {
    const newInvoice = new Invoice({
      ...req.body,
      user: req.userId,
    });

    const savedInvoice = await newInvoice.save();
    res.status(201).json(savedInvoice);
  } catch (err) {
  console.error("Invoice Error:", err);
  console.error("Request Body:", req.body);

  res.status(500).json({
    message: err.message,
  });
}
});
// Sari invoices dekho
router.get('/', authMiddleware, async (req, res) => {
  try {
    const invoices = await Invoice.find({
      user: req.userId,
    }).sort({ createdAt: -1 });

    res.json(invoices);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// Ek invoice delete karo
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const deleted = await Invoice.findOneAndDelete({
      _id: req.params.id,
      user: req.userId,
    });

    if (!deleted) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    res.json({ message: 'Invoice deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;