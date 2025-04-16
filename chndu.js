function orderNow(item) {
    localStorage.setItem('selectedItem', item);
    window.location.href = 'order.html';
}

function viewProduct(name, title, price, image, size) {
    localStorage.setItem('selectedProduct', JSON.stringify({ name, title, price, image, size }));
    window.location.href = 'product.html';
}

document.getElementById('orderForm')?.addEventListener('submit', function(e) {
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

window.onload = function() {
    const item = localStorage.getItem('selectedItem');
    if (item && document.getElementById('item')) {
        document.getElementById('item').value = item;
    }

    const product = localStorage.getItem('selectedProduct');
    if (product && document.getElementById('product-title')) {
        const { name, title, price, image, size } = JSON.parse(product);
        document.getElementById('product-title').innerText = title;
        document.getElementById('product-price').innerText = `Rent per day: ${price}`;
        document.getElementById('product-size').innerText = `Size: ${size}`;
        document.getElementById('product-image').src = image;
        document.getElementById('order-button').onclick = () => orderNow(name);
        loadReviews(name);
    }
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
        alert('Please fill out the review and rating!');
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
