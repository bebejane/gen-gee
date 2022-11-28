'use client'

import s from './page.module.scss'
import { isDev } from './utils'
import * as allTemplates from '/templates'
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom'
import {
  connect,
  IntentCtx,
  RenderManualFieldExtensionConfigScreenCtx,
  RenderFieldExtensionCtx,
  RenderModalCtx
} from 'datocms-plugin-sdk';
import 'datocms-react-ui/styles.css';
import { render } from './utils/render';
import ConfigScreen from './entrypoints/ConfigScreen';
import SocialGenConfigScreen from './entrypoints/SocialGenConfigScreen';
import SocialGen from './entrypoints/SocialGen'
import SocialGenModal from './entrypoints/SocialGenModal'

export default function Plugin() {

  const templates = Object.keys(allTemplates).map(k => allTemplates[k].config)

  useEffect(() => {
    connect({
      renderConfigScreen(ctx) {
        return render(<ConfigScreen ctx={ctx} />);
      },
      manualFieldExtensions(ctx: IntentCtx) {
        return [
          {
            id: 'social-gen',
            name: 'Social-Gen' + (isDev ? ' (dev)' : ''),
            type: 'editor',
            fieldTypes: ['json'],
            configurable: true
          },
        ];
      },
      renderFieldExtension(fieldExtensionId: string, ctx: RenderFieldExtensionCtx) {
        switch (fieldExtensionId) {
          case 'social-gen':
            return render(<SocialGen ctx={ctx} />);
        }
      },
      renderManualFieldExtensionConfigScreen(fieldExtensionId: string, ctx: RenderManualFieldExtensionConfigScreenCtx) {
        ReactDOM.render(
          <React.StrictMode>
            <SocialGenConfigScreen ctx={ctx} />
          </React.StrictMode>,
          document.getElementById('root'),
        );
      },
      renderModal(modalId: string, ctx: RenderModalCtx) {
        switch (modalId) {
          case 'socialGenModal':
            return render(<SocialGenModal ctx={ctx} />);
        }
      },
    });
  }, [])

  return (
    <div id="root" className={s.container}>
      Social-Gen plugin
    </div>
  )
}