# Migrate between Postgres databases

A CLI tool for **migrating data from one PostgreSQL database to another**.

> [!NOTE]  
> **This project is experimental.**
> 
> There may be bugs, and the API is subject to change. While we cannot provide professional support for experimental projects, we welcome your feedback.

## Usage

```sh
npx @neondatabase/pg-import@latest --silent false --accept-all false --source="pg-string" --destination="pg-string"
```

### Flags and Options

- `--source <source>`: The connection string for the source PostgreSQL database. This is **optional**.
  - Example: `--source "postgres://user:password@localhost:5432/source_db"`

- `--destination <destination>`: The connection string for the destination PostgreSQL database. This is **optional**.
  - Example: `--destination "postgres://user:password@localhost:5432/destination_db"`

- `--silent`: Suppresses console output if set to `true`. The default value is `false`.
  - Example: `--silent true`

- `--accept-all`: Automatically accepts all prompts if set to `true`. The default value is `false`.
  - Example: `--accept-all true`

- `--backup-file-path`: Specifies the path and filename for the backup file. If not set, the default value is **dump_restore_{randomly_generated_string}.bak**.
  - Example: `--backup-file-path "../Downloads/example.bak"`

## When Migrating to Neon

- Make sure your Neon plan supports your database size. The Neon Free Tier offers 0.5 GiB of storage. For larger data sizes, upgrade to the Launch or Scale plan. See [Neon plans](https://neon.tech/docs/introduction/plans).
- If you are on the Neon Launch or Scale plan, you can optimize for the migration by configuring a larger compute size or enabling [autoscaling](https://neon.tech/docs/introduction/autoscaling) for additional CPU and RAM. See [How to size your compute](https://neon.tech/docs/manage/endpoints#how-to-size-your-compute).
- This utility uses `pg_dump` and `pg_restore`. A generated dump file containing any of the following statements will produce a warning or error when data is restored to Neon:
  - `ALTER OWNER` statements
  - `CREATE EVENT TRIGGER` statements
  - Any statement requiring the PostgreSQL superuser privilege or not held by the role running the migration

  See [Import from Postgres](https://neon.tech/docs/import/import-from-postgres) for possible workarounds.

## Authors

This library is created by [Neon](https://neon.tech) with contributions from:

- Rishi Raj Jain ([@rishi_raj_jain_](https://twitter.com/rishi_raj_jain_))

## Contributing

We love contributions! Here's how you can contribute:

- [Open an issue](https://github.com/neondatabase/pg-import/issues) if you believe you've encountered a bug.
- Make a [pull request](https://github.com/neondatabase/pg-import/pull) to add new features, make improvements, or fix bugs.

## Contributors

<a href="https://github.com/neondatabase/pg-import/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=neondatabase/pg-import&purge=1" />
</a>
