
import React, { useEffect, useRef } from 'react';
import katex from 'katex';

interface MathRendererProps {
  content: string;
  className?: string;
  block?: boolean;
}

const MathRenderer: React.FC<MathRendererProps> = ({ content, className, block = false }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      // Simple regex to find $...$ for inline and $$...$$ or block math
      // For this app, we'll handle the content as a mix of text and math if needed, 
      // but for simplicity here we assume the passed content is either pure LaTeX 
      // or we use a basic string replacement if it's mixed.
      
      const renderMath = () => {
        try {
            // If it contains $, we process segments. Otherwise, render whole.
            if (content.includes('$')) {
                let html = content;
                // Simple replacement for demonstration. A real markdown parser + katex is better.
                html = html.replace(/\$\$(.*?)\$\$/g, (_, tex) => 
                    katex.renderToString(tex, { displayMode: true, throwOnError: false })
                );
                html = html.replace(/\$(.*?)\$/g, (_, tex) => 
                    katex.renderToString(tex, { displayMode: false, throwOnError: false })
                );
                containerRef.current!.innerHTML = html.replace(/\n/g, '<br/>');
            } else {
                katex.render(content, containerRef.current!, {
                    displayMode: block,
                    throwOnError: false,
                });
            }
        } catch (err) {
            console.error("KaTeX error:", err);
            containerRef.current!.textContent = content;
        }
      };
      renderMath();
    }
  }, [content, block]);

  return <div ref={containerRef} className={className} />;
};

export default MathRenderer;
