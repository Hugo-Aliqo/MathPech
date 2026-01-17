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
    if (el && content) {
      const renderMath = () => {
        try {
          if (content.includes('$')) {
            // Rendu mixte texte et LaTeX
            let html = content;
            
            // Rendu des blocs $$...$$
            html = html.replace(/\$\$(.*?)\$\$/gs, (_, tex) => 
              katex.renderToString(tex, { displayMode: true, throwOnError: false })
            );
            
            // Rendu de l'inline $...$
            html = html.replace(/\$(.*?)\$/g, (_, tex) => 
              katex.renderToString(tex, { displayMode: false, throwOnError: false })
            );
            
            el.innerHTML = html.replace(/\n/g, '<br/>');
          } else {
            // Rendu pur LaTeX
            katex.render(content, el, {
              displayMode: block,
              throwOnError: false,
              trust: true,
              strict: false
            });
          }
        } catch (err) {
          console.error("KaTeX rendering error:", err);
          el.textContent = content;
        }
      };
      renderMath();
    } else if (el) {
      el.innerHTML = "";
    }
  }, [content, block]);

  return <div ref={containerRef} className={`${className} math-container`} />;
};

export default MathRenderer;