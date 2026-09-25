# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

### Other setup steps

- To set up ESLint for linting, run `npx expo lint`, or follow our guide on ["Using ESLint and Prettier"](https://docs.expo.dev/guides/using-eslint/)
- If you'd like to set up unit testing, follow our guide on ["Unit Testing with Jest"](https://docs.expo.dev/develop/unit-testing/)
- Learn more about the TypeScript setup in this template in our guide on ["Using TypeScript"](https://docs.expo.dev/guides/typescript/)

## Git workflow and commit conventions

Follow [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) for this project. Each commit should describe one coherent change and leave the affected code working.

### Commit message format

```text
type(scope): short description

Optional body explaining why the change was needed and any important tradeoffs.

Optional footer, such as a breaking-change explanation or issue reference.
```

The type identifies the kind of change. The scope identifies the affected area and is optional when the change applies to the whole project.

| Type       | Use for                                 | Example                                                    |
| ---------- | --------------------------------------- | ---------------------------------------------------------- |
| `feat`     | New functionality                       | `feat(transactions): add lookup by creator across budgets` |
| `fix`      | Correcting a bug                        | `fix(db): enforce non-null text primary keys`              |
| `refactor` | Restructuring without changing behavior | `refactor(db): extract shared query helpers`               |
| `docs`     | Tracked documentation                   | `docs(readme): document commit conventions`                |
| `test`     | Adding or improving tests               | `test(budgets): verify deletion rolls back on failure`     |
| `chore`    | Repository maintenance                  | `chore(git): ignore local planning documents`              |
| `build`    | Dependencies or build configuration     | `build(deps): update expo-sqlite`                          |
| `style`    | Formatting-only changes                 | `style(db): format CRUD modules`                           |

Use `style` for code formatting, not visual UI changes. A new UI capability uses `feat(ui)`; correcting a broken layout uses `fix(ui)`.

Preferred scopes: `db`, `users`, `budgets`, `memberships`, `transactions`, `store`, `ui`, `deps`, and `git`. Use another specific scope, such as `readme`, when it describes the change more clearly.

### Writing and organizing commits

- Use lowercase types/scopes and an action verb such as "add", "prevent", "remove", or "support".
- Aim for a title of 72 characters or fewer, without a trailing period. This is a project preference, not a requirement of the Conventional Commits specification.
- Describe the result. Avoid vague messages such as "updates", "some fixes", or "today's work".
- Group related changes together, even when they span several files. For example, removing a schema field and updating its callers should not leave an intermediate commit with broken references.
- Separate unrelated features, fixes, and formatting changes when they can stand independently.
- Include schema changes with their generated migration SQL, snapshots, migration registration files, and required caller changes.
- Treat already-applied migrations as history; use a new corrective migration when an existing database needs a change.
- When dependencies change, include `package.json` and the corresponding `pnpm-lock.yaml` changes together.
- Use the body for the reason behind a workaround, compatibility implications, data-handling decisions, or relevant verification results. Only claim checks that were actually run.
- Keep `todo.txt` and `app-blueprint.md` local and ignored. Do not force-add them to a commit.

Example of a change that benefits from a body:

```text
fix(db): preserve not-null constraints on text primary keys

Drizzle Kit 1.0.0-rc.4 omits NOT NULL from generated SQLite
text primary keys even when the schema explicitly requires it.

Add the constraint to the unapplied migration files.
```

### Before committing

1. Review the working tree and the actual changes:

   ```bash
   git status --short
   git diff
   ```

2. For TypeScript changes, run the project's type check:

   ```bash
   pnpm exec tsc --noEmit
   ```

   Run additional checks appropriate to the change. Database workflows should cover relevant constraints and failure cases; UI changes should be checked on the target device when practical. Documentation-only changes need a content and formatting review rather than an app build.

3. Stage only the files or changes belonging to the intended commit. For example, for a README-only change:

   ```bash
   git add README.md
   ```

   Use `git add -p` to select individual changes in an already tracked file when needed.

4. Inspect the staged content before committing:

   ```bash
   git diff --cached
   git diff --cached --check
   ```

5. Commit with a meaningful message. For the README example:

   ```bash
   git commit -m "docs(readme): document commit conventions"
   ```

   For a message with a body or footer, run `git commit` and write the complete message in the editor.

6. Confirm the result with `git status --short` and `git log -1 --oneline`. A commit records changes locally; pushing is a separate action. Push the intended branch when ready to share it.

### Breaking changes

Use `!` before the colon for a change that requires existing consumers to adapt. Explain what they must change in the body or a `BREAKING CHANGE:` footer.

```text
refactor(db)!: replace user membership arrays with membership queries

BREAKING CHANGE: user records no longer expose budgetMemberships.
Read memberships through the membership query functions.
```

A schema change is not automatically a breaking change. Consider its impact on existing callers, persisted data, and compatibility. This convention can be followed manually; no commit-message tooling is required initially.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
