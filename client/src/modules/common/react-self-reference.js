import {cloneElement, isValidElement} from "react";

const useSelfPointer = state => {
    let self = state.current;

    if (!Object.hasOwn(self, tag)) {
        self[tag] = Name.create();
    }

    const getChildName = (() => {
        let current_name = self[tag] + '_0';
        return () => {
            let result = current_name;
            current_name = nextName(current_name);
            return result;
        }
    })();

    self.useHtmlElement = name => {
        const ref = { [getAttr(getChildName())]: '' }
        if (!Object.hasOwn(self, name)) {
            Object.defineProperty(self, name, {
                get() {
                    return getDOM('[' + Object.keys(ref)[0] + ']');
                }
            })
        }
        return ref;
    }

    self.render = template => decorate(template(), self[tag]);
    return self;
}
export default useSelfPointer;

const getDOM = selector => document.querySelector(selector);

const tag = "o8o"

const getId = (() => {
    let i = 0;
    const map = new Map();

    return obj => {
        if (!map.has(obj)) map.set(obj, i++);
        return map.get(obj);
    };
})();

const getAttr = (name) => {
    const id = getId(name).toString(16);
    return`${tag}_${id}`
}

const Name = (() => {
    let c = 0;

    const createName = () => {
        const name = c.toString(16)
        c++;
        return name;
    };

    return {
        create: createName
    }
})();

const nextName = name => {
    let octets = name.split('_');
    let last = octets[octets.length - 1];
    octets[octets.length - 1] = (parseInt(last, 16) + 1).toString(16)
    return octets.join('_');
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