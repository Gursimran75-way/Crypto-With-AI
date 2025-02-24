import { createTheme } from "@mui/material/styles";

// A custom theme for this app
const theme = createTheme({
  palette: {
    secondary: {
      main: '#f4f7fd',
    },
    common: {
      darkPurple: '#0C1643',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        contained: {
          backgroundColor: '#0C1643',
        },
      },
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 450,
      md: 990,
      lg: 1440,
      xl: 1900,
    },
  },
});

export default theme;
