module.exports = {
  schema: './db/schema.ts',
  out: './db/migrations',
  dialect: 'sqlite',
  dbCredentials: {
    url: './db/bookmyslot.db',
  },
}; 