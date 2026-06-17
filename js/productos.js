export const productos = [
    {
        id: 1,
        nombre: "Franela Oversize",
        precio: 14.00,
        categoria: "streetwear",
        estilos: ["y2k", "cyber-grunge"], // ⚡ NUEVA PROPIEDAD
        imagen: "Recursos/Franelas/Oversize-1.png",
        personalizable: false,
        tipoEspecificacion: "Talla",
        tallas: ["S", "M", "L", "XL"],
        colores: [
            { nombre: "Negro", hex: "#111111" },
            { nombre: "Blanco", hex: "#ffffff" }
        ],
        disenos: [
            { nombre: "Cyber pool", img: "Recursos/Franelas/oversize-pool.webp" }
        ],
        imagenesPorColor: {
            "Negro": "Recursos/Franelas/Oversize-1.png",
            "Blanco": "Recursos/Franelas/oversize-blanca.webp"
        }
    },
    {
        id: 2,
        nombre: "Franela Personalizada",
        precio: 14.00,
        categoria: "streetwear",
        estilos: ["personalizado"], // Etiqueta especial
        imagen: "Recursos/Franelas/oversize.webp",
        personalizable: true,
        tipoEspecificacion: "Talla",
        tallas: ["S", "M", "L", "XL"],
        colores: [
            { nombre: "Negro", hex: "#111111" },
            { nombre: "Blanco", hex: "#ffffff" }
        ],
        disenos: [],
        imagenesPorColor: {
            "Negro": "Recursos/Franelas/oversize.webp",
            "Blanco": "Recursos/Franelas/oversize-blanca.webp"
        }
    },
    {
        id: 3,
        nombre: "Mousepad",
        precio: 3.50,
        categoria: "accesorios",
        estilos: ["y2k"], // Su etiqueta de diseño
        imagen: "Recursos/Accesorios/mousepad.png",
        personalizable: true,
        tipoEspecificacion: "Forma",
        tallas: ["Rectangular", "Circular"],
        colores: [{ nombre: "Estándar", hex: "#ffffff" }],
        disenos: [],
        imagenesPorForma: {
            "Rectangular": "Recursos/Accesorios/mousepad.png",
            "Circular": "Recursos/Accesorios/mousepad-circular.png"
        }
    }
];