import { isValidElement, cloneElement } from "react";

export const realDOM = (props) => {
    let _name = props[tag];
    if (!_name) {
        _name = Name.create();
    }

    const getChildName = (() => {
        let current_name = _name + '_0'
        return () => {
            let result = current_name;
            current_name = nextName(current_name)
            return result;
        }
    })();

    const getDOM = selector => document.querySelector(selector);
    return {
        // TODO `consider refactoring
        $: { [getAttr(_name)]: '' },
        get this() { return getDOM('[' + getAttr(_name) + ']') },
        get: obj => {
            let name = obj?.props[tag];
            return name ? getDOM('[' + getAttr(name) + ']') : null;
        },
        getByRef: ref => getDOM('[' + Object.keys(ref)[0] + ']'),
        new: (obj) => decorate(obj, _name),
        create: (obj) => decorate(obj, getChildName()),
        // TODO `consider refactoring
        get child() { return { [tag]: getChildName() } },
        useRef: () => { return { [getAttr(getChildName())]: '' } }
    };
}

const decorate = (obj, name) => {
    if (isValidElement(obj)) {
        let props = obj.props || {};
        if (obj.type['name'])  // Check if React Component
            return cloneElement(obj, { ...props, [tag]: name });
        return cloneElement(obj, { ...props, [getAttr(name)]: '' });
    }
    return obj;
}

const tag = "e8e"

const getAttr = (name) => {
    let id = getId(name).toString(16);
    return`${tag}_${id}`
}

const getId = (() => {
    let i = 0;
    const map = new Map();

    return obj => {
        if (!map.has(obj)) map.set(obj, i++);
        return map.get(obj);
    };
})()

const Name = (() => {
    let c = 0;

    const createName = () => {
        let name = c.toString(16)
        c++;
        return name;
    };

    const reset = () => { c--; console.log(c)}

    return {
        create: createName,
        reuse: reset
    }
})()

const nextName = name => {
    let octets = name.split('_');
    let last = octets[octets.length - 1];
    octets[octets.length - 1] = (parseInt(last, 16) + 1).toString(16)
    return octets.join('_');
}