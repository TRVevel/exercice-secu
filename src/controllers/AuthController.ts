import e, { Request, Response } from "express";
import { hashPassword, verifyPassword } from "../utils/pwdUtils";
import User, { UserI } from "../DBSchemas/User";
import { generateToken } from "../utils/JWTUtils";

export async function register(req: Request, res: Response) {
    try {
        const { name, email, password, age } = req.body;

        if (!name || !email || !password) {
            res.status(400).send({ message: 'champs name, email et password obligatoires' })
            return
        }

        const hashedPassword = await hashPassword(password);

        const newUser: UserI = new User({ name, email, hashedPassword, age })
        const createdUser = await newUser.save();

        createdUser.hashedPassword = '';
        res.status(201).send({ message: 'Utilisateur créé avec succès', user: createdUser })
    } catch (err: any) {
        //erreur de duplication
        if (err.code === 11000) {
            res.status(400).send({ message: "email ou nom déjà existant." })
            return
        } else {
            res.status(500).send({ message: err.message });
        }
    }
}

export async function login(req: Request, res: Response) {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            res.status(400).send({ message: 'champs email et password obligatoires' })
            return
        }

        const user = await User.findOne({ email });

        if (!user) {
            res.status(404).send({ message: 'utilisateur non trouvé' })
            return
        }

        const isPasswordValid = await verifyPassword(password, user.hashedPassword);

        if (!isPasswordValid) {
            res.status(401).json({ message: 'Mot de passe invalide' })
            return
        }

        const token = generateToken({ id: user._id })

        //Envoyer le token dans un cookier sécurisé,
        //le cookie n'est pas accesible par le client et ne peut être enbvoyé qu'à son émetteur
        res.cookie('jwt', token, { httpOnly: true, sameSite: 'strict' });
        res.status(200).json({ message: 'Login succesful!' })
    } catch (err: any) {
        res.status(500).send({ message: err.message })
    }
}