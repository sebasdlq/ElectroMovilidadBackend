require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const usuarioRoutes = require('./routes/usuarioRoutes');
const scooterRoutes = require('./routes/scooterRoutes');
const rentaRoutes = require('./routes/rentaRoutes');
const authRoutes = require('./routes/authRoutes')


mongoose.connect(process.env.DATABASE_URI)
.then(() => console.log('Conectado a MongoDB'))
.catch(err => console.error('Error de conexión a MongoDB:', err));

const app = express();
app.use(express.json())


// Rutas
app.use('/usuarios', usuarioRoutes);
app.use('/scooters', scooterRoutes);
app.use('/rentas', rentaRoutes);
app.use('/auth', authRoutes);

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Algo salió mal!' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Escuchando: ", PORT);
    
});

// app.get("/status", (request, response) => {
//    const status = {
//       "Status": "Running"
//    };
   
//    response.send(status);
// });
// mongoose
//     .connect(process.env.DATABASE_URI)
//     .then((err) => {

//         console.log("Connected to the database");
//         addDataToMongodb();
//     });
// const data = [
//     {
//         name: "John",
//         class: "GFG"
//     },
//     {
//         name: "Doe",
//         class: "GFG"
//     },
//     {
//         name: "Smith",
//         class: "GFG"
//     },
//     {
//         name: "Peter",
//         class: "GFG"
//     }
// ]
// const gfgSchema = new mongoose
//     .Schema({
//         name: { type: String, required: true },
//         class: { type: String, required: true },
//     });

// const GFGCollection = mongoose
//     .model("GFGCollection", gfgSchema);

// async function addDataToMongodb() {
//     await GFGCollection
//         .deleteMany();
//     await GFGCollection
//         .insertMany(data);
//     console.log("Data added to MongoDB");
// }

