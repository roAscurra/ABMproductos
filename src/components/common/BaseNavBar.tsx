import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import LunchDiningOutlinedIcon from '@mui/icons-material/LunchDiningOutlined';

export default function PrimarySearchAppBar() {

  return (
    <Box sx={{ marginBottom: 1 }}>
      <AppBar position="static" sx={{ bgcolor: "#b23e1f", height: 80, marginBottom: 1 }}>
        <Toolbar>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, justifyContent: 'center' ,fontSize: '1.7rem' }}
          >
            <LunchDiningOutlinedIcon sx={{mr: 2}}/>
            Buen Sabor
          </Typography>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
