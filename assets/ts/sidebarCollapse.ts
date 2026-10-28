/**
 * Collapsible left sidebar (desktop only).
 * The initial state is restored by an inline script in head.html to avoid a layout jump
 * (posts always start collapsed, see data-sidebar-mode="reading").
 *
 * The change is animated in two phases so the layout never jumps:
 * - collapse: fade out the labels, then shrink the column
 * - expand: grow the column with the labels hidden, then fade them in
 *
 * Navigating into a post plays the collapse, navigating out of one plays the expand
 * (head.html sets data-sidebar-intro from the state of the previous page).
 */
const storageKey = 'StackSidebarCollapsed';
const lastStateKey = 'StackSidebarLastState';

const fadeDuration = 150;
const resizeDuration = 300;
const introDelay = 350;

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const setupSidebarCollapse = (): void => {
    const toggle = document.getElementById('sidebar-collapse-toggle');
    if (!toggle) return;

    const root = document.documentElement;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let animating = false;

    const isCollapsed = () => root.dataset.sidebar === 'collapsed';

    const setState = (collapsed: boolean): void => {
        if (collapsed) {
            root.dataset.sidebar = 'collapsed';
        } else {
            delete root.dataset.sidebar;
        }

        const label = collapsed ? toggle.dataset.labelExpand : toggle.dataset.labelCollapse;
        toggle.setAttribute('aria-expanded', String(!collapsed));
        if (label) {
            toggle.setAttribute('aria-label', label);
            toggle.setAttribute('title', label);
        }

        // Lets the next page know whether the sidebar was visible (used to play the intro on posts)
        try {
            sessionStorage.setItem(lastStateKey, collapsed ? 'collapsed' : 'expanded');
        } catch (e) {}
    };

    const animateTo = async (collapsed: boolean): Promise<void> => {
        if (animating || collapsed === isCollapsed()) return;

        if (reducedMotion) {
            setState(collapsed);
            return;
        }

        animating = true;
        if (collapsed) {
            root.dataset.sidebarAnim = 'fade';
            await wait(fadeDuration);
            setState(true);
            delete root.dataset.sidebarAnim;
        } else {
            root.dataset.sidebarAnim = 'fade';
            setState(false);
            await wait(resizeDuration);
            delete root.dataset.sidebarAnim;
        }
        animating = false;
    };

    setState(isCollapsed());

    // Entering a post retracts the sidebar in front of the reader; leaving one opens it back
    const intro = root.dataset.sidebarIntro;
    if (intro) {
        delete root.dataset.sidebarIntro;
        wait(introDelay).then(() => animateTo(intro === 'collapse'));
    }

    toggle.addEventListener('click', () => {
        const collapsed = !isCollapsed();
        animateTo(collapsed);

        // On posts the sidebar starts collapsed for reading; toggling there doesn't change the saved preference
        if (root.dataset.sidebarMode === 'reading') return;

        try {
            localStorage.setItem(storageKey, String(collapsed));
        } catch (e) {}
    });
};

export default setupSidebarCollapse;
