/// <reference types="node" />
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Check if we already have data
  const count = await prisma.feedback.count();
  if (count > 0) {
    console.log(`Database already has ${count} feedback(s), skipping seed.`);
    return;
  }

  // Create sample feedbacks for testing
  const sampleFeedbacks = [
    {
      type: 'BUG',
      comment: 'The login button is not working on mobile devices. When I click it, nothing happens.',
      status: 'PENDING',
      aiAnalyzed: false,
    },
    {
      type: 'IDEA',
      comment: 'It would be great to have dark mode support! My eyes hurt at night.',
      status: 'PENDING',
      aiAnalyzed: false,
    },
    {
      type: 'OTHER',
      comment: 'How do I export my data? I could not find the option in settings.',
      status: 'PENDING',
      aiAnalyzed: false,
    },
  ];

  for (const feedback of sampleFeedbacks) {
    await prisma.feedback.create({
      data: feedback,
    });
  }

  console.log(`Created ${sampleFeedbacks.length} sample feedbacks.`);
  console.log('Seed completed!');
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
