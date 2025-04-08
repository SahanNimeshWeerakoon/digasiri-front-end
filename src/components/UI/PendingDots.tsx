import { Box } from '@mui/material';

interface Props {
  size?: number;
  color?: string;
}

const PendingDots = ({size=5, color="#FFFFFF"} : Props) => {
  const style = { width: size, height: size, background: color, borderRadius: '100%', marginRight: '5px' }
  return (
    <Box display="flex" alignItems="center">
      <Box sx={[style, { animation: 'dot-blink 1s infinite' }]}></Box>
      <Box sx={[style, { animation: 'dot-blink 1.2s infinite' }]}></Box>
      <Box sx={[style, { animation: 'dot-blink 1.4s infinite' }]}></Box>
    </Box>
  );
};

export default PendingDots;