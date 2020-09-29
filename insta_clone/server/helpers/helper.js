const Joi = require("@hapi/joi")

const sighUpValidation = (data) => {
    const schma = Joi.object({
        name: Joi.string().min(1).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required()
    })
    return schma.validate(data)
}

const sighInValidation = (data) => {
    const schma = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required()
    })
    return schma.validate(data)
}

module.exports.sighUpValidation = sighUpValidation;
module.exports.sighInValidation = sighInValidation