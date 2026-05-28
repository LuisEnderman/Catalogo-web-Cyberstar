// 1. BASE DE DATOS AMPLIADA
const productos = [
    {
        id: 1,
        nombre: "Franela Oversize",
        precio: 14.00,
        categoria: "streetwear",
        imagen: "Recursos/Franelas/Oversize-1.png",
        personalizable: false,
        tipoEspecificacion: "tallas",
        tallas: ["S", "M", "L", "XL"],
        // Lista de colores (puedes poner códigos HEX o nombres)
        colores: [
            { nombre: "Negro", hex: "#111111" },
            { nombre: "Blanco", hex: "#ffffff" },
            { nombre: "Gris", hex: "#888888" }
        ],
        // Fotos reales de tus diseños de sublimación/estampado
        disenos: [
            { nombre: "Cyber pool", img: "Recursos/Franelas/oversize-pool.webp" },
            { nombre: "Como antes, como siempre, como nunca", img: "Recursos/Franelas/akapellah.webp" },
            { nombre: "Money for peace", img: "Recursos/Franelas/oversize-1.png" }
        ]
    },
    {
        id: 2,
        nombre: "Franela Personalizada",
        precio: 14.00,
        categoria: "streetwear",
        imagen: "Recursos/Franelas/oversize.webp",
        personalizable: true,
        tipoEspecificacion: "tallas",
        tallas: ["S", "M", "L", "XL"],
        // Lista de colores (puedes poner códigos HEX o nombres)
        colores: [
            { nombre: "Negro", hex: "#111111" },
            { nombre: "Blanco", hex: "#ffffff" },
            { nombre: "Gris", hex: "#888888" }
        ],
        // Fotos reales de tus diseños de sublimación/estampado
        disenos: [
            { nombre: "Personalizada a tu gusto", img: "Recursos/Franelas/oversize-pool.webp" },
        ]
    },
    {
        id: 3,
        nombre: "Taza Cerámica Blanca",
        precio: 6.00,
        categoria: "tazas",
        imagen: "Recursos/Tazas/taza-blanca.png",
        personalizable: true,
        tipoEspecificacion: "tallas",
        tallas: [],
        colores: [{ nombre: "Blanco", hex: "#ffffff" }],
        disenos: [
            { nombre: "Pixel Art", img: "Recursos/Tazas/diseno1.jpg" },
            { nombre: "Code Coffee", img: "Recursos/Tazas/diseno4.jpg" }
        ]
    },
     {
        id: 4,
        nombre: "Llavero Metálico",
        precio: 3.50,
        categoria: "accesorios",
        imagen: "Recursos/Accesorios/llavero-metalico-circular.png",
        personalizable: true,
        tipoEspecificacion: "Forma", // <-- Volvemos a usar "Forma"
        tallas: ["Chapa Militar", "Rectangulo", "Circular"], // <-- Sus formas disponibles
        colores: [{ nombre: "Blanco", hex: "#ffffff" },
                { nombre: "plata", hex: "#C0C0C0" }],
        disenos: [
            { nombre: "Personalizado", img: "Recursos/Accesorios/llavero-metalico-rectangulo.png" },
        ]
    },
    {
        id: 5,
        nombre: "Mousepad",
        precio: 3.50,
        categoria: "accesorios",
        imagen: "Recursos/Accesorios/mousepad.png",
        personalizable: true,
        tipoEspecificacion: "Forma", // <-- Aquí le decimos qué palabra usar
        tallas: ["Rectangular", "Circular"], // <-- Aquí metemos las formas
        colores: [{ nombre: "Negro", hex: "#111111" }],
        disenos: [
            { nombre: "Vector Cyberpunk", img: "Recursos/Accesorios/diseno1.jpg" }
        ]
    },
    {
        id: 6,
        nombre: "Llavero MDF",
        precio: 3.50,
        categoria: "accesorios",
        imagen: "Recursos/Accesorios/llavero-mdf.webp",
        personalizable: true,
        tipoEspecificacion: "Forma", // <-- Volvemos a usar "Forma"
        tallas: ["Corazón", "Cuadrado", "Circular"], // <-- Sus formas disponibles
        colores: [{ nombre: "Transparente", hex: "#e2e2e2" }],
        disenos: [
            { nombre: "Logo Cyber Star", img: "Recursos/Accesorios/diseno2.jpg" }
        ]
    },
];  

const contenedorCatalogo = document.getElementById("catalogo");
const botonesFiltro = document.querySelectorAll(".btn-filtro");
const NUMERO_WHATSAPP = "584125129119"; // Reemplaza con tu número real

// Variables globales para rastrear lo que elige el usuario en el modal
let disenoSeleccionado = "";
let colorSeleccionado = "";
let tallaSeleccionada = "";
let productoActual = null;

// 2. RENDERIZAR GRILLA PRINCIPAL
function mostrarProductos(listaProductos) {
    contenedorCatalogo.innerHTML = "";
    
    listaProductos.forEach(producto => {
        const tarjeta = document.createElement("div");
        tarjeta.classList.add("tarjeta-producto");
        
        tarjeta.innerHTML = `
            <div class="imagen-contenedor">
                <img src="${producto.imagen}" alt="${producto.nombre}">
                ${producto.personalizable ? `<span class="tag-personalizable">Personalizable</span>` : ''}
            </div>
            <div class="info-producto">
                <h3>${producto.nombre}</h3>
                <p class="precio">$${producto.precio.toFixed(2)}</p>
                <button onclick="abrirPersonalizacion(${producto.id})" class="btn-whatsapp" style="border:none; cursor:pointer;">
                    ${producto.personalizable ? "Personalizar y Pedir" : "Ver diseños en stock"}
                </button>
            </div>
        `;
        contenedorCatalogo.appendChild(tarjeta);
    });
}

// Variable global: Nuestro arreglo dinámico para el carrito (Como una lista en C)
let carrito = [];

function abrirPersonalizacion(id) {
    productoActual = productos.find(p => p.id === id);
    if (!productoActual) return;

    disenoSeleccionado = "No seleccionado";
    colorSeleccionado = "No seleccionado";
    tallaSeleccionada = productoActual.tallas.length > 0 ? productoActual.tallas[0] : "No aplica";

    document.getElementById("modal-producto-nombre").textContent = productoActual.nombre;
    document.getElementById("modal-producto-precio").textContent = `$${productoActual.precio.toFixed(2)}`;
    document.getElementById("resumen-diseno").textContent = disenoSeleccionado;
    document.getElementById("resumen-color").textContent = colorSeleccionado;

    // --- CARGAR GALERÍA DE DISEÑOS ---
    const contenedorDisenos = document.getElementById("galeria-disenos");
    contenedorDisenos.innerHTML = "";
    productoActual.disenos.forEach(d => {
        const item = document.createElement("div");
        item.classList.add("item-diseno");
        item.innerHTML = `<img src="${d.img}" alt="${d.nombre}">`;
        item.onclick = () => {
            document.querySelectorAll(".item-diseno").forEach(i => i.classList.remove("seleccionado"));
            item.classList.add("seleccionado");
            disenoSeleccionado = d.nombre;
            document.getElementById("resumen-diseno").textContent = d.nombre;
        };
        contenedorDisenos.appendChild(item);
    });

    // --- CARGAR SELECTOR DE COLORES ---
    const contenedorColores = document.getElementById("selector-colores");
    contenedorColores.innerHTML = "";
    productoActual.colores.forEach(c => {
        const circulo = document.createElement("div");
        circulo.classList.add("circulo-color");
        circulo.style.backgroundColor = c.hex;
        circulo.onclick = () => {
            document.querySelectorAll(".circulo-color").forEach(cir => cir.classList.remove("seleccionado"));
            circulo.classList.add("seleccionado");
            colorSeleccionado = c.nombre;
            document.getElementById("resumen-color").textContent = c.nombre;
        };
        contenedorColores.appendChild(circulo);
    });

    // --- CARGAR TALLAS O FORMAS ---
    const contenedorTallas = document.getElementById("contenedor-tallas-modal");
    contenedorTallas.innerHTML = "";
    if (productoActual.tallas.length > 0) {
        const etiquetaEtiqueta = productoActual.tipoEspecificacion ? productoActual.tipoEspecificacion : "Talla";
        let html = `<label>Selecciona tu ${etiquetaEtiqueta}:</label><select id="talla-modal" onchange="tallaSeleccionada=this.value">`;
        productoActual.tallas.forEach(t => html += `<option value="${t}">${t}</option>`);
        html += `</select>`;
        contenedorTallas.innerHTML = html;
    }

    // CAMBIO AQUÍ: El botón ahora ejecuta la función para guardar en el carrito
    document.getElementById("btn-confirmar-pedido").textContent = "AÑADIR AL PEDIDO";

    document.getElementById("modal-personalizar").style.display = "flex";
}

function cerrarModal() {
    document.getElementById("modal-personalizar").style.display = "none";
}

// ================= LÓGICA DEL CARRITO DE COMPRAS =================

// Función para abrir/cerrar el panel lateral
function toggleCarrito() {
    const panel = document.getElementById("panel-carrito");
    panel.classList.toggle("abierto");
}

// Función para insertar un producto en la lista del carrito
function agregarAlCarrito() {
    if ((productoActual.disenos.length > 0 && disenoSeleccionado === "No seleccionado") || 
        (productoActual.colores.length > 0 && colorSeleccionado === "No seleccionado")) {
        alert("Por favor, selecciona un diseño y un color antes de continuar.");
        return;
    }

    const etiquetaEtiqueta = productoActual.tipoEspecificacion ? productoActual.tipoEspecificacion : "Talla";

    // Creamos un nuevo objeto con las elecciones específicas del cliente
    const itemPedido = {
        idUnico: Date.now(), // Genera un ID por tiempo (como un índice único) para poder borrarlo después
        nombre: productoActual.nombre,
        precio: productoActual.precio,
        imagen: productoActual.imagen,
        especificacionTipo: etiquetaEtiqueta,
        especificacionValor: tallaSeleccionada,
        color: colorSeleccionado,
        diseno: disenoSeleccionado
    };

    // Hacemos el "append" al arreglo global
    carrito.push(itemPedido);

    // Cerramos ventana de personalización, actualizamos el carrito visual y lo abrimos
    cerrarModal();
    actualizarInterfazCarrito();
    document.getElementById("panel-carrito").classList.add("abierto");
}

// Refresca la lista visual del carrito en el HTML
function actualizarInterfazCarrito() {
    const contenedorItems = document.getElementById("items-carrito");
    const contador = document.getElementById("contador-carrito");
    const totalElemento = document.getElementById("total-carrito");

    contenedorItems.innerHTML = "";
    let total = 0;

    // Recorremos el carrito para dibujar los elementos en el panel lateral
    carrito.forEach(item => {
        total += item.precio;
        
        const divItem = document.createElement("div");
        divItem.classList.add("item-en-carrito");
        divItem.innerHTML = `
            <img src="${item.imagen}" alt="${item.nombre}">
            <div class="item-carrito-info">
                <h4>${item.nombre}</h4>
                <p><b>Precio:</b> $${item.precio.toFixed(2)}</p>
                ${item.especificacionValor !== "No aplica" ? `<p><b>${item.especificacionTipo}:</b> ${item.especificacionValor}</p>` : ""}
                <p><b>Color:</b> ${item.color} | <b>Diseño:</b> ${item.diseno}</p>
            </div>
            <button onclick="eliminarDelCarrito(${item.idUnico})" class="btn-eliminar-item">
                <i class="fas fa-trash"></i>
            </button>
        `;
        contenedorItems.appendChild(divItem);
    });

    // Actualizamos los contadores de la barra superior
    contador.textContent = carrito.length;
    totalElemento.textContent = `$${total.toFixed(2)}`;
}

// Función para remover un artículo (Como liberar memoria o borrar nodo en C)
function eliminarDelCarrito(idUnico) {
    carrito = carrito.filter(item => item.idUnico !== idUnico);
    actualizarInterfazCarrito();
}

// CONCATENAR TODO EL CARRITO EN UN SOLO MENSAJE DE WHATSAPP
function enviarCarritoWhatsApp() {
    if (carrito.length === 0) {
        alert("Tu carrito está vacío.");
        return;
    }

    let mensaje = `🔥 *NUEVO PEDIDO - CYBER STAR* 🔥\n`;
    mensaje += `Hola! Quiero encargar los siguientes artículos de mi carrito:\n\n`;
    
    let total = 0;

    // Ciclo para escribir ordenadamente cada producto acumulado
    carrito.forEach((item, index) => {
        total += item.precio;
        mensaje += `*${index + 1}. ${item.nombre}* 🛒\n`;
        if (item.especificacionValor !== "No aplica") {
            mensaje += `  • ${item.especificacionTipo}: ${item.especificacionValor}\n`;
        }
        mensaje += `  • Color Prenda: ${item.color}\n`;
        mensaje += `  • Diseño Elegido: ${item.diseno}\n`;
        mensaje += `  • Precio: $${item.precio.toFixed(2)}\n\n`;
    });

    mensaje += `---------------------------\n`;
    mensaje += `💰 *TOTAL ESTIMADO:* $${total.toFixed(2)}\n\n`;
    mensaje += `¿Me podrían confirmar disponibilidad para gestionar el pago?`;

    const mensajeCodificado = encodeURIComponent(mensaje);
    window.open(`https://wa.me/${NUMERO_WHATSAPP}?text=${mensajeCodificado}`, '_blank');
}

// FILTROS (Mantenemos la misma lógica previa)
botonesFiltro.forEach(boton => {
    boton.addEventListener("click", (e) => {
        botonesFiltro.forEach(b => b.classList.remove("activo"));
        e.target.classList.add("activo");
        const cat = e.target.textContent.toLowerCase();
        if (cat === "todos") mostrarProductos(productos);
        else mostrarProductos(productos.filter(p => p.categoria === cat));
    });
});

mostrarProductos(productos);

// ========================================================
// HERRAMIENTA ADMINISTRADOR: GENERADOR AUTOMÁTICO DE CÓDIGO
// ========================================================
function generarCodigoProducto(event) {
    event.preventDefault(); // Evita que la página se recargue

    const nombre = document.getElementById("admin-nombre").value;
    const precio = parseFloat(document.getElementById("admin-precio").value);
    const categoria = document.getElementById("admin-categoria").value;
    const tipoEspec = document.getElementById("admin-tipo-espec").value;
    const imagen = document.getElementById("admin-imagen").value;
    
    // Procesar las tallas o formas (las separa por comas y quita espacios en blanco)
    const valoresInput = document.getElementById("admin-valores-espec").value;
    const tallasArray = valoresInput ? valoresInput.split(",").map(v => v.trim()) : [];

    // Procesar los diseños en stock desde las líneas del cuadro de texto
    const disenosInput = document.getElementById("admin-disenos").value.trim();
    const disenosArray = [];
    if (disenosInput) {
        const lineas = disenosInput.split("\n");
        lineas.forEach(linea => {
            const partes = linea.split(":");
            if (partes.length === 2) {
                disenosArray.push({
                    nombre: partes[0].trim(),
                    img: partes[1].trim()
                });
            }
        });
    }

    // Estructura por defecto para colores (puedes expandir esto luego si lo deseas)
    const coloresPredeterminados = [
        { nombre: "Negro", hex: "#111111" },
        { nombre: "Blanco", hex: "#ffffff" },
        { nombre: "Gris", hex: "#888888" }
    ];

    // Construimos el objeto final formateado de forma idéntica a tus structs
    const nuevoProductoObjeto = {
        id: Date.now(), // ID único autogenerado
        nombre: nombre,
        precio: precio,
        categoria: categoria,
        imagen: imagen,
        personalizable: true,
        tipoEspecificacion: tipoEspec ? tipoEspec : undefined,
        tallas: tallasArray,
        colores: coloresPredeterminados,
        disenos: disenosArray
    };

    // Convertimos el objeto a texto formateado limpio
    const codigoFormateado = ",\n" + JSON.stringify(nuevoProductoObjeto, null, 4);

    // Mostramos el resultado en la caja verde
    const txtArea = document.getElementById("output-codigo");
    txtArea.value = codigoFormateado;
    document.getElementById("contenedor-resultado-admin").style.display = "block";
    
    // Auto-selecciona el texto para que solo tengas que presionar Ctrl+C
    txtArea.select();
}

// ========================================================
// ACTIVADOR SECRETO DEL PANEL DE ADMINISTRACIÓN
// ========================================================
function verificarAccesoAdmin() {
    // Leemos los parámetros de la URL (lo que va después del signo ?)
    const parametros = new URLSearchParams(window.location.search);
    
    // Si la URL contiene '?admin=cyberstar', mostramos el panel
    if (parametros.get('admin') === 'cyberstar') {
        const panel = document.getElementById("panel-admin");
        if (panel) {
            panel.style.display = "block";
        }
    }
}

// Ejecutamos la verificación apenas cargue la página
verificarAccesoAdmin();