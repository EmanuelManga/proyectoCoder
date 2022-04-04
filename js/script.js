
const userCardTemplate = document.querySelector("[data-user-template]")
const userCardContainer = document.querySelector("[data-user-cards-container]")
const searchInput = document.querySelector("[data-search]")

let baseDeDatos = []

searchInput.addEventListener("input", e => {
    const value = e.target.value.toLowerCase()
    baseDeDatos.forEach(baseDeDatos => {
        const isVisible = baseDeDatos.nombre.toLowerCase().includes(value) || baseDeDatos.categoria.toLowerCase().includes(value)
        baseDeDatos.element.classList.toggle("hide", !isVisible)
    })
})

fetch("https://my-json-server.typicode.com/EmanuelManga/JsonProductos/lista")
.then(res => res.json())
.then(data => {
    baseDeDatos = data.map(baseDeDatos => {
    const card = userCardTemplate.content.cloneNode(true).children[0]
    const nombre = card.querySelector("[dataTitulo]")
    const precio = card.querySelector("[dataPrecio]")
    const imagen = card.querySelector("[dataImagen]")
    const boton = card.querySelector("[dataBoton]")
    card.setAttribute('category', baseDeDatos.categoria)
    nombre.textContent = baseDeDatos.nombre
    precio.textContent = divisa+baseDeDatos.precio
    imagen.setAttribute('src', baseDeDatos.imagen)
    boton.setAttribute('marcador', baseDeDatos.id);
    boton.addEventListener('click', anyadirProductoAlCarrito);
    boton.addEventListener('click', mostrarAlertaToastr )


    userCardContainer.append(card)
    return { nombre: baseDeDatos.nombre, precio: baseDeDatos.precio, imagen: baseDeDatos.imagen, id: baseDeDatos.id, categoria: baseDeDatos.categoria , boton: baseDeDatos.id ,element: card }
    })
    renderizarCarrito();
})


class Categorias{
    constructor(categoriasF){
        this.categoriasF = categoriasF
    }
}

const baseCategorias = []

baseCategorias.push(new Categorias("Todo"))
baseCategorias.push(new Categorias("Procesador"))
baseCategorias.push(new Categorias("Placa de video"))
baseCategorias.push(new Categorias("Fuentes"))
baseCategorias.push(new Categorias("Refrigeracion"))





let carrito = [];
// let carrito = JSON.parse(localStorage.getItem('carritouno'))
let carritod = [];
var carritoLocal = JSON.parse(localStorage.getItem('carritouno'));
// var carritoLocal =[];
const divisa = '$';
const DOMitems = document.querySelector('#items');
const DOMcarrito = document.querySelector('#carrito');
const DOMcarritoPago = document.querySelector('#carritoPago');
const DOMtotal = document.querySelector('#total');
const DOMtotalPago = document.querySelector('#totalPago');
const DOMbotonVaciar = document.querySelector('#boton-vaciar');
const DOMFiltro = document.querySelector('#filtro')
const btnComprar = document.querySelector('#boton-comprar')
const formDatos = document.querySelector('#formDatos')
const submitForm = document.querySelector('#submitForm')
const botonComprarPago = document.querySelector('#boton-comprar-pago')

// Funciones





console.log(carritoLocal)
// 
// Evento para añadir un producto al carrito de la compra
// 
function anyadirProductoAlCarrito(evento) {
    // Anyadimos el Nodo a nuestro carrito
    carrito.push(evento.target.getAttribute('marcador'))

    carritoLocal.push(evento.target.getAttribute('marcador'))
    
    localStorage.setItem('carritouno',JSON.stringify(carritoLocal))
    carritoLocal = localStorage.getItem('carritouno');
    carritoLocal = JSON.parse(carritoLocal)

    // localStorageParse();
    renderizarCarrito();
    // console.log(carrito)
    

}

// localStorage.clear();



// 
//  Evento para mostrar Toast al agregar al carrito 
// 
function mostrarAlertaToastr(){

    // Personalisamos Toastr 
    
    toastr.options = {
        closeButton: true,
        debug: false,
        newestOnTop: false,
        progressBar: true,
        positionClass: "toast-bottom-right",
        preventDuplicates: false,
        onclick: null,
        showDuration: 300,
        hideDuration: 1000,
        timeOut: 3000,
        extendedTimeOut: 1000,
        showEasing: "swing",
        hideEasing: "linear",
        showMethod: "fadeIn",
        hideMethod: "fadeOut"
    }
    toastr.success("Producto agregado con exito")
    
}

// 
// Dibuja todos los productos guardados en el carrito
// 
function renderizarCarrito() {

    // Vaciamos todo el html
    DOMcarrito.textContent = '';
    // Quitamos los duplicados
    const carritoSinDuplicados = [...new Set(carritoLocal)];
    // Generamos los Nodos a partir de carrito
    carritoSinDuplicados.forEach((item) => {
        // Obtenemos el item que necesitamos de la variable base de datos
        const miItem = baseDeDatos.filter((itemBaseDatos) => {
            // ¿Coincide las id? Solo puede existir un caso
            return itemBaseDatos.id === parseInt(item);
        });
        // Cuenta el número de veces que se repite el producto
        const numeroUnidadesItem = carritoLocal.reduce((total, itemId) => {
            // ¿Coincide las id? Incremento el contador, en caso contrario no mantengo
            return itemId === item ? total += 1 : total;
        }, 0);
        // Creamos el nodo del item del carrito
        const miNodo = document.createElement('li');
        miNodo.classList.add('list-group-item', 'text-right', 'mx-2');
        miNodo.textContent = `${numeroUnidadesItem} x ${miItem[0].nombre} - ${divisa}${miItem[0].precio} `;


        const miImagen = document.createElement('img');
        miImagen.classList.add('img-fluid');
        miImagen.setAttribute('src', miItem[0].imagen);

        // Boton de borrar
        const miBoton = document.createElement('button');
        miBoton.classList.add('btn', 'btn-danger', 'mx-5');
        miBoton.textContent = 'X';
        miBoton.style.marginLeft = '1rem';
        miBoton.dataset.item = item;
        miBoton.addEventListener('click', borrarItemCarrito);
        // Mezclamos nodos
        miNodo.appendChild(miImagen);
        miNodo.appendChild(miBoton);
        DOMcarrito.appendChild(miNodo);
    });
    // Renderizamos el precio total en el HTML
    DOMtotal.textContent = calcularTotal();
}



// 
// Evento para borrar un elemento del carrito
// 
function borrarItemCarrito(evento) {
    // Obtenemos el producto ID que hay en el boton pulsado
    const id = evento.target.dataset.item;
    // Borramos todos los productos
    carritoLocal = carritoLocal.filter((carritoId) => {  
        
        return carritoId !== id;
    });
    localStorage.setItem('carritouno',JSON.stringify(carritoLocal))
    carritoLocal = localStorage.getItem('carritouno');
    carritoLocal = JSON.parse(carritoLocal)
    // volvemos a renderizar

    renderizarCarrito();
    renderizarCarritoPago();
}


// 
// Calcula el precio total teniendo en cuenta los productos repetidos
// 
function calcularTotal() {
    // Recorremos el array del carrito 
    return carritoLocal.reduce((total, item) => {
        // De cada elemento obtenemos su precio
        const miItem = baseDeDatos.filter((itemBaseDatos) => {
            return itemBaseDatos.id === parseInt(item);
        });
        // Los sumamos al total
        return total + miItem[0].precio;
    }, 0).toFixed(2);
}


// 
// Varia el carrito y vuelve a dibujarlo
// 
function vaciarCarrito() {
    // Limpiamos los productos guardados

    carritoLocal = [];
    localStorage.setItem('carritouno',JSON.stringify(carritoLocal))
    carritoLocal = localStorage.getItem('carritouno');
    carritoLocal = JSON.parse(carritoLocal)
    

    // Renderizamos los cambios
    renderizarCarrito();
    
}





function renderizarFiltro(){
    baseCategorias.forEach((info) => {
        const miNodoF = document.createElement('a');
        miNodoF.classList.add('categoryItem')
        miNodoF.textContent = info.categoriasF

        const miNodoFAtrr = document.createAttribute("category");
        miNodoFAtrr.value = info.categoriasF;
        miNodoF.setAttributeNode(miNodoFAtrr);


        DOMFiltro.appendChild(miNodoF);
    })

}





$(document).ready(function(){

	// AGREGANDO CLASE ACTIVE AL PRIMER ENLACE ====================
	$('.categoryList .categoryItem[category="Todo"]').addClass('ct_item-active');

	// FILTRANDO PRODUCTOS  ============================================

	$('.categoryItem').click(function(){
		var catProduct = $(this).attr('category');
		console.log(catProduct);

		// AGREGANDO CLASE ACTIVE AL ENLACE SELECCIONADO
		$('.categoryItem').removeClass('ct_item-active');
		$(this).addClass('ct_item-active');

		// OCULTANDO PRODUCTOS =========================
		$('.productItem').css('transform', 'scale(0)');
		function hideProduct(){
			$('.productItem').hide();
		} setTimeout(hideProduct,400);

		// MOSTRANDO PRODUCTOS =========================
		function showProduct(){
			$('.productItem[category="'+catProduct+'"]').show();
			$('.productItem[category="'+catProduct+'"]').css('transform', 'scale(1)');
		} setTimeout(showProduct,400);
	});

	// MOSTRANDO TODOS LOS PRODUCTOS =======================

	$('.categoryItem[category="Todo"]').click(function(){
		function showAll(){
			$('.productItem').show();
			$('.productItem').css('transform', 'scale(1)');
		} setTimeout(showAll,400);
	});
});


// 
// 

$(document).ready(function(){

	// AGREGANDO CLASE ACTIVE AL PRIMER ENLACE ====================
	$('.bodyIndex .categoriaInicio[category="todoInicio"]').addClass('ct_item-active');

	// FILTRANDO PRODUCTOS  ============================================

	$('.categoriaInicio').click(function(){
		var catProduct = $(this).attr('category');
		console.log(catProduct);

		// AGREGANDO CLASE ACTIVE AL ENLACE SELECCIONADO
		$('.categoriaInicio').removeClass('ct_item-active');
		$(this).addClass('ct_item-active');

		// OCULTANDO PRODUCTOS =========================
		$('.index').css('transform', 'scale(0)');
		function hideProduct(){
			$('.index').hide();
		} setTimeout(hideProduct,400);
        

		// MOSTRANDO PRODUCTOS =========================
		function showProduct(){
			$('.index[category="'+catProduct+'"]').show();
			$('.index[category="'+catProduct+'"]').css('transform', 'scale(1)');
		} setTimeout(showProduct,400);

        
	});

});

// 
// 
// 

function renderizarCarritoPago() {

    // Vaciamos todo el html
    DOMcarritoPago.textContent = '';
    // Quitamos los duplicados
    const carritoSinDuplicados = [...new Set(carritoLocal)];
    // Generamos los Nodos a partir de carrito
    carritoSinDuplicados.forEach((item) => {
        // Obtenemos el item que necesitamos de la variable base de datos
        const miItem = baseDeDatos.filter((itemBaseDatos) => {
            // ¿Coincide las id? Solo puede existir un caso
            return itemBaseDatos.id === parseInt(item);
        });
        // Cuenta el número de veces que se repite el producto
        const numeroUnidadesItem = carritoLocal.reduce((total, itemId) => {
            // ¿Coincide las id? Incremento el contador, en caso contrario no mantengo
            return itemId === item ? total += 1 : total;
        }, 0);
        // Creamos el nodo del item del carrito
        const miNodo = document.createElement('li');
        miNodo.classList.add('list-group-item', 'text-right', 'mx-2');
        miNodo.textContent = `${numeroUnidadesItem} x ${miItem[0].nombre} - ${divisa}${miItem[0].precio} `;


        const miImagen = document.createElement('img');
        miImagen.classList.add('img-fluid');
        miImagen.setAttribute('src', miItem[0].imagen);

        // Boton de borrar
        const miBoton = document.createElement('button');
        miBoton.classList.add('btn', 'btn-danger', 'mx-5');
        miBoton.textContent = 'X';
        miBoton.style.marginLeft = '1rem';
        miBoton.dataset.item = item;
        miBoton.addEventListener('click', borrarItemCarrito);
        // Mezclamos nodos
        miNodo.appendChild(miImagen);
        miNodo.appendChild(miBoton);
        DOMcarritoPago.appendChild(miNodo);
    });
    // Renderizamos el precio total en el HTML
    DOMtotalPago.textContent = calcularTotal();
}


function cargarDatos(){
    var datos = new Array();
    var datosIngresados =document.getElementsByClassName('datoInput')
    nombreIngre = [].map.call(datosIngresados,function(dataInput){
        datos.push(dataInput.value);
    });
    console.log(datos);
    var tot = calcularTotal();
    // swal.fire(
    //     `${datos[0]} ${datos[1]} gracias por tu compra`,
    //     `La factura se enviara a ${datos[2]} dentro de las proximas 24hr
    //     Su total fue de $${tot}`,
    //     )
        
    let timerInterval
    Swal.fire({
        title: datos[0] + ' ' +  datos[1] + ' gracias por tu compra',
        // html: 'I will close in <b></b> milliseconds.',
        text: 'La factura se enviara a ' + datos[2] + ' dentro de las proximas 24hr' + ' Su total fue de ' + divisa + tot,
        timer: 3000,
        timerProgressBar: true,
        didOpen: () => {
        Swal.showLoading()
        const b = Swal.getHtmlContainer().querySelector('b')
        timerInterval = setInterval(() => {
            b.textContent = Swal.getTimerLeft()
        }, 100)
        },
        willClose: () => {
        clearInterval(timerInterval)
        }
    }).then((result) => {
    /* Read more about handling dismissals below */
        if (result.dismiss === Swal.DismissReason.timer) {
        console.log('I was closed by the timer')
        }
    })

        
        // recargar()
        setTimeout(function(){
            window.location.reload(1);
            vaciarCarrito()
            renderizarCarritoPago()
        }, 3000);


}



// 
// 

// Eventos
DOMbotonVaciar.addEventListener('click', vaciarCarrito);
botonComprarPago.addEventListener('click',cargarDatos)
btnComprar.addEventListener('click', renderizarCarritoPago);


// Inicio
// anyadirProductoAlCarrito();
renderizarFiltro();
// renderizarCarrito();
// renderizarCarritoPago();

