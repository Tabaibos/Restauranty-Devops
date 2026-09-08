const express = require('express');
const router = express.Router();

const Order = require('../models/Order.model')

// const fileUploader = require('./../config/cloudinary.config')

router.get("/", (req, res) => {

    Order.find().then(orders => {
        console.log(orders);
        res.json(orders)
    }).catch(err => {
        res.status(400).json(err)
    })

})

router.get("/:id", (req, res) => {

    const id = req.params.id

    Order.findById(id).then(order => {
        res.json(order)
    }).catch(err => {
        res.status(400).json(err)
    })

})

router.put("/", (req, res) => {

    const order = req.body

    order.findByIdAndUpdate(order._id, order, { new: true }).then(newOrder => {
        res.json(newOrder)
    }).catch(err => {
        res.status(400).json(err)
    })

})

router.delete("/:id", (req, res) => {

    const id = req.params.id

    Order.findByIdAndDelete(id).then(orderDeleted => {
        res.json({
            message: "Order Eliminado",
            orderDeleted
        })
    }).catch(err => {
        res.status(400).json(err)
    })

})

module.exports = router;
