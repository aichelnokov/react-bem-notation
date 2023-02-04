# React BEM Notation
ReactBemNotation is a small hook that can possible use mods and mix props for generate full classList string in BEM notation.
Also you can use `additionalMods` and `additionalMix` for change result of generating full `className` string in render function.

_* For any other situations you can use additional `className` param._

:octocat: [Source code on github](https://github.com/aichelnokov/react-bem-notation)

## Install
:package: To download this package from npm use following command in a terminal
```
npm install react-bem-notation
```

## How to use

First, that you need is import hook
```js
// top of component file
import { useBemNotation } from 'react-bem-notation';

// in body of component
const {getClassName, getClassNameElem} = useBemNotation(YourComponent, {className: "other classes that you need", mods, mix}, 'block-name-that-you-want-to-display-in-dom-tree');

// ...
return (
    <div className={getClassName({additionalMods, additionalMix})}>
        <div className={getClassNameElem(elem, additionalMods, additionalMix)}>elem</div>
    </div>
);
```

>__Note!__
>All block modifiers that are __changed only by the component itself (from state)__ and will not change from the outside (from props) should be passed from the component state
>All block modifiers that are __modified by the parent component (from props)__ and will not be modified internally (from state) must be passed from props

## Example

This is a simly application that used modifiers and mixes, on a custom component `ModificableButton`.
During use application:
* if you click on the first button they’re changed mods inside component (they will set `modificable-button_pressed` class after `mouseDown` event and remove it after `mouseUp` event)
* if you click on the second button then first button will changes their mods from App state (toggle class `modificable-button_disabled`)

```jsx
/**
 * ModificableButton.jsx
 * button component with primitive props, some state and mixes
 */
import React, { useState, useMemo } from "react";
import useBemNotation from "react-bem-notation";

const ModificableButton = ({
    children,
    disabled = false,
    mods = {}, 
    mix = {}, 
    icon = undefined,
    onClick =  undefined,
    onMouseDown = undefined,
    onMouseUp = undefined,
}) => {
    const [pressed, setPressed] = useState(false);
    const {getClassName, getClassNameElem} = useBemNotation(ModificableButton, {className: "for-demo", mods, mix}, 'modificable-button');

    const iconComponent = useMemo(() => {
        if (typeof icon !== 'string') return null;
        const iconMods = {};
        iconMods[icon] = true;
        return (
            <span className={
                getClassNameElem({elem: 'icon', additionalMods: iconMods})
            }></span>
        );
    }, [icon]);

    const handleClick = (e) => {
        e.preventDefault();
        onClick?.(e);
    }

    const handleMouseEvents = (e) => {
        if (e.type === "mousedown") {
            setPressed(true);
            onMouseDown?.(e);
        }
        if (e.type === "mouseup") {
            setPressed(false);
            onMouseUp?.(e);
        }
    }

    return (
        <button className={
            getClassName({
                additionalMods: {"pressed": pressed, "disabled": disabled}, 
                additionalMix: {"mix-bool": true, "mix-string": "example", "mix-number": 0}
            })
        } onClick={handleClick} onMouseDown={handleMouseEvents} onMouseUp={handleMouseEvents}>
            {iconComponent}
            {children}
        </button>
    );
};

// Different method for initialize displayName
// ModificableButton.displayName = 'ModificableButton';
export default ModificableButton;
```

Then, we can use `ModificableButton` in `App` component.

```jsx
/**
 * App.js
 */
import React, { useState } from "react";
import ModificableButton from "./components/ModificableButton/ModificableButton.jsx"

const App = () => {
	const [disabled, setDisabled] = useState(false);
	
	const toggleDisable = (e) => {
		setDisabled((prevState) => {
			return !prevState;
		})
	}

    return (
		<React.Fragment>
			<h1>react-modificable</h1>
			<div className="panel">
				<ModificableButton mods={{"theme": "default"}} mix={{"mix-button-demo-bool": true}} disabled={disabled} icon="star">Click me!</ModificableButton>
				<ModificableButton onClick={toggleDisable} mods={{"theme": "default"}}>{disabled ? 'Enable' : 'Disable'}</ModificableButton>
			</div>
		</React.Fragment>
	);
};

export default App;
```

After load application we will see two `ModificableButton` elements in DOM tree with classes `modificable-button` in BEM notation.
```html
<button class="ModificableButton for-demo ModificableButton_theme_default mix-button-demo-bool mix-bool mix-string_example mix-number_0">
    <span class="modificable-button__icon modificable-button__icon_star"></span>
    Click me!
</button>
<button class="ModificableButton for-demo ModificableButton_theme_default mix-bool mix-string_example mix-number_0">Disable</button>
```