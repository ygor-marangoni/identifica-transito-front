let readyPromise: Promise<void> | undefined;
let resolveReady: (() => void) | undefined;

/**
 * Keeps the initial Landing V2 paint and its scroll measurements in the same
 * lifecycle. This module only runs in the browser and is intentionally local
 * to the public landing.
 */
export const waitForLandingV2Ready = () => {
    if (!import.meta.client) return Promise.resolve();

    readyPromise ??= new Promise<void>((resolve) => {
        resolveReady = resolve;
    });

    return readyPromise;
};

export const releaseLandingV2Ready = () => {
    if (!import.meta.client) return;

    resolveReady?.();
    resolveReady = undefined;
    readyPromise = Promise.resolve();
};
