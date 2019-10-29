# useScanDetection

A react hook for detecting barcode scanners in the DOM.

## Installation

```
npm i use-scan-detection
```

## Usage

```
useScanDetection({
    onComplete: () => {}
});
```

## Parameters

Parameters are supplied by a config object:

|   Parameter   |   Description |
|   ---         |   ---         |
|   waitTime    |   Maximum time between characters in milliseconds. Used to determine if input is from keyboard or a scanner. Defaults to `50`. |
| startCharacter | **Optional**. Character that barcode scanner prefixes input with. Code is only read if this character is read first. |
| endCharacter | Character that barcode scanner suffixes input with. Code is only read if this character is read last. Defaults to line return (key code `13`)|
| onComplete | Function that is called when a complete barcode is scanned. Function is called with a single string which is the read code. |
| onError | **Optional**. Function that is called when an incomplete barcode is scanned. Function is called with a single string which is currently always `incomplete scan detected`|
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