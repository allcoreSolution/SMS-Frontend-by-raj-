import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { LANGUAGES, lookup } from './translations';

const LanguageContext = createContext(null);

const nameToCode = (name) => LANGUAGES.find((l) => l.name === name || l.code === name)?.code || 'en';
const codeToName = (code) => LANGUAGES.find((l) => l.code === code)?.name || 'English';

const SKIP_TAGS = new Set(['SCRIPT', 'STYLE', 'TEXTAREA', 'INPUT', 'CODE', 'PRE', 'NOSCRIPT']);
const ATTRS = ['placeholder', 'title', 'aria-label'];

// text node -> { orig, shown }
const textStore = new WeakMap();
// element -> { attr: { orig, shown } }
const attrStore = new WeakMap();

const shouldSkip = (el) => {
  for (let n = el; n && n.nodeType === 1; n = n.parentElement) {
    if (SKIP_TAGS.has(n.tagName) || n.hasAttribute('data-no-translate') || n.getAttribute('translate') === 'no') return true;
  }
  return false;
};

export const hideGoogleTranslateElements = () => {
  try {
    if (typeof document === 'undefined') return;
    document.body.style.top = '0px';
    document.body.style.marginTop = '0px';
    document.body.style.position = 'static';

    const selectors = [
      '.goog-te-banner-frame',
      '#goog-gt-tt',
      '#goog-gt-vt',
      '.goog-te-balloon-frame',
      '.goog-tooltip',
      '.goog-te-gadget',
      '.goog-te-gadget-icon',
      '.skiptranslate',
      'iframe.skiptranslate',
      'div.skiptranslate',
      '[class*="VIpgJd"]',
      '[id*="goog-gt-"]'
    ];
    selectors.forEach(sel => {
      document.querySelectorAll(sel).forEach(el => {
        el.style.setProperty('display', 'none', 'important');
        el.style.setProperty('visibility', 'hidden', 'important');
        el.style.setProperty('opacity', '0', 'important');
        el.style.setProperty('pointer-events', 'none', 'important');
        el.style.setProperty('width', '0px', 'important');
        el.style.setProperty('height', '0px', 'important');
      });
    });
  } catch (e) {}
};

export const triggerGoogleTranslate = (langCode) => {
  try {
    const host = window.location.hostname;
    hideGoogleTranslateElements();

    if (!langCode || langCode === 'en' || (typeof langCode === 'string' && langCode.toLowerCase() === 'english')) {
      const domains = ['', host, '.' + host];
      const paths = ['/', window.location.pathname];
      domains.forEach(d => {
        paths.forEach(p => {
          document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${p}${d ? '; domain=' + d : ''};`;
        });
      });
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      const combo = document.querySelector('.goog-te-combo') || document.querySelector('select.goog-te-combo');
      if (combo) {
        combo.value = '';
        combo.dispatchEvent(new Event('change', { bubbles: true }));
      }
      setTimeout(hideGoogleTranslateElements, 100);
      setTimeout(hideGoogleTranslateElements, 500);
      return;
    }

    const val = `/en/${langCode}`;
    document.cookie = `googtrans=${val}; path=/;`;
    document.cookie = `googtrans=${val}; path=/; domain=${host};`;

    const applyToCombo = () => {
      hideGoogleTranslateElements();
      const combo = document.querySelector('.goog-te-combo') || document.querySelector('select.goog-te-combo');
      if (combo) {
        const desiredVal = (!langCode || langCode === 'en') ? '' : langCode.toLowerCase();
        if (combo.options && combo.options.length > 0) {
          for (let i = 0; i < combo.options.length; i++) {
            const optVal = (combo.options[i].value || '').toLowerCase();
            if (optVal === desiredVal || (desiredVal === '' && (optVal === 'en' || optVal === ''))) {
              combo.selectedIndex = i;
              combo.options[i].selected = true;
              break;
            }
          }
        }
        combo.value = desiredVal;
        combo.dispatchEvent(new Event('change', { bubbles: true }));
        try {
          combo.dispatchEvent(new Event('input', { bubbles: true }));
        } catch (_) {}
        setTimeout(hideGoogleTranslateElements, 150);
        return true;
      }
      return false;
    };

    if (!applyToCombo()) {
      setTimeout(applyToCombo, 200);
      setTimeout(applyToCombo, 600);
      setTimeout(applyToCombo, 1200);
      setTimeout(applyToCombo, 2500);
    }
  } catch (e) {
    console.warn('Google Translate Trigger notice:', e);
  }
};

function translateTextNode(node, code) {
  const parent = node.parentElement;
  if (!parent || shouldSkip(parent)) return;
  const rec = textStore.get(node);
  const current = node.nodeValue;
  let orig = rec && rec.shown === current ? rec.orig : current;
  if (!orig || !orig.trim()) return;
  if (code === 'en') {
    if (rec && rec.shown === current && current !== orig) node.nodeValue = orig;
    textStore.delete(node);
    return;
  }
  const tr = lookup(code, orig);
  if (tr) {
    const lead = orig.match(/^\s*/)[0];
    const trail = orig.match(/\s*$/)[0];
    const out = lead + tr + trail;
    if (node.nodeValue !== out) node.nodeValue = out;
    textStore.set(node, { orig, shown: out });
  } else {
    textStore.set(node, { orig, shown: current });
  }
}

function translateAttrs(el, code) {
  if (el.nodeType !== 1 || (SKIP_TAGS.has(el.tagName) && !(el.tagName === 'INPUT' || el.tagName === 'TEXTAREA'))) {
    if (el.nodeType !== 1) return;
  }
  if (el.hasAttribute('data-no-translate')) return;
  let store = attrStore.get(el);
  ATTRS.forEach((a) => {
    if (!el.hasAttribute(a)) return;
    const current = el.getAttribute(a);
    const rec = store && store[a];
    const orig = rec && rec.shown === current ? rec.orig : current;
    if (code === 'en') {
      if (rec && rec.shown === current && current !== orig) el.setAttribute(a, orig);
      if (store) delete store[a];
      return;
    }
    const tr = lookup(code, orig);
    if (!store) { store = {}; attrStore.set(el, store); }
    if (tr) {
      if (current !== tr) el.setAttribute(a, tr);
      store[a] = { orig, shown: tr };
    } else {
      store[a] = { orig, shown: current };
    }
  });
}

function walk(root, code) {
  if (!root) return;
  if (root.nodeType === 3) { translateTextNode(root, code); return; }
  if (root.nodeType !== 1) return;
  translateAttrs(root, code);
  const tw = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT);
  let n = tw.nextNode();
  while (n) {
    if (n.nodeType === 3) translateTextNode(n, code);
    else translateAttrs(n, code);
    n = tw.nextNode();
  }
}

export const LanguageProvider = ({ children }) => {
  const [code, setCode] = useState(() => {
    try {
      const isHindi = sessionStorage.getItem('sa_user_selected_hindi') === 'true' || localStorage.getItem('sa_language') === 'Hindi';
      return isHindi ? 'hi' : 'en';
    } catch (e) {
      return 'en';
    }
  });

  const setLanguage = useCallback((nameOrCode) => {
    const c = nameToCode(nameOrCode);
    if (c === 'hi') {
      sessionStorage.setItem('sa_user_selected_hindi', 'true');
      localStorage.setItem('sa_language', 'Hindi');
      triggerGoogleTranslate('hi');
    } else {
      sessionStorage.removeItem('sa_user_selected_hindi');
      localStorage.setItem('sa_language', 'English');
      triggerGoogleTranslate('en');
    }
    setCode(c);
  }, []);

  // Sync with storage events across tabs
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === 'sa_language') {
        const newCode = nameToCode(e.newValue || 'English');
        setCode(newCode);
        triggerGoogleTranslate(newCode);
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  // On initial mount: activate selected language in Google Translate and suppress UI
  useEffect(() => {
    const isHindi = sessionStorage.getItem('sa_user_selected_hindi') === 'true' || localStorage.getItem('sa_language') === 'Hindi';
    if (isHindi) {
      triggerGoogleTranslate('hi');
    } else {
      hideGoogleTranslateElements();
    }
    const timer = setInterval(hideGoogleTranslateElements, 600);
    return () => clearInterval(timer);
  }, []);

  // Apply instantaneous local translations + keep translating dynamically rendered content
  useEffect(() => {
    document.documentElement.lang = code;
    const root = document.getElementById('root') || document.body;
    walk(root, code);
    hideGoogleTranslateElements();

    let queued = new Set();
    let raf = 0;
    const flush = () => {
      raf = 0;
      const items = Array.from(queued);
      queued = new Set();
      items.forEach((n) => { if (n.isConnected) walk(n, code); });
      hideGoogleTranslateElements();
    };
    const obs = new MutationObserver((muts) => {
      muts.forEach((m) => {
        if (m.type === 'childList') m.addedNodes.forEach((n) => queued.add(n));
        else if (m.type === 'characterData') queued.add(m.target);
        else if (m.type === 'attributes') queued.add(m.target);
      });
      if (!raf) raf = requestAnimationFrame(flush);
    });
    obs.observe(root, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ATTRS });
    return () => { obs.disconnect(); if (raf) cancelAnimationFrame(raf); };
  }, [code]);

  const t = useCallback((text) => lookup(code, text) || text, [code]);

  return (
    <LanguageContext.Provider value={{ lang: codeToName(code), code, setLanguage, t, languages: LANGUAGES }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    return { lang: 'English', code: 'en', setLanguage: () => {}, t: (s) => s, languages: LANGUAGES };
  }
  return ctx;
};
