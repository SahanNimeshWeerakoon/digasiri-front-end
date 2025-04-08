import * as React from 'react';
import {styled, Theme, CSSObject} from '@mui/material/styles';
import {Box, List, CssBaseline, ListItem, ListItemButton, ListItemIcon, Tooltip, IconButton} from '@mui/material';
import MuiDrawer from '@mui/material/Drawer';
import {PersonAdd, Logout} from '@mui/icons-material';
import {Outlet, NavLink} from "react-router";
import useAuth from "@/hooks/useAuth.ts";

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
});

const DrawerHeader = styled('div')(({theme}) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, {shouldForwardProp: (prop) => prop !== 'open'})(
    ({theme}) => ({
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        variants: [
            {
                props: ({open}) => open,
                style: {
                    ...openedMixin(theme),
                    '& .MuiDrawer-paper': openedMixin(theme),
                },
            },
            {
                props: ({open}) => !open,
                style: {
                    ...closedMixin(theme),
                    '& .MuiDrawer-paper': closedMixin(theme),
                },
            },
        ],
    }),
);

export default function MiniDrawer() {
    const [open] = React.useState(false);

    const {logout} = useAuth();

    return (
        <Box sx={{display: 'flex'}}>
            <CssBaseline/>
            <Drawer variant="permanent" open={open}>
                <DrawerHeader sx={{
                    display: 'flex',
                    justifyContent: 'center'
                }}>
                    <img src="/Digasiri-logo.jpg" alt='Digasiri Logo' style={{ height: '1.5rem' }} />
                </DrawerHeader>
                <List sx={{flexGrow: 1}}>
                    <NavLink to="patients">
                        {({isActive}) => (<ListItem disablePadding sx={{display: 'block'}}>
                            <ListItemButton
                                selected={isActive}
                                sx={[
                                    {
                                        minHeight: 48,
                                        px: 2.5,
                                    },
                                ]}
                            >
                                <ListItemIcon
                                    sx={[
                                        {
                                            minWidth: 0,
                                            justifyContent: 'center',
                                        },
                                        {
                                            mr: 'auto',
                                        },
                                    ]}
                                >
                                    <PersonAdd/>
                                </ListItemIcon>
                            </ListItemButton>
                        </ListItem>)}
                    </NavLink>
                </List>
                <Box sx={{display: 'grid',placeContent: 'center',paddingBlock:2}}>
                    <Tooltip title="Logout" placement="right">
                        <IconButton onClick={logout}>
                            <Logout />
                        </IconButton>
                    </Tooltip>
                </Box>
            </Drawer>
            <Box component="main" sx={{flexGrow: 1, maxWidth: 'calc(100% - 64px)'}}>
                <Outlet/>
            </Box>
        </Box>
    );
}
