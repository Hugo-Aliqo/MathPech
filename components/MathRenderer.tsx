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

    // Helper pour générer le HTML d'erreur de manière sécurisée
    const renderError = (tex: string, error: unknown) => {
      const errorMessage = error instanceof Error ? error.message : String(error);
      const safeTex = tex
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
      
      return `<span class="math-error" title="${errorMessage.replace(/"/g, '&quot;')}">Erreur: ${safeTex}</span>`;
    };

    try {
      // Si le contenu contient des délimiteurs LaTeX, on le parse intelligemment
      if (content.includes('$')) {
        // Regex pour séparer : 
        // 1. $$...$$ (Display Math) - [\s\S] permet de capturer les retours à la ligne
        // 2. $...$ (Inline Math)
        const parts = content.split(/(\$\$[\s\S]*?\$\$)|(\$[\s\S]*?\$)/g).filter(part => part !== undefined);

        let finalHtml = "";

        for (const part of parts) {
          if (!part) continue;

          if (part.startsWith('$$') && part.endsWith('$$') && part.length >= 4) {
            // Mode Bloc
            const tex = part.slice(2, -2);
            try {
              finalHtml += katex.renderToString(tex, { 
                displayMode: true, 
                throwOnError: true 
              });
            } catch (e) {
              console.warn("KaTeX Display Error:", e);
              finalHtml += renderError(tex, e);
            }
          } else if (part.startsWith('$') && part.endsWith('$') && part.length >= 2) {
            // Mode Inline
            const tex = part.slice(1, -1);
            try {
              finalHtml += katex.renderToString(tex, { 
                displayMode: false, 
                throwOnError: true 
              });
            } catch (e) {
              console.warn("KaTeX Inline Error:", e);
              finalHtml += renderError(tex, e);
            }
          } else {
            // Texte brut : On échappe le HTML et on gère les retours à la ligne
            finalHtml += part
              .replace(/&/g, "&amp;")
              .replace(/</g, "&lt;")
              .replace(/>/g, "&gt;")
              .replace(/\n/g, '<br/>');
          }
        }
        el.innerHTML = finalHtml;
      } else {
        // Fallback pour le contenu purement LaTeX (ex: solutions sans $)
        // On essaie de le rendre comme une formule mathématique
        try {
          katex.render(content, el, {
            displayMode: block,
            throwOnError: true,
            trust: true,
            strict: false
          });
        } catch (e) {
           // Si ce n'est pas du LaTeX valide, on l'affiche simplement comme du texte (cas des réponses simples)
           // Mais si c'est une erreur de syntaxe LaTeX pure, on affiche l'erreur
           if (content.match(/[\\^_{}]/)) {
             console.warn("KaTeX Raw Render Error:", e);
             el.innerHTML = renderError(content, e);
           } else {
             // Probablement juste du texte sans formatage mathématique
             el.textContent = content;
           }
        }
      }
    } catch (err) {
      console.error("MathRenderer Fatal Error:", err);
      el.textContent = "Erreur d'affichage.";
      el.className = `${className || ''} math-error`;
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