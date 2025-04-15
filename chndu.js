function orderNow(item) {
    // Store item in localStorage and open order page
    localStorage.setItem('selectedItem', item);
    window.location.href = 'order.html';
}

document.getElementById('orderForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const address = document.getElementById('address').value;
    const phone = document.getElementById('phone').value;
    const payment = document.getElementById('payment').value;
    const item = localStorage.getItem('selectedItem');

    if (name && address && phone && payment) {
        const message = `Order Details:\nItem: ${item}\nName: ${name}\nAddress: ${address}\nPhone: ${phone}\nPayment: ${payment}`;
        const phoneNumber = "9981971917";
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
        document.getElementById('message').innerText = 'Order sent to WhatsApp! Check your message.';
        document.getElementById('orderForm').reset();
    } else {
        document.getElementById('message').innerText = 'Please fill all fields!';
    }
});

// Set selected item when order page loads
window.onload = function() {
    const item = localStorage.getItem('selectedItem');
    if (item) {
        document.getElementById('item').value = item;
    }
};