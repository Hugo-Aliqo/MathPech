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

    // Helper pour générer le HTML d'erreur de manière sécurisée et uniforme
    const renderError = (tex: string, error: unknown) => {
      const errorMessage = error instanceof Error ? error.message : String(error);
      const safeTex = tex
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
      
      // On affiche "Erreur LaTeX" et le code fautif dans une balise stylisée
      return `<span class="math-error" title="${errorMessage.replace(/"/g, '&quot;')}">⚠️ Erreur LaTeX: ${safeTex}</span>`;
    };

    try {
      // Détection des délimiteurs LaTeX pour le mode mixte (texte + maths)
      // On supporte $$...$$ (bloc) et $...$ (inline)
      if (content.includes('$')) {
        // Cette regex sépare le contenu en segments de texte et de maths
        // Les groupes de capture () font que le séparateur est inclus dans le résultat du split
        const regex = /(\$\$[\s\S]*?\$\$)|(\$[\s\S]*?\$)/g;
        const parts = content.split(regex);

        let finalHtml = "";

        parts.forEach(part => {
          if (part === undefined) return; // Skip undefined parts from regex groups

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
            // Texte brut : échappement HTML basique et gestion des sauts de ligne
            finalHtml += part
              .replace(/&/g, "&amp;")
              .replace(/</g, "&lt;")
              .replace(/>/g, "&gt;")
              .replace(/\n/g, '<br/>');
          }
        });
        
        el.innerHTML = finalHtml;
      } else {
        // Fallback: Pas de délimiteurs '$', on essaie de rendre tout le contenu comme du LaTeX ou du texte
        try {
          katex.render(content, el, {
            displayMode: block,
            throwOnError: true, // Important pour attraper les erreurs dans le catch
            trust: true,
            strict: false
          });
        } catch (e) {
           // Si erreur de parsing LaTeX
           // Heuristique : si le texte contient des caractères mathématiques typiques, c'est probablement une formule ratée
           if (/[\\^_{}=]/.test(content)) {
             console.warn("KaTeX Raw Render Error:", e);
             el.innerHTML = renderError(content, e);
           } else {
             // Sinon, c'est probablement juste du texte simple qui n'était pas du LaTeX
             el.textContent = content;
           }
        }
      }
    } catch (err) {
      console.error("MathRenderer Fatal Error:", err);
      el.innerHTML = renderError(content, err);
    }
  }, [content, block]);

  return (
    <div 
      ref={containerRef} 
      className={`math-container w-full overflow-x-auto ${className || ''}`} 
      style={{ maxWidth: '100%' }} // Force containment pour éviter que les formules larges ne cassent le layout
    />
  );
};

export default MathRenderer;