import React  from "react";
import { styleConcat } from './ComponentHelper';
import { Typography } from '@material-ui/core';

export default function Text({ font,strike,noWrap,variant,lineHeight, component, size, transform, align, regular, bold, semibold, medium, weight, light, center, right, left, spacing, height, color, style, children, ...props }) {



    const textStyles = [ 
        styles.light,
        size && { fontSize: size },
        transform && { textTransform: transform },
        align && { textAlign: align },
        height && { lineHeight: height },
        spacing && { letterSpacing: spacing },
        weight && { fontWeight: weight },
        regular && styles.regular,
        bold && styles.bold,
        semibold && styles.semibold, 
        light && styles.light,
        medium&&styles.medium,
        center && styles.center,
        right && styles.right,
        left && styles.left,
        noWrap && { whiteSpace: 'nowrap' },
        strike&&{textDecoration:'line-through'},
        lineHeight && {lineHeight:lineHeight},
        color && { color },  
        style
    ];

    return (
        <Typography variant={variant} component={component} style={styleConcat(textStyles)} {...props}>
            {children}
        </Typography>
    );
}


const styles = {
    // default style
    // variations
    regular: {
        fontWeight: "normal",
    },
    bold: {
        fontWeight: "700",
    },
    semibold: {
        fontWeight: "600",
    },
    medium: {
        fontWeight: "500",
    },
    light: {
        fontWeight: "400",
    },
    // position
    center: { textAlign: "center" },
    right: { textAlign: "right" },
    left: { textAlign: "left" }
};