import express, { urlencoded } from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import session from 'express-session'
import passport from 'passport'
import dbConnect from './DB/dbConnect.js'
import authRouter from './routes/auth.routes.js'

dotenv.config()
const app = express()
const allowedOrigins = process.env.CLIENT_URL?.split(",") || [];

dbConnect()

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

app.use(session({
  secret: 'yourSecret',
  resave: false,
  saveUninitialized: false,
}));

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())
app.use(passport.initialize());
app.use(passport.session());

app.use('/api/auth', authRouter);

app.get('/', (req, res) => res.send('Server is Running'));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});