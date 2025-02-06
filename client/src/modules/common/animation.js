let startFunc = null;
export const animate = (currentTarget, start, end) => {
    startFunc = startFunc || start;
    const decorator = next => {
        const endingListener = (e) => {
            end();
            next();
            e.target.removeEventListener('animationend', endingListener);
        };
        return endingListener;
    }

    const run = () => {
        currentTarget?.addEventListener('animationend', decorator(e => {}));
        startFunc();
        startFunc = null;
    }

    const nextAnimation = (nextTarget, startFunc, endFunc) => {
        currentTarget?.addEventListener('animationend', decorator(startFunc));
        return animate(nextTarget, startFunc, endFunc);
    }

    return {
        start: run,
        then: nextAnimation
    }
}