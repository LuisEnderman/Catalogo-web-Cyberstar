export let carrito = [];

export function toggleCarrito() {
    const panel = document.getElementById("panel-carrito");
    if (panel) {
        panel.classList.toggle("abierto");
    }
}

export function agregarAlCarrito(producto, talla, color, diseno) {
    const itemPedido = {
        idUnico: Date.now(), // ID único para poder borrar el producto exacto
        idProducto: producto.id,
        nombre: producto.nombre,
        precio: producto.precio,
        imagen: producto.imagen,
        especificacionValor: talla,
        color: color,
        diseno: diseno
    };
    carrito.push(itemPedido);
    actualizarInterfazCarrito();
}

export function eliminarDelCarrito(idUnico) {
    carrito = carrito.filter(item => item.idUnico !== idUnico);
    actualizarInterfazCarrito();
}

export function actualizarInterfazCarrito() {
    const contenedorItems = document.getElementById("items-carrito");
    const contador = document.getElementById("contador-carrito");
    const totalContenedor = document.getElementById("total-carrito");
    
    if (!contenedorItems) return;

    // Limpiar contenedor antes de renderizar
    contenedorItems.innerHTML = "";
    
    let total = 0;

    carrito.forEach(item => {
        total += item.precio;
        
        const divItem = document.createElement("div");
        divItem.classList.add("item-carrito-render");
        divItem.style.display = "flex";
        divItem.style.gap = "15px";
        divItem.style.alignItems = "center";
        divItem.style.marginBottom = "15px";
        divItem.style.borderBottom = "1px solid var(--color-gris-claro)";
        divItem.style.paddingBottom = "10px";

        divItem.innerHTML = `
            <img src="${item.imagen}" style="width: 60px; height: 60px; object-fit: contain; background: var(--color-gris-claro);">
            <div style="flex: 1;">
                <h4 style="font-size: 0.9rem; text-transform: uppercase; margin: 0;">${item.nombre}</h4>
                <p style="font-size: 0.8rem; color: var(--color-gris-oscuro); margin: 3px 0;">
                    ${item.especificacionValor} | ${item.color}<br>
                    <span style="color: var(--color-texto); font-weight: bold;">Estampado: ${item.diseno}</span>
                </p>
                <span style="font-weight: 700; font-size: 0.9rem;">$${item.precio.toFixed(2)}</span>
            </div>
            <button class="btn-eliminar-item" data-id="${item.idUnico}" style="background: none; border: none; color: red; cursor: pointer; font-size: 1.1rem;">
                <i class="fas fa-trash-alt"></i>
            </button>
        `;

        contenedorItems.appendChild(divItem);
    });

    // Actualizar los números de la interfaz (Contador y Total)
    if (contador) contador.textContent = carrito.length;
    if (totalContenedor) totalContenedor.textContent = `$${total.toFixed(2)}`;

    // Añadir eventos para borrar artículos
    document.querySelectorAll(".btn-eliminar-item").forEach(boton => {
        boton.onclick = (e) => {
            const idParaBorrar = parseInt(e.currentTarget.getAttribute("data-id"));
            eliminarDelCarrito(idParaBorrar);
        };
    });
}

export function enviarCarritoWhatsApp() {
    if (carrito.length === 0) {
        alert("Tu pedido está vacío. Añade algún producto antes de enviar.");
        return;
    }

    let telefono = "584125129119"; // Tu número de Cyber Star
    let mensaje = `⚡ *NUEVO PEDIDO - CYBER STAR* ⚡\n\n`;
    let total = 0;

    carrito.forEach((item, index) => {
        total += item.precio;
        mensaje += `*${index + 1}. ${item.nombre.toUpperCase()}* - $${item.precio.toFixed(2)}\n`;
        mensaje += `   • Opción/Talla: ${item.especificacionValor}\n`;
        mensaje += `   • Color: ${item.color}\n`;
        mensaje += `   • Diseño: ${item.diseno}\n`;
        
        // ⚡ AQUÍ ESTÁ EL PLAN B: SI ES PERSONALIZADO, LE METE LA ADVERTENCIA AL MENSAJE EN WA
        if (item.diseno === "Personalizado a tu gusto") {
            mensaje += `   ↳ 📸 *[POR FAVOR, ADJUNTA TU FOTO DE REFERENCIA EN EL SIGUIENTE MENSAJE]*\n`;
        }
        mensaje += `\n`;
    });

    mensaje += `-----------------------------\n`;
    mensaje += `💰 *TOTAL ESTIMADO:* $${total.toFixed(2)}\n\n`;
    mensaje += `Espero tu confirmación con los datos de pago para procesar la orden. ¡Fino!`;

    // Codificar el texto para la URL de WhatsApp
    const mensajeCodificado = encodeURIComponent(mensaje);
    const urlWhatsApp = `https://wa.me/${telefono}?text=${mensajeCodificado}`;

    // Abrir el chat en una pestaña nueva
    window.open(urlWhatsApp, "_blank");
}

// Hacer las funciones disponibles para eventos onclick antiguos en el HTML global
window.toggleCarrito = toggleCarrito;
window.enviarCarritoWhatsApp = enviarCarritoWhatsApp;