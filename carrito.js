let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

function guardarCarrito() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

function agregarAlCarrito(nombre, precio, imagen) {
    if (!imagen) {
        imagen = "img/OIP.webp";
    }

    const productoExistente = carrito.find(p => p.nombre === nombre);

    if (productoExistente) {
        productoExistente.cantidad++;
        productoExistente.imagen = imagen;
    } else {
        carrito.push({
            nombre: nombre,
            precio: Number(precio),
            imagen: imagen,
            cantidad: 1
        });
    }

    guardarCarrito();
    actualizarContador();
    alert("✅ Producto agregado al carrito");
}

function actualizarContador() {
    const contador = document.getElementById("contador");
    if (!contador) return;

    let cantidad = 0;
    carrito.forEach(p => {
        cantidad += Number(p.cantidad) || 0;
    });

    contador.textContent = cantidad;
}

function mostrarCarrito() {
    const lista = document.getElementById("lista-carrito");
    if (!lista) return;

    let total = 0;

    if (carrito.length === 0) {
        lista.innerHTML = `
            <div class="text-center py-5 text-muted fs-5">
                🛒<br><br>Tu carrito está vacío.<br><br>¡Ve al catálogo y agrega tus productos!
            </div>
        `;
        const totalEl = document.getElementById("total");
        if (totalEl) totalEl.textContent = "0";
        return;
    }

    lista.innerHTML = "";
    carrito.forEach((producto, indice) => {
        const precio = Number(producto.precio) || 0;
        const cantidad = Number(producto.cantidad) || 1;
        const subtotal = precio * cantidad;
        total += subtotal;

        let imagen = producto.imagen || "img/OIP.webp";

        lista.innerHTML += `
            <div class="d-flex align-items-center gap-3 p-3 border rounded-3 bg-white shadow-sm flex-wrap">
                <img src="${imagen}" style="width:100px; height:120px; object-fit:cover;" class="rounded" onerror="this.src='img/OIP.webp';">
                <div class="flex-grow-1">
                    <h5 class="mb-1">${producto.nombre}</h5>
                    <p class="mb-1 text-muted">Precio: $${precio.toLocaleString("es-CO")}</p>
                    <p class="mb-0 fw-bold">Subtotal: $${subtotal.toLocaleString("es-CO")}</p>
                </div>
                <div class="d-flex align-items-center gap-2">
                    <button class="btn btn-sm btn-dark px-3" onclick="restar(${indice})">-</button>
                    <span class="fw-bold px-2">${cantidad}</span>
                    <button class="btn btn-sm btn-dark px-3" onclick="sumar(${indice})">+</button>
                </div>
                <button class="btn btn-outline-danger btn-sm ms-auto" onclick="eliminarProducto(${indice})">🗑 Eliminar</button>
            </div>
        `;
    });

    const totalEl = document.getElementById("total");
    if (totalEl) totalEl.textContent = total.toLocaleString("es-CO");
}

function sumar(indice) {
    if (!carrito[indice]) return;
    carrito[indice].cantidad++;
    actualizarTodo();
}

function restar(indice) {
    if (!carrito[indice]) return;
    if (carrito[indice].cantidad > 1) {
        carrito[indice].cantidad--;
    } else {
        carrito.splice(indice, 1);
    }
    actualizarTodo();
}

function eliminarProducto(indice) {
    if (!carrito[indice]) return;
    carrito.splice(indice, 1);
    actualizarTodo();
}

function vaciarCarrito() {
    if (carrito.length === 0) return;
    if (confirm("¿Seguro que quieres vaciar el carrito?")) {
        carrito = [];
        actualizarTodo();
    }
}

function actualizarTodo() {
    guardarCarrito();
    actualizarContador();
    mostrarCarrito();
}

function enviarWhatsApp() {
    if (carrito.length === 0) {
        alert("🛒 Tu carrito está vacío.");
        return;
    }

    let mensaje = "Hola, Moda y Estilo. 👗✨\n\nQuiero realizar el siguiente pedido:\n\n";
    let total = 0;

    carrito.forEach(producto => {
        const precio = Number(producto.precio) || 0;
        const cantidad = Number(producto.cantidad) || 1;
        const subtotal = precio * cantidad;
        total += subtotal;

        mensaje += "👗 " + producto.nombre + "\n" +
                   "Cantidad: " + cantidad + "\n" +
                   "Precio: $" + precio.toLocaleString("es-CO") + "\n" +
                   "Subtotal: $" + subtotal.toLocaleString("es-CO") + "\n\n";
    });

    mensaje += "💰 TOTAL: $" + total.toLocaleString("es-CO") + "\n\nQuedo pendiente de la confirmación del pedido. 😊";

    const telefono = "573164813861";
    const url = "https://wa.me/" + telefono + "?text=" + encodeURIComponent(mensaje);

    window.open(url, "_blank");
}

document.addEventListener("DOMContentLoaded", function() {
    actualizarContador();
    mostrarCarrito();
});