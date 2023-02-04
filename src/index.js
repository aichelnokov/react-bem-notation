import { useMemo } from 'react';

/**
 * Create a full list of classes
 * Include name of component, additional className, and all mods and mixes
 * @param {string} className
 * @param {Object} mods
 * @param {Object} mix
 * @returns {string[]}
 */
function getFullClassList(displayName, className, mods, mix) {
    const fullClassList = [displayName];

    if (className && (typeof className === 'string')) fullClassList.push(className);
    
    return [...fullClassList, ...getClassList(mods, displayName + '_'), ...getClassList(mix)];
}

/**
 * Return array of class names of mods or mixes
 * @param {Object} m list of mods or mixes
 * @param {string} p prefix
 * @returns {string[]}
 */
function getClassList(m, p = '') {
    const classList = [];

    for (var i in m) {
        const v = m[i];
        if ((typeof v === 'boolean') && v) {
            classList.push(`${p}${i}`);
        } else if ((typeof v === 'number') || (typeof v === 'string')) {
            classList.push(`${p}${i}_${String(v).replace(/\s+/g, '-')}`);
        }
    }

    return classList;
}

/**
 * @param {React.Component} component functional component
 * @param {Object} options addtional css classes, initial mods and mixes
 * @returns {Object} functions for generate full className:string fro block or elem
 */

export default function useBemNotation(component, { className = '', mods = {}, mix = {} } = {}, displayName = 'Component') {
    const getClassName = useMemo(() => {
        if (!component.displayName) {
            component.displayName = displayName;
        }
        return ({additionalMods = {}, additionalMix = {}} = {}) => {
            return getFullClassList(component.displayName, className, Object.assign(mods, additionalMods), Object.assign(mix, additionalMix)).join(' ');
        };
    }, [className, displayName, mods, mix]);

    const getClassNameElem = useMemo(() => {
        return ({elem = 'elem', additionalMods = {}, additionalMix = {}} = {}) => {
            return getFullClassList([component.displayName, elem].join('__'), '', Object.assign(additionalMods), Object.assign(additionalMix)).join(' ');
        };
    }, [displayName]);

    return { getClassName, getClassNameElem };
}