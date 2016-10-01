'use strict';

module.exports = {

    development: {
        client: 'postgresql',
        connection: 'postgres://postgres:@192.168.99.100:5432/doce',
        migrations: {
            tableName: 'migrations',
            directory: './migrations'
        },
        seeds: {
            directory: './seeds'
        }
    },

    raspberry: {
        client: 'postgresql',
        connection: 'postgres://postgres:postgres@localhost:5432/doce',
        migrations: {
            tableName: 'migrations',
            directory: './migrations'
        },
        seeds: {
            directory: './seeds'
        }
    },

    test: {
        client: 'postgresql',
        connection: 'postgres://postgres:@192.168.99.100:5433/doce-test',
        migrations: {
            tableName: 'migrations',
            directory: './migrations'
        },
        seeds: {
            directory: './seeds/dev'
        }
    },

    production: {
        client: 'postgresql',
        connection: process.env.DATABASE_URL,
        pool: {
            min: 2,
            max: 10
        },
        migrations: {
            tableName: 'migrations',
            directory: './migrations'
        },
        seeds: {
            directory: './seeds'
        }
    }

};
