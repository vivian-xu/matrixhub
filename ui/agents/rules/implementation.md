# Implementation Constraints

This document combines the current UI stack and the key rules around Mantine, TanStack Router, TanStack Form, Zod, and i18n.

## Stack

- `pnpm`
- `Vite`
- `React 19`
- `TypeScript`
- `Mantine v8`
- `TanStack Router`
- `TanStack Form`
- `Zod`
- `react-i18next`
- `ESLint v9`

## Project Baselines

- `@tanstack/router-plugin` must be registered before `@vitejs/plugin-react`
- `babel-plugin-react-compiler` is enabled and should not be removed casually
- `VITE_UI_BASE_PATH` controls the deployed UI base path
- `src/routeTree.gen.ts` is generated and must only be produced by tooling

## Mantine

- Prefer Mantine layout primitives such as `AppShell`, `Stack`, `Group`, `Flex`, and `Box`
- Prefer `Text` and `Title` for text rendering
- Prefer Mantine props and theme tokens for spacing
- Do not pile up raw `div`s or inline styles where Mantine already covers the use case
- Do not hardcode colors, font sizes, or spacing values as the default approach

## Router

- All route files belong in `src/routes`
- Every route file should explicitly export `Route`
- Route files own route definitions, layouts, redirects, and metadata
- Non-trivial pages should live in `src/features` and be mounted by the route
- Do not let complex business logic stay in route files long term

## Forms

- Use `@tanstack/react-form` for all forms in this project
- Use `Zod` as the default validation and schema definition approach for form data
- Do not use uncontrolled forms, native ad-hoc form state, Mantine `useForm`, or other form libraries for new form work
- Prefer TanStack Form validators backed by `Zod` schemas instead of duplicating validation logic by hand
- Use TanStack Form validators for field-level validation and `onSubmit` validation for form-level or cross-field rules
- Keep Mantine as the field UI layer; bind TanStack Form state to Mantine component props such as `value`, `checked`, `onChange`, and `error`

Example:

```tsx
import { TextInput } from '@mantine/core'
import { useForm } from '@tanstack/react-form'
import { z } from 'zod'

const nameSchema = z.string().trim().min(1, 'Project name is required')

function CreateProjectForm() {
  const form = useForm({
    defaultValues: {
      name: '',
      description: '',
    },
    onSubmit: async ({ value }) => {
      await createProject(value)
    },
  })

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        form.handleSubmit()
      }}
    >
      <form.Field
        name="name"
        validators={{
          onChange: ({ value }) => {
            const result = nameSchema.safeParse(value)
            return result.success ? undefined : result.error.issues[0]?.message
          },
        }}
        children={(field) => (
          <TextInput
            label={t('projects.nameLabel')}
            value={field.state.value}
            onChange={(event) => field.handleChange(event.currentTarget.value)}
            error={field.state.meta.errors?.[0]}
          />
        )}
      />
    </form>
  )
}
```

## Feature Page Splitting Guidelines

These rules apply to page implementations under `src/features/{feature}/pages`.

- Split page implementation by responsibility and complexity, not by file length
- When a single page file carries multiple distinct complex concerns, split it proactively. Typical cases include complex list rendering mixed with forms or dialogs, page composition mixed with heavy state or side effects, or data loading/submission mixed with large UI blocks
- Extract independently understandable complex sections into the current feature's `components/`
- Extract complex state and side effects into the current feature's `hooks/`
- Only move code into `shared` when it is clearly reused across features or has already become a stable common pattern
- Do not split for the sake of splitting. The goal is to reduce reading and modification cost

## i18n

- When adding new user-facing copy, put it in locale files first
- When adding a new page, update both `en` and `zh`
- The path under `src/locales/{lang}/**/*.json` becomes the translation key prefix
- Prefer `useTranslation()` inside components
- Do not keep spreading new hardcoded display copy

## Default Commands

```bash
pnpm dev
pnpm build
pnpm lint
pnpm typecheck
```
