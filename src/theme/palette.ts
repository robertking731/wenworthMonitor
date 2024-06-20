import { alpha } from '@mui/material/styles';

// ----------------------------------------------------------------------

export type ColorSchema = 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error';

declare module '@mui/material/styles/createPalette' {
  interface TypeBackground {
    neutral: string;
  }
  interface SimplePaletteColorOptions {
    lighter: string;
    darker: string;
  }
  interface PaletteColor {
    lighter: string;
    darker: string;
  }
  interface Palette {
    glass: {
      primary: string;
      secondary: string;
    };
    backgroundGradientEffect: {
      gradientBackgroundStart: string;
      gradientBackgroundEnd: string;
      firstColor: string;
      secondColor: string;
      thirdColor: string;
      fourthColor: string;
      fifthColor: string;
      pointerColor: string;
      size: string;
      blendingValue: string;
      interactive: boolean;
    };
  }
}

// SETUP COLORS

export const grey = {
  0: '#FFFFFF',
  100: '#F9FAFB',
  200: '#F4F6F8',
  300: '#DFE3E8',
  400: '#C4CDD5',
  500: '#919EAB',
  600: '#637381',
  700: '#454F5B',
  800: '#212B36',
  900: '#161C24',
};

export const primary = {
  lighter: '#C8FAD6',
  light: '#5BE49B',
  main: '#00A76F',
  dark: '#007867',
  darker: '#004B50',
  contrastText: '#FFFFFF',
};

export const secondary = {
  lighter: '#EFD6FF',
  light: '#C684FF',
  main: '#8E33FF',
  dark: '#5119B7',
  darker: '#27097A',
  contrastText: '#FFFFFF',
};

export const info = {
  lighter: '#CAFDF5',
  light: '#61F3F3',
  main: '#00B8D9',
  dark: '#006C9C',
  darker: '#003768',
  contrastText: '#FFFFFF',
};

export const success = {
  lighter: '#D3FCD2',
  light: '#77ED8B',
  main: '#22C55E',
  dark: '#118D57',
  darker: '#065E49',
  contrastText: '#ffffff',
};

export const warning = {
  lighter: '#FFF5CC',
  light: '#FFD666',
  main: '#FFAB00',
  dark: '#B76E00',
  darker: '#7A4100',
  contrastText: grey[800],
};

export const error = {
  lighter: '#FFE9D5',
  light: '#FFAC82',
  main: '#FF5630',
  dark: '#B71D18',
  darker: '#7A0916',
  contrastText: '#FFFFFF',
};

export const common = {
  black: '#000000',
  white: '#FFFFFF',
};

export const action = {
  hover: alpha(grey[500], 0.08),
  selected: alpha(grey[500], 0.16),
  disabled: alpha(grey[500], 0.8),
  disabledBackground: alpha(grey[500], 0.24),
  focus: alpha(grey[500], 0.24),
  hoverOpacity: 0.08,
  disabledOpacity: 0.48,
};

const base = {
  primary,
  secondary,
  info,
  success,
  warning,
  error,
  grey,
  common,
  divider: alpha(grey[500], 0.2),
  action,
};

// ----------------------------------------------------------------------

export function palette(mode: 'light' | 'dark') {
  const light = {
    ...base,
    mode: 'light',
    text: {
      primary: grey[800],
      secondary: grey[600],
      disabled: grey[500],
    },
    background: {
      paper: '#FFFFFF',
      default: '#FFFFFF',
      neutral: grey[200],
    },
    action: {
      ...base.action,
      active: grey[600],
    },
    glass: {
      primary: alpha(grey[500], 0.16),
      secondary: alpha(grey[500], 0.24),
    },
    backgroundGradientEffect: {
      gradientBackgroundStart: "rgb(228, 220, 222)",
      gradientBackgroundEnd: "rgb(220, 247, 222)",
      firstColor: "118, 213, 255",
      secondColor: "221, 104, 155",
      thirdColor: "100, 220, 255",
      fourthColor: "200, 150, 150",
      fifthColor: "220, 220, 70",
      pointerColor: "180, 140, 255",
      size: '50%',
      blendingValue: 'hard-light',
      interactive: true,
    }
  };

  const dark = {
    ...base,
    mode: 'dark',
    text: {
      primary: '#FFFFFF',
      secondary: grey[500],
      disabled: grey[600],
    },
    background: {
      paper: grey[800],
      default: grey[900],
      neutral: alpha(grey[500], 0.12),
    },
    action: {
      ...base.action,
      active: grey[500],
    },
    backgroundGradientEffect: {
      gradientBackgroundStart: 'rgb(20, 0, 30)', // even darker color
      gradientBackgroundEnd: 'rgb(0, 3, 15)', // even darker color
      firstColor: '4, 21, 47', // even darker color
      secondColor: '51, 13, 47', // even darker color
      thirdColor: '18, 41, 47', // even darker color
      fourthColor: '37, 9, 9', // even darker color
      fifthColor: '33, 43, 9', // even darker color
      pointerColor: '26, 18, 47', // even darker color
      size: '80%',
      blendingValue: 'hard-dark',
      interactive: true,
    }
  };

  return mode === 'light' ? light : dark;
}
