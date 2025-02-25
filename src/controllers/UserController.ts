import { Request, Response } from "express";
import User from "../DBSchemas/User";

export async function getAllUsers(req: Request, res: Response) {
    try {
        const users = await User.find(); // Ajout du `await` pour attendre la requête
        res.status(200).json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}