// Função ready() para executar quando o DOM estiver carregado
function ready() {
    var addToCartButtons = document.querySelectorAll('.shop-item-button');
    addToCartButtons.forEach(function(button) {
        button.addEventListener('click', addToCartClicked);
    });

    document.querySelector('.btn-purchase').addEventListener('click', purchaseClicked);

    // Event listener para aplicar cupom de desconto
    document.getElementById('apply-coupon').addEventListener('click', applyCoupon);
}

// Seleciona o botão do carrinho e o carrinho
var cartButton = document.getElementById('cart-button');
var cart = document.getElementById('cart');

// Abre/fecha o carrinho
cartButton.addEventListener('click', function() {
    cart.classList.toggle('open');
});

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
    alert('Obrigado pela sua compra! em até 15 dias estaremos entregando a sua encomenda. :D');
    var cartItems = document.querySelector('.cart-items');
    while (cartItems.hasChildNodes()) {
        cartItems.removeChild(cartItems.firstChild);
    }
    updateCartTotal();
}

// Função para aplicar cupom de desconto
function applyCoupon() {
    var couponInput = document.getElementById('coupon-input').value;
    var discountRate = 0.10; // 10% de desconto

    // Verifica se o cupom é válido
    if (couponInput === 'DESCONTO10') {
        var totalElement = document.querySelector('.cart-total-price');
        var total = parseFloat(totalElement.textContent.replace('R$', '').replace(',', '.'));
        var discountedTotal = total * (1 - discountRate);
        discountedTotal = Math.round(discountedTotal * 100) / 100;
        totalElement.innerText = 'R$' + discountedTotal.toFixed(2);
        alert('Cupom aplicado com sucesso! 10% de desconto.');
    } else {
        alert('Cupom inválido.');
    }
}

// Verifica se o DOM já está carregado e executa a função ready()
if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', ready);
} else {
    ready();
}

// Função para calcular o frete com base no CEP
document.getElementById('calculate-freight').addEventListener('click', function() {
    var cep = document.getElementById('cep-input').value;

    if (cep) {
        // Remove any non-digit characters from the input
        cep = cep.replace(/\D/g, '');

        if (cep.length === 8) {
            // Fetch data from ViaCEP API
            fetch(`https://viacep.com.br/ws/${cep}/json/`)
                .then(response => response.json())
                .then(data => {
                    if (!data.erro) {
                        // Display the address data
                        document.getElementById('cep-result').innerHTML = `
                            <p>CEP: ${data.cep}</p>
                            <p>Logradouro: ${data.logradouro}</p>
                            <p>Bairro: ${data.bairro}</p>
                            <p>Cidade: ${data.localidade}</p>
                            <p>Estado: ${data.uf}</p>
                        `;
                    } else {
                        document.getElementById('cep-result').innerHTML = `<p>CEP não encontrado.</p>`;
                    }
                })
                .catch(error => {
                    console.error('Erro ao buscar o CEP:', error);
                    document.getElementById('cep-result').innerHTML = `<p>Erro ao buscar o CEP.</p>`;
                });
        } else {
            document.getElementById('cep-result').innerHTML = `<p>CEP inválido.</p>`;
        }
    } else {
        document.getElementById('cep-result').innerHTML = `<p>Por favor, insira um CEP.</p>`;
    }
});
