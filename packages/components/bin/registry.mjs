// @ts-check

/**
 * Registry of VLRC and Richtext components for the VLRC CLI.
 */
export const VLRC_COMPONENTS = {
  // --- Richtext & Editor ---
  RichTextEditor: {
    name: 'RichTextEditor',
    displayName: 'Rich Text Editor',
    package: '@vlrc-fe/components/richtext',
    category: 'Form Controls',
    keywords: ['richtext', 'wysiwyg', 'editor', 'lexical', 'markdown', 'astryx'],
    import: "import { RichTextEditor } from '@vlrc-fe/components/richtext';",
    description:
      'A WYSIWYG rich-text editor built on Meta Lexical, styled with Astryx design tokens. Shares TextArea input visuals for resting border, hover ring, focus-within ring, and validation status.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Pass toolbar={<RichTextEditorToolbar />} to render formatting controls at the top of the field.',
      },
      {
        guidance: true,
        description:
          'Persist content by serializing editorState.toJSON() in onChange; rehydrate via defaultValue or RichTextView.',
      },
      {
        guidance: true,
        description:
          'GFM pipe tables import, edit, and export by default with header rows and column alignment.',
      },
      {
        guidance: false,
        description: 'Do not use for single-line text input; use TextInput instead.',
      },
    ],
    props: [
      {
        name: 'label',
        type: 'string',
        description: 'Label text for the editor. Always rendered for accessibility.',
        required: true,
      },
      {
        name: 'isLabelHidden',
        type: 'boolean',
        default: 'false',
        description: 'Visually hide the label while keeping it accessible to screen readers.',
      },
      {
        name: 'description',
        type: 'string',
        description: 'Description text displayed between the label and editor.',
      },
      {
        name: 'defaultValue',
        type: 'string',
        description:
          'Initial serialized editor state (JSON string from editorState.toJSON()). Read once on mount.',
      },
      {
        name: 'onChange',
        type: '(editorState: EditorState, editor: LexicalEditor) => void',
        description:
          'Fired when content changes. Serialize with editorState.toJSON() for persistence.',
      },
      {
        name: 'placeholder',
        type: 'string',
        description: 'Placeholder text shown when editor is empty.',
      },
      {
        name: 'isReadOnly',
        type: 'boolean',
        default: 'false',
        description: 'Whether the editor is read-only (non-editable).',
      },
      {
        name: 'isDisabled',
        type: 'boolean',
        default: 'false',
        description: 'Whether the editor is disabled.',
      },
      {
        name: 'status',
        type: '{ type: "warning" | "error" | "success"; message?: string }',
        description: 'Validation status border and message.',
      },
      {
        name: 'size',
        type: "'sm' | 'md' | 'lg'",
        default: "'md'",
        description: 'The size of the editor affecting internal padding.',
      },
      {
        name: 'toolbar',
        type: 'ReactNode',
        description: 'Toolbar content rendered at top edge of the field.',
      },
      {
        name: 'plugins',
        type: 'ReactNode',
        description: 'Additional Lexical plugins rendered inside the composer.',
      },
      {
        name: 'hasMarkdownShortcuts',
        type: 'boolean',
        default: 'true',
        description: 'Enable Markdown shortcut typing (e.g. "# " for headings).',
      },
      {
        name: 'minHeight',
        type: 'string | number',
        default: "'4.5rem'",
        description: 'Minimum height of the editable surface.',
      },
      { name: 'xstyle', type: 'StyleXStyles', description: 'Meta StyleX style override.' },
    ],
  },

  RichTextView: {
    name: 'RichTextView',
    displayName: 'Rich Text View',
    package: '@vlrc-fe/components/richtext',
    category: 'Typography',
    keywords: ['richtext', 'view', 'read-only', 'markdown', 'lexical'],
    import: "import { RichTextView } from '@vlrc-fe/components/richtext';",
    description:
      'Read-only renderer for serialized Lexical editor state or Markdown documents, applying Astryx typography and token styling.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Use to safely render formatted rich text without mounting an interactive composer.',
      },
      {
        guidance: true,
        description: 'Pass custom nodes or code languages if serialized content uses extensions.',
      },
    ],
    props: [
      {
        name: 'value',
        type: 'string | SerializedEditorState',
        description: 'Serialized JSON string or Markdown string to render.',
        required: true,
      },
      {
        name: 'transformers',
        type: 'ReadonlyArray<Transformer>',
        description: 'Custom Markdown transformers for parsing.',
      },
      { name: 'xstyle', type: 'StyleXStyles', description: 'Meta StyleX style override.' },
    ],
  },

  RichTextEditorToolbar: {
    name: 'RichTextEditorToolbar',
    displayName: 'Rich Text Editor Toolbar',
    package: '@vlrc-fe/components/richtext',
    category: 'Form Controls',
    keywords: ['toolbar', 'richtext', 'formatting', 'buttons', 'undo', 'redo'],
    import: "import { RichTextEditorToolbar } from '@vlrc-fe/components/richtext';",
    description:
      'Formatting toolbar for RichTextEditor featuring undo/redo, block format selector, inline formatting, links, and table insertion.',
    bestPractices: [
      { guidance: true, description: 'Pass directly to the toolbar prop of RichTextEditor.' },
      { guidance: false, description: 'Do not render outside the Lexical composer context.' },
    ],
    props: [
      {
        name: 'label',
        type: 'string',
        default: "'Text formatting'",
        description: 'Accessible label for the toolbar.',
      },
      {
        name: 'headingLevels',
        type: "Array<'h1' | 'h2' | 'h3'>",
        default: "['h1', 'h2', 'h3']",
        description: 'Heading levels offered in block dropdown.',
      },
      {
        name: 'size',
        type: "'sm' | 'md' | 'lg'",
        default: "'sm'",
        description: 'Size of toolbar controls.',
      },
      {
        name: 'hasLink',
        type: 'boolean',
        default: 'true',
        description: 'Show link creation button and popover.',
      },
      {
        name: 'endContent',
        type: 'ReactNode',
        description: 'Extra items at the end of the toolbar.',
      },
      { name: 'xstyle', type: 'StyleXStyles', description: 'Meta StyleX style override.' },
    ],
  },

  NotionEditor: {
    name: 'NotionEditor',
    displayName: 'Notion-Style Block Editor',
    package: '@vlrc-fe/editor',
    category: 'Form Controls',
    keywords: ['notion', 'editor', 'block', 'slash', 'floating-toolbar', 'table'],
    import: "import { NotionEditor } from '@vlrc-fe/editor';",
    description:
      'Enterprise Notion-like Markdown and Rich-Text Editor built on Meta Lexical, Meta StyleX, and Astryx tokens. Features interactive Table modal & action menu, slash command (/), bubble toolbar, draggable blocks, code highlighting, and live tree view.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Use when you need a Notion-like document authoring experience with interactive block menus.',
      },
      {
        guidance: true,
        description:
          'Leverage the built-in Table suite (InsertTableDialog, TableActionMenu, TableCellResizer) for spreadsheet-like grid editing.',
      },
      { guidance: true, description: 'Listen to onChange to receive live serialized Markdown.' },
    ],
    props: [
      {
        name: 'defaultValue',
        type: 'string',
        default: "''",
        description: 'Initial document content in Markdown.',
      },
      {
        name: 'onChange',
        type: '(markdown: string, editorState: EditorState, editor: LexicalEditor) => void',
        description: 'Fired when document content changes with serialized Markdown string.',
      },
      {
        name: 'placeholder',
        type: 'string',
        default: '"Type \'/\' for commands, or write markdown..."',
        description: 'Empty state placeholder.',
      },
      {
        name: 'readOnly',
        type: 'boolean',
        default: 'false',
        description: 'Disables editing and hides editing toolbars.',
      },
      {
        name: 'showToolbar',
        type: 'boolean',
        default: 'true',
        description: 'Displays the top rich formatting toolbar.',
      },
      {
        name: 'showFloatingToolbar',
        type: 'boolean',
        default: 'true',
        description: 'Displays the bubble toolbar on text selection.',
      },
      {
        name: 'showSlashMenu',
        type: 'boolean',
        default: 'true',
        description: 'Enables typing "/" to open block options.',
      },
      {
        name: 'showDraggableBlocks',
        type: 'boolean',
        default: 'true',
        description: 'Displays left gutter drag handles for block reordering.',
      },
      {
        name: 'showTreeView',
        type: 'boolean',
        default: 'false',
        description: 'Displays live AST debug inspector below the editor.',
      },
      {
        name: 'enableTabIndentation',
        type: 'boolean',
        default: 'true',
        description: 'Enables Tab/Shift+Tab for list and code indentation.',
      },
      {
        name: 'enableCodeHighlighting',
        type: 'boolean',
        default: 'true',
        description: 'Prism syntax highlighting for code fences.',
      },
      { name: 'sx', type: 'StyleXStyles', description: 'Meta StyleX style override.' },
    ],
  },

  InsertTableDialog: {
    name: 'InsertTableDialog',
    displayName: 'Insert Table Dialog',
    package: '@vlrc-fe/editor',
    category: 'Form Controls',
    keywords: ['table', 'insert', 'dialog', 'modal', 'dimensions', 'grid'],
    import: "import { InsertTableDialog } from '@vlrc-fe/editor';",
    description:
      'Accessible configuration modal for inserting tables into Lexical rich-text editors. Asks for row count, column count, and header row toggle before dispatching INSERT_TABLE_COMMAND.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Use before inserting tables so users can specify grid dimensions instead of hardcoding fixed cells.',
      },
      {
        guidance: true,
        description: 'Clamps rows (1-50) and columns (1-20) for optimal document rendering.',
      },
    ],
    props: [
      {
        name: 'open',
        type: 'boolean',
        description: 'Controlled visibility state.',
        required: true,
      },
      {
        name: 'onOpenChange',
        type: '(open: boolean) => void',
        description: 'Callback fired when modal opens or closes.',
        required: true,
      },
      {
        name: 'onConfirm',
        type: '(options: { rows: string; columns: string; includeHeaders: boolean }) => void',
        description: 'Fired on form submit with dimensions.',
        required: true,
      },
    ],
  },

  TableActionMenuPlugin: {
    name: 'TableActionMenuPlugin',
    displayName: 'Table Action Menu Plugin',
    package: '@vlrc-fe/editor',
    category: 'Editor Plugins',
    keywords: ['table', 'menu', 'context', 'cell', 'row', 'column', 'background-color'],
    import: "import { TableActionMenuPlugin } from '@vlrc-fe/editor';",
    description:
      'Floating context action menu attached to the active table cell. Provides row/column insertion (above/below/left/right), deletion, header toggles, cell unmerging, and cell background color palette.',
    bestPractices: [
      {
        guidance: true,
        description: 'Mount inside LexicalComposer alongside TablePlugin and anchorElem.',
      },
      {
        guidance: true,
        description: 'Provides full Google Docs and Notion style cell manipulation.',
      },
    ],
    props: [
      {
        name: 'anchorElem',
        type: 'HTMLElement',
        description: 'Anchor DOM container for positioning the floating trigger button.',
        required: true,
      },
    ],
  },

  TableCellResizerPlugin: {
    name: 'TableCellResizerPlugin',
    displayName: 'Table Cell Resizer Plugin',
    package: '@vlrc-fe/editor',
    category: 'Editor Plugins',
    keywords: ['table', 'resize', 'col-resize', 'drag', 'column-width'],
    import: "import { TableCellResizerPlugin } from '@vlrc-fe/editor';",
    description:
      'Interactive drag-to-resize column width and row height resizer for table cells inside Lexical editors.',
    bestPractices: [
      {
        guidance: true,
        description: 'Enables click-and-drag border handles for fluid table layout customization.',
      },
    ],
    props: [
      {
        name: 'anchorElem',
        type: 'HTMLElement',
        description: 'Anchor DOM container for positioning drag handles.',
        required: true,
      },
    ],
  },

  TableHoverActionsPlugin: {
    name: 'TableHoverActionsPlugin',
    displayName: 'Table Hover Actions Plugin',
    package: '@vlrc-fe/editor',
    category: 'Editor Plugins',
    keywords: ['table', 'hover', 'quick-add', 'plus-button', 'row', 'col'],
    import: "import { TableHoverActionsPlugin } from '@vlrc-fe/editor';",
    description:
      'Floating quick "+" buttons on table cell borders for fast single-click row and column addition.',
    bestPractices: [
      {
        guidance: true,
        description: 'Hover near cell borders to reveal 1-click addition triggers.',
      },
    ],
    props: [
      {
        name: 'anchorElem',
        type: 'HTMLElement',
        description: 'Anchor DOM container.',
        required: true,
      },
    ],
  },

  // --- VLRC Components ---
  SignaturePad: {
    name: 'SignaturePad',
    displayName: 'Signature Pad',
    package: '@vlrc-fe/components',
    category: 'Data Entry',
    keywords: ['signature', 'canvas', 'pen', 'drawing', 'sign'],
    import: "import { SignaturePad } from '@vlrc-fe/components';",
    description:
      'High-performance canvas digital signature pad supporting pressure smoothing, color selection, stroke width, undo, clear, and PNG export.',
    bestPractices: [
      {
        guidance: true,
        description: 'Use in contract signing, approval workflows, or form verification.',
      },
      { guidance: true, description: 'Listen to onSave to receive the base64 PNG data URL.' },
    ],
    props: [
      {
        name: 'onSave',
        type: '(dataUrl: string) => void',
        description: 'Callback fired with PNG base64 data URL.',
      },
      {
        name: 'strokeColor',
        type: 'string',
        default: "'#0f172a'",
        description: 'Pen stroke color token.',
      },
      {
        name: 'strokeWidth',
        type: 'number',
        default: '2.5',
        description: 'Pen stroke thickness in pixels.',
      },
      {
        name: 'backgroundColor',
        type: 'string',
        default: "'#ffffff'",
        description: 'Canvas background color.',
      },
      {
        name: 'width',
        type: 'number | string',
        default: "'100%'",
        description: 'Width of signature pad.',
      },
      {
        name: 'height',
        type: 'number',
        default: '200',
        description: 'Height of signature pad canvas in pixels.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        default: 'false',
        description: 'Disables canvas interaction.',
      },
      { name: 'sx', type: 'StyleXStyles', description: 'Meta StyleX style override.' },
    ],
  },

  Questionnaire: {
    name: 'Questionnaire',
    displayName: 'Questionnaire & Assessment',
    package: '@vlrc-fe/components',
    category: 'Data Entry',
    keywords: ['questionnaire', 'survey', 'form', 'quiz', 'multi-step', 'assessment'],
    import: "import { Questionnaire } from '@vlrc-fe/components';",
    description:
      'Multi-step interactive questionnaire and assessment engine supporting single choice, multiple choice, text inputs, ratings, and progress tracking.',
    bestPractices: [
      {
        guidance: true,
        description: 'Use for customer surveys, onboarding wizards, and multi-step assessments.',
      },
      {
        guidance: true,
        description: 'Enforces validation on mandatory questions before moving to the next step.',
      },
    ],
    props: [
      {
        name: 'questions',
        type: 'QuestionnaireItem[]',
        description: 'Array of questions and answer options.',
        required: true,
      },
      {
        name: 'onSubmit',
        type: '(answers: Record<string, any>) => void',
        description: 'Callback fired on completion.',
        required: true,
      },
      {
        name: 'onStepChange',
        type: '(stepIndex: number) => void',
        description: 'Fired when active step advances.',
      },
      {
        name: 'allowSkip',
        type: 'boolean',
        default: 'false',
        description: 'Allows skipping optional questions.',
      },
      {
        name: 'showProgress',
        type: 'boolean',
        default: 'true',
        description: 'Renders progress bar above questions.',
      },
      { name: 'sx', type: 'StyleXStyles', description: 'Meta StyleX style override.' },
    ],
  },

  Marker: {
    name: 'Marker',
    displayName: 'Text Marker Highlight',
    package: '@vlrc-fe/components',
    category: 'Typography',
    keywords: ['marker', 'highlight', 'fluorescent', 'pen', 'text-accent'],
    import: "import { Marker } from '@vlrc-fe/components';",
    description:
      'Accessible text highlight and marker primitive supporting fluorescent, pen, and underline effects using design tokens.',
    bestPractices: [
      {
        guidance: true,
        description: 'Use to draw visual attention to key terms, phrases, or search results.',
      },
    ],
    props: [
      {
        name: 'variant',
        type: "'fluorescent' | 'pen' | 'underline'",
        default: "'fluorescent'",
        description: 'Visual marker style.',
      },
      {
        name: 'color',
        type: "'yellow' | 'green' | 'blue' | 'pink' | 'purple'",
        default: "'yellow'",
        description: 'Color palette accent.',
      },
      { name: 'as', type: 'ElementType', default: "'mark'", description: 'HTML tag to render.' },
      {
        name: 'children',
        type: 'ReactNode',
        description: 'Text content to highlight.',
        required: true,
      },
      { name: 'sx', type: 'StyleXStyles', description: 'Meta StyleX style override.' },
    ],
  },

  CompareSlider: {
    name: 'CompareSlider',
    displayName: 'Compare Slider',
    package: '@vlrc-fe/components',
    category: 'Media & Presentation',
    keywords: ['compare', 'slider', 'before-after', 'split-view', 'image-comparison'],
    import: "import { CompareSlider } from '@vlrc-fe/components';",
    description:
      'Interactive before/after split view comparison slider with smooth touch, mouse, and keyboard accessibility.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Use for visual comparisons (e.g. before/after photo retouching, dark/light theme previews).',
      },
    ],
    props: [
      {
        name: 'itemOne',
        type: 'ReactNode',
        description: 'Left / top content to compare.',
        required: true,
      },
      {
        name: 'itemTwo',
        type: 'ReactNode',
        description: 'Right / bottom content to compare.',
        required: true,
      },
      {
        name: 'orientation',
        type: "'horizontal' | 'vertical'",
        default: "'horizontal'",
        description: 'Slider axis orientation.',
      },
      {
        name: 'position',
        type: 'number',
        default: '50',
        description: 'Divider position percentage (0-100).',
      },
      {
        name: 'onPositionChange',
        type: '(pos: number) => void',
        description: 'Fired when divider moves.',
      },
      { name: 'sx', type: 'StyleXStyles', description: 'Meta StyleX style override.' },
    ],
  },

  TagsInput: {
    name: 'TagsInput',
    displayName: 'Tags Input',
    package: '@vlrc-fe/components',
    category: 'Form Controls',
    keywords: ['tags', 'chips', 'keywords', 'input', 'multivalue'],
    import: "import { TagsInput } from '@vlrc-fe/components';",
    description:
      'Keyboard-friendly multi-tag input with auto-complete, badge removal, paste parsing, and delimiter triggers (Enter, comma).',
    bestPractices: [
      {
        guidance: true,
        description: 'Use for category labels, meta keywords, and multi-value tag management.',
      },
    ],
    props: [
      { name: 'value', type: 'string[]', description: 'Current array of tags.', required: true },
      {
        name: 'onChange',
        type: '(tags: string[]) => void',
        description: 'Callback fired when tags are added or removed.',
        required: true,
      },
      {
        name: 'placeholder',
        type: 'string',
        default: "'Add tag...'",
        description: 'Input placeholder.',
      },
      { name: 'maxTags', type: 'number', description: 'Maximum allowed tags.' },
      {
        name: 'validateTag',
        type: '(tag: string) => boolean',
        description: 'Validation predicate for new tags.',
      },
      { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables input.' },
      { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Size tier.' },
      { name: 'sx', type: 'StyleXStyles', description: 'Meta StyleX style override.' },
    ],
  },

  Masonry: {
    name: 'Masonry',
    displayName: 'Masonry Layout Grid',
    package: '@vlrc-fe/components',
    category: 'Layout',
    keywords: ['masonry', 'pinterest', 'grid', 'responsive', 'columns'],
    import: "import { Masonry } from '@vlrc-fe/components';",
    description:
      'Responsive Pinterest-style masonry grid layout with token-spaced gutters and automatic column balancing.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Use for photo galleries, cards of differing heights, and portfolio showcases.',
      },
    ],
    props: [
      {
        name: 'columns',
        type: 'number | { xs?: number; sm?: number; md?: number; lg?: number; xl?: number }',
        default: '3',
        description: 'Column count or responsive breakpoint mapping.',
      },
      {
        name: 'gap',
        type: 'SpacingToken | number',
        default: "'md'",
        description: 'Gutter spacing between masonry items.',
      },
      {
        name: 'children',
        type: 'ReactNode',
        description: 'Items to lay out in columns.',
        required: true,
      },
      { name: 'sx', type: 'StyleXStyles', description: 'Meta StyleX style override.' },
    ],
  },

  Gauge: {
    name: 'Gauge',
    displayName: 'Gauge Speedometer',
    package: '@vlrc-fe/components',
    category: 'Data Visualization',
    keywords: ['gauge', 'speedometer', 'meter', 'radial', 'progress', 'score'],
    import: "import { Gauge } from '@vlrc-fe/components';",
    description:
      'Radial speedometer and metric gauge component with customizable arc angles, min/max thresholds, and status colors.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Use for health scores, capacity usage, performance indicators, and speed metrics.',
      },
    ],
    props: [
      { name: 'value', type: 'number', description: 'Current numeric value.', required: true },
      { name: 'min', type: 'number', default: '0', description: 'Minimum scale value.' },
      { name: 'max', type: 'number', default: '100', description: 'Maximum scale value.' },
      {
        name: 'size',
        type: "'sm' | 'md' | 'lg' | number",
        default: "'md'",
        description: 'Diameter size.',
      },
      {
        name: 'showValue',
        type: 'boolean',
        default: 'true',
        description: 'Displays value label in arc center.',
      },
      { name: 'label', type: 'string', description: 'Secondary descriptive text below value.' },
      {
        name: 'status',
        type: "'default' | 'success' | 'warning' | 'error'",
        default: "'default'",
        description: 'Arc color token status.',
      },
      { name: 'sx', type: 'StyleXStyles', description: 'Meta StyleX style override.' },
    ],
  },

  CircularProgress: {
    name: 'CircularProgress',
    displayName: 'Circular Progress Indicator',
    package: '@vlrc-fe/components',
    category: 'Feedback',
    keywords: ['circular-progress', 'spinner', 'loader', 'radial-progress'],
    import: "import { CircularProgress } from '@vlrc-fe/components';",
    description:
      'Circular radial loading and progress indicator with smooth SVG animations, indeterminate state, and token styling.',
    bestPractices: [
      {
        guidance: true,
        description: 'Use for upload progress, file transfers, or asynchronous action loading.',
      },
    ],
    props: [
      { name: 'value', type: 'number', default: '0', description: 'Percentage completed (0-100).' },
      {
        name: 'size',
        type: "'sm' | 'md' | 'lg' | number",
        default: "'md'",
        description: 'Size diameter.',
      },
      {
        name: 'thickness',
        type: 'number',
        default: '3',
        description: 'Stroke thickness in pixels.',
      },
      {
        name: 'indeterminate',
        type: 'boolean',
        default: 'false',
        description: 'Enables continuous spinning loader.',
      },
      {
        name: 'status',
        type: "'default' | 'success' | 'warning' | 'error'",
        default: "'default'",
        description: 'Color status.',
      },
      {
        name: 'showLabel',
        type: 'boolean',
        default: 'false',
        description: 'Renders percentage label inside circle.',
      },
      { name: 'sx', type: 'StyleXStyles', description: 'Meta StyleX style override.' },
    ],
  },

  Stepper: {
    name: 'Stepper',
    displayName: 'Stepper Workflow',
    package: '@vlrc-fe/components',
    category: 'Navigation',
    keywords: ['stepper', 'steps', 'workflow', 'wizard', 'process'],
    import: "import { Stepper } from '@vlrc-fe/components';",
    description:
      'Multi-step workflow progress navigator supporting horizontal and vertical orientations, completed icons, and clickable steps.',
    bestPractices: [
      {
        guidance: true,
        description: 'Use for multi-page checkout flows, onboarding wizards, and setup checklists.',
      },
    ],
    props: [
      {
        name: 'activeStep',
        type: 'number',
        default: '0',
        description: 'Zero-indexed active step.',
      },
      {
        name: 'steps',
        type: 'Array<{ title: string; description?: string; icon?: ReactNode }>',
        description: 'List of step definitions.',
        required: true,
      },
      {
        name: 'orientation',
        type: "'horizontal' | 'vertical'",
        default: "'horizontal'",
        description: 'Layout axis.',
      },
      {
        name: 'onStepClick',
        type: '(stepIndex: number) => void',
        description: 'Fired when a step header is clicked.',
      },
      { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Size tier.' },
      { name: 'sx', type: 'StyleXStyles', description: 'Meta StyleX style override.' },
    ],
  },

  Timeline: {
    name: 'Timeline',
    displayName: 'Event Timeline',
    package: '@vlrc-fe/components',
    category: 'Data Presentation',
    keywords: ['timeline', 'events', 'history', 'activity-log', 'audit'],
    import: "import { Timeline } from '@vlrc-fe/components';",
    description:
      'Chronological event timeline display with customizable markers, icons, line styles, and timestamps.',
    bestPractices: [
      {
        guidance: true,
        description: 'Use for audit logs, order tracking history, and project milestones.',
      },
    ],
    props: [
      {
        name: 'items',
        type: 'TimelineItem[]',
        description: 'Array of timeline events.',
        required: true,
      },
      {
        name: 'align',
        type: "'left' | 'right' | 'alternate'",
        default: "'left'",
        description: 'Item content alignment relative to center line.',
      },
      { name: 'reverse', type: 'boolean', default: 'false', description: 'Reverses item order.' },
      { name: 'sx', type: 'StyleXStyles', description: 'Meta StyleX style override.' },
    ],
  },

  CopyButton: {
    name: 'CopyButton',
    displayName: 'Copy Button',
    package: '@vlrc-fe/components',
    category: 'Buttons',
    keywords: ['copy', 'clipboard', 'button', 'copy-to-clipboard'],
    import: "import { CopyButton } from '@vlrc-fe/components';",
    description:
      'Accessible dedicated clipboard copy button with feedback check animation, tooltip, and error handling.',
    bestPractices: [
      {
        guidance: true,
        description: 'Use next to code snippets, API keys, URLs, or transaction IDs.',
      },
    ],
    props: [
      {
        name: 'value',
        type: 'string',
        description: 'Text string to copy to clipboard.',
        required: true,
      },
      { name: 'onCopy', type: '() => void', description: 'Callback fired after successful copy.' },
      {
        name: 'timeout',
        type: 'number',
        default: '2000',
        description: 'Duration in ms to display checkmark icon.',
      },
      {
        name: 'size',
        type: "'xs' | 'sm' | 'md' | 'lg'",
        default: "'sm'",
        description: 'Button size.',
      },
      {
        name: 'variant',
        type: "'ghost' | 'outline' | 'default'",
        default: "'ghost'",
        description: 'Button appearance variant.',
      },
      { name: 'sx', type: 'StyleXStyles', description: 'Meta StyleX style override.' },
    ],
  },

  DataTable: {
    name: 'DataTable',
    displayName: 'Enterprise Data Table',
    package: '@vlrc-fe/components',
    category: 'Table & List',
    keywords: ['datatable', 'table', 'grid', 'tanstack-table', 'virtualized', 'faceted-filter'],
    import: "import { DataTable } from '@vlrc-fe/components/DataTable';",
    description:
      'High-performance enterprise data table powered by TanStack Table v8 and Astryx design tokens. Supports faceted filtering, sorting, pagination, row selection, and loading skeletons.',
    bestPractices: [
      {
        guidance: true,
        description: 'Use for administrative dashboards, data grids, and large record lists.',
      },
      {
        guidance: true,
        description:
          'Combine with DataTableColumnHeader and DataTableFacetedFilter for advanced column control.',
      },
    ],
    props: [
      {
        name: 'columns',
        type: 'ColumnDef<TData, TValue>[]',
        description: 'TanStack column definition schemas.',
        required: true,
      },
      { name: 'data', type: 'TData[]', description: 'Row data records.', required: true },
      { name: 'filterKey', type: 'string', description: 'Column key for global text search.' },
      {
        name: 'filterableColumns',
        type: 'Array<{ id: string; title: string; options: Option[] }>',
        description: 'Faceted filter dropdown configurations.',
      },
      {
        name: 'selectable',
        type: 'boolean',
        default: 'false',
        description: 'Enables row checkbox selection.',
      },
      {
        name: 'paginated',
        type: 'boolean',
        default: 'true',
        description: 'Enables pagination controls.',
      },
      { name: 'pageSize', type: 'number', default: '10', description: 'Rows per page.' },
      {
        name: 'loading',
        type: 'boolean',
        default: 'false',
        description: 'Displays loading skeleton rows.',
      },
      { name: 'sx', type: 'StyleXStyles', description: 'Meta StyleX style override.' },
    ],
  },

  ResponsiveDialog: {
    name: 'ResponsiveDialog',
    displayName: 'Responsive Modal Dialog / Drawer',
    package: '@vlrc-fe/components',
    category: 'Overlays',
    keywords: ['dialog', 'drawer', 'responsive-dialog', 'modal', 'mobile-drawer'],
    import: "import { ResponsiveDialog } from '@vlrc-fe/components';",
    description:
      'Adaptive modal dialog that renders as a desktop Dialog on md+ screens and transforms seamlessly into a native touch Drawer on mobile devices.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Use for modals that must provide an ergonomic native experience across mobile and desktop.',
      },
    ],
    props: [
      {
        name: 'open',
        type: 'boolean',
        description: 'Controlled visibility state.',
        required: true,
      },
      {
        name: 'onOpenChange',
        type: '(open: boolean) => void',
        description: 'Visibility change callback.',
        required: true,
      },
      { name: 'title', type: 'string', description: 'Accessible dialog title.' },
      { name: 'description', type: 'string', description: 'Accessible description.' },
      { name: 'children', type: 'ReactNode', description: 'Modal content body.', required: true },
      { name: 'trigger', type: 'ReactNode', description: 'Optional trigger element.' },
      { name: 'footer', type: 'ReactNode', description: 'Optional action buttons footer.' },
    ],
  },

  FormDatePicker: {
    name: 'FormDatePicker',
    displayName: 'Form Date Picker',
    package: '@vlrc-fe/components',
    category: 'Form Controls',
    keywords: ['datepicker', 'calendar', 'form-field', 'react-hook-form', 'date'],
    import: "import { FormDatePicker } from '@vlrc-fe/components/Form';",
    description:
      'Accessible calendar date picker field wrapper designed for react-hook-form, featuring popover calendar, presets, and validation display.',
    bestPractices: [
      {
        guidance: true,
        description: 'Use inside a <Form> container with control and name bindings.',
      },
    ],
    props: [
      { name: 'name', type: 'string', description: 'Form field property path.', required: true },
      {
        name: 'control',
        type: 'Control<any>',
        description: 'React Hook Form control object.',
        required: true,
      },
      { name: 'label', type: 'string', description: 'Field label.' },
      {
        name: 'placeholder',
        type: 'string',
        default: "'Select date...'",
        description: 'Input trigger placeholder.',
      },
      { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables field.' },
    ],
  },
};

/**
 * Format a component record into Astryx CLI human-readable markdown.
 * @param {typeof VLRC_COMPONENTS[keyof typeof VLRC_COMPONENTS]} comp
 * @param {{ propsOnly?: boolean }} [options]
 */
export function formatComponentDoc(comp, options = {}) {
  const { propsOnly = false } = options;

  let propsMarkdown =
    '## Props\n\n| Prop | Type | Default | Description |\n|------|------|---------|-------------|\n';
  for (const p of comp.props || []) {
    const req = p.required ? ' **(required)**' : '';
    const def = p.default || '-';
    propsMarkdown += `| \`${p.name}\` | \`${p.type}\` | ${def} | ${p.description}${req} |\n`;
  }

  if (propsOnly) {
    return `package: ${comp.package}\n\n${propsMarkdown}`;
  }

  let bestPracticesMd = '';
  if (comp.bestPractices && comp.bestPractices.length > 0) {
    bestPracticesMd = '## Best Practices\n\n';
    for (const bp of comp.bestPractices) {
      const prefix = bp.guidance ? '- **Do:**' : "- **Don't:**";
      bestPracticesMd += `${prefix} ${bp.description}\n`;
    }
    bestPracticesMd += '\n';
  }

  return `package: ${comp.package}

# ${comp.name}

${comp.description}

**Import:** \`${comp.import}\`

${bestPracticesMd}${propsMarkdown}`;
}

/**
 * Format a component into typed JSON envelope matching Astryx CLI spec.
 * @param {typeof VLRC_COMPONENTS[keyof typeof VLRC_COMPONENTS]} comp
 */
export function formatComponentJson(comp) {
  return JSON.stringify(
    {
      apiVersion: 1,
      type: 'component.detail',
      package: comp.package,
      data: {
        name: comp.name,
        displayName: comp.displayName,
        category: comp.category,
        keywords: comp.keywords,
        props: comp.props,
        usage: {
          description: comp.description,
          bestPractices: comp.bestPractices,
        },
        package: comp.package,
        import: comp.import,
        sourceAvailable: true,
      },
      meta: {
        answeredBy: {
          cli: '0.7.16',
          core: '0.7.16',
          copy: 'vlrc-bridge',
        },
      },
    },
    null,
    2,
  );
}
