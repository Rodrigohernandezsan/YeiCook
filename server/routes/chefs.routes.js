const express = require('express')
const router = express.Router()

const uploader = require('../configs/cloudinary.config');

const { ensureLoggedIn, ensureLoggedOut} = require("connect-ensure-login")

const Chef = require('../models/chefCard.model')
const User = require('../models/user.model')
const Like = require('../models/likes.model')

// Role checker middleware
const checkRole = rolesToCheck => (req, res, next) => rolesToCheck.includes(req.user.role) ? next() : res.redirect('/login')

// Endpoints
router.get('/getAllChefs', (req, res, next) => {

    Chef
        .find()
        .populate('likes')
        .populate('user')
        .then(response => res.json(response))
        .catch(err => next(err))

})

router.get('/getOneChef/:id', (req, res, next) => {

    Chef
        .findById(req.params.id)
        .then(response => res.json(response))
        .catch(err => next(err))
})


router.put("/getOneChef/:id", checkRole(['ADMIN']), ensureLoggedIn(), uploader.fields([{ name: 'avatar', maxCount: 1 }, { name: 'img', maxCount: 1 }]), (req, res, next) => {
        const {
            name,
            email,
            type,
            specialty,
            location,
            contact,
            certificate,
            title,
        } = req.body
    const tempImg = req.files && req.files['img'] ? req.files['img'][0].url : req.body.img
    const tempAvatar = req.files && req.files['avatar'] ? req.files['avatar'][0].url : req.body.avatar
        Chef
            .findByIdAndUpdate(req.params.id, {
                name,
                avatar: tempAvatar,
                email,
                type,
                specialty,
                location,
                contact,
                certificate,
                title,
                img: tempImg
            }, { new: true })
            .then(response => res.json(response))
            .catch(err => next(err))
})


router.post('/newChef', checkRole(['ADMIN']), ensureLoggedIn(), uploader.fields([{ name: 'avatar', maxCount: 1 }, { name: 'img', maxCount: 1 }]), (req, res, next) => {
    const {
        name,
        email,
        type,
        specialty,
        location,
        contact,
        certificate,
        title,
    } = req.body;

    const tempImg = req.files ? req.files['img'][0].url : req.body.img
    const tempAvatar = req.files ? req.files['avatar'][0].url : req.body.avatar
        Chef
            .create({
                name,
                avatar: tempAvatar,
                email,
                type,
                specialty,
                location,
                contact,
                certificate,
                title,
                img: tempImg
            })
            .then(response => res.json(response))
            .catch(err => next(err))

})

router.delete('/chef/:id', checkRole(['ADMIN']),ensureLoggedIn(), (req, res) => {
 
            Chef
                .findByIdAndDelete(req.params.id)
                .then(response => res.status(200).json(response))
                .catch(err => next(err))
        
    })

router.post('/getOneChef/:id/like', (req, res, next) => {
    const params = { chef: req.params.id, user: req.user._id};
    console.log(params);

    Like.findOne(params)
        .then(like => {
            if (like) {
                Like.findByIdAndRemove(like._id)
                    .then(() => {
                        res.json({ like: -1 });
                    })
                    .catch(next);
            } else {
                const newLike = new Like(params);
                newLike.save()
                    .then(() => {
                        res.json({ like: 1 });
                    })
                    .catch(next);
            }
        })
        .catch(next);
})


module.exports = router
