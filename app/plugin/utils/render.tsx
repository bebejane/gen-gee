import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { isServer } from './'

const container = !isServer ? document.querySelector('body') : null;
const root = !isServer ? createRoot(container!) : null

export function render(component: React.ReactNode): void {
  root.render(<StrictMode>{component}</StrictMode>);
}
