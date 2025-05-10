function orderNow(item) {
    // Get price from the service-item
    const serviceItem = Array.from(document.querySelectorAll('.service-item')).find(
        el => el.querySelector('h3').innerText === item || el.querySelector('button').getAttribute('onclick').includes(`'${item}'`)
    );
    const priceText = serviceItem?.querySelector('p').innerText;
    const price = priceText ? parseFloat(priceText.match(/₹(\d+)/)[1]) * 100 : 100; // Convert to paise
    localStorage.setItem('selectedItem', item);
    localStorage.setItem('selectedItemPrice', price);
    window.location.href = 'order.html';
}

function viewProduct(name, title, price, image, size, type, description) {
    localStorage.setItem('selectedProduct', JSON.stringify({ name, title, price, image, size, type, description }));
    window.location.href = 'product.html';
}

function chatWithUs() {
    const phoneNumber = "9981971917";
    const message = "Hi, I have a query about my order.";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}

function payWithRazorpay(item, price, name, phone) {
    const options = {
        key: 'rzp_test_5WWeuoVN8AvZXQ', // Replace with your Razorpay Key ID
        amount: price, // Price in paise
        currency: 'INR',
        name: 'KSK Wear & Care',
        description: `Order for ${item}`,
    
        handler: function (response) {
            document.getElementById('message').innerText = 'Payment successful! Order confirmed.';
            document.getElementById('orderForm').reset();
            document.getElementById('thanks-button').disabled = false;
        },
        prefill: {
            name: name,
            contact: phone
        },
        theme: {
            color: '#ff4d4d'
        },
        modal: {
            ondismiss: function() {
                document.getElementById('message').innerText = 'Payment cancelled. Please try again.';
            }
        }
    };
    const rzp = new Razorpay(options);
    rzp.open();
}

document.getElementById('orderForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const address = document.getElementById('address').value;
    const phone = document.getElementById('phone').value;
    const orderDate = document.getElementById('order-date').value;
    const orderTime = document.getElementById('order-time').value;
    const payment = document.getElementById('payment').value;
    const item = localStorage.getItem('selectedItem');
    const price = parseInt(localStorage.getItem('selectedItemPrice'));

    if (name && address && phone && orderDate && orderTime && payment && item && price) {
        if (payment === 'upi' || payment === 'card') {
            payWithRazorpay(item, price, name, phone);
        } else {
            const message = `Order Details:\nItem: ${item}\nName: ${name}\nAddress: ${address}\nPhone: ${phone}\nOrder Date: ${orderDate}\nOrder Time: ${orderTime}\nPayment: ${payment}\nPrice: ₹${price / 100}`;
            const phoneNumber = "9981971917";
            const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');
            document.getElementById('message').innerText = 'Order sent to WhatsApp! Check your message.';
            document.getElementById('orderForm').reset();
        }
    } else {
        document.getElementById('message').innerText = 'Are dost pura form fill kar yr!';
    }
});

window.onload = function() {
    const item = localStorage.getItem('selectedItem');
    const price = localStorage.getItem('selectedItemPrice');
    if (item && document.getElementById('item')) {
        document.getElementById('item').value = item;
    }
    if (price && document.getElementById('item-price')) {
        document.getElementById('item-price').value = price;
    }

    const product = localStorage.getItem('selectedProduct');
    if (product && document.getElementById('product-title')) {
        const { name, title, price, image, size, type, description } = JSON.parse(product);
        document.getElementById('product-title').innerText = title;
        document.getElementById('product-price').innerText = type === 'buy' ? `Price: ${price}` : `Rent per day: ${price}`;
        document.getElementById('product-size').innerText = `Size: ${size}`;
        document.getElementById('product-image').src = image;
        document.getElementById('product-description').innerText = description;
        document.getElementById('order-button').onclick = () => orderNow(name);
        loadReviews(name);
    }

    // Disable buttons for unavailable products
    document.querySelectorAll('.service-item').forEach(item => {
        const button = item.querySelector('button');
        const isAvailable = item.dataset.available !== 'false';
        if (!isAvailable) {
            button.disabled = true;
            button.innerText = 'Out of Stock';
        }
    });
};

function submitReview() {
    const reviewText = document.getElementById('review-text').value;
    const rating = document.getElementById('rating').value;
    const product = JSON.parse(localStorage.getItem('selectedProduct') || '{}').name;

    if (reviewText && rating && product) {
        const reviews = JSON.parse(localStorage.getItem(`reviews_${product}`) || '[]');
        reviews.push({ text: reviewText, rating, date: new Date().toLocaleDateString() });
        localStorage.setItem(`reviews_${product}`, JSON.stringify(reviews));
        document.getElementById('review-text').value = '';
        document.getElementById('rating').value = '5';
        loadReviews(product);
    } else {
        alert('Are bhala manus, pahila review fill kar fir submit kar!');
    }
}

function loadReviews(product) {
    const reviews = JSON.parse(localStorage.getItem(`reviews_${product}`) || '[]');
    const reviewList = document.getElementById('review-list');
    reviewList.innerHTML = '';
    reviews.forEach(review => {
        const div = document.createElement('div');
        div.className = 'review-item';
        div.innerHTML = `
            <p><strong>Rating: ${review.rating} Stars</strong></p>
            <p>${review.text}</p>
            <p><small>${review.date}</small></p>
        `;
        reviewList.appendChild(div);
    });
}
