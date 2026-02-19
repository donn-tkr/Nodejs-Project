import { Router } from 'express';
import { handleCreateUser, handleListUsers, handleGetUserById, handleDeleteUser, handleUpdateUser, handleCountUser, handleUpdatePassword, handleSearchUserByEmail, handleBulkCreateUsers} from './users.controller.js';

const router = Router();

//users
router.post('/', handleCreateUser);
router.get('/', handleListUsers);
router.get('/count', handleCountUser);
router.get('/search', handleSearchUserByEmail);
router.get('/:id', handleGetUserById);
router.delete('/:id', handleDeleteUser);
router.patch('/:id', handleUpdateUser)
router.patch('/:id/password', handleUpdatePassword);
router.post("/bulk", handleBulkCreateUsers);

export default router;