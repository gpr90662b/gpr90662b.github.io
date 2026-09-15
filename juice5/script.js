// Tailwind Configuration
tailwind.config = {
    theme: {
        extend: {
            colors: {
                brand: {
                    50: '#f0fdf4',
                    100: '#dcfce7',
                    200: '#bbf7d0',
                    500: '#22c55e',
                    600: '#16a34a',
                    700: '#15803d',
                    800: '#166534',
                    900: '#14532d',
                },
                citrus: {
                    400: '#fbbf24',
                    500: '#f59e0b',
                    600: '#d97706',
                },
                berry: {
                    500: '#ec4899',
                    600: '#db2777',
                }
            },
            fontFamily: {
                heading: ['Outfit', 'sans-serif'],
                body: ['Plus Jakarta Sans', 'sans-serif'],
            }
        }
    }
};

// Application State
let menuItems = [
    {
                id: '1',
                name: 'Pure Apple',
                category: 'pure',
                tag: 'Nature Core Crunch!',
                ingredients: [ 'Apple'],
                desc: 'A crisp, timeless classic that delivers a pure, hydrating splash of smooth orchard energy and simple refreshment.',
                prices: { '4 oz': 5.00, '8 oz': 10.00, '16 oz': 12.00 },
                image: 'https://images.unsplash.com/photo-1534336810865-0beae4c81278?auto=format&fit=crop&w=600&q=80'
            },


{
                id: '2',
                name: 'Beet The Day',
                category: 'blends',
                tag: 'Brilliant Beet Vitality!',
                ingredients: [ 'Beets', 'Red Apple', 'Lemon'],
                desc: 'An earthy yet crisp blend that pairs rich, ground-root nutrients with bright orchard sweetness for a deeply refreshing, detoxifying lift.',
                prices: { '4 oz': 5.00, '8 oz': 10.00, '16 oz': 12.00 },
                image: 'https://images.unsplash.com/photo-1626591425404-e001dfd87de2?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?auto=format&fit=crop&w=600&q=80'
            },


{
                id: '3',
                name: 'Cool Beet Clense',
                category: 'blends',
                tag: 'Ruby Refresh!',
                ingredients: [ 'Beet', 'Cucumber', 'Lime'],
                desc: 'Earthy red beet softened by hydrating, crisp cucumber and finished with a bright, zesty squeeze of lime.',
                prices: { '4 oz': 5.00, '8 oz': 10.00, '16 oz': 12.00 },
                image: 'https://images.unsplash.com/photo-1753656512676-68af646ce776?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fEJlZXQlMkMlMjBBcHBsZSUyQyUyMExlbW9uJTIwYmxlbmQlMjBqdWljZSUyMHBpY3N8ZW58MHx8MHx8fDA%3D?auto=format&fit=crop&w=600&q=80'
            },

{
                id: '4',
                name: 'Berry Grape Bliss',
                category: 'blends',
                tag: 'Anthem of Antioxidants!',
                ingredients: [ 'Blueberry', 'Strawberry', 'Red Grapes'],
                desc: 'A deeply hydrating, earthy blend sharpened by a zesty citrus kick to deliver a clean, detoxifying splash of pure rejuvenation.',
                prices: { '4 oz': 5.00, '8 oz': 10.00, '16 oz': 12.00 },
                image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=600&q=80'
            },


{
                id: '5',
                name: 'Pure Carrot',
                category: 'pure',
                tag: 'Pure Golden Glow!',
                ingredients: [ 'Carrot'],
                desc: 'A smooth, naturally sweet roots classic that offers a crisp, glowing lift of wholesome daytime energy.',
                prices: { '4 oz': 5.00, '8 oz': 10.00, '16 oz': 12.00 },
                image: 'https://images.unsplash.com/photo-1628961915805-4c92c885ce61?auto=format&fit=crop&w=600&q=80'
            },

{
                id: '6',
                name: 'Green Apple Crisp',
                category: 'blends',
                tag: 'Crisp Monrning Dew!',
                ingredients: [ 'Celery', 'Apple'],
                desc: 'A ultra-crisp, light green pairing that effortlessly balances hydrating minerals with a clean, uplifting orchard sweetness.',
                prices: { '4 oz': 5.00, '8 oz': 10.00, '16 oz': 12.00 },
                image: 'https://plus.unsplash.com/premium_photo-1700084621249-b22c621ac4e9?auto=format&fit=crop&w=600&q=80'
            },

{
                id: '7',
                name: 'Kale Me Fresh',
                category: 'blends',
                tag: 'Bright & Mighty Green!',
                ingredients: [ 'Kale', 'Lemon', 'Apple'],
                desc: 'A vibrant leafy powerhouse softened by sweet apple and bright citrus for a smooth, approachable green energy lift.',
                prices: { '4 oz': 5.00, '8 oz': 10.00, '16 oz': 12.00 },
                image: 'https://images.pexels.com/photos/10047776/pexels-photo-10047776.jpeg?auto=format&fit=crop&w=600&q=80'
            },

{
                id: '8',
                name: 'All Green Everything',
                category: 'blends',
                tag: 'Emerald Power Surge!',
                ingredients: [ 'Kale', 'Apple', 'Spinach', 'Celery'],
                desc: 'The ultimate nutrient-dense green field trip, providing a crisp, deeply revitalizing and detoxifying surge of natural energy.',
                prices: { '4 oz': 5.00, '8 oz': 10.00, '16 oz': 12.00 },
                image: 'https://images.unsplash.com/photo-1610622929850-77f505c3ce5a?auto=format&fit=crop&w=600&q=80'
            },

{
                id: '9',
                name: 'Pure orange',
                category: 'pure',
                tag: 'Liquid Sunshine Boost',
                ingredients: ['Orange'],
                desc: 'A timeless, brilliant classic bursting with bold citrus brightness to instantly wake up your senses and fuel your day.',
                prices: { '4 oz': 5.00, '8 oz': 10.00, '16 oz': 12.00 },
                image:'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=600&q=80'
            },

{
                id: '10',
                name: 'Ruby Green Rush',
                category: 'blends',
                tag: 'Velvet Green Vitality!',
                ingredients: ['Red Grapes','Raspberry', 'Kale'],
                desc: 'A clever, bold fusion where deep berry and grape sweetness flawlessly balance the rich, detoxifying power of leafy greens.',
                prices: { '4 oz': 5.00, '8 oz': 10.00, '16 oz': 12.00 },
                image:'https://images.pexels.com/photos/16052388/pexels-photo-16052388.jpeg?auto=format&fit=crop&w=600&q=80'
            },

{
                id: '11',
                name: 'Grape Apple Crush',
                category: 'blends',
                tag: 'Sweet Vineyard Rush!',
                ingredients: ['Red Grapes','Apple'],
                desc: 'A crisp, velvety sweet orchard combination that delivers a smooth, delicious wave of sustained natural energy.',
                prices: { '4 oz': 5.00, '8 oz': 10.00, '16 oz': 12.00 },
                image:'https://images.pexels.com/photos/14337459/pexels-photo-14337459.jpeg?auto=format&fit=crop&w=600&q=80'
            },


{
                id: '12',
                name: 'Green Apple Zing',
                category: 'blends',
                tag: 'Zesty Spinach Splash!',
                ingredients: ['Spinach','Apple','Lemon'],
                desc: 'A light, breezy green blend that pairs gentle leafy nutrients with a sharp, zesty finish for a fast-acting afternoon reset.',
                prices: { '4 oz': 5.00, '8 oz': 10.00, '16 oz': 12.00 },
                image:'https://images.unsplash.com/photo-1622597468666-27cb9cae0e45?auto=format&fit=crop&w=600&q=80'
            },

{
                id: '13',
                name: 'Fire Shot',
                category: 'wellness',
                tag: 'Fire Up Your Wellness!',
                ingredients: [ 'Turmeric','Lemon','Cayene Paper', 'Ginger'],
                desc: 'A fiery, deeply revitalizing elixir designed to kickstart your metabolism and deliver a sharp, detoxifying jolt of clean energy.',
                prices: { '4 oz': 5.00, '8 oz': 10.00, '16 oz': 12.00 },
                image: 'https://plus.unsplash.com/premium_photo-1708985665217-edf6f05dd828?auto=format&fit=crop&w=600&q=80'
            },

{
                id: '14',
                name: 'Morning Fire Citrus',
                category: 'breakfast',
                tag: 'Citrus & Spice!',
                ingredients: ['Grapfruit','Radishes', 'orange', 'Cayene Paper'],
                desc: 'Tart grapefruit and sweet orange meet peppery radish and a pinch of cayenne to jumpstart your day.',
                prices: { '4 oz': 5.00, '8 oz': 10.00, '16 oz': 12.00 },
                image: 'https://images.pexels.com/photos/14898399/pexels-photo-14898399.jpeg?auto=format&fit=crop&w=600&q=80'
            },



{
                id: '15',
                name: 'Sunshine Garden Breakfast',
                category: 'breakfast',
                tag: 'Sunshine Hydration!',
                ingredients: ['Yellow Paper','Kiwi', 'Cucumber', 'Corn'],
                desc: 'Crisp cucumber and sweet corn blended with tangy kiwi and vibrant yellow pepper for a refreshing morning hydration boost.',
                prices: { '4 oz': 5.00, '8 oz': 10.00, '16 oz': 12.00 },
                image: 'https://images.pexels.com/photos/7674696/pexels-photo-7674696.jpeg?auto=format&fit=crop&w=600&q=80'
            },

{
                id: '16',
                name: 'Garden Breakfast Boost',
                category: 'breakfast',
                tag: 'Harvest Glow!',
                ingredients: ['Carrot','Lemon','Red Apple','Brussel Sprouts',
				'Tomato','Asian Pear','Beet wirh Greens', 'Cauliflower','Broccoli'],
                desc: 'Crisp Asian pear and sweet carrots soften a hearty, vibrant blend of nutrient-rich root vegetables and fresh garden greens.',
                prices: { '4 oz': 5.00, '8 oz': 10.00, '16 oz': 12.00 },
                image: 'https://images.pexels.com/photos/15362683/pexels-photo-15362683.jpeg?auto=format&fit=crop&w=600&q=80'
            },


{
                id: '17',
                name: 'Tropical Sunrise',
                category: 'seasonal',
                tag: 'Immunity Boost',
                ingredients: [ 'Mango','Orange', 'Pineapple'],
                desc: 'A vibrant and refreshing tropical medley bursting with the sweet, sun-kissed flavors of tangy citrus and luscious exotic fruits.',
                prices: { '4 oz': 5.00, '8 oz': 10.00, '16 oz': 12.00 },
                image: 'https://images.pexels.com/photos/38233296/pexels-photo-38233296.jpeg?auto=format&fit=crop&w=600&q=80'
            },

{
                id: '18',
                name: 'Citrus Island',
                category: 'seasonal',
                tag: 'Sunshine in a Sip!',
                ingredients: ['Orange', 'Pineapple'],
                desc: 'A bright, sunny duo that delivers a crisp splash of pure tropical energy and zesty refreshment.',
                prices: { '4 oz': 5.00, '8 oz': 10.00, '16 oz': 12.00 },
                image: 'https://images.pexels.com/photos/34339257/pexels-photo-34339257.jpeg?auto=format&fit=crop&w=600&q=80'
            },
			
			{
                id: '19',
                name: 'Pure Pineapple',
                category: 'seasonal',
                tag: 'Pure Paradise Power!',
                ingredients: ['Pineapple'],
                desc: 'An intensely vibrant tropical escape that packs a bold, sweet punch of revitalizing island energy.',
                prices: { '4 oz': 5.00, '8 oz': 10.00, '16 oz': 12.00 },
                image: 'https://images.unsplash.com/photo-1705246535138-953e01125cb0?auto=format&fit=crop&w=600&q=80'
            },
			
			
			{
                id: '20',
                name: 'Pink Pineapple Punch',
                category: 'seasonal',
                tag: 'Berry Tropical Boost!',
                ingredients: ['Strawberry','Apple', 'Pineapple'],
                desc: 'A sweet and tangy trio bursting with crisp orchard freshness and an uplifting splash of tropical energy.',
                prices: { '4 oz': 5.00, '8 oz': 10.00, '16 oz': 12.00 },
                image: 'https://images.pexels.com/photos/36845957/pexels-photo-36845957.jpeg?auto=format&fit=crop&w=600&q=80'
            },

{
                id: '21',
                name: 'Island Beet Boost',
                category: 'seasonal',
                tag: 'Tropical Boost!',
                ingredients: ['Beets','Pineapple', 'Lemon'],
                desc: 'An earthy yet vibrant blend where sweet tropical notes and zesty citrus create a crisp, detoxifying burst of natural energy.',
                prices: { '4 oz': 5.00, '8 oz': 10.00, '16 oz': 12.00 },
                image: 'https://images.pexels.com/photos/5668199/pexels-photo-5668199.jpeg?auto=format&fit=crop&w=600&q=80'
            }

        ];

let cart = [];
let currentCustomSize = '12 oz';
let currentCustomPrice = 7.50;

function renderMenu(itemsToRender = menuItems) {
    const grid = document.getElementById('menu-grid');
    if (!grid) return;

    grid.innerHTML = itemsToRender.map(item => {
        const sizes = Object.keys(item.prices);
        const defaultSize = sizes[0];
        const defaultPrice = item.prices[defaultSize].toFixed(2);

        return `
            <div class="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-md hover:shadow-xl transition-all group flex flex-col">
                <div class="relative h-52 overflow-hidden bg-slate-100">
                    <img src="${item.image}" alt="${item.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
                    ${item.tag ? `<span class="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full">${item.tag}</span>` : ''}
                </div>
                <div class="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div class="space-y-2">
                        <h3 class="text-xl font-bold text-slate-900 font-heading">${item.name}</h3>
                        <p class="text-xs text-slate-500 leading-relaxed">${item.desc}</p>
                        <div class="flex flex-wrap gap-1.5 pt-2">
                            ${item.ingredients.map(ing => `<span class="bg-slate-100 text-slate-600 text-[11px] font-medium px-2.5 py-0.5 rounded-md">${ing}</span>`).join('')}
                        </div>
                    </div>

                    <div class="pt-4 border-t border-slate-100 space-y-3">
                        <div class="flex items-center justify-between">
                            <div class="text-xs text-slate-500 font-bold uppercase">Size Options:</div>
                            <select id="size-${item.id}" onchange="updateCardPrice('${item.id}')" class="bg-slate-100 text-xs font-bold text-slate-800 px-2 py-1 rounded-lg border border-slate-200 focus:outline-none">
                                ${sizes.map(s => `<option value="${s}">${s} - $${item.prices[s].toFixed(2)}</option>`).join('')}
                            </select>
                        </div>

                        <div class="flex items-center justify-between gap-2">
                            <span id="price-display-${item.id}" class="text-2xl font-extrabold text-slate-900 font-heading">$${defaultPrice}</span>
                            <button onclick="addToCart('${item.id}')" class="bg-brand-600 hover:bg-brand-700 text-white font-bold px-4 py-2.5 rounded-xl text-sm transition-all flex items-center gap-2 shadow-md shadow-brand-500/20">
                                <i class="fa-solid fa-plus text-xs"></i>
                                Add to Order
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function updateCardPrice(itemId) {
    const item = menuItems.find(i => i.id === itemId);
    const selectedSize = document.getElementById(`size-${itemId}`).value;
    const priceDisplay = document.getElementById(`price-display-${itemId}`);
    if (item && selectedSize && priceDisplay) {
        priceDisplay.textContent = `$${item.prices[selectedSize].toFixed(2)}`;
    }
}

function addToCart(itemId) {
    const item = menuItems.find(i => i.id === itemId);
    if (!item) return;

    const selectedSize = document.getElementById(`size-${itemId}`).value;
    const price = item.prices[selectedSize];

    const existingIndex = cart.findIndex(c => c.id === itemId && c.size === selectedSize);
    if (existingIndex > -1) {
        cart[existingIndex].qty += 1;
    } else {
        cart.push({
            id: item.id,
            name: item.name,
            size: selectedSize,
            price: price,
            qty: 1
        });
    }

    updateCartUI();
    showToast(`Added ${item.name} (${selectedSize}) to order!`);
}

function filterMenu(category) {
    document.querySelectorAll('.menu-tab').forEach(btn => {
        btn.classList.remove('bg-brand-600', 'text-white');
        btn.classList.add('bg-white', 'text-slate-600');
    });
    event.target.classList.remove('bg-white', 'text-slate-600');
    event.target.classList.add('bg-brand-600', 'text-white');

    if (category === 'all') {
        renderMenu(menuItems);
    } else {
        const filtered = menuItems.filter(i => i.category === category);
        renderMenu(filtered);
    }
}

function searchMenu() {
    const query = document.getElementById('menu-search').value.toLowerCase();
    const filtered = menuItems.filter(i => 
        i.name.toLowerCase().includes(query) || 
        i.ingredients.some(ing => ing.toLowerCase().includes(query)) ||
        i.desc.toLowerCase().includes(query)
    );
    renderMenu(filtered);
}

function selectCustomSize(size, basePrice) {
    currentCustomSize = size;
    currentCustomPrice = basePrice;
    document.querySelectorAll('.custom-size-btn').forEach(btn => {
        btn.classList.remove('active', 'border-brand-500', 'bg-brand-500/10');
        btn.classList.add('border-slate-700', 'bg-slate-800');
    });
    event.currentTarget.classList.add('active', 'border-brand-500', 'bg-brand-500/10');
    event.currentTarget.classList.remove('border-slate-700', 'bg-slate-800');
    calculateCustomTotal();
}

function calculateCustomTotal() {
    let total = currentCustomPrice;
    const boosters = document.querySelectorAll('input[name="custom-booster"]:checked');
    total += boosters.length * 1.00;
    document.getElementById('custom-total-display').textContent = `$${total.toFixed(2)}`;
    return total;
}

function addCustomJuiceToCart() {
    const base = document.querySelector('input[name="custom-base"]:checked').value;
    const ingredients = Array.from(document.querySelectorAll('input[name="custom-ingredient"]:checked')).map(i => i.value);
    const boosters = Array.from(document.querySelectorAll('input[name="custom-booster"]:checked')).map(i => i.value);

    const customName = `Custom Blend (${base}${ingredients.length > 0 ? ' + ' + ingredients.join(', ') : ''}${boosters.length > 0 ? ' + ' + boosters.join(', ') : ''})`;
    const totalPrice = calculateCustomTotal();

    cart.push({
        id: 'custom-' + Date.now(),
        name: customName,
        size: currentCustomSize,
        price: totalPrice,
        qty: 1
    });

    updateCartUI();
    showToast(`Added your Custom Blend (${currentCustomSize}) to order!`);
    toggleCartDrawer();
}

function updateCartUI() {
    const cartContainer = document.getElementById('cart-items-container');
    const cartCountBadge = document.getElementById('cart-count');
    const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
    
    if (cartCountBadge) cartCountBadge.textContent = totalQty;

    if (cart.length === 0) {
        cartContainer.innerHTML = `
            <div class="text-center py-12 space-y-3">
                <div class="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400 text-2xl">
                    <i class="fa-solid fa-basket-shopping"></i>
                </div>
                <p class="text-slate-500 font-medium text-sm">Your phone order list is empty.</p>
                <a href="#menu" onclick="toggleCartDrawer()" class="inline-block text-brand-600 font-bold text-xs hover:underline">Browse Menu Items &rarr;</a>
            </div>
        `;
    } else {
        cartContainer.innerHTML = cart.map((item, index) => `
            <div class="flex items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                <div class="space-y-1 max-w-[200px]">
                    <h4 class="font-bold text-slate-900 text-sm leading-tight">${item.name}</h4>
                    <div class="text-xs text-brand-600 font-semibold">${item.size} • $${item.price.toFixed(2)} each</div>
                </div>
                <div class="flex items-center gap-3">
                    <div class="flex items-center border border-slate-300 rounded-lg bg-white">
                        <button onclick="changeQty(${index}, -1)" class="px-2 py-1 text-xs text-slate-600 hover:bg-slate-100">-</button>
                        <span class="px-2 text-xs font-bold text-slate-800">${item.qty}</span>
                        <button onclick="changeQty(${index}, 1)" class="px-2 py-1 text-xs text-slate-600 hover:bg-slate-100">+</button>
                    </div>
                    <span class="font-extrabold text-slate-900 text-sm">$${(item.price * item.qty).toFixed(2)}</span>
                </div>
            </div>
        `).join('');
    }

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const freeDeliveryThreshold = 25.00;
    const deliveryFee = subtotal >= freeDeliveryThreshold || subtotal === 0 ? 0.00 : 4.00;
    const total = subtotal + deliveryFee;

    document.getElementById('cart-subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('cart-delivery-fee').textContent = deliveryFee === 0 ? 'FREE' : `$${deliveryFee.toFixed(2)}`;
    document.getElementById('cart-total').textContent = `$${total.toFixed(2)}`;

    const progressPercent = Math.min(100, Math.round((subtotal / freeDeliveryThreshold) * 100));
    document.getElementById('delivery-progress-bar').style.width = `${progressPercent}%`;
    document.getElementById('delivery-status-percent').textContent = `${progressPercent}%`;

    if (subtotal >= freeDeliveryThreshold) {
        document.getElementById('delivery-status-text').textContent = '🎉 You unlocked FREE Delivery!';
    } else {
        const remaining = (freeDeliveryThreshold - subtotal).toFixed(2);
        document.getElementById('delivery-status-text').textContent = `Add $${remaining} more for FREE delivery`;
    }
}

function changeQty(index, delta) {
    cart[index].qty += delta;
    if (cart[index].qty <= 0) {
        cart.splice(index, 1);
    }
    updateCartUI();
}

function toggleCartDrawer() {
    const drawer = document.getElementById('cart-drawer');
    drawer.classList.toggle('hidden');
}

function toggleAdminDrawer() {
    const drawer = document.getElementById('admin-drawer');
    drawer.classList.toggle('hidden');
}

function toggleMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    menu.classList.toggle('hidden');
}

function copyOrderSummarySMS() {
    if (cart.length === 0) {
        showToast('Your order list is empty!', 'fa-triangle-exclamation');
        return;
    }

    let text = "Hi Custom Juice! I'd like to place an order:\n\n";
    cart.forEach(item => {
        text += `• ${item.qty}x ${item.name} (${item.size}) - $${(item.price * item.qty).toFixed(2)}\n`;
    });
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    text += `\nTotal: $${subtotal.toFixed(2)}`;

    navigator.clipboard.writeText(text).then(() => {
        showToast('Order summary copied to clipboard!');
    });
}

function showToast(message, icon = 'fa-circle-check') {
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toast-message');
    const toastIcon = document.getElementById('toast-icon');

    toastMsg.textContent = message;
    toastIcon.className = `fa-solid ${icon} text-brand-400`;

    toast.classList.remove('translate-y-20', 'opacity-0');
    toast.classList.add('translate-y-0', 'opacity-100');

    setTimeout(() => {
        toast.classList.remove('translate-y-0', 'opacity-100');
        toast.classList.add('translate-y-20', 'opacity-0');
    }, 3000);
}

function checkZipCode() {
    const zip = document.getElementById('zip-input').value.trim();
    const result = document.getElementById('zip-result');

    if (!zip || zip.length < 5) {
        result.className = "text-sm font-semibold text-rose-600 block";
        result.textContent = "Please enter a valid 5-digit ZIP code.";
        return;
    }

    const validZips = ['60201', '60202', '60203', '60204','60208','60209'];
    
    result.classList.remove('hidden');
    if (validZips.includes(zip) || zip.endsWith('1') || zip.endsWith('5') || zip.endsWith('7')) {
        result.className = "text-sm font-semibold text-brand-700 block bg-brand-100 p-3 rounded-xl border border-brand-200 mt-2";
        result.innerHTML = `<i class="fa-solid fa-circle-check"></i> Great news! We offer home delivery to ZIP code <strong>${zip}</strong>.`;
    } else {
        result.className = "text-sm font-semibold text-citrus-600 block bg-citrus-50 p-3 rounded-xl border border-citrus-200 mt-2";
        result.innerHTML = `<i class="fa-solid fa-truck"></i> We can fulfill orders for <strong>${zip}</strong> via direct phone pickup or special courier request!`;
    }
}

function updateBusinessInfo() {
    const bizName = document.getElementById('admin-biz-name').value || "Custom Juice";
    const bizPhone = document.getElementById('admin-biz-phone').value || "(312) 358-2030";

    document.querySelectorAll('.site-name-text').forEach(el => el.textContent = bizName);
    document.querySelectorAll('.site-phone-display').forEach(el => el.textContent = bizPhone);
    document.querySelectorAll('.site-phone-link').forEach(el => el.href = `tel:${bizPhone.replace(/[^0-9]/g, '')}`);
}

function addNewMenuItem() {
    const name = document.getElementById('new-juice-name').value;
    const category = document.getElementById('new-juice-cat').value;
    const price = parseFloat(document.getElementById('new-juice-price').value) || 7.50;
    const ingredients = document.getElementById('new-juice-ingredients').value.split(',').map(s => s.trim());

    if (!name) {
        alert('Please enter a juice name.');
        return;
    }

    const newItem = {
        id: Date.now().toString(),
        name: name,
        category: category,
        tag: 'New Item',
        ingredients: ingredients.length > 0 && ingredients[0] !== '' ? ingredients : ['Fresh Organic Fruit'],
        desc: 'Freshly handcrafted juice made to order with organic natural ingredients.',
        prices: { '12 oz': price, '16 oz': price + 2.00, '32 oz': price + 8.00 },
        image: `https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=600&q=80`
    };

    menuItems.unshift(newItem);
    renderMenu(menuItems);
    toggleAdminDrawer();
    showToast(`Added "${name}" to the menu!`);

    document.getElementById('new-juice-name').value = '';
    document.getElementById('new-juice-ingredients').value = '';
}

function handleCateringSubmit(e) {
    e.preventDefault();
    showToast('Catering request sent! We will call you back shortly.');
    e.target.reset();
}

window.addEventListener('DOMContentLoaded', () => {
    renderMenu();
    updateCartUI();
});