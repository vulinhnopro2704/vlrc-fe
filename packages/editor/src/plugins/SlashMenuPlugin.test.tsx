// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest';
import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { NotionEditor } from '../Editor';

describe('SlashMenuPlugin', () => {
  it('should render editor with SlashMenuPlugin enabled without errors', () => {
    const { container } = render(<NotionEditor showSlashMenu={true} showToolbar={false} />);
    expect(container.querySelector('[data-slot="notion-editor"]')).toBeInTheDocument();
  });
});
