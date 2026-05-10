import express from 'express'
import dotenv from 'dotenv'
import connectDB from "./config/db.js"
import { globalErrorHandler } from './middleware/globalError.js'
import router from './routes/index.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(express.json())

connectDB()

app.use('/api', router)

app.use((req, res, next) => {
    const error: any = new Error(`${req.originalUrl} not found!`);
    error.statusCode = 404;
    next(error);
});

app.use(globalErrorHandler)

const server = app.listen(PORT, () => {
    console.log(`SERVER is running on PORT ${PORT}`)
})