import { createTheme } from '@material-ui/core/styles'
// import { black } from '@mui/material/colors'

const theme = createTheme({
  palette: {
    primary: {
      main: '#009B93'
    },
    secondary: {
      main: '#02B1A8'
    }
  },
  components: {
    MuiFormLabel: {
      styleOverrides: {
        root: {
          color: '#000'
        }
      }
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: '#000'
        }
      }
    }
  }
})

export default theme
