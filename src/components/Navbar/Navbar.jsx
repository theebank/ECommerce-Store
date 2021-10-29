import React from 'react';
import { AppBar, Toolbar, IconButton, Badge, MenuItem, Menu, Typography } from '@material-ui/core';
import { ShoppingCart } from '@material-ui/icons';
import { Link,useLocation } from 'react-router-dom';

import logo from '../../assets/logo.jpg'
import useStyles from './styles';

const Navbar = ({totalItems}) => {
    const classes = useStyles();
    const location = useLocation();

    
    return (
        <div>
            <AppBar position = "fixed" className = {classes.AppBar} color = "inherit">
                <Toolbar>
                    <Typography component = {Link} to = "/" variant = "h6" className = {classes.title} color = "inherit">
                        <img src = {logo} alt = "Webstore.js" height = "25px" className = {classes.image}/>
                        Theeban's Car shop
                    </Typography>
                    <div className = {classes.grow}/>
                    {location.pathname==='/' && (
                    <div className = {classes.button}>
                        <IconButton component = {Link} to = "/cart" aria-aria-label = "Show Cart Items" color = "inherit">
                            <Badge badgeContent = {totalItems} color = "secondary">
                                <ShoppingCart/>
                            </Badge>
                        </IconButton>
                    </div>)}

                </Toolbar>
            </AppBar>
        </div>
    )
}

export default Navbar
