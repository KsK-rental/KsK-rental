function orderNow(item) {
    localStorage.setItem('selectedItem', item);
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

// 🧾 All products redirect to same Razorpay link
const razorpayLink = "https://razorpay.me/@bunnyksk";

function payWithRazorpay() {
    if (razorpayLink) {
        window.open(razorpayLink, "_blank");
    } else {
        alert("Payment link is not available. Contact support.");
    }
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

    if (name && address && phone && orderDate && orderTime && payment) {
        if (payment === 'upi' || payment === 'card') {
            payWithRazorpay();
        } else {
            const message = `Order Details:\nItem: ${item}\nName: ${name}\nAddress: ${address}\nPhone: ${phone}\nOrder Date: ${orderDate}\nOrder Time: ${orderTime}\nPayment: ${payment}`;
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
    if (item && document.getElementById('item')) {
        document.getElementById('item').value = item;
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
