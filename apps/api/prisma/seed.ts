import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, Role } from "../src/generated/prisma/client.js";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const adapter = new PrismaPg({
  connectionString,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  await prisma.membership.deleteMany();
  await prisma.user.deleteMany();
  await prisma.tenant.deleteMany();

  const acme = await prisma.tenant.create({
    data: {
      name: "Acme Properties",
      slug: "acme",
    },
  });

  const beta = await prisma.tenant.create({
    data: {
      name: "Beta Estates",
      slug: "beta",
    },
  });

  const admin = await prisma.user.create({
    data: {
      email: "admin@acme.test",
      name: "Acme Admin",
    },
  });

  const reviewer = await prisma.user.create({
    data: {
      email: "reviewer@acme.test",
      name: "Acme Reviewer",
    },
  });

  const readonly = await prisma.user.create({
    data: {
      email: "readonly@acme.test",
      name: "Acme Read Only",
    },
  });

  const betaAdmin = await prisma.user.create({
    data: {
      email: "admin@beta.test",
      name: "Beta Admin",
    },
  });

  await prisma.membership.createMany({
    data: [
      {
        userId: admin.id,
        tenantId: acme.id,
        role: Role.ADMIN,
      },
      {
        userId: reviewer.id,
        tenantId: acme.id,
        role: Role.REVIEWER,
      },
      {
        userId: readonly.id,
        tenantId: acme.id,
        role: Role.READ_ONLY,
      },
      {
        userId: betaAdmin.id,
        tenantId: beta.id,
        role: Role.ADMIN,
      },
    ],
  });

  console.log("Seed data created:");
  console.log({
    tenants: {
      acme: acme.id,
      beta: beta.id,
    },
    users: {
      admin: admin.email,
      reviewer: reviewer.email,
      readonly: readonly.email,
      betaAdmin: betaAdmin.email,
    },
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
