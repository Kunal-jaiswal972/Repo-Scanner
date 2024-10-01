import { useState, useEffect } from "react";
import axios from "axios";
import hljs from "highlight.js";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { a11yDark } from "react-syntax-highlighter/dist/esm/styles/prism";

import { Typography, CircularProgress, Stack } from "@mui/material";
import { HighlightedCodeBlock } from "@/components/HighLightedCodeBlock";
import { formatDate } from "@/lib/formatDate";
import { CustomText } from "@/components/CustomText";

export const VulnerableFileDisplay = ({ report, repo }) => {
  const {
    File,
    StartLine,
    EndLine,
    Match,
    Description,
    Commit,
    Date,
    Message,
  } = report;

  const [fileContent, setFileContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [language, setLanguage] = useState("plaintext");

  const userAndRepo = repo.split("https://github.com/")[1];
  const rawFileUrl = `https://raw.githubusercontent.com/${userAndRepo}/${Commit}/${File}`;
  const githubFileUrl = `${repo}/blob/${Commit}/${File}`;

  useEffect(() => {
    const fetchFileContent = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get(rawFileUrl);
        setFileContent(res.data);

        const detectedLanguage = hljs.highlightAuto(res.data).language;
        setLanguage(detectedLanguage || "plaintext");
      } catch (err) {
        setError("Failed to fetch file content.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFileContent();
  }, [rawFileUrl]);

  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Stack sx={{ mb: 10 }}>
      {isLoading ? (
        <CircularProgress />
      ) : (
        <>
          <Stack>
            <CustomText
              heading="Vulnerability"
              data={Description}
              color="red"
            />
            <CustomText heading="CommitSHA" data={Commit} color="blue" />
            <CustomText heading="Date" data={formatDate(Date)} color="green" />
            <CustomText
              heading="Commit Message"
              data={Message}
              color="purple"
            />
            <CustomText heading="Language" data={language} color="orange" />
            <CustomText heading="Link" color="teal">
              <a
                href={githubFileUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "white" }}
              >
                {File}
              </a>
            </CustomText>
          </Stack>

          <SyntaxHighlighter
            language={language}
            style={a11yDark}
            showLineNumbers={true}
            wrapLines={true}
          >
            {fileContent}
          </SyntaxHighlighter>

          <HighlightedCodeBlock
            lines={fileContent.split("\n").slice(StartLine - 1, EndLine)}
            startLine={StartLine - 1}
            endLine={EndLine}
            match={Match}
          />
        </>
      )}
    </Stack>
  );
};
