import Joi from 'joi'
import errorMessages from './errorMessages.js'
import dotenv from 'dotenv'
dotenv.config()

const validator = (schema) => (payload) => schema.validate(payload)

const postValidation = {
	title: Joi.string().required(),
	text: Joi.string().required(),
	image: Joi.string().allow('').required(),
	tags: Joi.array().items(Joi.string()).required(),
}
const passcodeValidation = {
	passcode: Joi.string()
		.required()
		.valid(process.env.PASSCODE)
		.messages({ 'any.invalid': errorMessages.wrongPasscode }),
}

const idValidation = { id: Joi.number().positive().required() }
const postSchema = Joi.object(postValidation).append(passcodeValidation)
const editSchema = Joi.object(postValidation)
	.append(idValidation)
	.append(passcodeValidation)
const removeSchema = Joi.object(idValidation).append(passcodeValidation)

export const validatePost = validator(postSchema)
export const validateEdit = validator(editSchema)
export const validateRemove = validator(removeSchema)
