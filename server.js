import express from 'express'

const PORT = process.env.port || 3004;
const app = express();
const server = app.listen(PORT,() => console.log(`NOOOOOOO`,PORT));
app.use(express.static('public'));
