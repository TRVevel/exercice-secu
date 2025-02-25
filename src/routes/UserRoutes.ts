import express from "express"
import { createTodo, getAllFalses, getAllFromUser, getAllTodos, modifyTodo } from "../controllers/TodoController";
import { verifyTokenMiddleware } from "../middleware/verifyTokenMiddleware";
import { getAllUsers } from "../controllers/UserController";

const router = express.Router()

/**
 * @openapi
 * /users:
 *   get:
 *     summary: Retrieve all users
 *     tags:
 *       - Users
 *     description: Fetches a list of all users from the database.
 *     responses:
 *       200:
 *         description: Successfully retrieved users.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: "60d0fe4f5311236168a109ca"
 *                   username:
 *                     type: string
 *                     example: "johndoe"
 *                   email:
 *                     type: string
 *                     example: "johndoe@example.com"
 *       500:
 *         description: Internal Server Error
 */
router.get('', getAllUsers);

export default router;