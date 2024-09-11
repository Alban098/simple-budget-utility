import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import "react-pro-sidebar/dist/css/styles.css";
import { Box, Divider, IconButton, Typography, useTheme } from "@mui/material";
import { Link, To, useLocation } from "react-router-dom";
import { tokens } from "../theme";
import AccountBalanceOutlinedIcon from "@mui/icons-material/AccountBalanceOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import EqualizerOutlinedIcon from "@mui/icons-material/EqualizerOutlined";
import UploadIcon from "@mui/icons-material/Upload";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import QueryStatsIcon from "@mui/icons-material/QueryStats";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import { ReactNode, useState } from "react";

interface ItemParams {
  title: string;
  to: To;
  icon: ReactNode;
  location: string;
}

function Item({ title, to, icon, location }: ItemParams) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <MenuItem
      active={location === to}
      style={{
        color: colors.grey[100],
      }}
      icon={icon}
    >
      <Typography>{title}</Typography>
      <Link to={to} />
    </MenuItem>
  );
}

export default function Sidebar() {
  const theme = useTheme();
  const location = useLocation();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <Box
      sx={{
        "& .pro-sidebar-inner": {
          background: `${colors.primary[400]} !important`,
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
        },
        "& .pro-inner-item": {
          padding: "5px 35px 5px 20px !important",
        },
        "& .pro-inner-item:hover": {
          color: "#868dfb !important",
        },
        "& .pro-menu-item.active": {
          color: "#6870fa !important",
        },
      }}
    >
      <ProSidebar collapsed={isCollapsed}>
        <Menu iconShape="square">
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
            style={{
              margin: "10px 0 20px 0",
              color: colors.grey[100],
            }}
          >
            {!isCollapsed && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                ml="15px"
              >
                <Typography variant="h5" color={colors.grey[100]}>
                  Alban098
                </Typography>
                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                  <MenuOutlinedIcon />
                </IconButton>
              </Box>
            )}
          </MenuItem>
          <Divider component="li" />
          <Box paddingLeft={isCollapsed ? undefined : "5%"}>
            <Item
              title="Dashboard"
              to="/"
              icon={<QueryStatsIcon />}
              location={location.pathname}
            />

            {!isCollapsed && (
              <Typography
                variant="h6"
                color={colors.grey[300]}
                sx={{ m: "15px 0 5px 20px" }}
              >
                Management
              </Typography>
            )}
            <Divider variant="middle" component="li" />
            <Item
              title="Accounts"
              to="/account"
              icon={<AccountBalanceOutlinedIcon />}
              location={location.pathname}
            />
            <Item
              title="Transactions"
              to="/transaction"
              icon={<ReceiptLongOutlinedIcon />}
              location={location.pathname}
            />
            {!isCollapsed && (
              <Typography
                variant="h6"
                color={colors.grey[300]}
                sx={{ m: "15px 0 5px 20px" }}
              >
                Register
              </Typography>
            )}
            <Divider variant="middle" component="li" />
            <Item
              title="Category"
              to="/category"
              icon={<FormatListBulletedIcon />}
              location={location.pathname}
            />
            {!isCollapsed && (
              <Typography
                variant="h6"
                color={colors.grey[300]}
                sx={{ m: "15px 0 5px 20px" }}
              >
                Import
              </Typography>
            )}
            <Divider variant="middle" component="li" />
            <Item
              title="Account Statement"
              to="/transaction/import"
              icon={<UploadIcon />}
              location={location.pathname}
            />
            {!isCollapsed && (
              <Typography
                variant="h6"
                color={colors.grey[300]}
                sx={{ m: "15px 0 5px 20px" }}
              >
                Analysis
              </Typography>
            )}
            <Divider variant="middle" component="li" />
            <Item
              title="By Category"
              to="/analysis/categories"
              icon={<EqualizerOutlinedIcon />}
              location={location.pathname}
            />
          </Box>
        </Menu>
      </ProSidebar>
    </Box>
  );
}
