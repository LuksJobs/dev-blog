const convertMermaidBlocks = (): void => {
    const codeBlocks = document.querySelectorAll('pre > code.language-mermaid, code.language-mermaid');

    codeBlocks.forEach((codeBlock) => {
        if (codeBlock.closest('.mermaid')) return;

        const parent = codeBlock.parentElement;
        const text = (codeBlock.textContent || '').trim();

        if (!text) return;

        const diagram = document.createElement('div');
        diagram.className = 'mermaid';
        diagram.textContent = text;

        if (parent && parent.tagName === 'PRE') {
            parent.replaceWith(diagram);
        } else {
            codeBlock.replaceWith(diagram);
        }
    });
};

const setupMermaid = (): void => {
    convertMermaidBlocks();

    const mermaidNodes = document.querySelectorAll('.mermaid');
    if (!mermaidNodes.length) return;

    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js';
    script.async = true;

    script.onload = () => {
        const mermaid = (window as any).mermaid;

        if (!mermaid) return;

        mermaid.initialize({
            startOnLoad: false,
            securityLevel: 'loose',
            theme: 'default',
            flowchart: {
                useMaxWidth: true,
                htmlLabels: true,
            },
        });

        mermaid.run({ nodes: Array.from(mermaidNodes) });
    };

    document.head.appendChild(script);
};

window.addEventListener('DOMContentLoaded', setupMermaid);
