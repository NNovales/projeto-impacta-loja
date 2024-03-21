// Função ready() para executar quando o DOM estiver carregado
function ready() {
    var addToCartButtons = document.querySelectorAll('.shop-item-button');
    addToCartButtons.forEach(function(button) {
        button.addEventListener('click', addToCartClicked);
    });

    document.querySelector('.btn-purchase').addEventListener('click', purchaseClicked);
}

// Função para adicionar item ao carrinho
function addToCartClicked(event) {
    var button = event.target;
    var shopItem = button.parentElement;
    var title = shopItem.querySelector('.product-name').textContent;
    var price = shopItem.querySelector('.product-price').textContent;
    var imageSrc = shopItem.querySelector('.product-image').src;
    addItemToCart(title, price, imageSrc);
    updateCartTotal();
}

// Função para criar uma nova linha no carrinho
function addItemToCart(title, price, imageSrc) {
    
    var cartRow = document.createElement('div');
    cartRow.classList.add('cart-row');
    var cartItems = document.querySelector('.cart-items');
    var cartItemNames = cartItems.getElementsByClassName('cart-item-title');
    for (var i = 0; i < cartItemNames.length; i++) {
        if (cartItemNames[i].innerText === title) {
            alert('Este item já foi adicionado ao carrinho');
            return;
        }
    }
    var cartRowContents = `
        <div class="cart-item cart-column">
            <img class="cart-item-image" src="${imageSrc}" width="100" height="100">
            <span class="cart-item-title">${title}</span>
        </div>
        <span class="cart-price cart-column">${price}</span>
        <div class="cart-quantity cart-column">
            <input class="cart-quantity-input" type="number" value="1">
            <button class="btn btn-danger" type="button">REMOVER</button>
        </div>`;
    cartRow.innerHTML = cartRowContents;
    cartItems.append(cartRow);
    cartRow.querySelector('.btn-danger').addEventListener('click', removeCartItem);
    cartRow.querySelector('.cart-quantity-input').addEventListener('change', quantityChanged);
}

// Função para atualizar o total do carrinho
function updateCartTotal() {
    var cartItemContainer = document.querySelector('.cart-items');
    var cartRows = cartItemContainer.getElementsByClassName('cart-row');
    var total = 0;
    for (var i = 0; i < cartRows.length; i++) {
        var cartRow = cartRows[i];
        var priceElement = cartRow.querySelector('.cart-price');
        var quantityElement = cartRow.querySelector('.cart-quantity-input');
        var price = parseFloat(priceElement.textContent.replace('R$', '').replace(',', '.'));
        var quantity = quantityElement.value;
        total = total + (price * quantity);
    }
    total = Math.round(total * 100) / 100;
    document.querySelector('.cart-total-price').innerText = 'R$' + total.toFixed(2);
}

// Função para remover item do carrinho
function removeCartItem(event) {
    var buttonClicked = event.target;
    buttonClicked.parentElement.parentElement.remove();
    updateCartTotal();
}

// Função para alterar a quantidade de itens
function quantityChanged(event) {
    var input = event.target;
    if (isNaN(input.value) || input.value <= 0) {
        input.value = 1;
    }
    updateCartTotal();
}

// Função para lidar com o clique no botão de compra
function purchaseClicked() {
    alert('Obrigado pela sua compra!');
    var cartItems = document.querySelector('.cart-items');
    while (cartItems.hasChildNodes()) {
        cartItems.removeChild(cartItems.firstChild);
    }
    updateCartTotal();
}

// Verifica se o DOM já está carregado e executa a função ready()
if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', ready);
} else {
    ready();
}
