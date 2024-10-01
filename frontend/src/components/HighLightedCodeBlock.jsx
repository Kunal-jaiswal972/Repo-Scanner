export const HighlightedCodeBlock = ({ lines, startLine, endLine, match }) => {
  return (
    <div
      style={{
        borderRadius: "12px",
        backgroundColor: "#1e1e1e",
        padding: "20px",
        margin: "10px 0",
        boxShadow: "0 4px 15px rgba(0, 0, 0, 0.3)",
        overflow: "auto",
        fontFamily: "monospace",
        color: "white",
        fontSize: "14px",
      }}
    >
      {lines.map((line, index) => {
        const currentLineNumber = startLine + index;
        if (currentLineNumber > endLine) return null;

        const parts = line.split(new RegExp(`(${match})`, "g"));
        return (
          <div key={index} style={{ color: "white", lineHeight: "1.5" }}>
            {parts.map((part, i) => (
              <span
                key={i}
                style={
                  part === match
                    ? {
                        backgroundColor: "#ff3b30",
                        color: "white",
                        fontWeight: "bold",
                      }
                    : {}
                }
              >
                {part}
              </span>
            ))}
          </div>
        );
      })}
    </div>
  );
};
