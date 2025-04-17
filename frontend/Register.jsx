import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  Link,
  Avatar
} from "@mui/material";
import PersonAddIcon from '@mui/icons-material/PersonAdd';

export default function Register() {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post("http://localhost:8000/auth/register", {
        user_id: userId,
        password,
      });

      if (response.data.message === "User registered successfully.") {
        localStorage.setItem("userId", userId);
        navigate("/profile");
      }
    } catch (err) {
      if (err.response?.data?.detail) {
        setError(err.response.data.detail);
      } else {
        setError("Registration failed. Please try again.");
      }
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "background.default",
        py: 4
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={3}
          sx={{
            p: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar
            sx={{
              mb: 2,
              bgcolor: "secondary.main",
              width: 56,
              height: 56
            }}
          >
            <PersonAddIcon fontSize="large" />
          </Avatar>

          <Typography component="h1" variant="h4" gutterBottom>
            Create Account
          </Typography>

          <Typography variant="body1" color="text.secondary" mb={3} textAlign="center">
            Sign up to find study buddies
          </Typography>

          {error && (
            <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleRegister} sx={{ width: "100%" }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="userId"
              label="User ID"
              name="userId"
              autoComplete="username"
              autoFocus
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="secondary"
              sx={{ mt: 3, mb: 2, py: 1.5 }}
            >
              Register
            </Button>

            <Box textAlign="center">
              <Typography variant="body2">
                Already have an account?{" "}
                <Link
                  component="button"
                  variant="body2"
                  onClick={() => navigate("/")}
                  underline="hover"
                >
                  Log in
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
