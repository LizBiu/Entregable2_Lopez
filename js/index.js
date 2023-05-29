const containerProducts = document.getElementById('container-products');
const modal = document.getElementById('exampleModal');
const carrito = document.getElementById('carrito');
const totalCarrito = document.getElementById('total');
const btnClose = document.getElementsByClassName('btn-close')[0];
const containerCart = document.querySelector('.modal-body');
const iconMenu = document.getElementById('icon-menu');
let productosCarrito = [];

class Producto {
    constructor(imagen, nombre, precio, id) {
        this.imagen = imagen;
        this.nombre = nombre;
        this.precio = precio;
        this.id = id;
        this.cantidad = 1;
        this.subtotal = 0;
    }

    obtenerTotal() {
        this.subtotal = this.precio * this.cantidad;
    }
}

cargarEventos();

function cargarEventos() {

    document.addEventListener('DOMContentLoaded', () => {
        renderizarProductos();
        productosCarrito = JSON.parse(localStorage.getItem('productosLS')) || [];
        mostrarProductosCarrito();
    });

    containerProducts.addEventListener('click', agregarProducto);
    containerCart.addEventListener('click', eliminarProducto);

    carrito.onclick = function () {
        modal.style.display = 'block';
    };

    btnClose.onclick = function () {
        modal.style.display = 'none';
    };

    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    };
}

function eliminarProducto(e) {
    if (e.target.classList.contains('eliminar-producto')) {
        const productoId = parseInt(e.target.getAttribute('id'));
        productosCarrito = productosCarrito.filter((producto) => producto.id !== productoId);
        guardarProductosLocalStorage();
        console.log(productosCarrito);
        mostrarProductosCarrito();
    }
}

function agregarProducto(e) {
    e.preventDefault();

    if (e.target.classList.contains('agregar-carrito')) {
        const productoAgregado = e.target.parentElement;
        leerDatosProducto(productoAgregado);
    }
}

function leerDatosProducto(producto) {
    const datosProducto = new Producto(
        producto.querySelector('img').src,
        producto.querySelector('h4').textContent,
        Number(producto.querySelector('p').textContent.replace('$', '')),
        parseInt(producto.querySelector('a').getAttribute('id'))
    );

    datosProducto.obtenerTotal();

    agregarAlCarrito(datosProducto);
}

function agregarAlCarrito(productoAgregar) {

    const existeEnCarrito = productosCarrito.some((producto) => producto.id === productoAgregar.id);
    if (existeEnCarrito) {
        const productos = productosCarrito.map((producto) => {
            if (producto.id === productoAgregar.id) {
                producto.cantidad++;
                producto.subtotal = producto.precio * producto.cantidad;
                return producto;
            } else {
                return producto;
            }
        });

        productosCarrito = productos;
    } else {
        productosCarrito.push(productoAgregar);
    }

    guardarProductosLocalStorage();
    console.log(productosCarrito);
    mostrarProductosCarrito();
}

function mostrarProductosCarrito() {
    limpiarHTML();

    productosCarrito.forEach((producto) => {
        const {
            imagen,
            nombre,
            precio,
            cantidad,
            id
        } = producto;

        const div = document.createElement('div');
        div.classList.add('contenedor-producto');
        div.innerHTML = `
        <table>
    <thead>
      <tr>
        <th><img src="${imagen}" width="70"></th>
        <td><P>${nombre}</P></td>
        <th><P>Precio: $${precio}</P></th>
        <th><P>Cantidad: ${cantidad}</P></th>
        <th><a href="#" class="btn btn-danger eliminar-producto" id="${id}">X</a></th>
      </tr>
    </thead>
  </table>	
		`;
        containerCart.appendChild(div);
    });

    calcularTotal();
}

function calcularTotal() {
    let total = productosCarrito.reduce((sumaTotal, producto) => sumaTotal + producto.subtotal, 0);
    // console.log(total);

    totalCarrito.innerHTML = `Total a Pagar: $ ${total}`;
}

function limpiarHTML() {
    while (containerCart.firstChild) {
        containerCart.removeChild(containerCart.firstChild);
    }
}

function guardarProductosLocalStorage() {
    localStorage.setItem('productosLS', JSON.stringify(productosCarrito));
}

function renderizarProductos() {
    productos.forEach((producto) => {
        const divCard = document.createElement('div');
        divCard.classList.add('card');
        divCard.innerHTML += `
        
			<img src="./assets/${producto.img}" alt="${producto.nombre}" />
			<h4>${producto.nombre}</h4>
			<p>$${producto.precio}</p>
			<a id=${producto.id} class="boton agregar-carrito" href="#">Agregar</a>
        `;

        containerProducts.appendChild(divCard);
    });
}
