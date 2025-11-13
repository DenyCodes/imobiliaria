// VARIÁVEIS GLOBAIS PARA O CARROSSEL
let currentImageIndex = 0;
let currentImageList = [];

// --- FUNÇÕES DO FILTRO ---

function aplicarFiltro() {
    const bairroSelecionado = document.getElementById('bairro-filtro').value;
    const quartosSelecionados = parseInt(document.getElementById('quartos-filtro').value);
    const valorMaxInput = document.getElementById('valor-max-filtro').value;
    
    const valorMax = valorMaxInput ? parseFloat(valorMaxInput) : Infinity;

    const anuncios = document.querySelectorAll('.card');

    anuncios.forEach(card => {
        const cardBairro = card.getAttribute('data-bairro');
        const cardValor = parseFloat(card.getAttribute('data-valor')); 
        const cardQuartos = parseInt(card.getAttribute('data-quartos')); 

        // Condições
        const filtroBairro = (bairroSelecionado === 'todos' || cardBairro === bairroSelecionado);
        const filtroValor = (cardValor <= valorMax);
        const filtroQuartos = (cardQuartos >= quartosSelecionados); 

        if (filtroBairro && filtroValor && filtroQuartos) {
            card.style.display = 'block'; 
        } else {
            card.style.display = 'none';
        }
    });
}

function limparFiltro() {
    document.getElementById('bairro-filtro').value = 'todos';
    document.getElementById('quartos-filtro').value = '0';
    document.getElementById('valor-max-filtro').value = '';

    aplicarFiltro();
}

window.onload = aplicarFiltro;


// --- FUNÇÕES DO MODAL E CARROSSEL ---

const modal = document.getElementById('imovel-modal');

// Função para formatar o valor monetário
function formatarValor(valor) {
    return `R$ ${parseFloat(valor).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

// Abre o modal e preenche com os dados do cartão clicado
function showDetalhes(cardElement) {
    // 1. Coleta os dados dos atributos data-
    const dados = {
        titulo: cardElement.getAttribute('data-titulo'),
        endereco: cardElement.getAttribute('data-endereco') + ' - ' + cardElement.getAttribute('data-bairro').replace('-', ' ').toUpperCase(),
        valor: formatarValor(cardElement.getAttribute('data-valor')),
        quartos: cardElement.getAttribute('data-quartos'),
        banheiros: cardElement.getAttribute('data-banheiros'),
        area: cardElement.getAttribute('data-area'),
        utilidades: cardElement.getAttribute('data-utilidades'),
        contato: cardElement.getAttribute('data-contato'),
        // Pega a lista de imagens e divide por vírgula
        imagens: cardElement.getAttribute('data-imagens').split(',')
    };

    // 2. Preenche o conteúdo estático do modal
    document.getElementById('modal-titulo').textContent = dados.titulo;
    document.getElementById('modal-valor').textContent = dados.valor;
    document.getElementById('modal-endereco').textContent = dados.endereco;
    document.getElementById('modal-quartos').textContent = dados.quartos;
    document.getElementById('modal-banheiros').textContent = dados.banheiros;
    document.getElementById('modal-area').textContent = dados.area;
    document.getElementById('modal-utilidades').textContent = dados.utilidades;
    document.getElementById('modal-contato').textContent = dados.contato;
    
    // Configura o link do WhatsApp
    const linkWa = `https://wa.me/55${dados.contato.replace(/\D/g, '')}?text=Olá! Tenho interesse no imóvel: ${dados.titulo} (${dados.endereco}).`;
    document.getElementById('modal-whatsapp-link').href = linkWa;

    // 3. Inicializa o Carrossel
    currentImageList = dados.imagens;
    currentImageIndex = 0;
    updateCarousel();

    // 4. Exibe o modal
    modal.style.display = 'block';
}

// Função que atualiza a imagem no carrossel
function updateCarousel() {
    const imgElement = document.getElementById('modal-img');
    if (currentImageList.length > 0) {
        imgElement.style.opacity = '0'; // Esconde para a transição
        setTimeout(() => {
            imgElement.src = currentImageList[currentImageIndex];
            imgElement.style.opacity = '1'; // Revela
        }, 300); // Tempo igual ao CSS transition
    }
}

// Avança para a próxima imagem
function nextSlide(event) {
    event.stopPropagation(); 
    currentImageIndex = (currentImageIndex + 1) % currentImageList.length;
    updateCarousel();
}

// Volta para a imagem anterior
function prevSlide(event) {
    event.stopPropagation(); 
    currentImageIndex = (currentImageIndex - 1 + currentImageList.length) % currentImageList.length;
    updateCarousel();
}

// Fecha o modal
function closeDetalhes(event) {
    if (event.target === modal || event.target.className === 'close-button') {
        modal.style.display = 'none';
    }
}

// Fecha o modal se o usuário pressionar a tecla ESC
window.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        modal.style.display = 'none';
    }
});