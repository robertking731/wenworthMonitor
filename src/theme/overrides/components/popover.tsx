import { listClasses } from '@mui/material/List';
import { Theme, alpha } from '@mui/material/styles';

import { paper } from '../../css';

// ----------------------------------------------------------------------

export function popover(theme: Theme) {
  return {
    MuiPopover: {
      styleOverrides: {
        paper: {
          ...paper({ theme, dropdown: true }),
          backdropFilter: 'blur(10px)',
          backgroundColor: alpha(theme.palette.background.default, 0.3),
          '&>span': {
            backgroundColor: alpha(theme.palette.background.default, 0.9),
          },
          [`& .${listClasses.root}`]: {
            paddingTop: 0,
            paddingBottom: 0,
          },
        },
      },
    },
  };
}
