import { productos } from './productos.js';
import { toggleCarrito, enviarCarritoWhatsApp } from './carrito.js';

const contenedorCatalogo = document.getElementById("catalogo");

// ⚡ ESTADO GLOBAL DE LOS FILTROS COMBINADOS
let categoriaActiva = "todos";
let estiloActivo = "todos";

// 1. RENDERIZAR GRILLA PRINCIPAL FILTRADA
function filtrarYMostrarProductos() {
    if (!contenedorCatalogo) return;
    contenedorCatalogo.innerHTML = "";
    
    // Filtrado inteligente combinado
    const productosFiltrados = productos.filter(p => {
        const cumpleCategoria = (categoriaActiva === "todos" || p.categoria.toLowerCase() === categoriaActiva);
        
        // Verifica si el array de estilos del producto contiene la cápsula seleccionada
        const cumpleEstilo = (estiloActivo === "todos" || (p.estilos && p.estilos.map(e => e.toLowerCase()).includes(estiloActivo)));
        
        return cumpleCategoria && cumpleEstilo;
    });

    // Si no hay productos que coincidan con ambos filtros
    if (productosFiltrados.length === 0) {
        contenedorCatalogo.innerHTML = `
            <p style="grid-column: 1/-1; text-align: center; color: var(--color-gris-oscuro); padding: 50px 0; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 1px;">
                No hay productos en esta cápsula actualmente.
            </p>
        `;
        return;
    }

    // Dibujar las tarjetas filtradas
    productosFiltrados.forEach(producto => {
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
                <button class="btn-ir-producto btn-whatsapp" data-id="${producto.id}" style="border:none; cursor:pointer; width:100%;">
                    ${producto.personalizable ? "Personalizar y Pedir" : "Ver detalles"}
                </button>
            </div>
        `;
        contenedorCatalogo.appendChild(tarjeta);
    });
}

// 2. CONFIGURAR ESCUCHADORES DE CLIC PARA LOS FILTROS
function inicializarFiltros() {
    
    // Lógica para abrir/cerrar el menú oculto de cápsulas
    const btnToggle = document.getElementById("btn-toggle-filtros");
    const panelFiltros = document.getElementById("panel-micro-filtros");
    
    if (btnToggle && panelFiltros) {
        btnToggle.addEventListener("click", () => {
            panelFiltros.classList.toggle("abierto");
            
            const icono = btnToggle.querySelector("i");
            if (panelFiltros.classList.contains("abierto")) {
                icono.className = "fas fa-times"; // Icono de equis para cerrar
            } else {
                icono.className = "fas fa-sliders-h"; // Icono original
            }
        });
    }

    // Escuchar botones de Categorías Principales
    document.querySelectorAll(".btn-filtro").forEach(btn => {
        btn.addEventListener("click", (e) => {
            document.querySelectorAll(".btn-filtro").forEach(b => b.classList.remove("activo"));
            btn.classList.add("activo");
            
            categoriaActiva = btn.getAttribute("data-categoria").toLowerCase();
            filtrarYMostrarProductos();
        });
    });

    // Escuchar microbotones de Cápsulas Estéticas
    document.querySelectorAll(".btn-micro-filtro").forEach(btn => {
        btn.addEventListener("click", (e) => {
            document.querySelectorAll(".btn-micro-filtro").forEach(b => b.classList.remove("activo-micro"));
            btn.classList.add("activo-micro");
            
            estiloActivo = btn.getAttribute("data-estilo").toLowerCase();
            filtrarYMostrarProductos();
        });
    });
}

// 3. CAPTURAR EL CLIC EN LA TARJETA PARA REDIRIGIR A PRODUCTO.HTML
if (contenedorCatalogo) {
    contenedorCatalogo.addEventListener("click", (e) => {
        // Captura con exactitud el botón sin importar en qué pixel se haga clic
        const boton = e.target.closest(".btn-ir-producto");
        
        if (boton) {
            const id = boton.getAttribute("data-id");
            localStorage.setItem("productoSeleccionadoId", id);
            window.location.href = "producto.html";
        }
    });
}

// Hacer las funciones del carrito visibles para los botones onclick del index.html
window.toggleCarrito = toggleCarrito;
window.enviarCarritoWhatsApp = enviarCarritoWhatsApp;

// 4. CORRER TODO AL CARGAR EL CONTENIDO
document.addEventListener("DOMContentLoaded", () => {
    filtrarYMostrarProductos(); // Renderiza la tienda completa al inicio
    inicializarFiltros();       // Activa los clics de los dos menús de filtrado
});