import { Stack, Typography } from "@mui/material";

export const CustomText = ({ heading, data, color, children }) => {
  return (
    <Stack direction="row" spacing={1}>
      <Typography variant="body1" sx={{ color: color, fontWeight: "bold" }}>
        {heading}:
      </Typography>
      <Typography variant="body2" >
        {data || children}
      </Typography>
    </Stack>
  );
};
