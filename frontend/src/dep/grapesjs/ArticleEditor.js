'use client';

import grapesjs from 'grapesjs';
import GjsEditor from '@grapesjs/react';
import 'grapesjs/dist/css/grapes.min.css';
import './grapejs.css';
import plugin from 'grapesjs-blocks-basic';
// import { useState } from 'react';
import { KmsAPI, KmsAPIGET } from '../kms/kmsHandler';

function ArticleEditor() {
  const projectID = 1;
  const onEditor = (editor) => {
    console.log('Editor loaded', { editor });
    const storageManager = editor.Storage;
    storageManager.add('kms_remote', {
      async load(storageOptions) {
        console.log('storageOptions');
        console.log(storageOptions);
        const res = await KmsAPIGET(`articlegrapesjs?id=${projectID}`);
        const datares = res.body.data;
        return JSON.parse(datares);
      },
      async store(data, storageOptions) {
        console.log('storing data');
        // console.log("data");
        // console.log(data);
        // console.log("storageOptions");
        // console.log(storageOptions);
      },
    });
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
        width: 'auto',
        log: 'debug',
        storageManager: {
          type: 'kms_remote',
          stepsBeforeSave: 1,
          autosave: true,
          autoload: true,
          fetchOptions: (opts) => (opts.method === 'POST' ? { method: 'PATCH' } : {}),
          // onStore: (data) => ({ id: projectID, data }),
          onStore: (data, editor) => {
            const pagesHtml = editor.Pages.getAll().map((page) => {
              const component = page.getMainComponent();
              return {
                html: editor.getHtml({ component }),
                css: editor.getCss({ component }),
              };
            });
            KmsAPI('PUT', 'articlegrapesjs', { id: projectID, dump: { data, pagesHtml } }).then();
          },
          onLoad: (result) => result.data,
        },
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
