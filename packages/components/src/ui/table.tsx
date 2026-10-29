import * as React from 'react';
import * as stylex from '@stylexjs/stylex';
import { colors } from '../theme/tokens.stylex';

const styles = stylex.create({
  container: {
    position: 'relative',
    width: '100%',
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    captionSide: 'bottom',
    fontSize: '0.875rem',
    borderCollapse: 'collapse',
  },
  header: {
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    borderBottomColor: colors.border,
  },
  body: {},
  footer: {
    backgroundColor: 'color-mix(in srgb, var(--muted) 50%, transparent)',
    borderTopWidth: 1,
    borderTopStyle: 'solid',
    borderTopColor: colors.border,
    fontWeight: 500,
  },
  row: {
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    borderBottomColor: colors.border,
    transitionProperty: 'background-color',
    transitionDuration: '150ms',
    ':hover': {
      backgroundColor: 'color-mix(in srgb, var(--muted) 50%, transparent)',
    },
  },
  head: {
    color: colors.foreground,
    height: '2.5rem',
    paddingInline: '0.5rem',
    textAlign: 'left',
    verticalAlign: 'middle',
    fontWeight: 500,
    whiteSpace: 'nowrap',
  },
  cell: {
    padding: '0.5rem',
    verticalAlign: 'middle',
    whiteSpace: 'nowrap',
    color: colors.foreground,
  },
  caption: {
    color: colors.mutedForeground,
    marginTop: '1rem',
    fontSize: '0.875rem',
  },
});

function Table({ className, sx, ...props }: React.ComponentProps<'table'> & { sx?: stylex.StyleXStyles }) {
  const sxProps = stylex.props(styles.table, sx);
  return (
    <div data-slot="table-container" {...stylex.props(styles.container)}>
      <table
        data-slot="table"
        {...sxProps}
        className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
        {...props}
      />
    </div>
  );
}

function TableHeader({ className, sx, ...props }: React.ComponentProps<'thead'> & { sx?: stylex.StyleXStyles }) {
  const sxProps = stylex.props(styles.header, sx);
  return (
    <thead
      data-slot="table-header"
      {...sxProps}
      className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
      {...props}
    />
  );
}

function TableBody({ className, sx, ...props }: React.ComponentProps<'tbody'> & { sx?: stylex.StyleXStyles }) {
  const sxProps = stylex.props(styles.body, sx);
  return (
    <tbody
      data-slot="table-body"
      {...sxProps}
      className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
      {...props}
    />
  );
}

function TableFooter({ className, sx, ...props }: React.ComponentProps<'tfoot'> & { sx?: stylex.StyleXStyles }) {
  const sxProps = stylex.props(styles.footer, sx);
  return (
    <tfoot
      data-slot="table-footer"
      {...sxProps}
      className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
      {...props}
    />
  );
}

function TableRow({ className, sx, ...props }: React.ComponentProps<'tr'> & { sx?: stylex.StyleXStyles }) {
  const sxProps = stylex.props(styles.row, sx);
  return (
    <tr
      data-slot="table-row"
      {...sxProps}
      className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
      {...props}
    />
  );
}

function TableHead({ className, sx, ...props }: React.ComponentProps<'th'> & { sx?: stylex.StyleXStyles }) {
  const sxProps = stylex.props(styles.head, sx);
  return (
    <th
      data-slot="table-head"
      {...sxProps}
      className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
      {...props}
    />
  );
}

function TableCell({ className, sx, ...props }: React.ComponentProps<'td'> & { sx?: stylex.StyleXStyles }) {
  const sxProps = stylex.props(styles.cell, sx);
  return (
    <td
      data-slot="table-cell"
      {...sxProps}
      className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
      {...props}
    />
  );
}

function TableCaption({ className, sx, ...props }: React.ComponentProps<'caption'> & { sx?: stylex.StyleXStyles }) {
  const sxProps = stylex.props(styles.caption, sx);
  return (
    <caption
      data-slot="table-caption"
      {...sxProps}
      className={className ? `${sxProps.className || ''} ${className}`.trim() : sxProps.className}
      {...props}
    />
  );
}

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
};
