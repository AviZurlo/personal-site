import { EditorView } from '@codemirror/view';

interface ImageUploadOptions {
  uploadImage: (file: File) => Promise<string | null>;
  onUploadStart?: () => void;
  onUploadEnd?: () => void;
}

/**
 * CodeMirror extension that handles image paste and drag-and-drop.
 *
 * This extension intercepts paste and drop events at the CodeMirror level
 * (before default handling) to detect images, upload them, and insert
 * markdown syntax at the cursor position.
 */
export function imageUploadExtension(options: ImageUploadOptions) {
  const { uploadImage, onUploadStart, onUploadEnd } = options;

  return EditorView.domEventHandlers({
    paste: async (event, view) => {
      const items = event.clipboardData?.items;
      if (!items) return false;

      // Check if any clipboard item is an image
      let hasImage = false;
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          hasImage = true;
          break;
        }
      }

      if (!hasImage) return false;

      // Prevent default paste behavior for images
      event.preventDefault();

      // Process all image items
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.type.indexOf('image') !== -1) {
          const file = item.getAsFile();
          if (file) {
            // Get cursor position before upload
            const pos = view.state.selection.main.head;

            // Show upload indicator
            onUploadStart?.();

            // Upload the image
            const url = await uploadImage(file);

            // Hide upload indicator
            onUploadEnd?.();

            if (url) {
              // Create markdown syntax
              const altText = file.name || 'image';
              const markdown = `\n![${altText}](${url})\n`;

              // Insert at cursor position
              view.dispatch({
                changes: { from: pos, insert: markdown },
                selection: { anchor: pos + markdown.length }
              });
            }
          }
        }
      }

      return true;
    },

    drop: async (event, view) => {
      const files = event.dataTransfer?.files;
      if (!files || files.length === 0) return false;

      // Check if any file is an image
      let hasImage = false;
      for (let i = 0; i < files.length; i++) {
        if (files[i].type.indexOf('image') !== -1) {
          hasImage = true;
          break;
        }
      }

      if (!hasImage) return false;

      // Prevent default drop behavior for images
      event.preventDefault();

      // Get drop position in the editor
      const pos = view.posAtCoords({ x: event.clientX, y: event.clientY }) || view.state.selection.main.head;

      // Process all image files
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.type.indexOf('image') !== -1) {
          // Show upload indicator
          onUploadStart?.();

          // Upload the image
          const url = await uploadImage(file);

          // Hide upload indicator
          onUploadEnd?.();

          if (url) {
            // Create markdown syntax
            const altText = file.name || 'image';
            const markdown = `\n![${altText}](${url})\n`;

            // Insert at drop position
            view.dispatch({
              changes: { from: pos, insert: markdown },
              selection: { anchor: pos + markdown.length }
            });
          }
        }
      }

      return true;
    },

    dragover: (event) => {
      // Check if drag contains files
      const hasFiles = event.dataTransfer?.types.includes('Files');
      if (hasFiles) {
        // Prevent default to allow drop
        event.preventDefault();
        return true;
      }
      return false;
    }
  });
}
