# TanStack Form Composition — Reference Guide

This document explains the TanStack Form composition pattern and how to apply it to reduce form boilerplate in this codebase.

**TanStack Form version:** `@tanstack/react-form@^1.27.7` (v1)

---

## Section 1: Current Problem — Repeated Boilerplate

All 5 forms in the codebase repeat the same patterns:

### 1A. Field render prop pattern (~10 lines per field)

Every text input field looks like this:

```tsx
<form.Field
  name="displayName"
  children={(field) => {
    const isInvalid =
      field.state.meta.isTouched && !field.state.meta.isValid;
    return (
      <Field data-invalid={isInvalid}>
        <FieldLabel>ชื่อ</FieldLabel>
        <Input
          id={field.name}
          name={field.name}
          value={field.state.value}
          onChange={(e) => field.handleChange(e.target.value)}
          autoComplete="off"
          aria-invalid={isInvalid}
          placeholder="..."
        />
        {isInvalid && <FieldError errors={field.state.meta.errors} />}
      </Field>
    );
  }}
/>
```

This same structure repeats for **every** field in every form. The only things that change are: `name`, `label`, `placeholder`, and occasionally `orientation`.

### 1B. Manual `isSubmitting` state

3 of 5 forms (`AddFarmerForm`, `AddEmployeeForm`, `AddProductForm`) manage submission state manually:

```tsx
const [isSubmitting, setIsSubmitting] = useState(false);

// in onSubmit:
setIsSubmitting(true);
mutation.mutate(value, {
  onSuccess: () => { setIsSubmitting(false); },
  onError: () => { setIsSubmitting(false); },
});

// in JSX:
<Button disabled={isSubmitting}>
  {isSubmitting ? <Spinner /> : null} ยืนยัน
</Button>
```

This could be derived from the mutation's `isPending` (like `ProductPriceForm` and `EmployeeSplitProductForm` already do) or from `form.Subscribe` on `isSubmitting`.

### 1C. No shared field components

Text inputs, number inputs, Select, and Combobox are all written inline every time. There are no reusable field components.

### Forms inventory

| Form | File | Fields | Manual isSubmitting |
|------|------|--------|-------------------|
| AddFarmerForm | `src/features/farmers/components/farmers/AddFarmerForm.tsx` | 2 text | Yes |
| AddEmployeeForm | `src/features/farmers/components/employees/AddEmployeeForm.tsx` | 1 text | Yes |
| AddProductForm | `src/features/products/components/AddProductForm.tsx` | 1 text, 1 select | Yes |
| ProductPriceForm | `src/features/products/components/ProductPriceForm.tsx` | 1 number | No (uses `mutation.isPending`) |
| EmployeeSplitProductForm | `src/features/farmers/components/employees/EmployeeSplitProductForm.tsx` | 1 combobox, 4 number | No (uses `mutation.isPending`) |

---

## Section 2: TanStack Form Composition API Overview

### Decision Chart

Use this to pick the right API:

| Situation | API to use |
|-----------|-----------|
| Reuse a single field's UI across forms | `AppField` + pre-bound field component |
| Reuse form-level UI (submit button) | `AppForm` + pre-bound form component |
| Break a large form into sub-sections | `withForm` |
| Reuse a group of related fields together | `withFieldGroup` |

### API Reference

#### `createFormHookContexts()`

Called **once** per app. Creates the context objects needed for the composition system.

```tsx
import { createFormHookContexts } from "@tanstack/react-form";

export const { fieldContext, formContext, useFieldContext, useFormContext } =
  createFormHookContexts();
```

**Returns:**
- `fieldContext` — React context for field instances (pass to `createFormHook`)
- `formContext` — React context for form instances (pass to `createFormHook`)
- `useFieldContext` — Hook to access field state inside pre-bound field components
- `useFormContext` — Hook to access form instance inside pre-bound form components

#### `createFormHook()`

Called **once** per app (after `createFormHookContexts`). Registers your field/form component library and returns the composition hooks.

```tsx
import { createFormHook } from "@tanstack/react-form";

const { useAppForm, withForm, withFieldGroup } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: { TextField, NumberField, SelectField },
  formComponents: { SubmitButton },
});
```

**Returns:**
- `useAppForm` — Drop-in replacement for `useForm`. Same API, but the returned form object has `AppField` and `AppForm` in addition to `Field`.
- `withForm` — HOC for breaking forms into typed sub-sections
- `withFieldGroup` — HOC for reusable groups of related fields

#### `form.AppField`

Replaces `form.Field` when using pre-bound components. Automatically provides field context to the child component.

```tsx
<form.AppField
  name="displayName"
  children={(field) => <field.TextField label="ชื่อ" placeholder="..." />}
/>
```

The child component (e.g. `TextField`) accesses field state via `useFieldContext()` internally — you don't pass `value`, `onChange`, etc.

#### `form.AppForm`

Wrapper for form-level reusable components. Provides form context so children can use `useFormContext()`.

```tsx
<form.AppForm>
  <form.SubmitButton label="ยืนยัน" />
</form.AppForm>
```

#### `useFieldContext<T>()`

Used **inside** pre-bound field components to access the field instance. The generic `T` specifies the expected value type of the field.

```tsx
function TextField({ label }: { label: string }) {
  const field = useFieldContext<string>();
  // field.state.value is typed as string
  // field.handleChange expects string
}
```

#### `useFormContext()`

Used **inside** pre-bound form components to access the form instance.

```tsx
function SubmitButton({ label }: { label: string }) {
  const form = useFormContext();
  return (
    <form.Subscribe selector={(state) => state.isSubmitting}>
      {(isSubmitting) => (
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? <Spinner /> : null} {label}
        </button>
      )}
    </form.Subscribe>
  );
}
```

#### `withForm()`

HOC for breaking large forms into typed sub-sections. The component receives the `form` instance as a prop.

**Important:** Use `function Render` (a named function expression) for the render prop — anonymous arrow functions cause ESLint hook rule violations.

```tsx
const ChildForm = withForm({
  defaultValues: { firstName: "", lastName: "" },
  props: { title: "Section" },
  render: function Render({ form, title }) {
    return (
      <form.AppField
        name="firstName"
        children={(field) => <field.TextField label={title} />}
      />
    );
  },
});

// Usage: <ChildForm form={form} title="Name Section" />
```

#### `withFieldGroup()`

HOC for reusable groups of related fields that appear together across multiple forms. Unlike `withForm`, the render function receives a `group` object (not `form`). The `group` scopes field access to just the group's fields.

Good candidate in this codebase: the linked `farmerSplitRatio` + `employeeSplitRatio` fields in `EmployeeSplitProductForm`, where changing one auto-calculates the other.

```tsx
const SplitRatioFields = withFieldGroup({
  defaultValues: {
    farmerSplitRatio: null as string | null,
    employeeSplitRatio: null as string | null,
  },
  render: function Render({ group }) {
    return (
      <div className="grid grid-cols-2 gap-4">
        <group.AppField name="farmerSplitRatio">
          {(field) => <field.NumberField label="สัดส่วนเถ้าแก่" />}
        </group.AppField>
        <group.AppField name="employeeSplitRatio">
          {(field) => <field.NumberField label="สัดส่วนคนตัด" />}
        </group.AppField>
      </div>
    );
  },
});

// Usage:
<SplitRatioFields form={form} fields="splitData" />
// or with field mapping:
<SplitRatioFields
  form={form}
  fields={{
    farmerSplitRatio: "farmerSplitRatio",
    employeeSplitRatio: "employeeSplitRatio",
  }}
/>
```

---

## Section 3: Implementation Steps

### Step 1: Create the form hook setup file

**File:** `src/components/form/form-hook.ts`

This file calls `createFormHookContexts()` once and `createFormHook()` once, registering all shared components.

It should export:
- `useFieldContext` — for use in field components
- `useFormContext` — for use in form components
- `useAppForm` — drop-in replacement for `useForm` in all form files
- `withForm` — if needed for large forms
- `withFieldGroup` — if needed for split ratio fields

```
createFormHookContexts()
  → fieldContext, formContext, useFieldContext, useFormContext

createFormHook({ fieldContext, formContext, fieldComponents, formComponents })
  → useAppForm, withForm, withFieldGroup
```

### Step 2: Create reusable field components

Each component uses `useFieldContext<T>()` internally to access field state.

#### `src/components/form/fields/TextField.tsx`

- `useFieldContext<string>()`
- Props: `label: string`, `placeholder?: string`, `orientation?: "vertical" | "horizontal" | "responsive"`
- Encapsulates: the `isInvalid` check, `Field` wrapper, `FieldLabel`, `Input`, `FieldError`
- Handles `autoComplete="off"`, `aria-invalid`, `id`, `name` automatically

#### `src/components/form/fields/NumberField.tsx`

- `useFieldContext<string | null>()` (current forms store numbers as strings, with `null` for optional)
- Props: `label: string`, `placeholder?: string`, `orientation?: "vertical" | "horizontal"`
- Handles `null` → `""` conversion for the input value
- Sets `inputMode="decimal"` and `type="number"` by default

#### `src/components/form/fields/SelectField.tsx`

- `useFieldContext<string>()`
- Props: `label: string`, `items: { value: string; label: string }[]`, `orientation?: ...`
- Wraps the shadcn `Select`, `SelectTrigger`, `SelectValue`, `SelectContent`, `SelectGroup`, `SelectItem` components

#### `src/components/form/fields/ComboboxField.tsx`

- `useFieldContext<string>()`
- Props: `label: string`, `items: { value: string; label: string }[]`, `placeholder?: string`, `emptyMessage?: string`
- Wraps the shadcn Combobox components

### Step 3: Create reusable form component

#### `src/components/form/components/SubmitButton.tsx`

- Uses `useFormContext()` to get the form instance
- Uses `form.Subscribe` with `selector={(state) => state.isSubmitting}`
- Props: `label?: string` (default: "ยืนยัน"), `disabled?: boolean`
- Renders `<Button>` with `<Spinner />` when submitting
- Eliminates the need for manual `useState(false)` for `isSubmitting` in all 3 forms that use it

### Step 4: Register everything in `createFormHook`

In `src/components/form/form-hook.ts`:

```tsx
const { useAppForm, withForm, withFieldGroup } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    TextField,
    NumberField,
    SelectField,
    ComboboxField,
  },
  formComponents: {
    SubmitButton,
  },
});
```

### Step 5: Refactor forms one at a time

For each form:
1. Replace `import { useForm }` with `import { useAppForm }` from `form-hook.ts`
2. Replace `form.Field` with `form.AppField` + registered component name
3. Wrap submit button area with `form.AppForm` and use `form.SubmitButton`
4. Remove `useState(false)` for `isSubmitting` if present
5. Remove unused imports (`Field`, `FieldLabel`, `FieldError`, `Input`, `Spinner`, `useState`)

**Suggested order** (simplest to most complex):
1. `ProductPriceForm` — 1 field, no manual isSubmitting (smallest change, good test)
2. `AddFarmerForm` — 2 text fields, has manual isSubmitting
3. `AddEmployeeForm` — 1 text field, has manual isSubmitting
4. `AddProductForm` — 1 text + 1 select field, has manual isSubmitting
5. `EmployeeSplitProductForm` — combobox + linked number fields (most complex)

### Step 6 (optional): `withFieldGroup` for split ratios

Extract the `farmerSplitRatio` + `employeeSplitRatio` pair from `EmployeeSplitProductForm` into a `SplitRatioFields` group using `withFieldGroup`. These two fields have linked `onChange` listeners where changing one auto-calculates the other to sum to `1.0`.

This is optional because the linked fields only appear in one form currently. If the transaction form (Phase 4) reuses this pattern, then `withFieldGroup` becomes valuable.

---

## Section 4: Before/After Comparison

### AddFarmerForm — Before (~128 lines)

```tsx
import { useForm } from "@tanstack/react-form";
import { useState } from "react";
// ... 6 more imports for UI components

export default function AddFarmerForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const addFarmer = useAddFarmer();
  const form = useForm({
    defaultValues: { displayName: "", phone: null as null | string },
    validators: { onSubmit: formFarmerSchema },
    onSubmit: async ({ value }) => {
      setIsSubmitting(true);
      addFarmer.mutate({ data: value }, {
        onSuccess: () => { form.reset(); setIsSubmitting(false); },
        onError: () => { setIsSubmitting(false); toast.error("..."); },
      });
    },
  });

  return (
    <Card>
      {/* CardHeader... */}
      <CardContent>
        <form onSubmit={(e) => { e.preventDefault(); form.handleSubmit(); }}>
          <FieldGroup>
            {/* ~25 lines for displayName field */}
            <form.Field name="displayName" children={(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel>ชื่อลูกค้า</FieldLabel>
                  <Input value={field.state.value} onChange={...} aria-invalid={isInvalid} ... />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }} />
            {/* ~25 more lines for phone field (same pattern) */}
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <Button disabled={isSubmitting}>
          {isSubmitting ? <Spinner /> : null} ยืนยัน
        </Button>
      </CardFooter>
    </Card>
  );
}
```

### AddFarmerForm — After (~50 lines)

```tsx
import { useAppForm } from "@/components/form/form-hook";
// ... fewer imports, no useState, no Field/FieldLabel/FieldError/Input/Spinner

export default function AddFarmerForm() {
  const addFarmer = useAddFarmer();
  const form = useAppForm({
    defaultValues: { displayName: "", phone: null as null | string },
    validators: { onSubmit: formFarmerSchema },
    onSubmit: async ({ value }) => {
      addFarmer.mutate({ data: value }, {
        onSuccess: () => { form.reset(); },
        onError: () => { toast.error("..."); },
      });
    },
  });

  return (
    <Card>
      {/* CardHeader... */}
      <CardContent>
        <form onSubmit={(e) => { e.preventDefault(); form.handleSubmit(); }}>
          <FieldGroup>
            <form.AppField
              name="displayName"
              children={(field) => (
                <field.TextField label="ชื่อลูกค้า" placeholder="ชื่อลูกค้า ..." />
              )}
            />
            <form.AppField
              name="phone"
              children={(field) => (
                <field.TextField label="เบอร์โทรศัพท์" placeholder="เบอร์มือถือ ..." />
              )}
            />
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <form.AppForm>
          <form.SubmitButton label="ยืนยัน" />
        </form.AppForm>
      </CardFooter>
    </Card>
  );
}
```

**What changed:**
- 2 inline field blocks (~25 lines each) → 2 `AppField` calls (~3 lines each)
- Manual `isSubmitting` state removed entirely (handled by `SubmitButton` + `form.Subscribe`)
- 6 UI component imports removed (`Field`, `FieldLabel`, `FieldError`, `Input`, `Spinner`, `useState`)

---

## Section 5: Key Decisions & Tradeoffs

### Where to put the files

```
src/components/form/
├── form-hook.ts              # createFormHookContexts + createFormHook
├── fields/
│   ├── TextField.tsx
│   ├── NumberField.tsx
│   ├── SelectField.tsx
│   └── ComboboxField.tsx
└── components/
    └── SubmitButton.tsx
```

Central location in `src/components/form/` since these are shared across all features (farmers, products, future transaction forms).

### One `useAppForm` for the entire app

Yes. All forms share the same set of field components (text, number, select, combobox) and form components (submit button). There's no reason to create multiple form hooks.

If a form needs a one-off custom field, you can still use `form.Field` (the original API) alongside `form.AppField` in the same form. They coexist.

### Performance

The context values provided by `createFormHookContexts` are **not** reactive React state. They are static class instances backed by TanStack Store (a signals-based reactive store). This means passing them through context does **not** cause unnecessary re-renders.

### ESLint: named function in `withForm`

If you use `withForm`, the `render` property must use a **named function expression**, not an arrow function:

```tsx
// Causes ESLint hook errors:
render: ({ form }) => { /* hooks here trigger warnings */ }

// Works correctly:
render: function Render({ form }) { /* hooks work fine */ }
```

ESLint's `react-hooks/rules-of-hooks` rule needs to see a capitalized function name to recognize it as a component.

### Gradual migration

`useAppForm` is a **drop-in replacement** for `useForm`. You can refactor one form at a time:
- Forms using `useAppForm` can still use `form.Field` (the old way) for any fields not yet converted
- Forms using `useForm` (the old way) continue to work unchanged
- No breaking changes, no big-bang migration required

### Phone field type: `string | null`

The `phone` field in `AddFarmerForm` defaults to `null`. The `TextField` component should handle this — when `useFieldContext<string>()` is used, and the actual value is `null`, the input renders `""`. Alternatively, create a `NullableTextField` or handle it in `TextField` with a `value ?? ""` fallback.

Consider whether `phone` should default to `""` instead of `null` in the form's `defaultValues` to simplify the field component. This is a form schema decision, not a composition decision.

---

## Appendix: File Reference

| Existing file | Relevance |
|---------------|-----------|
| `src/features/farmers/components/farmers/AddFarmerForm.tsx` | 2 text fields, manual isSubmitting |
| `src/features/farmers/components/employees/AddEmployeeForm.tsx` | 1 text field, manual isSubmitting, horizontal layout |
| `src/features/products/components/AddProductForm.tsx` | 1 text + 1 select, manual isSubmitting |
| `src/features/products/components/ProductPriceForm.tsx` | 1 number field, uses mutation.isPending (simplest) |
| `src/features/farmers/components/employees/EmployeeSplitProductForm.tsx` | 1 combobox + 4 number fields, linked onChange listeners |
| `src/components/ui/field.tsx` | Existing Field, FieldLabel, FieldError, FieldGroup UI components (keep using these inside pre-bound components) |

## Appendix: Official Docs

- [Form Composition Guide](https://tanstack.com/form/latest/docs/framework/react/guides/form-composition)
- [Quick Start](https://tanstack.com/form/latest/docs/framework/react/quick-start)
- [API Reference — @tanstack/react-form](https://tanstack.com/form/latest/docs/framework/react/reference/index)
