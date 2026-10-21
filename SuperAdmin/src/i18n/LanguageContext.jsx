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

function translateTextNode(node, code) {
  const parent = node.parentElement;
  if (!parent || shouldSkip(parent)) return;
  const rec = textStore.get(node);
  const current = node.nodeValue;
  // If React changed the text after we translated it, treat the new value as the new original
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
  if (el.nodeType !== 1 || SKIP_TAGS.has(el.tagName) && !(el.tagName === 'INPUT' || el.tagName === 'TEXTAREA')) {
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
  const [code, setCode] = useState(() => nameToCode(localStorage.getItem('sa_language') || 'English'));

  const setLanguage = useCallback((nameOrCode) => {
    const c = nameToCode(nameOrCode);
    localStorage.setItem('sa_language', codeToName(c));
    setCode(c);
  }, []);

  // keep in sync if another tab / settings page changes it
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === 'sa_language') setCode(nameToCode(e.newValue || 'English'));
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  // Apply translation to whole DOM + keep translating anything React renders later
  useEffect(() => {
    document.documentElement.lang = code;
    const root = document.getElementById('root') || document.body;
    walk(root, code);

    let queued = new Set();
    let raf = 0;
    const flush = () => {
      raf = 0;
      const items = Array.from(queued);
      queued = new Set();
      items.forEach((n) => { if (n.isConnected) walk(n, code); });
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
