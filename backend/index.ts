import 'dotenv/config';
import cors from 'cors';
import app from './src/app.js';
const PORT = process.env.PORT || 3000;

app.use(cors());

app.listen(PORT, () => {
  console.log(`o servidor ta rodando http://localhost:${PORT}`);
});