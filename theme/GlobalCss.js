import makeStyles from '@material-ui/core/styles/makeStyles';
import createBreakpoints from '@material-ui/core/styles/createBreakpoints';

const breakpoints = createBreakpoints({});

let paddingClasses = {};
for (let count = 1; count <= 8; count++) {
  paddingClasses['.pt-' + count] = { paddingTop: count * 4 + 'px !important' };
  paddingClasses['.pb-' + count] = { paddingBottom: count * 4 + 'px !important' };
}

const globalStyles = makeStyles((theme) => ({
  breakpoints,
  '@global': {
    '.responsive-header-name': {
      '@media screen and (max-width: 600px)': {
        fontSize: '1.5vw'
      }
    },
    '*': {
      boxSizing: 'border-box',
      margin: 0,
      padding: 0,
    },
    a: {
      textDecoration: 'none',
      '&:hover,&:focus': {
        textDecoration: 'none',
      },
      '&.disable-link': {
        pointerEvents: 'none',
        cursor: 'default',
        [theme.breakpoints.down('xs')]: {
          pointerEvents: 'inherit',
          cursor: 'pointer',
        },
      },
    },
    img: {
      maxWidth: '100%',
    },
    '.pointer': {
      cursor: 'pointer',
    },
    '.rounded': {
      borderRadius: '50%',
    },
    '.Cmt-table-responsive': {
      minHeight: '.01%',
      overflowX: 'auto',
      [theme.breakpoints.down('sm')]: {
        width: '100%',
        marginBottom: 15,
        overflowY: 'hidden',
        border: `1px solid ${theme.palette.borderColor.main}`,
        '& > table': {
          marginBottom: 0,
          '& > thead > tr > th': {
            paddingTop: 8,
          },
          '& > thead > tr > th, > tbody > tr > th, > tfoot > tr > th, thead > tr > td, tbody > tr > td, tfoot > tr > td': {
            whiteSpace: 'nowrap',
          },
        },
      },
    },
    '.dropzone': {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: theme.spacing(10, 5),
      border: `2px dashed ${theme.palette.borderColor.main}`,
      borderRadius: 2,
      backgroundColor: theme.palette.background.default,
      outline: 'none',
      transition: 'border .24s ease-in-out',
    },
    '.MuiDropzoneArea-root': {
      minHeight: '130 !important',
      [theme.breakpoints.down('sm')]: {
        minHeight: '160 !important',
      },
    },
    '.swal2-shown .swal2-container': {
      zIndex: 1104,
    },
    '.swal2-container .swal2-popup, .swal2-container .swal2-popup.swal2-toast': {
      backgroundColor: theme.palette.popupColor.main,
      color: theme.palette.text.primary,
    },
    '.swal2-container .swal2-content, .swal2-container .swal2-title': {
      color: theme.palette.text.primary,
    },
    '.swal2-container .swal2-footer a': {
      color: theme.palette.primary.main,
    },
    '.swal2-container .swal2-close:focus': {
      outline: 'none',
    },
    '.MuiFormControl-marginDense': {
      marginTop: '0px !important',
    },
    '.MuiOutlinedInput-inputMarginDense, .react-tel-input .small-height-field': {
      paddingTop: '12.5px !important',
      paddingBottom: '12.5px !important',
    },
    '.MuiFormLabel-root': {
      color: 'black',
      paddingTop: '2px !important',
      fontSize: '0.90rem !important',
    },
    // '.MuiSelect-nativeInput': {
    //   bottom: '10px',
    //   width: '90%',
    //   opacity: 10,
    //   border: '1px solid white',
    // },
    '.MuiToggleButton-root.Mui-selected ': {
      backgroundColor: theme.palette.primary.main + '!important',
      color: '#fff!important',
    },
     '.input_height .MuiAutocomplete-input': {
      paddingTop: '7px !important',
      paddingBottom: '6px !important'
    },
    ...paddingClasses,
  },
}));

export default globalStyles;
