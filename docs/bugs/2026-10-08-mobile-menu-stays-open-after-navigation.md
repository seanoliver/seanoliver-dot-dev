# Mobile menu stays open after navigating

**Date:** 2026-10-08 **Branch:** fix/hamburger-menu-close **Caught by:** browser
QA during the React 19 upgrade (2026-07-11), tracked as issue #17

## Symptom

Below 768px, tapping a link in the hamburger menu navigated to the new page, but
the Radix dropdown stayed `data-state="open"`. The body kept
`pointer-events: none`, so the open menu covered the destination page and the
page did not respond to taps until the menu was dismissed.

## Root cause

Each menu entry was a Next `Link` inside a Radix `DropdownMenuItem`, and that
item was itself inside a second `DropdownMenuItem` from `hamburger-menu.tsx`.

A tap fires `click` on the `<a>`. Next `Link`'s `onClick` calls
`e.preventDefault()` to do client-side navigation. The event then bubbles to the
item, whose handler is `composeEventHandlers(props.onClick, handleSelect)`.
`composeEventHandlers` skips `handleSelect` when `event.defaultPrevented` is
true, and `handleSelect` is what calls `rootContext.onClose()`. So the menu
never closed. The header lives in the root layout and is not remounted on
navigation, so the open state carried over to the next page.

The theme toggle dropdown was unaffected because its items are not links.

## Repro steps

1. Check out `19afa3b`, run `pnpm build && pnpm start`.
2. Open `/` at 390px wide.
3. Tap the menu button, then tap Projects.
4. The URL changes to `/projects` and the menu is still open.

## Fix

`NavLink` now renders `<DropdownMenuItem asChild>` with the `Link` as its child,
and `hamburger-menu.tsx` no longer wraps it in a second item. With `asChild`,
Radix passes its `onClick` to `Link` as a prop. `Link` calls `props.onClick`
before its own `preventDefault`, so `handleSelect` runs and closes the menu.
`CommonElements` forwards the extra props and merges `className` so the slot
props reach the `<a>`.

This also leaves one `menuitem` per link instead of two nested ones.

## Verification

- New e2e test `tests/e2e/navigation.spec.ts` failed before the fix
  (`expect(locator).toBeHidden()`: received visible) and passes after.
- Full e2e suite: 30 passed. Unit tests: 117 passed. Lint and typecheck clean.
- Keyboard path checked by hand in Playwright: Enter on a focused item
  navigates, closes the menu, and restores `pointer-events: auto`.

## Recurrence guardrail

`tests/e2e/navigation.spec.ts` opens the menu at 390px, navigates, and asserts
the menu is hidden and the body accepts pointer events. Any future Radix menu
item that wraps a `Link` needs `asChild` for the same reason.
