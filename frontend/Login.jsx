// Frontend/Login.jsx
import { useState, useEffect } from "react";
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
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';

export default function Login() {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [macAddress, setMacAddress] = useState("");
  const navigate = useNavigate();

  // Generate a simulated MAC address or attempt to retrieve device info
  // In reality, this would use specialized APIs or libraries
  useEffect(() => {
    const generateMacAddress = () => {
      // In a real implementation, you would use a library like 'network-address' or other
      // methods to get the actual MAC address. Since browser security prevents direct access,
      // a server-side approach or desktop-specific approach would be needed.

      // For demonstration, generate a simulated MAC address
      const hexDigits = "0123456789ABCDEF";
      let macAddress = "";

      // Generate a random MAC address with the format XX:XX:XX:XX:XX:XX
      for (let i = 0; i < 6; i++) {
        macAddress += hexDigits.charAt(Math.floor(Math.random() * 16));
        macAddress += hexDigits.charAt(Math.floor(Math.random() * 16));
        if (i < 5) macAddress += ":";
      }

      console.log("Generated MAC address:", macAddress);
      setMacAddress(macAddress);
    };

    generateMacAddress();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // First perform the standard login
      const loginResponse = await axios.post("http://localhost:8000/auth/login", {
        user_id: userId,
        password,
      });

      // After successful login, update the user's MAC address
      if (loginResponse.data.message === "Login successful.") {
        try {
          // Update the user's MAC address
          await axios.post("http://localhost:8000/profile/update-mac", {
            userId: userId,
            mac: macAddress
          });

          // Send user data to Raspberry Pi for match processing
          await axios.post("http://localhost:8000/raspberry-pi/send-user-data", {
            userId: userId
          });

          // Store user ID in local storage
          localStorage.setItem("userId", userId);
          // Store MAC address for future use
          localStorage.setItem("macAddress", macAddress);

          // Redirect based on whether profile exists
          if (loginResponse.data.profileExists) {
            navigate("/swipe"); // Go to matches if profile exists
          } else {
            navigate("/profile"); // Go to profile form if it doesn't exist
          }
        } catch (macError) {
          console.error("Error updating MAC address:", macError);
          // Even if MAC update fails, we can still proceed with login
          localStorage.setItem("userId", userId);

          if (loginResponse.data.profileExists) {
            navigate("/swipe");
          } else {
            navigate("/profile");
          }
        }
      } else {
        // Should not happen if backend uses HTTPExceptions correctly, but good practice
        setError(loginResponse.data.message || "Login failed. Unexpected response.");
      }
    } catch (err) {
      if (err.response?.data?.detail) {
        // Add more helpful guidance when credentials are invalid
        if (err.response.data.detail.includes("Invalid credentials")) {
          setError(`${err.response.data.detail} Please check your credentials or sign up for a new account.`);
        } else {
          setError(err.response.data.detail);
        }
      } else if (err.request) {
        // Network error (server down, CORS issue not resolved, etc.)
        setError("Network error. Could not reach the server. Please check backend and CORS.");
        console.error("Login Network Error:", err.request);
      }
      else {
        setError("Login failed. Please check your credentials or try again later.");
        console.error("Login Error:", err.message);
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
              bgcolor: "primary.main",
              width: 56,
              height: 56
            }}
          >
            <PeopleAltIcon fontSize="large" />
          </Avatar>

          <Typography component="h1" variant="h4" gutterBottom>
            Welcome to Make a Homie
          </Typography>

          <Typography variant="body1" color="text.secondary" mb={3} textAlign="center">
            Connect with like-minded buddies
          </Typography>

          {error && (
            <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleLogin} sx={{ width: "100%" }}>
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
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, py: 1.5 }}
            >
              Log In
            </Button>

            <Box textAlign="center">
              <Typography variant="body2">
                Don't have an account?{" "}
                <Link
                  component="button"
                  variant="body2"
                  onClick={() => navigate("/register")}
                  underline="hover"
                >
                  Sign up
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}