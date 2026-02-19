import {prisma} from "../utils/prisma.js";

export async function findUserByEmail( email ) {
    return prisma.user.findUnique({
        where:{ email }
    });
}

export async function createUser(userData){
    return prisma.user.create({
        data: userData
    });
}
export async function listUsers() {
    return prisma.user.findMany()
    
}

export async function getUserById(id) {
    return prisma.user.findUnique({
        where: { id }
    });

}

export async function deleteUser(id) {
    return prisma.user.delete({
        where: { id }
    });

}

export async function updateUser(id, data) {
    return prisma.user.update({
        where: { id },
        data
    });
}

export async function countUser() {
    return prisma.user.count();
}

export async function updateUserPassword(id, newPassword) {
    return prisma.user.update({
        where: { id },
        data: {
            password: newPassword
        }
    });
}

export async function createUsers(usersData) {
  return prisma.user.createManyAndReturn({ 
    data: usersData,
  });
}

export function excludePassword(user) {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
}
