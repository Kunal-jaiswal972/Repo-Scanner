import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Container, Typography } from "@mui/material";
import { GitUrlScanner } from "@/components/GitUrlScanner";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

export default function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Container
        maxWidth="md"
        sx={{
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          gap: "2rem",
          padding: "1rem",
        }}
      >
        <Typography variant="h3" component="h1">
          Repo Scanner
        </Typography>
        <Typography variant="h5">
          Enter the repo url in the input below
        </Typography>
        <GitUrlScanner />
      </Container>
    </ThemeProvider>
  );
}
