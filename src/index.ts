import express from "express";
import dotenv from "dotenv"
import mongoose from "mongoose";
import TodoRoutes from "./routes/TodoRoutes";
import AuthRoutes from "./routes/AuthRoutes";
import swaggerDocs from './config/swagger';
import swaggerUi from 'swagger-ui-express'
import cors from 'cors';
import UserRoutes from "./routes/UserRoutes";
import mongoSanitize from "express-mongo-sanitize";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

//Création serveur express
const app = express()

//chargement des variables d'environnement
dotenv.config()

//Définition du port du serveurS
const PORT = process.env.PORT

//COnfig du serveur par défaut
app.use(express.json());

// Active CORS pour toutes les origines
const corsOptions = {
    origin: process.env.API_URL || "http://localhost:4200", // Placer le domaine du client pour
    methods: 'GET,POST,DELETE,PUT', // Restreindre les méthodes autorisées
    allowedHeaders: 'Content-Type,Authorization', // Définir les en-têtes acceptés
    credentials: true // Autoriser les cookies et les headers sécurisés
    };
app.use(cors(corsOptions));
app.use(mongoSanitize());
export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // ⏳ temps en millisecondes
    max: 100, // 🔒 Limite à 100 requêtes par IP
    message: "⛔ Trop de requêtes. Réessayez plus tard."
    });
    // Appliquer le rate limiter sur toutes les routes
app.use(apiLimiter);
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
app.use(
    helmet({
    contentSecurityPolicy: {
    directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "'nonce-random123'"],
    styleSrc: ["'self'"], // Supprimer 'strict-dynamic'
    imgSrc: ["'self'"], // Supprimer 'data:'
    objectSrc: ["'none'"],
    baseUri: ["'self'"],
    formAction: ["'self'"],
    frameAncestors: ["'none'"],
    scriptSrcAttr: ["'none'"],
    upgradeInsecureRequests: [],
    },
    },
    })
    );
    
//TODO ajouter routes ici
app.use('/todos', TodoRoutes)
app.use('/auth', AuthRoutes)
app.use('/users', UserRoutes)

// Route pour accéder au JSON brut
app.get('/swagger.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerDocs);
});

// Swagger route
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

console.log(process.env.NODE_ENV);

//app.listen indique au serveur d'écouter les requêtes HTTP arrivant sur le
//port indiqué
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});