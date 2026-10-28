/**
 * Collapsible left sidebar (desktop only).
 * The initial state is restored by an inline script in head.html to avoid a layout jump.
 */
const storageKey = 'StackSidebarCollapsed';

const setupSidebarCollapse = (): void => {
    const toggle = document.getElementById('sidebar-collapse-toggle');
    if (!toggle) return;

    const root = document.documentElement;

    const apply = (collapsed: boolean): void => {
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
    };

    apply(root.dataset.sidebar === 'collapsed');

    toggle.addEventListener('click', () => {
        const collapsed = root.dataset.sidebar !== 'collapsed';
        apply(collapsed);

        try {
            localStorage.setItem(storageKey, String(collapsed));
        } catch (e) {}
    });
};

export default setupSidebarCollapse;
