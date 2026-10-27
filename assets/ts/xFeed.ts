/**
 * Carousel for the X posts widget (partials/widget/x-feed.html).
 * Slides scroll natively (swipe/trackpad, scroll-snap); arrows and dots drive the same scroll.
 */
export default function setupXFeed() {
    document.querySelectorAll<HTMLElement>('[data-x-feed]').forEach(feed => {
        const track = feed.querySelector<HTMLElement>('[data-x-feed-track]');
        const prev = feed.querySelector<HTMLButtonElement>('[data-x-feed-prev]');
        const next = feed.querySelector<HTMLButtonElement>('[data-x-feed-next]');
        const dots = Array.from(feed.querySelectorAll<HTMLButtonElement>('[data-x-feed-dot]'));
        if (!track || !prev || !next) return;

        const slides = Array.from(track.children) as HTMLElement[];

        const currentIndex = () => {
            const width = track.clientWidth || 1;
            return Math.min(Math.round(track.scrollLeft / width), slides.length - 1);
        };

        const goTo = (index: number) => {
            const target = slides[Math.max(0, Math.min(index, slides.length - 1))];
            track.scrollTo({ left: target.offsetLeft - track.offsetLeft, behavior: 'smooth' });
        };

        const update = () => {
            const index = currentIndex();
            prev.disabled = index === 0;
            next.disabled = index === slides.length - 1;
            dots.forEach((dot, i) => dot.setAttribute('aria-current', String(i === index)));
        };

        prev.addEventListener('click', () => goTo(currentIndex() - 1));
        next.addEventListener('click', () => goTo(currentIndex() + 1));
        dots.forEach((dot, i) => dot.addEventListener('click', () => goTo(i)));

        track.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') { e.preventDefault(); goTo(currentIndex() - 1); }
            if (e.key === 'ArrowRight') { e.preventDefault(); goTo(currentIndex() + 1); }
        });

        let ticking = false;
        track.addEventListener('scroll', () => {
            if (ticking) return;
            ticking = true;
            window.requestAnimationFrame(() => { update(); ticking = false; });
        }, { passive: true });

        update();
    });
}
