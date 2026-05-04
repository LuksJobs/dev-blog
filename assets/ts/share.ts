type ShareStatus = 'shared' | 'copied' | 'cancelled' | 'error';

function setTemporaryStatus(button: HTMLButtonElement, labelEl: HTMLElement | null, status: ShareStatus) {
    const originalLabel = button.getAttribute('data-original-label') ?? (labelEl?.textContent ?? 'Compartilhar');
    button.setAttribute('data-original-label', originalLabel);

    const map: Record<ShareStatus, string> = {
        shared: 'Compartilhado',
        copied: 'Link copiado',
        cancelled: 'Cancelado',
        error: 'Erro'
    };

    const next = map[status];
    if (labelEl) labelEl.textContent = next;
    else button.setAttribute('aria-label', next);

    button.classList.add('is-status');
    window.setTimeout(() => {
        if (labelEl) labelEl.textContent = originalLabel;
        button.classList.remove('is-status');
    }, 1800);
}

async function copyToClipboard(text: string) {
    if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        return;
    }

    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', 'true');
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    textarea.remove();
}

function buildShareData(button: HTMLElement) {
    const url = button.getAttribute('data-share-url') || window.location.href;
    const title = button.getAttribute('data-share-title') || document.title;

    return { url, title };
}

function bumpLocalCounter(button: HTMLButtonElement) {
    // Simple local/per-device counter (non-public). Keyed by URL.
    const url = button.getAttribute('data-share-url') || window.location.href;
    const key = `repost-count:${url}`;

    const current = Number.parseInt(window.localStorage.getItem(key) || '0', 10) || 0;
    const next = current + 1;
    window.localStorage.setItem(key, String(next));

    const countEl = button.querySelector<HTMLElement>('[data-share-count]');
    if (countEl) countEl.textContent = String(next);
}

function hydrateLocalCounter(button: HTMLButtonElement) {
    const url = button.getAttribute('data-share-url') || window.location.href;
    const key = `repost-count:${url}`;

    const current = Number.parseInt(window.localStorage.getItem(key) || '0', 10) || 0;
    const countEl = button.querySelector<HTMLElement>('[data-share-count]');
    if (countEl) countEl.textContent = String(current);
}

export default function setupShare() {
    const buttons = Array.from(document.querySelectorAll<HTMLButtonElement>('[data-share-button]'));
    if (!buttons.length) return;

    buttons.forEach(btn => {
        if (btn.getAttribute('data-share-ready') === '1') return;
        btn.setAttribute('data-share-ready', '1');

        hydrateLocalCounter(btn);

        const labelEl = btn.querySelector<HTMLElement>('[data-share-label]');

        btn.addEventListener('click', async (e) => {
            e.preventDefault();

            const { url, title } = buildShareData(btn);

            // Optimistic bump (a click is a click; share sheet may be cancelled).
            bumpLocalCounter(btn);

            try {
                if (navigator.share) {
                    await navigator.share({ title, url });
                    setTemporaryStatus(btn, labelEl, 'shared');
                } else {
                    await copyToClipboard(url);
                    setTemporaryStatus(btn, labelEl, 'copied');
                }
            } catch (err: any) {
                // AbortError is the usual cancel signal on supported browsers.
                if (err?.name === 'AbortError') {
                    setTemporaryStatus(btn, labelEl, 'cancelled');
                } else {
                    setTemporaryStatus(btn, labelEl, 'error');
                    // eslint-disable-next-line no-console
                    console.warn('Share failed:', err);
                }
            }
        });
    });
}
