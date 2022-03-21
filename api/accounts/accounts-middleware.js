const yup = require('yup')
const Accounts = require('./accounts-model')


const accountSchema = yup.object().shape({
    name: yup.string()
        .typeError('name of account must be a string')
        .trim()
        .required('name and budget are required')
        .min(3, 'name of account must be between 3 and 100')
        .max(100, 'name of account must be between 3 and 100'),
    budget: yup.number()
        .typeError('budget of account must be a number')
        .required('name and budget are required')
        .min(0, 'budget of account is too large or too small')
        .max(1000000, 'budget of account is too large or too small'),
})

exports.checkAccountPayload = async (req, res, next) => {
    try {
        const validated = await accountSchema.validate(req.body)
        req.body = validated
        next()
    } catch (err) {
        next({status: 400, message: err.errors[0]})
    }
}

exports.checkAccountNameUnique = async (req, res, next) => {
    const notUnique = await Accounts.checkName(req.body.name)
    if (notUnique) {
        next({status: 400, message: 'that name is taken'})
    } else {
        next()
    }
}

exports.checkAccountId = async (req, res, next) => {
    try {
        const account = await Accounts.getById(req.params.id)
        if (!account) {
            next({status: 404, message: "account not found"})
        } else {
            req.account = account
            next()
        }
    } catch (err) {
        next(err)
    }
}

exports.errorHandling = (err, req, res, next) => { //eslint-disable-line
    res.status(err.status || 500).json({
        message: `There was an error: ${err.message}`,
    });
}
