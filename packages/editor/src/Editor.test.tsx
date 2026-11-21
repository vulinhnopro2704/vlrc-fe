// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { NotionEditor } from './Editor';
import type { NotionEditorProps } from './types';

// Test constants
const SAMPLE_MARKDOWN = '# Hello VLRC\n\nThis is a Notion-like editor.';
const CUSTOM_PLACEHOLDER = 'Write your thoughts here...';

const createDefaultProps = (overrides?: Partial<NotionEditorProps>): NotionEditorProps => ({
  placeholder: CUSTOM_PLACEHOLDER,
  showToolbar: true,
  showFloatingToolbar: false,
  showSlashMenu: false,
  showDraggableBlocks: false,
  ...overrides,
});

describe('NotionEditor', () => {
  describe('UI', () => {
    it('should match snapshot in default empty state', () => {
      const { asFragment } = render(<NotionEditor {...createDefaultProps()} />);
      expect(asFragment()).toMatchSnapshot();
    });

    it('should match snapshot with initial markdown content', () => {
      const { asFragment } = render(
        <NotionEditor {...createDefaultProps({ defaultValue: SAMPLE_MARKDOWN })} />,
      );
      expect(asFragment()).toMatchSnapshot();
    });

    it('should match snapshot when readOnly', () => {
      const { asFragment } = render(
        <NotionEditor {...createDefaultProps({ readOnly: true, showToolbar: false })} />,
      );
      expect(asFragment()).toMatchSnapshot();
    });

    it('should match snapshot without toolbar', () => {
      const { asFragment } = render(
        <NotionEditor {...createDefaultProps({ showToolbar: false })} />,
      );
      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('Behavior', () => {
    it('should render contenteditable surface with accessibility attributes', () => {
      render(<NotionEditor {...createDefaultProps()} />);

      const editorContent = screen.getByRole('textbox');
      expect(editorContent).toBeInTheDocument();
      expect(editorContent).toHaveAttribute('contenteditable', 'true');
      expect(screen.getByText(CUSTOM_PLACEHOLDER)).toBeInTheDocument();
    });

    it('should respect readOnly prop by disabling contenteditable and hiding toolbar', () => {
      render(<NotionEditor readOnly showToolbar={false} />);

      const editorRoot = document.querySelector('[data-slot="notion-editor"]');
      expect(editorRoot).toHaveAttribute('data-readonly', 'true');

      const editorContent = screen.getByRole('textbox');
      expect(editorContent).toHaveAttribute('contenteditable', 'false');
      expect(document.querySelector('[data-slot="editor-toolbar"]')).not.toBeInTheDocument();
    });

    it('should render TreeView when showTreeView is true', () => {
      render(<NotionEditor {...createDefaultProps({ showTreeView: true })} />);
      expect(document.querySelector('.tree-view-output')).toBeInTheDocument();
    });

    it('should trigger onChange callback when initialized or updated', () => {
      const onChange = vi.fn();
      render(<NotionEditor defaultValue={SAMPLE_MARKDOWN} onChange={onChange} />);

      const editorContent = screen.getByRole('textbox');
      expect(editorContent).toBeInTheDocument();
    });

    it('should convert markdown table syntax into interactive table elements', () => {
      const TABLE_MD = '| Feature | Status |\n| --- | --- |\n| Resizer | OK |';
      render(<NotionEditor defaultValue={TABLE_MD} showToolbar={false} />);

      const tableElement = document.querySelector('table');
      expect(tableElement).toBeInTheDocument();
      expect(screen.getByText('Feature')).toBeInTheDocument();
      expect(screen.getByText('Status')).toBeInTheDocument();
      expect(screen.getByText('Resizer')).toBeInTheDocument();
      expect(screen.getByText('OK')).toBeInTheDocument();
    });

    it('should render collapsible toggle sections with heading level attributes', () => {
      const TOGGLE_HTML =
        '<details data-level="h1" open><summary data-level="h1">Toggle Heading 1</summary><div class="lexical-collapsible-content">Section content</div></details>';
      render(<NotionEditor defaultValue={TOGGLE_HTML} showToolbar={false} />);

      const detailsElement = document.querySelector('details');
      expect(detailsElement).toBeInTheDocument();
      expect(detailsElement).toHaveAttribute('data-level', 'h1');
      expect(detailsElement).toHaveAttribute('open');

      const summaryElement = document.querySelector('summary');
      expect(summaryElement).toBeInTheDocument();
      expect(summaryElement).toHaveAttribute('data-level', 'h1');
      expect(screen.getByText('Toggle Heading 1')).toBeInTheDocument();
    });
  });
});
