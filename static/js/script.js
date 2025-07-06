window.onload = function () {
    window.history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);

    document.body.style.overflow = 'hidden';

    setTimeout(function () {
        const navbar = document.getElementById('navbar');
        const header = document.getElementById('header');
        const features = document.getElementById('features');
        const pricing = document.getElementById('pricing');
        const footer = document.getElementById('footer');
        const logo = document.getElementById('logo');
        const img_container = logo?.parentElement;
        const media = document.getElementById('media');
        const resell = document.getElementById('resell');

        navbar.classList.remove('hidden');
        features.classList.remove('hidden');
        header.classList.remove('hidden');
        footer.classList.remove('hidden');
        media.classList.remove('hidden');
        resell.classList.remove('hidden');

        header.classList.add('fade-in');
        features.classList.add('fade-in'); 
        pricing.classList.add('fade-in');
        footer.classList.add('fade-in');
        media.classList.add('fade-in');
        resell.classList.add('fade-in');

        if (img_container) img_container.remove();

        document.body.style.overflow = '';
    }, 3000);
};

document.addEventListener('DOMContentLoaded', () => {
    const purchase = document.getElementById('purchase-btn');
    const button = purchase.querySelector('.btn-text');
    const loader = purchase.querySelector('.loader');

    const sell_button = document.getElementById('purchase-btn');

    sell_button.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
    
        const button = sell_button.querySelector('.btn-text');
        const loader = sell_button.querySelector('.loader');
    
        button.style.opacity = '0';
        setTimeout(() => loader.style.opacity = '1', 300);
        setTimeout(() => {
            window.sellAuthEmbed.checkout(sell_button, {
                cart: [{ productId: 318843, variantId: 437701, quantity: 1 }],
                shopId: 120114,
                modal: true
            });
        }, 500);
    
        setTimeout(() => {
            loader.style.opacity = '0';
            button.style.opacity = '1';
        }, 2300);
    });

    const navbar_purchase_button = document.getElementById('navbar-purchase-btn');
    if (navbar_purchase_button) {
        navbar_purchase_button.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();

            window.sellAuthEmbed.checkout(navbar_purchase_button, {
                cart: [{ productId: 318843, variantId: 437701, quantity: 1 }],
                shopId: 120114,
                modal: true
            });
        });
    }

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });    
});
