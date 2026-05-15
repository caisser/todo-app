This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


# Frontend React Best Practices
**Note:** This document is optimized for AI agents and LLMs to follow when maintaining, generating, or refactoring this codebase. It defines strict architectural boundaries and coding standards to ensure consistency across automation workflows.
---

## 1. Architecture

### 1.1 Overall

This is a Next.js 16 project for a To-Dos project.

---

## 2. Tech Stack & Infrastructure Constraints

**Impact**: CRITICAL

Framework versions:

- Next.js version: 16.2.3
- React version: 19.2.4

This web application is deployed via Vercel.

---

## 3. Data Fetching and Mutations

**Impact**: CRITICAL

### 3.1 Data fetching:

- **Primary Tool:** Use `@tanstack/react-query` for all data fetching implementations.

For pages when you detect that is critical to have the information as soon as possible, fetch the data in the page (server) using the `request` function defined in `libs/request.ts`. In the other cases, fetch the data in the client side using react-query.

### 3.2 Mutations

For mutations, use always server actions to hide implementations. Use the `request` function defined in `libs/request.ts`.

## 4. State Management

**Impact**: CRITICAL

- **Local State:** Use `useState` or `useReducer`.
- **Complex/Reactive State:** Use `zustand` for state that needs to be reactive across multiple components.
- **Shared UI State:** Use the **Context API** for simple hierarchies where a full state manager is unnecessary.

---

## 5. Navigation & Global Context

**Impact**: CRITICAL

Navigation must be very explicit. Take a url-based state approach using query params, so, even when the user refresh a website, it will recover the state.

## 6. Folder Organization

**Impact**: CRITICAL

### 6.1 Pages

Path: `app/{{page-name}}/page.tsx`.

### 6.2 Components (Atomic Design)

Components must reside in `components` and follow **Atomic Design** principles.

- **Generic:** `components/{ComponentName}.tsx`. Use this for generic components without a related context.
- **Feature-Specific:** `components/{context}/{ComponentName}.tsx`. Use this for components within a context, for example, components for a page.
- **UI Kit**: `components/ui/{ComponentName}.tsx`. Use this only when you consider a component is part of the UI Kit. Example: Button, TextField, Dropdown.
- **Styles:** Use Tailwind to style the components. Important: The tailwind config was extended to add the 'brand-' style. For example: text-brand-primary, bg-brand-secondary.
- **Icons**: Icons should be stored in the `components/ui` folder and follow the case and naming conventions.

### 6.3 Types

Use the folder `types/` when you consider a global or shared type.

- Path: `types/`.
- Extension: Always use `.ts` (avoid `.d.ts`).
- Requirement: Avoid `any`. Proactively define interfaces for all new or refactored code.

### 6.4 Libraries

Use the folder `libs/` to store internal libraries like `logging.ts`.

### 6.5 Utilitaries

Use the folder `utils/` to store generic utilitary functions and code. For example: `normalizeStr(str: string)`, `parseQueryParams()`, etc.

### 6.6 Stores

Use the folder `stores/` to put zustand stores.

### 6.7 Hooks

Use the folder `hooks/` to put there the custom hooks. If there are more than one hook related to the same feature and only that feature, create a nested folder.

---

## 7. Programming practices

**Impact**: CRITICAL

- Components must not have business logic inside. It must be handled by a custom hook. Keep components atomic.
- Components and classes must follow PascalCase nomenclature for file naming. Functions and hooks must follow camelCase, for example: parseQueryParams.ts. Types must have PascalCase only if they are entities, for example: User.ts, Program.ts. For the rest of types use hyphen-case.
- Types for function arguments and return must be defined in the same file of the function. Same for custom hooks.
- If a component has lots of states, then prefer using a custom hook to provide the value and setter.
- Avoid as much as possible the use of `useEffect`. Check for knowledge: <https://react.dev/learn/you-might-not-need-an-effect>
- For components location, see the point 6.2 of this guide.
- Avoid waterfalls as much as possible.
- Use two spaces for indentation and keep a blank like at the end of the files.
- Feel free to use functional or imperative programming. Use the paradigm that fit most with the task.
- For styles, use modern solutions if the feature you want to use has a good browser support. You can consult <https://caniuse.com> fo this purpose.

## 8. Validating Changes

Build the project to make sure there are no hidden issues:

```bash
pnpm run build
```
---

## 9. How to Run the Project

```bash
pnpm run dev
```

## 14. Restrictions

- You can install a NPM package if it will help you to accelerate the development but validate the following points:
  - Only use pnpm
  - Validate the security of the package.
  - Validate the support of the package (ratio of human commits/month)
  - Validate the impact of the bundle size in the code
- Do not use `rm` command to remove a file. Use an alternative to make possible recover the file after removing it.
- Apply the knowledge of the installed skills to avoid security issues in the code you write.
- Apply the knowledge of the installed skills to avoid performance issues in the code you write.
- Avoid leaving behind remnants of bad practices such as unused variables or console.logs.
