/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

'use client';

import React, { useState, useEffect } from 'react';
import grapesjs from 'grapesjs';
import GjsEditor from '@grapesjs/react';
import 'grapesjs/dist/css/grapes.min.css';
import './grapejs.css';
import 'grapick/dist/grapick.min.css';
import * as pluginBlockBasic from 'grapesjs-blocks-basic';
import * as pluginStyleBg from 'grapesjs-style-bg';
import * as pluginTuiImageEditor from 'grapesjs-tui-image-editor';
import * as pluginTyped from 'grapesjs-typed';
import * as pluginCKEditor from 'grapesjs-plugin-ckeditor';
import customCodePlugin from 'grapesjs-custom-code';
import parserPostCSS from 'grapesjs-parser-postcss';
import grapesjsTabsPlugin from 'grapesjs-tabs';
import styleFilter from 'grapesjs-style-filter';
import gjsForms from 'grapesjs-plugin-forms';
import pluginCountdown from 'grapesjs-component-countdown';
// import { useState } from 'react';
import { KmsAPI, KmsAPIGET } from '../kms/kmsHandler';

function ArticleEditor({ ArticleID }) {
  const [projectID, setProjectID] = useState(undefined);
  useEffect(() => {
    if (ArticleID !== undefined) {
      setProjectID(ArticleID);
    }
  }, [ArticleID]);
  // console.log(projectID);
  const onEditor = (editor) => {
    // console.log('Editor loaded', { editor });

    const storageManager = editor.Storage;
    storageManager.add('kms_remote', {
      async load(storageOptions) {
        // console.log('storageOptions');
        // console.log(storageOptions);
        // console.log(projectID);
        const res = await KmsAPIGET(`articlegrapesjs?id=${projectID}`);
        const datares = res.body.data;
        return JSON.parse(datares);
      },
      async store(data, storageOptions) {
        // console.log('storing data');
        // console.log("data");
        // console.log(data);
        // console.log("storageOptions");
        // console.log(storageOptions);
      },
    });
  };
  if (projectID === undefined) {
    return null; // or some loading indicator
  }

  return (
    <GjsEditor
      // Pass the core GrapesJS library to the wrapper (required).
      // You can also pass the CDN url (eg. "https://unpkg.com/grapesjs")
      grapesjs={grapesjs}
      // Load the GrapesJS CSS file asynchronously from URL.
      // This is an optional prop, you can always import the CSS directly in your JS if you wish.
      grapesjsCss="https://unpkg.com/grapesjs/dist/css/grapes.min.css"
      // GrapesJS init options
      plugins={[
        pluginBlockBasic,
        customCodePlugin,
        parserPostCSS,
        grapesjsTabsPlugin,
        pluginStyleBg,
        pluginTuiImageEditor,
        styleFilter,
        pluginTyped,
        gjsForms,
        pluginCountdown,
        pluginCKEditor,
      ]}
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
          [pluginBlockBasic]: {
            blocks: ['column1', 'column2', 'column3', 'column3-7', 'text', 'link', 'image', 'video', 'map'],
          },
        },
      }}
      onEditor={onEditor}
    />
  );
}
export default ArticleEditor;
