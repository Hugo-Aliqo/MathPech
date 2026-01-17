import React, { useEffect, useRef } from 'react';
import katex from 'katex';

interface MathRendererProps {
  content?: string;
  className?: string;
  block?: boolean;
}

const MathRenderer: React.FC<MathRendererProps> = ({ content = "", className, block = false }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    if (!content) {
      el.innerHTML = "";
      return;
    }

    try {
      if (content.includes('$')) {
        // Rendu intelligent du texte mixte (Markdown-like avec LaTeX)
        let safeContent = content
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;");

        // 1. Rendu des blocs $$...$$ (Display mode)
        safeContent = safeContent.replace(/\$\$(.*?)\$\$/gs, (_, tex) => {
          try {
            return katex.renderToString(tex, { displayMode: true, throwOnError: false });
          } catch (e) {
            return tex;
          }
        });

        // 2. Rendu de l'inline $...$ (Inline mode)
        safeContent = safeContent.replace(/\$(.*?)\$/g, (_, tex) => {
          try {
            return katex.renderToString(tex, { displayMode: false, throwOnError: false });
          } catch (e) {
            return tex;
          }
        });

        // 3. Gestion des retours à la ligne simples
        el.innerHTML = safeContent.replace(/\n/g, '<br/>');
      } else {
        // Rendu pur LaTeX si aucun délimiteur $ n'est présent
        katex.render(content, el, {
          displayMode: block,
          throwOnError: false,
          trust: true,
          strict: false
        });
      }
    } catch (err) {
      console.error("KaTeX error:", err);
      el.textContent = content;
    }
  }, [content, block]);

  return (
    <div 
      ref={containerRef} 
      className={`${className || ''} math-container overflow-x-auto`} 
    />
  );
};

export default MathRenderer;