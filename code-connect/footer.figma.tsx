// @ts-nocheck
import figma from '@figma/code-connect'
import { Footer } from '../src/components/Footer'

/**
 * Maps Figma "Footer" (node 8285:82)
 * → src/components/Footer.tsx (fully extracted as a React component)
 */

figma.connect(
  Footer,
  'https://www.figma.com/design/glE8OOm7wbnBsEqD0L4YWz/Wayfarer-Travel?node-id=8285-82',
  {
    example: () => <Footer />,
  }
)
