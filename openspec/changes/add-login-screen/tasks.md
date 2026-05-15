## 1. TextField UI Primitive

- [ ] 1.1 Create `components/ui/TextField.tsx` with props: `id`, `label`, `type`, `placeholder`, and standard input HTML attributes
- [ ] 1.2 Style: bottom-border only at rest (`border-b border-brand-border`), transitions to `border-brand-primary` on focus; no outline or ring
- [ ] 1.3 Label renders in JetBrains Mono label-caps above the input with `space-y-xs` gap

## 2. Login Page Layout

- [ ] 2.1 Create `app/login/page.tsx` — full-screen centered layout (`min-h-screen flex flex-col items-center justify-center`) with `bg-brand-background`
- [ ] 2.2 Add branding block: 48×48px black `rounded-lg` icon with `task_alt` Material Symbol in white, "Tasks" headline (`font-headline-lg text-brand-primary`), "MONOCHROME TASK SYSTEM" subtitle (`font-label-caps text-brand-secondary`)
- [ ] 2.3 Add `LoginCard` container: white card, `rounded-lg`, `p-lg`, `max-w-[400px] w-full`, no shadow at rest, shadow on hover (`hover:shadow-[0px_10px_30px_rgba(0,0,0,0.04)]`)

## 3. Login Form

- [ ] 3.1 Add email `TextField` inside the card using `id="email"`, `type="email"`, `placeholder="nombre@compania.com"`, label "EMAIL"
- [ ] 3.2 Add password row: `TextField` with `id="password"`, `type="password"`, label "CONTRASEÑA" — label row includes inline "¿OLVIDASTE TU CONTRASEÑA?" `<a>` (right-aligned, `font-label-caps text-brand-primary`, keyboard-focusable, `hover:opacity-70`)
- [ ] 3.3 Add "Iniciar Sesión" `<button type="submit">`: full-width, black fill (`bg-brand-primary text-white`), `font-body-lg semibold`, `rounded`, `mt-md`; `hover:opacity-90 active:scale-[0.98]`
- [ ] 3.4 Add "Crear cuenta" `<a>` styled as button: full-width, outlined (`border border-brand-primary text-brand-primary`), `font-body-lg semibold`, `rounded`, `mt-sm`; `hover:bg-surface-container-low active:scale-[0.98]`
- [ ] 3.5 Wire `onSubmit` stub on `<form>`: `e.preventDefault()` — add `// TODO: wire Supabase Auth` comment

## 4. Decorative Background

- [ ] 4.1 Add a fixed bottom overlay `<img>` (or `<div>` with bg image): grayscale filter, `opacity-20`, `pointer-events-none`, `aria-hidden="true"`

## 5. Accessibility & Polish

- [ ] 5.1 Verify all `<label for>` / `<input id>` associations are correct for email and password fields
- [ ] 5.2 Confirm tab order: email → password → forgot-password link → submit → create account
- [ ] 5.3 Run `pnpm build` to confirm no TypeScript or compile errors
