import { createTheme } from '@mui/material/styles'
import theme from './theme'

const themeMui = createTheme({
  palette: {
    primary: {
      main: theme.color.primary
    },
    secondary: {
      main: theme.color.secondary
    }
  },
  components: {
    MuiFormLabel: {
      styleOverrides: {
        root: {
          color: theme.color.text,
          marginBottom: '0.5em'
        }
      }
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: theme.color.text
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          marginTop: '1em'
        }
      }
    }
  }
})

export default themeMui