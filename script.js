let modalKey = 0;      // GLOBAL
let quantPizzas = 1;   // CONTROLA QUANTIDADE INICIAL
let cart = [ ];        // CARRINHO

const formatoReal = (valor) => {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}
const formatoMonetario = (valor) => {
    if(valor) {
        return valor.toFixed(2);
    }
}
function Vibra( ){
    navigator.vibrate(100);
}

function imprimir( ){
    const conteudo = document.querySelector('aside').innerHTML;
     const opcao ={
        filename: "LAF-Pedido.pdf",
        html2canvas:{scala:2},
        jsPDF:{unit:"mm", format: "a4", orientation: "portrait"}
    };
    html2pdf( ).set(opcao).from(conteudo).save( );
}

const abrirModal = ( ) => {
    Vibra( );
    document.querySelector('.pizzaWindowArea').style.opacity = '0';
    document.querySelector('.pizzaWindowArea').style.display = 'flex';
    setTimeout(( ) => document.querySelector('.pizzaWindowArea').style.opacity = 1, 300);
}
const fecharModal = ( ) => {
    Vibra( );
    document.querySelector('.pizzaWindowArea').style.opacity = '0';
    setTimeout(( ) => document.querySelector('.pizzaWindowArea').style.display = 'none', 500);
}
const botoesFechar = ( ) => {
    Vibra( );
    document.querySelectorAll('.pizzaInfo--cancelButton').forEach( (item) => 
    item.addEventListener('click', fecharModal) );
}
//------------------------ TELA PRODUTOS SETA ATRIBUTOS GERAL ----------------------------------
const preencheDadosDasPizzas = (pizzaItem, item, index) => {
	pizzaItem.setAttribute('data-key', index);
    pizzaItem.querySelector('.pizza-item--img img').src = item.img;
    pizzaItem.querySelector('.pizza-item--price').innerHTML = formatoReal(item.price[0]);
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
    // pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;
}
//------------------------ TELA CARRINHO SETA ATRIBUTOS GERAL ----------------------------------
const preencheDadosModal = (item) => {
    document.querySelector('.pizzaBig img').src = item.img;
    document.querySelector('.pizzaInfo h1').innerHTML = item.name;
    document.querySelector('.pizzaInfo--desc').innerHTML = item.description;
    document.querySelector('.pizzaInfo--actualPrice').innerHTML = formatoReal(item.price[0]);
}
const pegarKey = (e) => {
    // PEGAR VALOR DO ATRIBUTO DATA-KEY
    let key = e.target.closest('.pizza-item').getAttribute('data-key');
    // QUANTIDADE INICIAL EM 1
    quantPizzas = 1;
    // MANTER AS INFORMAÇÕES QUE CLICOU
    modalKey = key;
    return key;
}
const preencherTamanhos = (key) => {
    // SELECIONA OS SIZES
    document.querySelectorAll('.pizzaInfo--size').forEach((size, sizeIndex) => {
        // SELECIONA O PRIMEIRO ARRAY
        (sizeIndex == 0) ? size.classList.add('selected') : ' ';
        size.querySelector('span').innerHTML = lafJson[key].sizes;
    })
}
const mudarQuantidade = ( ) => {
    // Ações nos botões + e - da janela modal
    document.querySelector('.pizzaInfo--qtmais').addEventListener('click', ( ) => {
        quantPizzas++;
        document.querySelector('.pizzaInfo--qt').innerHTML = quantPizzas;
    })
    document.querySelector('.pizzaInfo--qtmenos').addEventListener('click', ( ) => {
        if(quantPizzas > 1) {
            quantPizzas--
            document.querySelector('.pizzaInfo--qt').innerHTML = quantPizzas;
        }
    })
}
const adicionarNoCarrinho = ( ) => {
    document.querySelector('.pizzaInfo--addButton').addEventListener('click', ( ) => {

    	// tamanho
	    let size = document.querySelector('.pizzaInfo--size.selected').getAttribute('data-key');

        // preco
        let price = document.querySelector('.pizzaInfo--actualPrice').innerHTML.replace('R$&nbsp;','');
    
        // crie um identificador que junte id e tamanho
	    // concatene as duas informacoes separadas por um símbolo, vc escolhe
	    let identificador = lafJson[modalKey].id+'t'+size;

        // antes de adicionar verifique se ja tem aquele codigo e tamanho
        // para adicionarmos a quantidade
        let key = cart.findIndex( (item) => item.identificador == identificador );

        if(key > -1) {
            // se encontrar aumente a quantidade
            cart[key].qt += quantPizzas;
        } else {
            // adicionar objeto pizza no carrinho
            let pizza = {
                identificador,
                id: lafJson[modalKey].id,
                size,
                qt: quantPizzas,
                price: parseFloat(price)
            }
            cart.push(pizza);
        }
        fecharModal( );
        abrirCarrinho( );
        atualizarCarrinho( );
    })
}
const abrirCarrinho = ( ) => {
    Vibra( );
    if(cart.length > 0) {        
	    document.querySelector('aside').classList.add('show');         // mostrar o carrinho
        document.querySelector('header').style.display = 'flex';       // mostrar barra superior
    }
    // exibir aside do carrinho no modo mobile
    document.querySelector('.menu-openner').addEventListener('click', ( ) => {
        if(cart.length > 0) {
            document.querySelector('aside').classList.add('show');
            document.querySelector('aside').style.left = '0';
        }
    })
}
const fecharCarrinho = ( ) => {
    // FECHAR CARRINHO COM X CELULAR
    Vibra( );
    document.querySelector('.menu-closer').addEventListener('click', () => {
        document.querySelector('aside').style.left = '100vw';              //ficara fora da tela
        document.querySelector('header').style.display = 'flex';
    })
}
const atualizarCarrinho = ( ) => {
    // exibir número de itens no carrinho
    Vibra( );
	document.querySelector('.menu-openner span').innerHTML = cart.length;
	
	// mostrar ou nao o carrinho
	if(cart.length > 0) {

		// mostrar o carrinho
		document.querySelector('aside').classList.add('show');

		// zerar meu .cart para nao fazer insercoes duplicadas
		document.querySelector('.cart').innerHTML = ' ';

        // crie as variaveis antes do for
		let subtotal = 0;
		let desconto = 0;
		let total    = 0;

        // PREENCHER O ITENS DE COMPRA E CALCULAR
		for(let i in cart) {
			// PEGAR ITENS PELO ID
			let pizzaItem = lafJson.find( (item) => item.id == cart[i].id );

            // em cada item pegar o subtotal
        	subtotal += cart[i].price * cart[i].qt;

			// CLONAE E EXIBIR NA PAGINA
			let cartItem = document.querySelector('.modelo-clone .cart--item').cloneNode(true);
			document.querySelector('.cart').append(cartItem);

			let pizzaSizeName = cart[i].size;

			let pizzaName = `${pizzaItem.name}`;

			// preencher as informacoes
			cartItem.querySelector('img').src = pizzaItem.img;
			cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
			cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;

			// selecionar botoes + e -
			cartItem.querySelector('.cart--item-qtmais').addEventListener('click', ( ) => {
				// adicionar apenas a quantidade que esta neste contexto
				cart[i].qt++;
				// atualizar a quantidade
				atualizarCarrinho();
			})
			cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', ( ) => {
				if(cart[i].qt > 1) {
					// subtrair apenas a quantidade que esta neste contexto
					cart[i].qt--;
				} else {
					// remover se for zero
					cart.splice(i, 1);
				}
               (cart.length < 1) ? document.querySelector('header').style.display = 'flex' : ''

				// atualizar a quantidade
				atualizarCarrinho( );
			})
			document.querySelector('.cart').append(cartItem);
		}
		// calcule desconto % (0.1 = 10%)
		desconto = subtotal * 0.03;
		total = subtotal - desconto;

		// selecionar o ultimo span do elemento
		document.querySelector('.subtotal span:last-child').innerHTML = formatoReal(subtotal);
		document.querySelector('.desconto span:last-child').innerHTML = formatoReal(desconto);
		document.querySelector('.total span:last-child').innerHTML    = formatoReal(total);

	} else {
		// ocultar o carrinho
		document.querySelector('aside').classList.remove('show');
		document.querySelector('aside').style.left = '100vw';
	}
}
const finalizarCompra = ( ) => {
    document.querySelector('.cart--finalizar').addEventListener('click', ( ) => {
        document.querySelector('aside').classList.remove('show');
        document.querySelector('aside').style.left = '100vw';
        document.querySelector('header').style.display = 'flex';
        Vibra( );
        Vibra( );
        imprimir( );
    })
}

// MAPEAR lafJson PARA GERAR O CLONE DA LISTA DE PRODUTOS
lafJson.map((item, index ) => {
    let pizzaItem = document.querySelector('.modelo-clone .pizza-item').cloneNode(true);
    document.querySelector('.pizza-area').append(pizzaItem);

    // preencher os dados de cada pizza
    preencheDadosDasPizzas(pizzaItem, item, index);
    
    // pizza clicada
    pizzaItem.querySelector('.pizza-item a').addEventListener('click', (e) => {
        e.preventDefault( );

        let chave = pegarKey(e);

        // abrir janela modal
        abrirModal( );

        // preenchimento dos dados
        preencheDadosModal(item);

        // pegar tamanho selecionado
        preencherTamanhos(chave);

		// definir quantidade inicial como 1
		document.querySelector('.pizzaInfo--qt').innerHTML = quantPizzas;

    })
botoesFechar( );
})
mudarQuantidade( );
adicionarNoCarrinho( );
atualizarCarrinho( );
fecharCarrinho( );
finalizarCompra( );



// function imprimir( ){

//     const conteudo = document.querySelector('aside').innerHTML;

//     const janela = window.open('', '', 'height=700, width=700');

//     janela.document.write('<html><head>');
//     janela.document.write('<link rel="stylesheet" href="estilo.css"/>');
//     janela.document.write('</head>');
//     janela.document.write('<body>');
//     janela.document.write(conteudo);
//     janela.document.write('</body></html>');
//     janela.print( );
// }