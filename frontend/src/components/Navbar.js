// use external components from react bootstrap library
import { Button, Navbar } from 'react-bootstrap';
import { useContext } from 'react';
import { CartContext } from '../CartContext';

function NavbarComponent() {
    const cart = useContext(CartContext);

    const prodCounts = cart.items.reduce((sum, product) => sum + product.quantity, 0);

    const handleCheckout = async () => {
        try {
            const response = await fetch('  https://d46d-43-249-234-141.ngrok-free.app/checkout', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ items: cart.items })
            });

            const data = await response.json();

            if (data.url) {
                window.location.assign(data.url);
            }
        } catch (error) {
            console.error("Error during checkout:", error);
            // Handle errors as needed
        }
    };

    return (
        <>
            <Navbar expand="sm">
                {/* on click => returns to home page */}
                <Navbar.Brand href='/'><h1>MyStore</h1></Navbar.Brand>

                {/* some of the stuff will collapse if on mobile screen */}
                <Navbar.Toggle />

                {/* tells what stuff u want to collapse */}
                <Navbar.Collapse className='justify-content-end'>
                    <Button onClick={handleCheckout}>Cart {prodCounts} Items</Button>
                </Navbar.Collapse>
            </Navbar>
        </>
    );
}

export default NavbarComponent;
