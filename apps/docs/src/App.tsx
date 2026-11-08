import { useState } from 'react';
import * as stylex from '@stylexjs/stylex';
import {
  Button,
  Badge,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Input,
  Modal,
  ConfirmModal,
  Icons,
} from '@vlrc-fe/components';
import { useModalState } from '@vlrc-fe/hooks';

const styles = stylex.create({
  container: {
    maxWidth: '1000px',
    margin: '0 auto',
    padding: '2rem 1rem',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    borderBottomColor: 'var(--border)',
    paddingBottom: '1.5rem',
  },
  titleGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
  },
  title: {
    fontSize: '1.875rem',
    fontWeight: 800,
    margin: 0,
  },
  subtitle: {
    color: 'var(--muted-foreground)',
    margin: 0,
    fontSize: '0.95rem',
  },
  controls: {
    display: 'flex',
    gap: '0.5rem',
    alignItems: 'center',
  },
  section: {
    marginBottom: '2.5rem',
  },
  sectionTitle: {
    fontSize: '1.25rem',
    fontWeight: 700,
    marginBottom: '1rem',
  },
  row: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.75rem',
    alignItems: 'center',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '1rem',
  },
  modalContent: {
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  inputWrapper: {
    width: '280px',
  },
  btnIcon: {
    width: 16,
    height: 16,
    marginRight: 6,
  },
  modalText: {
    margin: 0,
    color: 'var(--muted-foreground)',
  },
});

export function App() {
  const [theme, setTheme] = useState<'light' | 'dark' | 'pink' | 'lavender'>('light');
  const { modal, openModal, closeModal } = useModalState(['demoModal', 'deleteModal'] as const);

  const toggleTheme = (newTheme: 'light' | 'dark' | 'pink' | 'lavender') => {
    setTheme(newTheme);
    const root = document.documentElement;
    root.classList.remove('dark');
    root.removeAttribute('data-theme');

    if (newTheme === 'dark') {
      root.classList.add('dark');
    } else if (newTheme === 'pink' || newTheme === 'lavender') {
      root.setAttribute('data-theme', newTheme);
    }
  };

  return (
    <div {...stylex.props(styles.container)}>
      <header {...stylex.props(styles.header)}>
        <div {...stylex.props(styles.titleGroup)}>
          <h1 {...stylex.props(styles.title)}>VLRC UI Playground</h1>
          <p {...stylex.props(styles.subtitle)}>
            Interactive component catalog for <code>@vlrc-fe/components</code> and{' '}
            <code>@vlrc-fe/hooks</code>
          </p>
        </div>

        <div {...stylex.props(styles.controls)}>
          <Button
            variant={theme === 'light' ? 'default' : 'outline'}
            size="sm"
            onClick={() => toggleTheme('light')}
          >
            Light
          </Button>
          <Button
            variant={theme === 'dark' ? 'default' : 'outline'}
            size="sm"
            onClick={() => toggleTheme('dark')}
          >
            Dark
          </Button>
          <Button
            variant={theme === 'pink' ? 'default' : 'outline'}
            size="sm"
            onClick={() => toggleTheme('pink')}
          >
            Pink
          </Button>
          <Button
            variant={theme === 'lavender' ? 'default' : 'outline'}
            size="sm"
            onClick={() => toggleTheme('lavender')}
          >
            Lavender
          </Button>
        </div>
      </header>

      {/* Buttons Section */}
      <section {...stylex.props(styles.section)}>
        <h2 {...stylex.props(styles.sectionTitle)}>Buttons</h2>
        <div {...stylex.props(styles.row)}>
          <Button variant="default">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="link">Link</Button>
          <Button size="sm">Small</Button>
          <Button size="lg">Large</Button>
        </div>
      </section>

      {/* Badges Section */}
      <section {...stylex.props(styles.section)}>
        <h2 {...stylex.props(styles.sectionTitle)}>Badges</h2>
        <div {...stylex.props(styles.row)}>
          <Badge variant="default">Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="destructive">Destructive</Badge>
          <Badge variant="outline">Outline</Badge>
        </div>
      </section>

      {/* Cards Section */}
      <section {...stylex.props(styles.section)}>
        <h2 {...stylex.props(styles.sectionTitle)}>Cards</h2>
        <div {...stylex.props(styles.grid)}>
          <Card>
            <CardHeader>
              <CardTitle>Default Card</CardTitle>
              <CardDescription>A clean, elevated card built with Meta StyleX.</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Supports dynamic border and background theming out of the box.</p>
            </CardContent>
          </Card>

          <Card variant="glass">
            <CardHeader>
              <CardTitle>Glassmorphic Card</CardTitle>
              <CardDescription>Frosted glass effect with backdrop filter.</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Ideal for modern modal headers, dashboard widgets, and overlays.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Inputs & Form Controls */}
      <section {...stylex.props(styles.section)}>
        <h2 {...stylex.props(styles.sectionTitle)}>Inputs</h2>
        <div {...stylex.props(styles.row)}>
          <div {...stylex.props(styles.inputWrapper)}>
            <Input placeholder="Enter username..." />
          </div>
          <div {...stylex.props(styles.inputWrapper)}>
            <Input type="email" placeholder="Enter email address..." />
          </div>
          <div {...stylex.props(styles.inputWrapper)}>
            <Input disabled placeholder="Disabled field" />
          </div>
        </div>
      </section>

      {/* Modal & Dialogs with Hooks */}
      <section {...stylex.props(styles.section)}>
        <h2 {...stylex.props(styles.sectionTitle)}>Modals (Powered by @vlrc-fe/hooks)</h2>
        <div {...stylex.props(styles.row)}>
          <Button onClick={() => openModal('demoModal')}>
            <Icons.Eye {...stylex.props(styles.btnIcon)} /> Open Preview Modal
          </Button>
          <Button variant="destructive" onClick={() => openModal('deleteModal')}>
            <Icons.Trash {...stylex.props(styles.btnIcon)} /> Confirm Delete Dialog
          </Button>
        </div>

        {modal.demoModal.load && (
          <Modal
            open={modal.demoModal.open}
            onCancel={() => closeModal('demoModal')}
            title="Interactive Modal"
            description="Mounted lazily with useModalState, ensuring smooth exit animations."
          >
            <div {...stylex.props(styles.modalContent)}>
              <p {...stylex.props(styles.modalText)}>
                This modal was mounted lazily with <code>useModalState</code>, ensuring exit
                animations complete before unmounting from the DOM.
              </p>
            </div>
          </Modal>
        )}

        {modal.deleteModal.load && (
          <ConfirmModal
            isOpen={modal.deleteModal.open}
            title="Delete this record?"
            message="Are you sure you want to proceed? This action cannot be reversed."
            type="danger"
            confirmText="Delete permanently"
            cancelText="Cancel"
            onClose={() => closeModal('deleteModal')}
            onConfirm={() => closeModal('deleteModal')}
          />
        )}
      </section>
    </div>
  );
}
