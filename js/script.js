var swiper = new Swiper(".myswiper-1", {
    slidesPerView: 1, 
    spaceBetween: 30,
    loop: true,
    pagination: {
        el: ".swiper-pagination",
        clickable: true,
    },
    navigation: {
        nextEl: ".swiper-button-next", 
        prevEl: ".swiper-button-prev", 
    }
});
var swiper = new Swiper(".myswiper-2", {
    slidesPerView: 3, 
    spaceBetween: 30,
    loop: true,
    navigation: {
        nextEl: ".swiper-button-next", 
        prevEl: ".swiper-button-prev", 
    },
    breakpoints: {
        0: {
            slidesPerView: 1
        },
        520: {
            slidesPerView: 2
        },
        950: {
            slidesPerView: 3
        }
    }
});

// carrito

const carrito = document.getElementById("carrito");
const elementos1 = document.getElementById("lista-1");
const elementos2 = document.getElementById("lista-2");
const elementos3 = document.getElementById("lista-3");
const lista = document.querySelector("#lista-carrito tbody");
const vaciarCarritoBtn = document.getElementById("vaciar-carrito");

cargarEventListeners();

function cargarEventListeners() {
    elementos1.addEventListener("click", comprarElemento);
    elementos2.addEventListener("click", comprarElemento);
    elementos3.addEventListener("click", comprarElemento);
    carrito.addEventListener("click", eliminarElemento);

    vaciarCarritoBtn.addEventListener("click", vaciarCarrito);

    // Cargar elementos del carrito desde localStorage al cargar la página
    document.addEventListener("DOMContentLoaded", () => {
        const carritoLS = obtenerElementosLocalStorage();
        carritoLS.forEach((elemento) => insertarCarrito(elemento));
    });
}

function comprarElemento(e) {
    e.preventDefault();
    if (e.target.classList.contains("agregar-carrito")) {
        const elemento = e.target.parentElement.parentElement;
        leerDatosElemento(elemento);
    }
}

function leerDatosElemento(elemento) {
    const infoElemento = {
        imagen: elemento.querySelector("img").src,
        titulo: elemento.querySelector("h3").textContent,
        precio: elemento.querySelector(".precio").textContent,
        id: elemento.querySelector("a").getAttribute("data-id"),
    };

    insertarCarrito(infoElemento);

    // Guardar elementos en localStorage
    guardarElementoLocalStorage(infoElemento);
}

function insertarCarrito(elemento) {
    const row = document.createElement("tr");
    row.innerHTML = `
        <td>
            <img src="${elemento.imagen}" width=100>
        </td>
        <td>
            ${elemento.titulo}
        </td>
        <td>
            ${elemento.precio}
        </td>
        <td>
            <a href="#" class="borrar" data-id="${elemento.id}">Borrar</a>
        </td>
    `;

    lista.appendChild(row);
}

function eliminarElemento(e) {
    e.preventDefault();
    let elemento, elementoId;

    if (e.target.classList.contains("borrar")) {
        e.target.parentElement.parentElement.remove();
        elemento = e.target.parentElement.parentElement;
        elementoId = elemento.querySelector("a").getAttribute("data-id");

        // Eliminar elemento del localStorage
        eliminarElementoLocalStorage(elementoId);
    }
}

function vaciarCarrito() {
    // Vaciar la lista en el DOM
    while (lista.firstChild) {
        lista.removeChild(lista.firstChild);
    }

    // Vaciar localStorage
    localStorage.clear();

    return false;
}

function guardarElementoLocalStorage(elemento) {
    let elementos;

    // Obtener elementos del localStorage
    elementos = obtenerElementosLocalStorage();

    // Añadir el nuevo elemento
    elementos.push(elemento);

    // Guardar en localStorage
    localStorage.setItem("elementos", JSON.stringify(elementos));
}

function obtenerElementosLocalStorage() {
    let elementos;

    // Comprobar si hay elementos en localStorage
    if (localStorage.getItem("elementos") === null) {
        elementos = [];
    } else {
        elementos = JSON.parse(localStorage.getItem("elementos"));
    }

    return elementos;
}

function eliminarElementoLocalStorage(id) {
    let elementos;

    // Obtener elementos del localStorage
    elementos = obtenerElementosLocalStorage();

    // Filtrar el elemento a eliminar
    elementos = elementos.filter((elemento) => elemento.id !== id);

    // Guardar la lista actualizada en localStorage
    localStorage.setItem("elementos", JSON.stringify(elementos));
}







