// @ts-nocheck
import figma from '@figma/code-connect'
import { Navbar } from '../src/components/Navbar'

/**
 * Maps Figma "Navbar" (node 8285:53)
 * → src/components/Navbar.tsx (fully extracted as a React component)
 */

figma.connect(
  Navbar,
  'https://www.figma.com/design/glE8OOm7wbnBsEqD0L4YWz/Wayfarer-Travel?node-id=8285-53',
  {
    example: () => <Navbar />,
  }
)
