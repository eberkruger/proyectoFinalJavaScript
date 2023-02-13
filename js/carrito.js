let todosProductosCarrito = localStorage.getItem("productosEnCarrito");
todosProductosCarrito = JSON.parse(todosProductosCarrito);
const carritoVacio = document.getElementById("carritoVacio");
const productosCarrito = document.getElementById("productosCarrito");
const accionesCarrito = document.getElementById("accionesCarrito");
const carritoComprado = document.getElementById("carritoComprado");
let botonesEliminar = document.getElementsByClassName(
  "carritoProductoEliminar"
);
let botonVaciar = document.getElementById("accionesCarritoVaciar");
const precioCarritoTotal = document.getElementById("total");
let botonComprar = document.getElementById("accionesCarritoComprar");

function renderizarCarrito() {
  if (todosProductosCarrito && todosProductosCarrito.length > 0) {
    carritoVacio.classList.add("disabled");
    productosCarrito.classList.remove("disabled");
    accionesCarrito.classList.remove("disabled");

    productosCarrito.innerHTML = "";

    todosProductosCarrito.forEach(({imgUrl, nombre, cantidad, precio, id}) => {
      let productoAgregadoCarrito = document.createElement("div");
      productoAgregadoCarrito.classList.add("productoAgregado");
      productoAgregadoCarrito.innerHTML = `
                <img class="productoAgragadoImagen" src="${imgUrl}" alt="${nombre}">
                <div class="carritoProductoNombre">
                  <small>Nombre</small>
                  <h4>${nombre}</h4>
                </div>
                <div class="botonesCantidades">
                  <button id=inc${id} onclick=incrementarUnidad(${id})><img src="../assets/imagenesSVG/add-outline.svg"/></button>
                  <button id=dec${id} onclick=decrementarUnidad(${id})><img src="../assets/imagenesSVG/remove-outline.svg"/></button>
                </div>
                <div class="carritoProductoCantidad">
                  <small>Cantidad</small>
                  <p>${cantidad}</p>
                </div>
                <div class="carritoProductoPrecio">
                  <small>Precio</small>
                  <p>${precio}</p>
                </div>
                <div class="carritoProductoSubtotal">
                  <small>Subtotal</small>
                  <p>${precio * cantidad}</p>
                </div>
                <button id="${id}"class="carritoProductoEliminar"><lord-icon
                src="https://cdn.lordicon.com/jmkrnisz.json"
                trigger="hover"
                colors="primary:#e83a30"
                style="width:32px;height:32px">
                </lord-icon></button>
            `;

      productosCarrito.appendChild(productoAgregadoCarrito);
    });

    ActualizarBotonesEliminar();
    precioTotal();
  } else {
    carritoVacio.classList.remove("disabled");
    productosCarrito.classList.add("disabled");
    accionesCarrito.classList.add("disabled");
  }
}
renderizarCarrito();

function decrementarUnidad(id) {
  let indexProducto = todosProductosCarrito.findIndex(producto => producto.id == id);
  if (todosProductosCarrito[indexProducto].cantidad > 1) {
    todosProductosCarrito[indexProducto].cantidad--
  } else {
    todosProductosCarrito.splice(indexProducto, 1)
  };
  renderizarCarrito(todosProductosCarrito);
  localStorage.setItem("productosEnCarrito", JSON.stringify(todosProductosCarrito));
}

function incrementarUnidad(id) {
  let indexProducto = todosProductosCarrito.findIndex(producto => producto.id == id);
  todosProductosCarrito[indexProducto].cantidad++;

  renderizarCarrito(todosProductosCarrito);
  localStorage.setItem("productosEnCarrito", JSON.stringify(todosProductosCarrito));
}

function ActualizarBotonesEliminar() {
   let botonesEliminar = document.querySelectorAll(".carritoProductoEliminar");

  botonesEliminar.forEach((boton) => {
    boton.addEventListener("click", eliminarDelCarrito);
  });
}

function eliminarDelCarrito(e) {
  const id = e.currentTarget.id;
  const index = todosProductosCarrito.findIndex((producto) => producto.id == id);

  todosProductosCarrito.splice(index, 1);
  renderizarCarrito();
  Toastify({
    text: "Producto eliminado del carrito",
    className: "toastify",
    duration: 1500,
    gravity: "bottom", // `top` or `bottom`
    position: "right", // `left`, `center` or `right`
    stopOnFocus: true, // Prevents dismissing of toast on hover
    style: {
      background: "linear-gradient(to right, #122923, #e73958)",
    },
  }).showToast();
  localStorage.setItem("productosEnCarrito", JSON.stringify(todosProductosCarrito));
}

botonVaciar.addEventListener("click", vaciarCarrito);
function vaciarCarrito() {
  todosProductosCarrito.length = 0;
  localStorage.setItem("productosEnCarrito", JSON.stringify(todosProductosCarrito));
  renderizarCarrito();
  lanzarSweetAlert(
    "Carrito vacío",
    "Siga reccoriendo la tienda",
    "success",
    2000,
    false,
    "#e73958"
  );
}

function precioTotal() {
  const totalCalculadoProductos = todosProductosCarrito.reduce((acc, producto) => acc + producto.precio * producto.cantidad,0);
  precioCarritoTotal.innerText = `$${totalCalculadoProductos}`;
}

botonComprar.addEventListener("click", comprarCarrito);
function comprarCarrito() {
  todosProductosCarrito.length = 0;
  localStorage.setItem("productosEnCarrito", JSON.stringify(todosProductosCarrito));

  carritoVacio.classList.toggle("disabled");
  productosCarrito.classList.toggle("disabled");
  accionesCarrito.classList.toggle("disabled");
  /* sweet alert */
  lanzarSweetAlert(
    "Gracias por su compra",
    "Vuelva pronto",
    "success",
    2000,
    false,
    "#e73958"
  );
}

function lanzarSweetAlert(
  title,
  text,
  icon,
  timer,
  mostrarBoton,
  colorIcono,
  imageUrl,
  imageWidth,
  imageHeight
) {
  Swal.fire({
    icon,
    title,
    text,
    timer,
    showConfirmButton: mostrarBoton,
    iconColor: colorIcono,
    imageUrl,
    imageWidth,
    imageHeight,
  });
}
