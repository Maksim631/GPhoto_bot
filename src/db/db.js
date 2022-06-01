import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export const update = async ({ chatId, accessToken, refreshToken }) => {
  try {
    await prisma.users.upsert({
      where: {
        chatId,
      },
      update: {
        accessToken,
        refreshToken,
      },
      create: {
        chatId,
        accessToken,
        refreshToken,
      },
    })
    return true
  } catch (e) {
    console.error(`Error accured: ${e}`)
    return false
  }
}

export const find = async (id) => {
  try {
    return await prisma.users.findUnique({
      where: {
        chatId: id,
      },
    })
  } catch (e) {
    console.error(`Error accured: ${e}`)
    return false
  }
}

export const findAll = async () => {
  try {
    return await prisma.users.findMany()
  } catch (e) {
    console.error(`Error accured: ${e}`)
    return false
  }
}

export const disconnect = async () => {
  return await prisma.$disconnect()
}
