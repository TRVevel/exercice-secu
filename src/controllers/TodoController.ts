import { Request, Response } from "express";
import Todo from "../DBSchemas/Todo";
import { JwtPayload } from "jsonwebtoken";

export async function createTodo(req: Request, res: Response) {
    try {
        const payload: JwtPayload = JSON.parse(req.headers.payload as string);
        const userId = payload.id
        const { task } = req.body;

        //Validation des champs
        if (!task) {
            res.status(400).send({ message: "champs task requis" })
            return
        }

        const newTodo = new Todo({ task, userId });

        const updatedTodo = await newTodo.save();

        res.status(201).send(updatedTodo)
    }
    catch (err: any) {
        res.status(500).send({ message: err.message })
    }

}

export async function getAllTodos(req: Request, res: Response) {
    try {
        const todos = await Todo.find();

        res.status(200).send(todos);
    }
    catch (err: any) {
        res.status(500).send({ message: "err.message" })
    }
}

export async function modifyTodo(req: Request, res: Response) {
    try {
        const { id } = req.params; // Récupérer l'ID depuis les paramètres de la requête

        // Validation des champs 
        if (!id) {
            res.status(400).json({ message: 'ID requis pour mettre à jour une todo' });
            return
        }

        // Mise à jour des champs
        const updatedTodo = await Todo.findByIdAndUpdate(
            id, // ID de l'utilisateur à mettre à jour
            { completed: true }, // Champs à mettre à jour
            { new: true, runValidators: true } // Options : retourner la nouvelle todo et valider les données
        );

        if (!updatedTodo) {
            res.status(404).json({ message: 'Todo non trouvée' });
            return
        }

        // Réponse réussie
        res.status(200).json({ message: 'Todo mise à jour avec succès', data: updatedTodo });

    } catch (err: any) {
        // Gestion des erreurs
        res.status(500).json({ message: 'Erreur interne', error: err.message });
    }

}

export async function getAllFalses(req: Request, res: Response) {
    try {
        const todos = await Todo.find({ completed: false });

        res.status(200).send(todos);
    }
    catch (err: any) {
        res.status(500).send({ message: "err.message" })
    }
}

export async function getAllFromUser(req: Request, res: Response) {

    try {
        const payload: JwtPayload = JSON.parse(req.headers.payload as string);
        const id = payload.id
        if (!payload || !id) {
            res.status(400).send({ message: "payload incorrect" })
        }
        const todos = await Todo.find({ userId: id })
        res.status(200).send({ message: "todos de l'user : " + id, todos: todos })

    } catch (error: any) {
        res.status(500).send({ message: error.message })
    }
}