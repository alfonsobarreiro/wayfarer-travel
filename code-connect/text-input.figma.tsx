// @ts-nocheck
import figma from '@figma/code-connect'

/**
 * Maps Figma "Input · Text" (node 8283:64)
 * → src/components/form/SignUpModal.tsx:160 — exported as `inputClass` constant
 *
 * Used across all SignUpModal fields. SignInModal uses the same pattern locally.
 */

const inputClass =
  'w-full rounded-lg border border-neutral-300 bg-white px-4 py-3 text-sm text-neutral-800 placeholder:text-neutral-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all'

figma.connect(
  'https://www.figma.com/design/glE8OOm7wbnBsEqD0L4YWz/Wayfarer-Travel?node-id=8283-64',
  {
    example: () => (
      <input type="email" placeholder="john@example.com" className={inputClass} />
    ),
  }
)
