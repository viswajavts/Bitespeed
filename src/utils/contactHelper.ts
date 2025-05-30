import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const consolidateContact = async ({ email, phoneNumber }: { email?: string, phoneNumber?: string }) => {
  if (!email && !phoneNumber) throw new Error('At least one of email or phoneNumber must be provided.');

  // Step 1: Find all related contacts (email or phone match)
  const relatedContacts = await prisma.contact.findMany({
    where: {
      OR: [
        { email: email || undefined },
        { phoneNumber: phoneNumber || undefined },
      ]
    },
    orderBy: { createdAt: 'asc' }
  });

  // Step 2: No matches → create new primary
  if (relatedContacts.length === 0) {
    const newContact = await prisma.contact.create({
      data: {
        email,
        phoneNumber,
        linkPrecedence: 'PRIMARY',
      },
    });

    return {
      primaryContatctId: newContact.id,
      emails: [newContact.email].filter(Boolean),
      phoneNumbers: [newContact.phoneNumber].filter(Boolean),
      secondaryContactIds: [],
    };
  }

  // Step 3: Identify all contacts (primary + secondaries)
  const allRelated = await getAllLinkedContacts(relatedContacts);
  const primaryContact = allRelated.find(c => c.linkPrecedence === 'PRIMARY')!;

  // Step 4: Check if current email or phoneNumber is new
  const isNewData =
    (!allRelated.some(c => c.email === email) && email) ||
    (!allRelated.some(c => c.phoneNumber === phoneNumber) && phoneNumber);

  // Step 5: Create a new secondary contact if new info
  if (isNewData) {
    await prisma.contact.create({
      data: {
        email,
        phoneNumber,
        linkPrecedence: 'SECONDARY',
        linkedId: primaryContact.id,
      }
    });
  }

  // Step 6: Refresh related list after insert
  const updatedRelated = await getAllLinkedContacts(relatedContacts);

  // Step 7: Consolidate response
  const emails = Array.from(new Set(updatedRelated.map(c => c.email).filter(Boolean)));
  const phones = Array.from(new Set(updatedRelated.map(c => c.phoneNumber).filter(Boolean)));
  const secondaryIds = updatedRelated.filter(c => c.linkPrecedence === 'SECONDARY').map(c => c.id);

  return {
    primaryContatctId: primaryContact.id,
    emails,
    phoneNumbers: phones,
    secondaryContactIds: secondaryIds
  };
};

const getAllLinkedContacts = async (contacts: any[]) => {
  const allIds = new Set<number>();

  for (const c of contacts) {
    allIds.add(c.id);
    if (c.linkedId) allIds.add(c.linkedId);
  }

  const result = await prisma.contact.findMany({
    where: {
      OR: [
        { id: { in: Array.from(allIds) } },
        { linkedId: { in: Array.from(allIds) } },
      ]
    },
    orderBy: { createdAt: 'asc' }
  });

  // Re-resolve: who is the oldest contact (true primary)
  const truePrimary = result.reduce((prev, curr) =>
    prev.createdAt < curr.createdAt ? prev : curr
  );

  // Promote true primary and demote others
  await Promise.all(
    result.map(async contact => {
      if (contact.id === truePrimary.id && contact.linkPrecedence !== 'PRIMARY') {
        await prisma.contact.update({ where: { id: contact.id }, data: { linkPrecedence: 'PRIMARY', linkedId: null } });
      } else if (contact.id !== truePrimary.id && contact.linkPrecedence !== 'PRIMARY') {
        await prisma.contact.update({ where: { id: contact.id }, data: { linkPrecedence: 'SECONDARY', linkedId: truePrimary.id } });
      }
    })
  );

  // Fetch again after updates
  return await prisma.contact.findMany({
    where: {
      OR: [
        { id: truePrimary.id },
        { linkedId: truePrimary.id },
      ]
    },
    orderBy: { createdAt: 'asc' }
  });
};
