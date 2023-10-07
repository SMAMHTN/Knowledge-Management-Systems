'use client';

import grapesjs from 'grapesjs';
import GjsEditor from '@grapesjs/react';
import 'grapesjs/dist/css/grapes.min.css';
import './grapejs.css';
import plugin from 'grapesjs-blocks-basic';
// import { useState } from 'react';
import { CookiesGenerateKMSCred, KmsAPI, KmsAPIGET } from '../kms/kmsHandler';

function ArticleEditor() {
  let credential;
  let kmsLink;
  CookiesGenerateKMSCred().then((result) => {
    credential = result.cred;
    kmsLink = result.link;
    console.log(projectEndpoint);
  });
  const projectID = 1;
  const projectEndpoint = `http://localhost:5656/articlegrapesjs?id=${projectID}`;
  console.log(projectEndpoint);
  const onEditor = (editor) => {
    console.log('Editor loaded', { editor });
    // console.log('passed here');
    // KmsAPIGET(`articlegrapesjs?id=${projectID}`).then((res) => {
    //   // if (res.body.StatusCode == 200) {
    //   // }
    //   console.log(res);
    //   console.log('before this');
    //   console.log(res.body);
    //   console.log('before this 2');
    //   console.log(res.body.data);
    //   console.log('before this 3');
    //   const body = res.body.StatusCode;
    // });
    // console.log('before this 4');
    // console.log(body);
    // console.log('before this 5');
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
        log: 'debug',
        storageManager: {
          type: 'remote',
          urlLoad: projectEndpoint,
          urlStore: projectEndpoint,
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
          onLoad: (result) => console.log(result),
          // onLoad: async () => {
          //   const [res, setRes] = useState({
          //     body: {
          //       data: "",
          //     },
          //   });
          // let body;
          // KmsAPIGET(`articlegrapesjs?id=${projectID}`).then((res) => {
          //   // if (res.body.StatusCode == 200) {
          //   // }
          //   body = res.body.data;
          //   return body;
          // });
          //   setRes(await KmsAPIGET(`articlegrapesjs?id=${projectID}`));
          //   return JSON.stringify(res.body.data);
          // },
          headers: {
            Authorization: `Basic ${credential}`,
            Accept: '*/*',
            Connection: 'keep-alive',
            'Content-Type': 'application/json',
          },
          credentials: {
            Authorization: `Basic ${credential}`,
          },
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
