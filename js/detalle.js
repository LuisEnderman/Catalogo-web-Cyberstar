import { productos } from './productos.js';
import { agregarAlCarrito, toggleCarrito } from './carrito.js';

// Variables globales para la página de detalle
let productoActual = null;
let disenoSeleccionado = "No seleccionado";
let colorSeleccionado = "No seleccionado";
let tallaSeleccionada = "";
let referenciaSeleccionada = "Tengo una foto de referencia de Pinterest/Instagram"; // Estado inicial del asistente

// 1. OBTENER EL PRODUCTO SELECCIONADO
function cargarDetalleProducto() {
    const idGuardado = localStorage.getItem("productoSeleccionadoId");
    if (!idGuardado) {
        window.location.href = "index.html";
        return;
    }

    productoActual = productos.find(p => p.id === parseInt(idGuardado));
    if (!productoActual) {
        window.location.href = "index.html";
        return;
    }

    tallaSeleccionada = productoActual.tallas.length > 0 ? productoActual.tallas[0] : "No aplica";
    renderizarInterfazDetalle();
}

// 2. INYECTAR LA INFORMACIÓN EN EL HTML DE DETALLE
function renderizarInterfazDetalle() {
    document.getElementById("detalle-imagen").src = productoActual.imagen;
    document.getElementById("detalle-imagen").alt = productoActual.nombre;
    document.getElementById("detalle-nombre").textContent = productoActual.nombre;
    document.getElementById("detalle-precio").textContent = `$${productoActual.precio.toFixed(2)}`;

    // --- CARGAR GALERÍA DE DISEÑOS EN STOCK ---
    const contenedorDisenos = document.getElementById("detalle-galeria-disenos");
    contenedorDisenos.innerHTML = "";
    
    if (productoActual.personalizable) {
        document.getElementById("seccion-disenos").style.display = "none";
        disenoSeleccionado = "Personalizado a tu gusto";
        document.getElementById("resumen-diseno").textContent = "Personalizado";
    } 
    else if (productoActual.disenos && productoActual.disenos.length > 0) {
        document.getElementById("seccion-disenos").style.display = "block";
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
    } 
    else {
        document.getElementById("seccion-disenos").style.display = "none";
        disenoSeleccionado = "No aplica";
        document.getElementById("resumen-diseno").textContent = "No aplica";
    }

    // --- CARGAR SELECTOR DE COLORES ---
    const contenedorColores = document.getElementById("detalle-selector-colores");
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

            if (productoActual.imagenesPorColor && productoActual.imagenesPorColor[c.nombre]) {
                document.getElementById("detalle-imagen").src = productoActual.imagenesPorColor[c.nombre];
            }
        };
        contenedorColores.appendChild(circulo);
    });

    // --- CARGAR TALLAS O FORMAS ---
    const contenedorTallas = document.getElementById("detalle-contenedor-tallas");
    contenedorTallas.innerHTML = "";
    
    if (productoActual.tallas.length > 0) {
        const etiquetaEtiqueta = productoActual.tipoEspecificacion ? productoActual.tipoEspecificacion : "Talla";
        
        let html = `<label>Selecciona tu ${etiquetaEtiqueta}:</label>
                    <select id="talla-detalle" class="select-urbano">`;
        
        productoActual.tallas.forEach(t => {
            html += `<option value="${t}">${t}</option>`;
        });
        html += `</select>`;
        
        contenedorTallas.innerHTML = html;

        document.getElementById("talla-detalle").onchange = (e) => {
            const valorElegido = e.target.value;
            tallaSeleccionada = valorElegido;

            if (productoActual.imagenesPorForma && productoActual.imagenesPorForma[valorElegido]) {
                document.getElementById("detalle-imagen").src = productoActual.imagenesPorForma[valorElegido];
            }
        };

        const primerValor = productoActual.tallas[0];
        if (productoActual.imagenesPorForma && productoActual.imagenesPorForma[primerValor]) {
            document.getElementById("detalle-imagen").src = productoActual.imagenesPorForma[primerValor];
        }
    }

    // --- ACTIVER / DESACTIVAR EL ASISTENTE DE REFERENCIAS ---
    const contenedorAsistente = document.getElementById("contenedor-asistente-referencia");
    if (contenedorAsistente) {
        if (productoActual.personalizable) {
            contenedorAsistente.style.display = "flex";
            
            const botonesRef = document.querySelectorAll(".btn-opcion-ref");
            botonesRef.forEach(btn => {
                btn.addEventListener("click", () => {
                    botonesRef.forEach(b => b.classList.remove("activa-ref"));
                    btn.classList.add("activa-ref");
                    referenciaSeleccionada = btn.getAttribute("data-ref");
                });
            });
        } else {
            contenedorAsistente.style.display = "none";
            referenciaSeleccionada = "No aplica (Producto en Stock)";
        }
    }

    renderizarGuiaTallas();
    renderizarProductosRelacionados();
}

// ⚡ INYECTAR LA TABLA DE MEDIDAS DINÁMICA
function renderizarGuiaTallas() {
    const contenedorMedidas = document.getElementById("contenido-medidas-tallas");
    if (!contenedorMedidas) return;

    if (productoActual.categoria === "streetwear") {
        contenedorMedidas.innerHTML = `
            <div style="display:grid; grid-template-columns: repeat(4, 1fr); gap: 5px; text-align:center; margin-top:5px;">
                <span style="font-weight:bold; border-bottom:1px solid #ccc;">Talla</span>
                <span style="font-weight:bold; border-bottom:1px solid #ccc;">Ancho</span>
                <span style="font-weight:bold; border-bottom:1px solid #ccc;">Largo</span>
                <span style="font-weight:bold; border-bottom:1px solid #ccc;">Manga</span>
                <span>S</span><span>54 cm</span><span>70 cm</span><span>24 cm</span>
                <span>M</span><span>57 cm</span><span>73 cm</span><span>25 cm</span>
                <span>L</span><span>60 cm</span><span>76 cm</span><span>26 cm</span>
                <span>XL</span><span>62 cm</span><span>78 cm</span><span>27 cm</span>
            </div>
        `;
    } else if (productoActual.tipoEspecificacion === "Forma") {
        contenedorMedidas.innerHTML = `
            <span>📐 <strong>Rectangular:</strong> 22cm x 18cm (Grosor 3mm).<br>
            📐 <strong>Circular:</strong> 20cm de diámetro (Grosor 3mm).</span>
        `;
    } else {
        contenedorMedidas.innerHTML = `<span>Estándar / Medidas adaptadas al formato del accesorio.</span>`;
    }
}

// ⚡ CARGAR E INYECTAR LOS PRODUCTOS RELACIONADOS
function renderizarProductosRelacionados() {
    const contenedorRelacionados = document.getElementById("contenedor-productos-relacionados");
    if (!contenedorRelacionados) return;

    contenedorRelacionados.innerHTML = "";

    const filtrados = productos.filter(p => p.categoria === productoActual.categoria && p.id !== productoActual.id);

    if (filtrados.length === 0) {
        productos.filter(p => p.id !== productoActual.id).slice(0, 4).forEach(p => crearTarjetaRelacionado(p, contenedorRelacionados));
    } else {
        filtrados.slice(0, 4).forEach(p => crearTarjetaRelacionado(p, contenedorRelacionados));
    }
}

function crearTarjetaRelacionado(p, contenedor) {
    const tarjeta = document.createElement("div");
    tarjeta.classList.add("tarjeta-producto"); 
    tarjeta.style.cursor = "pointer";
    tarjeta.style.padding = "15px";
    tarjeta.style.textAlign = "center";
    tarjeta.style.backgroundColor = "var(--color-gris-claro)";

    tarjeta.innerHTML = `
        <img src="${p.imagen}" style="width:100%; aspect-ratio:1/1; object-fit:contain; margin-bottom:12px;">
        <h4 style="font-size:1rem; text-transform:uppercase; margin:5px 0; color:var(--color-texto);">${p.nombre}</h4>
        <span style="font-weight:700; color:#a855f7;">$${p.precio.toFixed(2)}</span>
    `;

    tarjeta.onclick = () => {
        localStorage.setItem("productoSeleccionadoId", p.id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        cargarDetalleProducto(); 
    };

    contenedor.appendChild(tarjeta);
}

// 3. ENLAZAR EL BOTÓN DE AGREGAR AL CARRITO (Corregido 'disenos')
document.getElementById("btn-anadir-detalle").addEventListener("click", () => {
    if ((!productoActual.personalizable && productoActual.disenos && productoActual.disenos.length > 0 && disenoSeleccionado === "No seleccionado") || 
        (productoActual.colores.length > 0 && colorSeleccionado === "No seleccionado")) {
        alert("Por favor, selecciona las opciones de tu prenda antes de continuar.");
        return;
    }

    const disenoFinal = productoActual.personalizable ? `Personalizado (${referenciaSeleccionada})` : disenoSeleccionado;
    
    agregarAlCarrito(productoActual, tallaSeleccionada, colorSeleccionado, disenoFinal);
    toggleCarrito();
});

window.toggleCarrito = toggleCarrito;
document.addEventListener("DOMContentLoaded", cargarDetalleProducto);