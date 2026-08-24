const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '../.env') });

const prisma = require('../lib/prisma');

const DATA_PATH = path.join(__dirname, '../data/schemes.json');

async function seed() {
  console.log('Seeding SAHAYAK PostgreSQL database...');

  if (!fs.existsSync(DATA_PATH)) {
    console.error('Data file server/data/schemes.json not found!');
    process.exit(1);
  }

  const raw = fs.readFileSync(DATA_PATH, 'utf-8');
  const data = JSON.parse(raw);

  try {
    // =========================
    // SEED SCHEMES
    // =========================

    if (data.schemes?.length) {
      console.log(`Seeding ${data.schemes.length} schemes...`);

      for (const scheme of data.schemes) {
        await prisma.scheme.upsert({
          where: {
            schemeId: scheme.schemeId
          },
          update: {
            name: scheme.name,
            hindiName: scheme.hindiName ?? null,
            ministry: scheme.ministry,
            sector: scheme.sector,
            description: scheme.description,
            purpose: scheme.purpose,
            targetBeneficiaries: scheme.targetBeneficiaries,
            eligibility: scheme.eligibility ?? {},
            benefits: scheme.benefits ?? [],
            documentsRequired: scheme.documentsRequired ?? [],
            applicationSteps: scheme.applicationSteps ?? [],
            officialUrl: scheme.officialUrl,
            sourceMetadata: scheme.sourceMetadata
          },
          create: {
            schemeId: scheme.schemeId,
            name: scheme.name,
            hindiName: scheme.hindiName ?? null,
            ministry: scheme.ministry,
            sector: scheme.sector,
            description: scheme.description,
            purpose: scheme.purpose,
            targetBeneficiaries: scheme.targetBeneficiaries,
            eligibility: scheme.eligibility ?? {},
            benefits: scheme.benefits ?? [],
            documentsRequired: scheme.documentsRequired ?? [],
            applicationSteps: scheme.applicationSteps ?? [],
            officialUrl: scheme.officialUrl,
            sourceMetadata: scheme.sourceMetadata
          }
        });
      }

      console.log('Schemes seeded successfully.');
    }

    // =========================
    // SEED GRIEVANCES
    // =========================

    if (data.grievances?.length) {
      console.log(`Seeding ${data.grievances.length} grievances...`);

      for (const grievance of data.grievances) {
        await prisma.grievance.upsert({
          where: {
            ticketId: grievance.ticketId
          },
          update: {
            category: grievance.category,
            department: grievance.department,
            location: grievance.location,
            duration: grievance.duration ?? null,
            description: grievance.description,
            citizenPhone: grievance.citizenPhone ?? 'Simulated Citizen',
            status: grievance.status ?? 'Registered',
            priority: grievance.priority ?? 'Medium',
            history: grievance.history ?? [],
            resolutionNotes: grievance.resolutionNotes ?? '',
            assignedOfficer: grievance.assignedOfficer ?? 'Unassigned'
          },
          create: {
            ticketId: grievance.ticketId,
            category: grievance.category,
            department: grievance.department,
            location: grievance.location,
            duration: grievance.duration ?? null,
            description: grievance.description,
            citizenPhone: grievance.citizenPhone ?? 'Simulated Citizen',
            status: grievance.status ?? 'Registered',
            priority: grievance.priority ?? 'Medium',
            history: grievance.history ?? [],
            resolutionNotes: grievance.resolutionNotes ?? '',
            assignedOfficer: grievance.assignedOfficer ?? 'Unassigned'
          }
        });
      }

      console.log('Grievances seeded successfully.');
    }

    console.log('PostgreSQL seed completed successfully.');
  } catch (error) {
    console.error('PostgreSQL seeding failed:');
    console.error(error);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

seed();
