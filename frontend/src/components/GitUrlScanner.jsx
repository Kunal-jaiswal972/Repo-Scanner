import React, { useState } from "react";
import {
  TextField,
  Button,
  Box,
  CircularProgress,
  Typography,
} from "@mui/material";
import axiosInstance from "@/lib/axiosInstance";
import { VulnerabilityReport } from "@/components/VulnerabilityReport";

export const GitUrlScanner = () => {
  const [gitUrl, setGitUrl] = useState("");
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [urlError, setUrlError] = useState("");

  const isValidGitHubUrl = (url) => {
    return !!url.match(/github\.com\/([^/]+)\/([^/]+)/);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!isValidGitHubUrl(gitUrl)) {
      setUrlError("Please enter a valid GitHub repository URL.");
      setLoading(false);
      return;
    }

    try {
      const res = await axiosInstance.post("scan", {
        gitUrl,
      });

      setResponse(res.data);
      setError(null);
    } catch (err) {
      setError("Failed to perform the request");
      console.error("Error:", err);
    } finally {
      setLoading(false);
      setUrlError("");
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ display: "flex", flexDirection: "column", gap: 2, width: "100%" }}
    >
      <TextField
        label="GitHub URL"
        variant="outlined"
        value={gitUrl}
        onChange={(e) => setGitUrl(e.target.value)}
        fullWidth
        required
        disabled={loading}
        error={!!urlError}
        helperText={urlError}
      />

      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={loading || !gitUrl}
        startIcon={loading && <CircularProgress size={20} />}
      >
        {loading ? "Loading..." : "Submit"}
      </Button>

      {error && <Typography color="error">{error}</Typography>}

      {response && <VulnerabilityReport data={response} />}
    </Box>
  );
};
