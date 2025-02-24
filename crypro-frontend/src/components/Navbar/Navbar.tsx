import React, { useState, useMemo } from "react";
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  useMediaQuery,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Menu,
  Avatar,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Link, useNavigate } from "react-router-dom";
// import { AccountCircle } from "@mui/icons-material";
import { useAppSelector } from "../../store/store";
import { useLogoutMutation } from "../../services/api";

const Navbar: React.FC = () => {
  const [open, setOpen] = useState(false); // Drawer open state
  const { isLoggedIn } = useAppSelector((state) => state.auth);
  const [dialogOpen, setDialogOpen] = useState(false); // Dialog open state
  const isMobile = useMediaQuery("(max-width:600px)");
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [logoutUser] = useLogoutMutation();
  const { user } = useAppSelector((state) => state.auth);
  //   const location = useLocation();

  //   const matchRoute = (route)=>{
  //     return matchPath( {path:route} , location.pathname)
  // }

  const handleClose = (route?: "profile" | "logout") => {
    return () => {
      if (route) {
        if (route == "logout") {
          setDialogOpen(true);
        } else {
          navigate("/app/profile");
        }
      }
      setAnchorEl(null);
    };
  };

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const handleLogoutClick = () => {
    setDialogOpen(true);
  };

  const handleLogoutConfirm = () => {
    setAnchorEl(null);
    setDialogOpen(false);
    logoutUser();
  };

  const handleLogoutCancel = () => {
    setDialogOpen(false);
  };

  // Memoize Desktop Navbar Links
  const desktopLinks = useMemo(
    () => (
      <Box sx={{ display: "flex" }}>
        {/* {isLoggedIn && (
          <Button color="inherit" component={Link} to="/app/profile">
            Profile
          </Button>
        )}
        {isLoggedIn && (
          <Button color="inherit" onClick={handleLogoutClick}>
            Logout
          </Button>
        )} */}
        {!isLoggedIn && (
          <Button color="inherit" component={Link} to="/auth/register">
            SignUp
          </Button>
        )}
        {!isLoggedIn && (
          <Button color="inherit" component={Link} to="/auth/login">
            Login
          </Button>
        )}
      </Box>
    ),
    [isLoggedIn]
  );

  // Memoize Mobile Drawer Items
  const drawerLinks = useMemo(
    () => (
      <List>
        <ListItem component={Link} to="/profile">
          <ListItemText primary="Profile" />
        </ListItem>
        <Divider />
        <ListItem>
          <ListItemText primary="Logout" onClick={handleLogoutClick} />
        </ListItem>
      </List>
    ),
    []
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* AppBar */}
      <AppBar
        position="sticky"
        sx={{ backgroundColor: "#2c3e50", color: "white" }}
      >
        <Toolbar>
          {/* Logo */}
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            <Link to="/" style={{ color: "white", textDecoration: "none" }}>
              MyLogo
            </Link>
          </Typography>

          {/* Desktop Navbar Links */}
          {!isMobile && desktopLinks}

          {/* Hamburger Menu Icon (Mobile View) */}
          {isMobile && (
            <IconButton color="inherit" onClick={toggleDrawer}>
              <MenuIcon />
            </IconButton>
          )}
          {isLoggedIn && (
            <Box marginLeft="auto">
              <IconButton
                size="large"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <Avatar
                  alt="Remy Sharp"
                  src={
                    user?.imageUrl ||
                    `https://api.dicebear.com/5.x/initials/svg?seed=${user?.name}}`
                  }
                />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose()}
              >
                <MenuItem onClick={handleClose("profile")}>Profile</MenuItem>
                <MenuItem onClick={handleClose("logout")}>Logout</MenuItem>
              </Menu>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer for Navbar Links */}
      <Drawer anchor="right" open={open} onClose={toggleDrawer}>
        <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer}>
          {drawerLinks}
        </Box>
      </Drawer>

      {/* Logout Confirmation Dialog */}
      <Dialog open={dialogOpen} onClose={handleLogoutCancel}>
        <DialogTitle>Confirm Logout</DialogTitle>
        <DialogContent>Are you sure you want to logout?</DialogContent>
        <DialogActions>
          <Button onClick={handleLogoutCancel} color="primary">
            No
          </Button>
          <Button onClick={handleLogoutConfirm} color="error">
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Navbar;
