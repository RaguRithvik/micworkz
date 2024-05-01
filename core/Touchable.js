import React, { useState } from "react";
import { styleConcat } from './ComponentHelper';

export default function Touchable({ style,opacity, children, ...props }) {
    const [cursor, seCursor] = useState(false);
    const textStyles = [
        { cursor : cursor ? "pointer" : "" },
        opacity && {opacity :cursor?.6:1},
        style
    ];

    return (
        <div onMouseEnter={() => seCursor(true)} onMouseLeave={() => seCursor(false)} style={styleConcat(textStyles)} {...props}>
            {children}
        </div>
    );
}

