import { prisma } from '@faris/server/db';
import languageList from './seedData/languages.json';


async function main() {
    await prisma.language.createMany({
        data:languageList
    })
  }
  
  main()
    .then(async () => {
      await prisma.$disconnect()
    })
    .catch(async (e) => {
      console.error(e)
      await prisma.$disconnect()
      process.exit(1)
    })
