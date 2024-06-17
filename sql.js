import pg from 'pg'
import 'dotenv/config'
import { configDotenv } from 'dotenv'
configDotenv()
const Pool = pg.Pool
const superUser = new Pool({
	user: process.env.POSTGRESSUPERUSER,
	password: process.env.POSTGRESSUPASSWORD,
	host: process.env.POSTGRESHOST,
	port: process.env.POSTGRESPORT,
})
const user = new Pool({
	user: process.env.POSTGRESUSER,
	password: process.env.POSTGRESPASSWORD,
	host: process.env.POSTGRESHOST,
	port: process.env.POSTGRESPORT,
	database: process.env.POSTGRESDATABASE,
})

await superUser.query(
	`CREATE USER ${process.env.POSTGRESUSER} WITH PASSWORD '${process.env.POSTGRESPASSWORD}'`
)
await superUser.query(
	`CREATE DATABASE ${process.env.POSTGRESDATABASE} WITH OWNER ${process.env.POSTGRESUSER}`
)
await user.connect()
await user.query(
	`CREATE TABLE ${process.env.POSTGRESTABLE}(id BIGSERIAL NOT NULL PRIMARY KEY, title VARCHAR NOT NULL, text VARCHAR NOT NULL, tags VARCHAR[], image VARCHAR)`
)
user.end()
process.exit()
