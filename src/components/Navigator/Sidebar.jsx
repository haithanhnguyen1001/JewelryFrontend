import { NavLink } from "react-router-dom";
import { publicRoutes } from "../Router/routes";
import Drawer from "@mui/material/Drawer";
import "./navigator.css";
import { Box, CssBaseline, List, ListItemButton } from "@mui/material";

const Sidebar = () => {
  const routes = publicRoutes.map((route, index) => {
    return (
      <NavLink key={index} to={route.path} element={<route.component />}>
        {route.name}
      </NavLink>
    );
  });

  let drawerWidth = 200;

  return (
    <>
      <Box>
        <CssBaseline />
        <Drawer
          sx={{
            width: drawerWidth,
            position: 'relative',
            zIndex: 2,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
            },
          }}
          variant="permanent"
          anchor="left"
        >
          <List >
            {publicRoutes.map((route, index) => (
              <ListItemButton key={index} >
                <NavLink
                  key={index}
                  to={route.path}
                  style={{width: '100%', lineHeight: '100%'}} // This is just a gas-stop, modify if better alternative was found
                  element={<route.component pageName={route.name} />}
                >
                  {route.name}
                </NavLink>
              </ListItemButton>
            ))}
          </List>
        </Drawer>
      </Box>
    </>
  );
};

export default Sidebar;
