 import { createUser, findUserByEmail, listUsers, getUserById, deleteUser, updateUser, countUser, updateUserPassword, createUsers, excludePassword} from "./users.service.js";
 import { validateUser, validateUpdateUser } from "./users.validation.js";
 


 export async function handleCreateUser(req, res) {
    try{
      
    req.body.email = req.body.email.trim().toLowerCase();

        //validate user Data
        const result = validateUser(req.body);
        if(!result.ok){
            return res.status(400).json({
                message: 'validation failed',
                errors: result.errors
            });
        }
        
        //check if user already exists
        const existingUser = await findUserByEmail(req.body.email);
        if (existingUser) {
            return res.status(409).json ({message: 'user already exists'});
        }

        // create user 
        const user = await createUser(req.body);
        delete user.password;
        return res.status(201).json(user);

    } catch (error) {
        return res.status(500).json({error: error.message});
    }
 }

 export async function handleListUsers(req,res) {
    try{
        const users = await listUsers();
        delete users.password;
        return res.status(200).json(users.map(excludePassword));
    } catch (error) {
        return res.status(500).json({error: error.message});
    }
 }

 export async function handleGetUserById(req, res) {
    try {
        const{ id }= req.params;
        if (!id) {
            return res.status(400).json({message: 'Missing user ID'});
        }
        const user = await getUserById(id);
        if(!user){
            return res.status(404).json({message: 'User not found'});
        }

        delete user.password;
        return res.status(200).json(user);
    }catch (error) {
        return res.status(500).json({error: error.message});

    }
 }

 export async function handleDeleteUser(req, res) {
    try {
        const{ id }= req.params;
        if (!id) {
            return res.status(400).json({message: 'Missing user ID'});
        }
        const user = await getUserById(id);
        if(!user){
            return res.status(404).json({message: 'User not found'});
        }
        await deleteUser(id);

        return res.status(200).json({ message: "user deleted successfully"});
    }catch (error) {
        return res.status(500).json({error: error.message});

    }
 }

 
 export async function handleUpdateUser(req, res) {
    try {
        //check if user ID EXISTS
         const{ id }= req.params;
        if (!id) {
            return res.status(400).json({message: 'Missing user ID'});
        }
        //VERIFY if user EXISTS
        const user = await getUserById(id);
        if(!user){
            return res.status(404).json({message: 'User not found'});
        }
        if (req.body.email) {
            req.body.email = req.body.email.trim().toLowerCase();
        }
        if (!req.body.email && !req.body.password && !req.body.name) {
            return res.status(400).json({
                error: "Validation error",
                fields: { body: "Provide at least one field to update" }
            });
        }
        const existEmail = await findUserByEmail(req.body.email);
            if (existEmail && existEmail.id !== id) {
                return res.status(409).json({ error: 'Email already in use' });
            }

        //validate user Data
        const results = validateUpdateUser(req.body);
        if(!results.ok){
            return res.status(400).json({
                message: 'validation failed',
                errors: results.errors
            });
        }
        const updatedUser= await updateUser(id, results.data )
        delete updatedUser.password;
        return res.status(200).json(updatedUser);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

export async function handleCountUser(req, res) {
    try {
        const total = await countUser();
        return res.status(200).json({'Users count': total });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

export async function handleUpdatePassword(req, res) {
    try {
        const { id } = req.params;
        
        if (!id) {
            return res.status(400).json({ message: "Missing user ID" });
        }
        const user = await getUserById(id);
        if(!user){
            return res.status(404).json({message: 'User not found'});
        }
      
        // validate user Data
        const results = validateUpdateUser(req.body);

        if (!results.ok) {
            return res.status(400).json({
                message: 'Validation failed',
                errors: results.errors
            });
        }
     
        if (!results.data.password) {
            return res.status(400).json({
                message: 'Password is required'
            });
        }
        
        await updateUserPassword(id, results.data.password);

        return res.status(200).json({ message: 'Password updated' });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
export async function handleSearchUserByEmail(req, res) {
    try {
        const { email } = req.query;
        if (!email) {
            return res.status(400).json({ error: "Email query parameter is required" });
        }
        const user = await findUserByEmail(email);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        const { password, ...userWithoutPassword } = user;
        return res.status(200).json(userWithoutPassword);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

export async function handleBulkCreateUsers(req, res) {
  try {
    const { users } = req.body;

    if (!Array.isArray(users) || users.length === 0) {
      return res.status(400).json({ error: "Provide a non-empty users array" });
    }

    const validationErrors = {};
    for (let i = 0; i < users.length; i++) {
      const result = validateUser(users[i]);
      if (!result.ok) {
        validationErrors[i] = result.errors;
      }
    }

    if (Object.keys(validationErrors).length > 0) {
      return res.status(400).json({ error: "Validation failed", details: validationErrors });
    }

    const normalizedUsers = users.map((u) => ({
      ...u,
      email: u.email.toLowerCase().trim(),
    }));

    for (const userData of normalizedUsers) {
      const existing = await findUserByEmail(userData.email);
      if (existing) {
        return res.status(409).json({ error: `Email already in use: ${userData.email}` });
      }
    }

    const created = await createUsers(normalizedUsers);
    return res.status(201).json(created.map(excludePassword));

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}























