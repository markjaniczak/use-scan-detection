# useScanDetection

![npm](https://img.shields.io/npm/v/use-scan-detection)
![downloads](https://img.shields.io/npm/dm/use-scan-detection)

A react hook for detecting barcode scanners in the DOM.

## Installation

```
npm i use-scan-detection
```

## Usage

```
useScanDetection({
    onComplete: (code) => { console.log(code) }
});
```

## Parameters

Parameters are supplied by a config object:

|   Parameter   |   Description |
|   ---         |   ---         |
|   averageWaitTime    | Average time between characters in milliseconds. Used to determine if input is from keyboard or a scanner. Defaults to `50`. |
| timeToEvaluate    | Time to evaluate the buffer after each character. |
| startCharacter | **Optional**. Character that barcode scanner prefixes input with. Buffer only starts if this character is read first. |
| endCharacter | **Optional**. Character that barcode scanner suffixes input with. Buffer is evaluated early if this character is read. Defaults to line return and escape. |
| onComplete | Function that is called when a complete barcode is scanned. Function is called with a single string which is the complete code. |
| onError | **Optional**. Function that is called when an incomplete barcode is scanned. Function is called with a single string which is the incomplete code. |
| minLength | Minimum number of characters for a barcode to successfully read. Should be greater than 0. Defaults to `1`. |
| ignoreIfFocusOn | **Optional**. DOM element that if focused prevents codes from being read. |
| stopPropagation | Whether to call stopPropagation on each key event. Defaults to `false`. |
| preventDefault | Whether to call preventDefault on each key event. Defaults to `false`. |
| container | DOM element to listen for keydown events in. Defaults to `document`.

## Return
This hook returns nothing.

## Example
```js
import React, { useState } from 'react';
import useScanDetection from 'use-scan-detection';

const Input = () => {
    const [value, setValue] = useState("");

    useScanDetection({
        onComplete: setValue,
        minLength: 13 // EAN13
    });

    return (
        <input 
            value={value} 
            type="text"
        />
    );
};

export default Input
```

## License
MIT Licensed