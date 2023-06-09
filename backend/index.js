import userRouter from './routes/users.js';
import postRouter from './routes/posts.js';
import authRouter from './routes/auth.js';
import followsRouter from './routes/follows.js';
import subgreddiitsRouter from './routes/subgreddiits.js';
import reportsRouter from './routes/reports.js';

import express from 'express';
import connectDB from './utils/connectDB.js';
import cors from 'cors';

//middleware : runs before calling the routes


const app = express();
app.use(cors());

connectDB();

app.use(express.json());

//uniqueness: method and URL

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use('/api/users', userRouter);
app.use('/api/posts', postRouter);
app.use('/api/auth', authRouter);
app.use('/api/follows', followsRouter);
app.use('/api/subgreddiits', subgreddiitsRouter);
app.use('/api/reports', reportsRouter);


// in case of route conflicts, top route is picked
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });