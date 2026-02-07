import { defineDb, defineTable, column } from 'astro:db';

const User = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    username: column.text(),
    avatar: column.text({ optional: true }),
  }
});

const Account = defineTable({
  columns: {
    provider: column.text(),
    providerAccountId: column.text(),
    userId: column.text({ references: () => User.columns.id }),
  },

  indexes: [{ on: ["provider", "providerAccountId"], unique: true }]
});

const Session = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    userId: column.text({ references: () => User.columns.id }),
    expiresAt: column.number(),
  }
});

// https://astro.build/db/config
export default defineDb({
  tables: {User, Account, Session}
});
