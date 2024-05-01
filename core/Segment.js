import React, { useState } from "react";
import { styleConcat } from './ComponentHelper';
import Text  from './Text';
import Row  from './Row';
import Card  from './Card';

export default function Segment({ style,lable,active,active_color,opacity, children, ...props }) {
    const [cursor, seCursor] = useState(false);
    const textStyles = [
        { cursor : cursor ? "pointer" : "" },
        opacity && {opacity :cursor?.6:1},
        active && {backgroundColor:active_color},
        {borderRadius:30}, 
        style
    ];

    return (
        <Card padding={[5,0]} center middle onMouseEnter={() => seCursor(true)} onMouseLeave={() => seCursor(false)} style={styleConcat(textStyles)} {...props}>
            <Text center color={active?"white":""} bold>{lable}</Text>
        </Card>
    );
}

