const express = require('express')
const Accounts = require('./accounts-model')
const router = express.Router()

const {
    errorHandling,
    checkAccountNameUnique,
    checkAccountId,
    checkAccountPayload,
} = require('./accounts-middleware')

router.get('/', async (req, res, next) => {
    try {
        const data = await Accounts.getAll()
        res.json(data)
    } catch (err) {
        next(err)
    }
})

router.get('/:id', checkAccountId, (req, res) => {
    res.status(200).json(req.account)

})

router.post('/', checkAccountPayload, checkAccountNameUnique, async (req, res, next) => {
    try {
        const data = await Accounts.create(req.body)
        res.status(201).json(data)
    } catch (err) {
        next(err)
    }
})

router.put('/:id', checkAccountPayload, checkAccountNameUnique, checkAccountId, async (req, res, next) => {
    try {
        const updated = await Accounts.updateById(req.params.id, req.body)
        res.status(200).json(updated)
    } catch (err) {
        next(err)
    }
});

router.delete('/:id', checkAccountId, async (req, res, next) => {
    try {
        const deletedAccount = await Accounts.deleteById(req.params.id)
        res.json(deletedAccount)
    } catch (err) {
        next(err)
    }
})

router.use(errorHandling);

module.exports = router;
