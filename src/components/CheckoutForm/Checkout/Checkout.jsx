import React from 'react'
import { Paper, Stepper, Step, StepLabel, Typography, CircularProgress, Divider, Button,CssBaseline } from '@material-ui/core'
import { useState,useEffect } from 'react';
import useStyles from './styles';
import PaymentForm from '../PaymentForm';
import AddressForm from '../AddressForm';
import { commerce } from '../../../lib/commerce';
import { Link,useHistory } from 'react-router-dom';

const steps = ['Shipping address', 'Payment details'];

const Checkout = ({cart, order, onCaptureCheckout, error}) => {
    const classes = useStyles();
    const [activeStep, setactiveStep] = useState(0);
    const [checkoutToken, setcheckoutToken] = useState(null);
    const [shippingData, setshippingData] = useState({});
    const history = useHistory();

    useEffect(()=> {
        const generateToken = async () => {
            try{
                const token = await commerce.checkout.generateToken(cart.id,{type:'cart'});

                console.log(token);
                setcheckoutToken(token);
            }catch(error){
                history.pushState('/');
            }
        }
        generateToken();
    },[cart]);


    const nextStep = () => setactiveStep((prevActiveStep)=> prevActiveStep+1);
    const backStep = () => setactiveStep((prevActiveStep)=> prevActiveStep-1);

    const next = (data) => {
        setshippingData(data);

        nextStep();
    }
    let Confirmation = () => order.customer ? (
        <>
            <div>
                <Typography variant = "h5">
                    Thank you for your purchase at Theeban's Car Shop, {order.customer.firstname} {order.customer.lastname}!
                    <Divider className = {classes.divider}/>
                    <Typography variant = "subtitle2">Order ref: {order.customer_reference}</Typography>                
                </Typography>
            </div>
            <br />
            <Button  component = {Link} to = "/" variant = "outlined" type = "button">Back to Homepage</Button>
        </>
    ) : (
        <div className = {classes.spinner}>
            <CircularProgress />
        </div>
    );

    if(error){
        <>
        <Typography variant = "h5">Error:{error}</Typography>
        <br />
        <Button  component = {Link} to = "/" variant = "outlined" type = "button">Back to Homepage</Button>
        </>
    }

    const Form = () => activeStep ===0
        ? <AddressForm checkoutToken = {checkoutToken} next = {next}/>
        : <PaymentForm checkoutToken = {checkoutToken} shippingData = {shippingData} backStep = {backStep} onCaptureCheckout = {onCaptureCheckout} nextStep = {nextStep}/>;

    return (
        <>
        <CssBaseline />
            <div className = {classes.toolbar}/>   
            <main className = {classes.layout}>
                <Paper className = {classes.paper}>
                    <Typography variant = "h4" align = "center">Checkout</Typography>
                    <Stepper activeStep = {activeStep} className = {classes.stepper}>
                        {steps.map((step) => (
                            <Step key = {step}>
                                <StepLabel>{step}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                    {activeStep === steps.length ? <Confirmation /> : checkoutToken && <Form />}
                </Paper>

            </main>
        </>
    )
}

export default Checkout
