import React from 'react';
import Hidden from '@material-ui/core/Hidden';
import { Box } from '@material-ui/core';
import Link from 'next/link';
import CmtImage from '../../../../@coremat/CmtImage';

const Logo = ({ heading,color, ...props }) => {
  const logoUrl = color === 'white' ? '/logo192.png' : '/logo192.png';
  const logoSymbolUrl = color === 'white' ? '/logo192.png' : '/logo192.png'; 

  return (
    <Box className="pointer" {...props} className="responsive-header-name">
      <Hidden xsDown>
        <Link href="/">
          <a>
            {' '}
             {!heading?<CmtImage width={40} height={40} src={logoSymbolUrl} alt="logo" />:<h1>{heading}</h1>} 

          </a> 
        </Link>
      </Hidden>
      <Hidden smUp>
        <Link href="/">
          <a>
            {' '}
            {!heading?<CmtImage width={40} height={40} src={logoSymbolUrl} alt="logo" />:<h1>{heading}</h1>} 
          </a>
        </Link>
      </Hidden>
    </Box>
  );
};

export default Logo;
