import React from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { AppBar, Toolbar, Button, Box } from "@mui/material";

const NavBar = () => {
  const { user, logout } = useAuth();

  // Common button style
  const buttonStyle = {
    marginLeft: 1,
    backgroundColor: "#f4c16e", // warm soft orange
    color: "#000",
    fontWeight: 500,
    textTransform: "none",
    borderRadius: "6px",
    "&:hover": {
      backgroundColor: "#e5ae4d",
    },
  };

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: "#fbf2e4",
        height: 64,
        boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", height: "100%" }}>
        <Box display="flex" alignItems="center">
          <Link to="/">
            <img
              src="/logo.png"
              alt="ManzilWay Logo"
              style={{ height: "50px", marginLeft: "10px" }}
            />
          </Link>
        </Box>

        <Box display="flex" alignItems="center">
          {user ? (
            <>
              <Button sx={buttonStyle} component={Link} to="/tripplanner">
                Plan Your Trip
              </Button>
              <Button sx={buttonStyle} component={Link} to="/tripplans">
                My Plans
              </Button>
              <Button sx={buttonStyle} component={Link} to="/add">Add Destination</Button>
              <Button sx={buttonStyle} component={Link} to="/profile">Profile</Button>
              <Button sx={buttonStyle} onClick={logout}>Logout</Button>
            </>
          ) : (
            <>
              <Button sx={buttonStyle} component={Link} to="/login">Login</Button>
              <Button sx={buttonStyle} component={Link} to="/register">Register</Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
