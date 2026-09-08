const express = require('express');
const router = express.Router();

const Coupons = require('../models/coupons.model')

// const fileUploader = require('./../config/cloudinary.config')

router.get("/", (req, res) => {

    Coupons.find().then(coupons => {
        res.json(coupons)
    }).catch(err => {
        res.status(400).json(err)
    })

})

router.get("/:id", (req, res) => {

    const id = req.params.id

    Coupons.findById(id).then(coupon => {
        res.json(coupon)
    }).catch(err => {
        res.status(400).json(err)
    })

})

router.post("/", (req, res) => {

    const coupon = req.body

    Coupons.create(coupon)
        .then(newCoupon => {
            let id = newCoupon._id;
            return Coupons.findByIdAndUpdate(
                id,
            );
        })
        .then(updatedCoupon => {
            res.json(updatedCoupon);
        })
        .catch(err => {
            res.status(400).json(err);
        });

})

router.put("/:id", (req, res) => {

    const coupon = req.body

    Coupons.findByIdAndUpdate(coupon._id, coupon, { new: true }).then(newCoupon => {
        res.json(newCoupon)
    }).catch(err => {
        res.status(400).json(err)
    })
})

router.delete("/:id", (req, res) => {

    const id = req.params.id

    Coupons.findByIdAndDelete(id).then(couponDeleted => {
        res.json({
            message: "Coupons Eliminados",
            couponDeleted
        })
    }).catch(err => {
        res.status(400).json(err)
    })

})

module.exports = router;
