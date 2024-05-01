import React, { Component } from 'react'
import { Paper } from '@material-ui/core';
import { styleConcat } from './ComponentHelper';

export default function card({middle, center, padding, margin, style, color,borderRadius, children,noShadow,...props}) {

    function handleMargins() {
        
        if (typeof margin === 'number') {
            return {
                marginTop: margin,
                marginRight: margin,
                marginBottom: margin,
                marginLeft: margin,
            }
        }

        if (typeof margin === 'object') {
            const marginSize = Object.keys(margin).length;
            switch (marginSize) {
                case 1:
                    return {
                        marginTop: margin[0],
                        marginRight: margin[0],
                        marginBottom: margin[0],
                        marginLeft: margin[0],
                    }
                case 2:
                    return {
                        marginTop: margin[0],
                        marginRight: margin[1],
                        marginBottom: margin[0],
                        marginLeft: margin[1],
                    }
                case 3:
                    return {
                        marginTop: margin[0],
                        marginRight: margin[1],
                        marginBottom: margin[2],
                        marginLeft: margin[1],
                    }
                default:
                    return {
                        marginTop: margin[0],
                        marginRight: margin[1],
                        marginBottom: margin[2],
                        marginLeft: margin[3],
                    }
            }
        }
    }

    function handlePaddings() {
        
        if (typeof padding === 'number') {
            return {
                paddingTop: padding,
                paddingRight: padding,
                paddingBottom: padding,
                paddingLeft: padding,
            }
        }

        if (typeof padding === 'object') {
            const paddingSize = Object.keys(padding).length;
            switch (paddingSize) {
                case 1:
                    return {
                        paddingTop: padding[0],
                        paddingRight: padding[0],
                        paddingBottom: padding[0],
                        paddingLeft: padding[0],
                    }
                case 2:
                    return {
                        paddingTop: padding[0],
                        paddingRight: padding[1],
                        paddingBottom: padding[0],
                        paddingLeft: padding[1],
                    }
                case 3:
                    return {
                        paddingTop: padding[0],
                        paddingRight: padding[1],
                        paddingBottom: padding[2],
                        paddingLeft: padding[1],
                    }
                default:
                    return {
                        paddingTop: padding[0],
                        paddingRight: padding[1],
                        paddingBottom: padding[2],
                        paddingLeft: padding[3],
                    }
            }
        }
    }

 
    const defaultStyle = [
        color && { backgroundColor: color },
        handlePaddings(),
        handleMargins(),
        middle ? { alignItems: 'center' } : {},
        center ? { justifyContent: 'center' } : {},
        borderRadius?{borderRadius:borderRadius}:{},
        style
    ]

    return (
        <Paper elevation={noShadow?0:2} style={styleConcat(defaultStyle)} {...props}>
            {children}
        </Paper>
    );
}


