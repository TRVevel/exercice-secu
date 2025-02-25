import express from "express";
import dotenv from "dotenv"
import mongoose from "mongoose";
import TodoRoutes from "./routes/TodoRoutes";
import AuthRoutes from "./routes/AuthRoutes";
import swaggerDocs from './config/swagger';
import swaggerUi from 'swagger-ui-express'
import cors from 'cors';
import UserRoutes from "./routes/UserRoutes";

//Création serveur express
const app = express()

//chargement des variables d'environnement
dotenv.config()

//Définition du port du serveurS
const PORT = process.env.PORT

//COnfig du serveur par défaut
app.use(express.json());

// Active CORS pour toutes les origines
app.use(cors());

//connecter MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI as string);
        console.log('MongoDB connecté avec succès');
    } catch (err) {
        console.error('Erreur lors de la connexion à MongoDB:', err);
        process.exit(1);
    }
};

connectDB();

//TODO ajouter routes ici
app.use('/todos', TodoRoutes)
app.use('/auth', AuthRoutes)
app.use('/users', UserRoutes)

// Route pour accéder au JSON brut
app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerDocs);
});

// Swagger route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

console.log(process.env.NODE_ENV);

//app.listen indique au serveur d'écouter les requêtes HTTP arrivant sur le
//port indiqué
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});