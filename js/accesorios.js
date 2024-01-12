// Utilizamos la función fetch para obtener el contenido del archivo celulares.json
fetch('../js/accesorios.json')
.then(response => response.json())
.then(data => {
  // Cuando se completa la carga del JSON, generamos la lista en el HTML
  const celularesList = document.getElementById('celulares-list');

  data.forEach(celular => {
    // Creamos un elemento li para cada celular y lo añadimos a la lista
    const listItem = document.createElement('li');
    listItem.innerHTML = `
      <div class="celular-item">
        <img src="${celular.imagen}" alt="${celular.nombre}">
        <strong>${celular.nombre}</strong> - Marca: ${celular.marca}, Precio: $${celular.precio}
        <button class="add-to-cart-btn">Añadir al Carrito</button>
      </div>`;
    celularesList.appendChild(listItem);
  });
})
.catch(error => {
  console.error('Error al cargar el archivo JSON:', error);
});

// carrito
const carrito = document.getElementById("carrito");
const lista = document.querySelector("#lista-carrito tbody");
const vaciarCarritoBtn = document.getElementById("vaciar-carrito");

cargarEventListeners();

function cargarEventListeners() {
    document.addEventListener("click", function (e) {
        if (e.target.classList.contains("add-to-cart-btn")) {
            e.preventDefault(); // Evitar la acción por defecto del enlace
            const producto = obtenerInformacionProducto(e.target);
            agregarAlCarrito(producto);
        }
    });

    carrito.addEventListener("click", eliminarElemento);
    vaciarCarritoBtn.addEventListener("click", vaciarCarrito);

    // Cargar elementos del carrito desde localStorage al cargar la página
    document.addEventListener("DOMContentLoaded", cargarCarrito);
}

function obtenerInformacionProducto(btn) {
    const item = btn.parentElement;
    const imagen = item.querySelector("img").src;
    const titulo = item.querySelector("strong").textContent;
    const precio = parseFloat(item.querySelector(".celular-item strong").textContent.replace('$', ''));
    const id = titulo;

    return { imagen, titulo, precio, id };
}

function agregarAlCarrito(producto) {
    const existente = Array.from(lista.children).find((row) => {
        return row.querySelector(".borrar").getAttribute("data-id") === producto.id;
    });

    if (existente) {
        // Si ya existe, mostrar mensaje o tomar otra acción (no se está agregando más de uno del mismo producto)
        console.log('Este producto ya está en el carrito.');
    } else {
        // Si no existe, lo agregamos al array
        insertarCarrito(producto);
        guardarElementoLocalStorage(producto);
    }
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
        <td class="cantidad">
            1
        </td>
        <td>
            <a href="#" class="borrar" data-id="${elemento.id}">Borrar</a>
        </td>
    `;

    lista.appendChild(row);
}

function eliminarElemento(e) {
    e.preventDefault();

    if (e.target.classList.contains("borrar")) {
        const elementoId = e.target.getAttribute("data-id");

        // Eliminar elemento del localStorage
        eliminarElementoLocalStorage(elementoId);

        // Eliminar el elemento del DOM
        const row = e.target.parentElement.parentElement;
        const cantidadElemento = row.querySelector(".cantidad");
        if (cantidadElemento && parseInt(cantidadElemento.textContent) > 1) {
            actualizarCantidad(elementoId, parseInt(cantidadElemento.textContent) - 1);
        } else {
            row.remove();
        }
    }
}

function vaciarCarrito() {
    // Vaciar la lista en el DOM
    while (lista.firstChild) {
        lista.removeChild(lista.firstChild);
    }

    // Vaciar localStorage
    localStorage.removeItem("elementos");

    return false;
}

function cargarCarrito() {
    const carritoLS = obtenerElementosLocalStorage();
    carritoLS.forEach((elemento) => insertarCarrito(elemento));
}

function guardarElementoLocalStorage(elemento) {
    let elementos = obtenerElementosLocalStorage();

    const existente = elementos.find((el) => el.id === elemento.id);

    if (existente) {
        existente.cantidad++;
    } else {
        elemento.cantidad = 1;
        elementos.push(elemento);
    }

    localStorage.setItem("elementos", JSON.stringify(elementos));
}

function obtenerElementosLocalStorage() {
    let elementos;

    if (localStorage.getItem("elementos") === null) {
        elementos = [];
    } else {
        elementos = JSON.parse(localStorage.getItem("elementos"));
    }

    return elementos;
}

function eliminarElementoLocalStorage(id) {
    let elementos = obtenerElementosLocalStorage();

    elementos = elementos.filter((elemento) => elemento.id !== id);

    localStorage.setItem("elementos", JSON.stringify(elementos));
}

function actualizarCantidad(id, nuevaCantidad) {
    const elementoExistente = Array.from(lista.children).find((row) => {
        return row.querySelector(".borrar").getAttribute("data-id") === id;
    });

    if (elementoExistente) {
        const cantidadElemento = elementoExistente.querySelector(".cantidad");
        cantidadElemento.textContent = nuevaCantidad;
        actualizarCantidadLocalStorage(id, nuevaCantidad);
    }
}

function actualizarCantidadLocalStorage(id, nuevaCantidad) {
    let elementos = obtenerElementosLocalStorage();
    const elementoExistente = elementos.find((el) => el.id === id);

    if (elementoExistente) {
        elementoExistente.cantidad = nuevaCantidad;
        localStorage.setItem("elementos", JSON.stringify(elementos));
    }
}




