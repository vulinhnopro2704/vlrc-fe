import type { JSX } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { TreeView } from '@lexical/react/LexicalTreeView';
import { Box } from '@vlrc-fe/components';

export function TreeViewPlugin(): JSX.Element {
  const [editor] = useLexicalComposerContext();

  return (
    <Box className="vlrc-editor-treeview-wrapper">
      <TreeView
        viewClassName="tree-view-output"
        treeTypeButtonClassName="debug-treetype-button"
        timeTravelButtonClassName="debug-timetravel-button"
        timeTravelPanelClassName="debug-timetravel-panel"
        timeTravelPanelButtonClassName="debug-timetravel-panel-button"
        timeTravelPanelSliderClassName="debug-timetravel-panel-slider"
        editor={editor}
      />
    </Box>
  );
}

export default TreeViewPlugin;
