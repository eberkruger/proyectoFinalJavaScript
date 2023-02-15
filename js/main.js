async function pedirInfo() {
  try {
    const resp = await fetch("../json/productos.json")
    const productosDB = await resp.json()
    miPrograma(productosDB)
  } catch (error) {
    console.log(error)
  }
}
pedirInfo()

function miPrograma(productos) {

  let carrito = localStorage.getItem("productosEnCarrito") ? JSON.parse(localStorage.getItem("productosEnCarrito")) : [];

  const contenedorProductos = document.getElementById("contenedorProductos");

  function renderizarProductos(arrayDeProductos) {
    contenedorProductos.innerHTML = "";

    arrayDeProductos.forEach(({ id, precio, nombre, imgUrl }) => {
      let tarjetaProducto = document.createElement("div");
      tarjetaProducto.classList.add("card");
      tarjetaProducto.innerHTML = `
          <img src=${imgUrl} alt=${nombre}>
          <div class="descripcion">
            <p class="nombreProducto">${nombre}</p>
            <p class="precioProducto">$${precio}</p>
            <button class="agregarCarrito" id=${id}>
            <img src="../assets/imagenesSVG/bxs-cart.svg" alt="Carrito de compras"/>
            </button>
          </div>
        `;

      contenedorProductos.appendChild(tarjetaProducto);
    });

    ActualizarBotonesAgregar();
  }
  renderizarProductos(productos);

  /* ******** BARRA BUSCADORA ******* */
  const buscador = document.getElementById("buscador");
  const buscar = document.getElementById("botonBuscar");
  const hero = document.getElementById("hero");
  const menuFiltros = document.getElementById("menuFiltros");
  buscar.onclick = filtrarNombre;

  function filtrarNombre() {
    let filtrarNombreProducto = productos.filter(
      ({ nombre, categoria }) =>
        nombre.toLowerCase().includes(buscador.value.toLowerCase()) ||
        categoria.toLowerCase().includes(buscador.value.toLowerCase())
    );

    apretarEnter();
    renderizarProductos(filtrarNombreProducto);

    hero.classList.toggle("disabled");
    menuFiltros.classList.toggle("disabled");
    tituloPrincipal.classList.toggle("disabled");
  }

  function apretarEnter() {
    buscador.addEventListener("keyup", function (e) {
      if (e.code === "Enter") {
        buscar.click();
        hero.classList.toggle("disabled");
        menuFiltros.classList.toggle("disabled");
        tituloPrincipal.classList.toggle("disabled");
      }
    });
  }

  /* ******** SECTION CATEGORÍAS ********  */
  /* TODOS */
  const tituloPrincipal = document.getElementById("tituloPrincipal");
  const verTodosProductos = document.getElementById("todos");
  verTodosProductos.addEventListener("click", mostrarTodosProductos);

  function mostrarTodosProductos(e) {
    if (e.target.id == "todos") {
      tituloPrincipal.innerText = "Todos nuestros productos";
      renderizarProductos(productos);
    }
  }

  /* NOTEBOOKS */
  const botonCategoriaNotebook = document.getElementById("notebook");
  botonCategoriaNotebook.addEventListener("click", filtrarCategoriaNotebook);
  
  function filtrarCategoriaNotebook(e) {
    if (e.target.id == "notebook") {
      tituloPrincipal.innerText = "Notebooks";
      let filtrarNotebook = productos.filter(
        ({ categoria }) => categoria.toLowerCase() === e.target.id
      );
      renderizarProductos(filtrarNotebook);
    }
  }

  /* MOUSES */
  const botonCategoriaMouse = document.getElementById("mouse");
  botonCategoriaMouse.addEventListener("click", filtrarCategoriaMouse);
  function filtrarCategoriaMouse(e) {
    if (e.target.id == "mouse") {
      tituloPrincipal.innerText = "Mouses";
      let filtrarMouse = productos.filter(
        ({ categoria }) => categoria.toLowerCase() === e.target.id
      );
      renderizarProductos(filtrarMouse);
    }
  }

  /* TECLADOS */
  const botonCategoriaTeclado = document.getElementById("teclado");
  botonCategoriaTeclado.addEventListener("click", filtrarCategoriaTeclado);

  function filtrarCategoriaTeclado(e) {
    if (e.target.id == "teclado") {
      tituloPrincipal.innerText = "Teclados";
      let filtrarTeclado = productos.filter(
        ({ categoria }) => categoria.toLowerCase() === e.target.id
      );
      renderizarProductos(filtrarTeclado);
    }
  }

  /* AURUCULARES */
  const botonCategoriaAuricular = document.getElementById("auricular");
  botonCategoriaAuricular.addEventListener("click", filtrarCategoriaAuricular);

  function filtrarCategoriaAuricular(e) {
    if (e.target.id == "auricular") {
      tituloPrincipal.innerText = "Auriculares";
      let filtrarAuricular = productos.filter(
        ({ categoria }) => categoria.toLowerCase() === e.target.id
      );
      renderizarProductos(filtrarAuricular);
    }
  }

  /* ACTUALIZAR BOTONES DE AGREGAR AL CARRITO */
  function ActualizarBotonesAgregar() {
    let botonesAgregarCarrito = document.querySelectorAll(".agregarCarrito");

    botonesAgregarCarrito.forEach((boton) => {
      boton.addEventListener("click", agregarAlCarrito);
    });
  }

  /* FUNCION AGREGAR AL CARRITO */
  function agregarAlCarrito(e) {
    let id = e.currentTarget.id;
    const productoAgregado = productos.find((producto) => producto.id == id);
    console.log(productoAgregado)
    lanzarToastify()
    if (carrito.some((producto) => producto.id == id)) {
      const index = carrito.findIndex((producto) => producto.id == id);
      carrito[index].cantidad++;
    } else {
      productoAgregado.cantidad = 1;
      carrito.push(productoAgregado);
    }

    localStorage.setItem("productosEnCarrito", JSON.stringify(carrito));
  }

  function lanzarToastify() {
    Toastify({
      text: "Producto agregado al carrito",
      className: "toastify",
      duration: 1500,
      gravity: "bottom", // `top` or `bottom`
      position: "right", // `left`, `center` or `right`
      stopOnFocus: true, // Prevents dismissing of toast on hover
      style: {
        background: "linear-gradient(to right, #122923, #e73958)",
      },
    }).showToast();
  }
}

