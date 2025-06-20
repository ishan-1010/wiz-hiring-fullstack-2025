module.exports = {
  schema: './bookmyslot/db/schema.ts',
  out: './bookmyslot/db/migrations',
  dialect: 'sqlite',
  dbCredentials: {
    url: './bookmyslot/db/bookmyslot.db',
  },
}; 