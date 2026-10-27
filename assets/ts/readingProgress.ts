/**
 * Thin progress bar at the top of the viewport showing how much of the article was read.
 */
export default function setupReadingProgress(articleContent: HTMLElement) {
    if (document.querySelector('.reading-progress')) return;

    const bar = document.createElement('div');
    bar.className = 'reading-progress';
    bar.setAttribute('aria-hidden', 'true');
    document.body.appendChild(bar);

    let ticking = false;

    const update = () => {
        const rect = articleContent.getBoundingClientRect();
        const total = rect.height - window.innerHeight;
        const read = total > 0 ? Math.min(Math.max(-rect.top / total, 0), 1) : 1;
        bar.style.transform = `scaleX(${read})`;
        ticking = false;
    };

    const onScroll = () => {
        if (ticking) return;
        ticking = true;
        window.requestAnimationFrame(update);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();
}
