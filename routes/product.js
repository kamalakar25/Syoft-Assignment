const express = require('express');
const jwt = require('jsonwebtoken');
const Product = require('../models/Product');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/', auth, (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied' });
    }
    const { title, description, inventoryCount } = req.body;
    const product = new Product({ title, description, inventoryCount });
    product.save()
        .then(() => res.status(201).json({ message: 'Product created' }))
        .catch(err => res.status(500).send('Server error'));
});

router.get('/', auth, (req, res) => {
    if (req.user.role !== 'admin' && req.user.role !== 'manager') {
        return res.status(403).json({ message: 'Access denied' });
    }
    Product.find()
        .then(products => res.json(products))
        .catch(err => res.status(500).send('Server error'));
});

router.put('/:id', auth, (req, res) => {
    if (req.user.role !== 'admin' && req.user.role !== 'manager') {
        return res.status(403).json({ message: 'Access denied' });
    }
    const { title, description, inventoryCount } = req.body;
    Product.findByIdAndUpdate(req.params.id, { title, description, inventoryCount }, { new: true })
        .then(product => res.json(product))
        .catch(err => res.status(500).send('Server error'));
});

router.delete('/:id', auth, (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied' });
    }
    Product.findByIdAndDelete(req.params.id)
        .then(() => res.json({ message: 'Product deleted' }))
        .catch(err => res.status(500).send('Server error'));
});

router.delete('/', auth, (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied' });
    }
    Product.deleteMany({})
        .then(() => res.json({ message: 'All products deleted' }))
        .catch(err => res.status(500).send('Server error'));
});


module.exports = router;
