const express = require('express');
const router = express.Router();
const MarineSpecies = require('../model/MarineSpecies');

// ➕ Create
router.post('/', async (req, res) => {
  try {
    const species = new MarineSpecies(req.body);
    await species.save();
    res.status(201).json(species);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 📖 Read All
router.get('/', async (req, res) => {
  const list = await MarineSpecies.find();
  res.json(list);
});

// 🔍 Read One
router.get('/:id', async (req, res) => {
  const species = await MarineSpecies.findById(req.params.id);
  res.json(species);
});

// ✏️ Update
router.put('/:id', async (req, res) => {
  const updated = await MarineSpecies.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

// ❌ Delete
router.delete('/:id', async (req, res) => {
  await MarineSpecies.findByIdAndDelete(req.params.id);
  res.sendStatus(204);
});

module.exports = router;
