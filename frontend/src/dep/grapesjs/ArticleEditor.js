'use client';

import grapesjs from 'grapesjs';
import GjsEditor from '@grapesjs/react';
import 'grapesjs/dist/css/grapes.min.css';
import './grapejs.css';
import plugin from 'grapesjs-blocks-basic';

function ArticleEditor() {
  const onEditor = (editor) => {
    console.log('Editor loaded', { editor });
  };

  return (
    <GjsEditor
      // Pass the core GrapesJS library to the wrapper (required).
      // You can also pass the CDN url (eg. "https://unpkg.com/grapesjs")
      grapesjs={grapesjs}
      // Load the GrapesJS CSS file asynchronously from URL.
      // This is an optional prop, you can always import the CSS directly in your JS if you wish.
      grapesjsCss="https://unpkg.com/grapesjs/dist/css/grapes.min.css"
      // GrapesJS init options
      plugins={[plugin]}
      options={{
        height: '100vh',
        storageManager: false,
        pluginsOpts: {
          [plugin]: {
            blocks: ['column1', 'column2', 'column3', 'column3-7', 'text', 'link', 'image', 'video', 'map'],
          },
        },
      }}
      onEditor={onEditor}
    />
  );
}
export default ArticleEditor;
