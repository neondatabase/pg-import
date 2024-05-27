# Migrate between Postgres databases

A CLI tool to **migrate between PostgreSQL databases**.

> [!NOTE]  
> **This project is in the Experimental Stage.**
> 
> We declare this project experimental to set clear expectations for your usage. There could be known or unknown bugs, the API could evolve. While we cannot provide professional support for experimental projects, we’d be happy to hear from you if you see value in this project!

## Usage

```sh
npx @neondatabase/migrate-pg --silent false --accept-all false --source="pg-string" --destination="pg-string"
```

### Flags and Options

- `--source <source>`: The connection string for the source PostgreSQL database. This is a required option.
  - Example: `--source "postgres://user:password@localhost:5432/source_db"`

- `--destination <destination>`: The connection string for the destination PostgreSQL database. This is a required option.
  - Example: `--destination "postgres://user:password@localhost:5432/destination_db"`

- `--silent`: Suppresses console output if set to `true`. The default value is `false`.
  - Example: `--silent true`

- `--accept-all`: Automatically accepts all prompts if set to `true`. The default value is `false`.
  - Example: `--accept-all true`

## When Migrating to Neon

- Make sure to enable [autoscaling](https://neon.tech/docs/introduction/autoscaling) during the migration process so that the compute is enough for large database instances.
- The following things can result in error during a migration process:
  - `ALTER OWNER` commands
  - `CREATE EVENT TRIGGER` commands
  - Anything that requires superuser that's not included in `neon_superuser` role

## Authors

This library is created by [Neon](https://neon.tech) with contributions from:

- Rishi Raj Jain ([@rishi_raj_jain_](https://twitter.com/rishi_raj_jain_))

## Contributing

We love our contributors! Here's how you can contribute:

- [Open an issue](https://github.com/neondatabase/migrate-pg/issues) if you believe you've encountered a bug.
- Make a [pull request](https://github.com/neondatabase/migrate-pg/pull) to add new features/make quality-of-life improvements/fix bugs.

## Contributors

<a href="https://github.com/neondatabase/migrate-pg/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=neondatabase/migrate-pg&purge=1" />
</a>
