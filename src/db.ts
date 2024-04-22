import { Sequelize } from '@sequelize/core'
import { SqliteDialect } from '@sequelize/sqlite3'

let sequelize: Sequelize;

if (process.env.JEST_WORKER_ID) {
  sequelize = new Sequelize({
    dialect: SqliteDialect,
    storage: ':memory:',
    pool: {
      idle: Infinity,
      max: 1,
    }
  });
} else {
  sequelize = new Sequelize({
    dialect: SqliteDialect,
    storage: 'sqlite.db',
  });
}

export default sequelize;
