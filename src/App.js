import React,{useState,useEffect} from 'react';
import { commerce } from './lib/commerce';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import {Products, Navbar, Cart, Checkout} from './components';

const App = () => {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState({});
    const [order, setorder] = useState({});
    const [errormsg, seterrormsg] = useState('');

    const fetchProducts = async () => {
        const { data } = await commerce.products.list();

        setProducts(data);
    }
    const fetchCart = async () => {
        setCart(await commerce.cart.retrieve());
    }

    const handleAddToCart = async (productID, quantity) => {
        const {cart} = await commerce.cart.add(productID,quantity);
        setCart(cart);
    }

    const handleUpdateCartQty = async(productID, quantity) => {
        const {cart} = await commerce.cart.update(productID,{quantity});

        setCart(cart);
    }

    const handleRemoveFromCart = async (productID, quantity) => {
        const {cart} = await commerce.cart.remove(productID);

        setCart(cart);
    }

    const handleEmptyCart = async () => {
        const {cart} = await commerce.cart.empty();
        setCart(cart);
    }

    const refreshCart = async () => {
        const newcart = await commerce.cart.refresh();

        setCart(newcart);

    }

    const handleCaptureCheckout = async (checkoutTokenId, newOrder) => {
        try{
            const incomingOrder = await commerce.checkout.capture(checkoutTokenId, newOrder);

            setorder(incomingOrder);
            refreshCart();
        }catch(error){
            seterrormsg(error.data.error.message)
        }
    }

    useEffect(()=>{
        fetchProducts();
        fetchCart();
    }, []);

    console.log(cart);
    return (
        <Router>
            <div>
                <Navbar totalItems = {cart.total_items}/>
                <Switch>
                    <Route exact path = "/">
                        <Products products = {products} onAddToCart = {handleAddToCart}/>
                    </Route>
                    <Route exact path = "/cart">
                        <Cart 
                            cart = {cart} 
                            handleUpdateCartQty = {handleUpdateCartQty}
                            handleRemoveFromCart = {handleRemoveFromCart}
                            handleEmptyCart = {handleEmptyCart}
                        />
                    </Route>  
                    <Route exact path = "/checkout">
                        <Checkout 
                            cart = {cart}
                            order = {order}
                            onCaptureCheckout = {handleCaptureCheckout}
                            error = {errormsg}
                        />
                    </Route>                                    
                </Switch>
            </div>
        </Router>
        
    )
}

export default App
