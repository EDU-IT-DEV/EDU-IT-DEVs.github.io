/* -------------------------------------- */
/*          VARIABLES GLOBALES            */
/* -------------------------------------- */
let listaProductos = [/* 
    { id:'1', nombre: 'Carne', cantidad: 2, precio: 12.34 },
    { id:'2', nombre: 'Pan', cantidad: 3, precio: 34.56 },
    { id:'3', nombre: 'Fideos', cantidad: 4, precio: 78.90 },
    { id:'4', nombre: 'Leche', cantidad: 5, precio: 87.65 },
    { id:'5', nombre: 'Crema', cantidad: 6, precio: 43.21 },
 */]

/* -------------------------------------- */
/*          FUNCIONES GLOBALES            */
/* -------------------------------------- */
async function borrarProd(id) {
    //const index = listaProductos.findIndex(p => p.id == id)
    //console.log(id, index)
    //listaProductos.splice(index, 1)
    await apiProductos.delete(id)

    renderLista()
}

async function cambiarValorProd(que, id, el) {
    const cual = listaProductos.findIndex(p => p.id == id)
    //console.log('cambiarValorProd', que, cual, el)
    //console.dir(el)
    const valor = el.value
    listaProductos[cual][que] = que == 'cantidad' ? parseInt(valor) : parseFloat(valor)

    const producto = listaProductos[cual]
    await apiProductos.put(id, producto)
}

async function renderLista() {
    console.log('renderLista')

    const plantilla = await $.ajax({ url: 'plantillas/productos.hbs' })
    const template = Handlebars.compile(plantilla);

    listaProductos = await apiProductos.get()
    const html = template({listaProductos: listaProductos})

    $('#lista').html(html)

    const ul = $('#contenedor-lista')
    componentHandler.upgradeElements(ul)
}

function configurarListenersMenu() {

    /* botón agregar producto */
    $('#btn-entrada-producto').click(async () => {
        const input = $('#ingreso-producto')
        const nombre = input.val()

        const producto = { nombre: nombre, cantidad: 1, precio: 0 }
        //listaProductos.push(producto)
        await apiProductos.post(producto)

        renderLista()
        input.val('')
    })

    /* botón borrar todo */
    $('#btn-borrar-productos').click(() => {
        if (listaProductos.length) {
            var dialog = $('dialog')[0];
            dialog.showModal();
        }
        /* if (confirm('¿Desea borrar todos los productos?')) {
            listaProductos = []
            renderLista()
        } */
    })
}

function registrarServiceWorker() {
    if ('serviceWorker' in navigator) {
        this.navigator.serviceWorker.register('/sw.js')
            .then(reg => {
                //console.log('El service worker se ha registrado correctamente', reg)
            })
            .catch(err => {
                console.error('Error al registrar el service worker', err)
            })
    }
    else {
        console.error('serviceWorker no está disponible en navigator')
    }
}


function iniDialog() {
    var dialog = $('dialog')[0];
    //console.log(dialog)

    //var showDialogButton = document.querySelector('#show-dialog');
    if (!dialog.showModal) {
        dialogPolyfill.registerDialog(dialog);
    }
    /* showDialogButton.addEventListener('click', function () {
        dialog.showModal();
    }); */
    $('dialog .aceptar').click(async () => {
        dialog.close();

        //listaProductos = []
        await apiProductos.deleteAll()
        renderLista()
    });

    $('dialog .cancelar').click( () => {
        dialog.close();
    });
}


async function testHandlebars() {
    // ------- ejemplo 1 ----------
    // compile the template
    /* const template = Handlebars.compile("Handlebars <b>{{doesWhat}}</b>");
    // execute the compiled template and print the output to the console
    const html = template({ doesWhat: "rocks!" })
    console.log(html) */

    // ------- ejemplo 2 ----------
    // compile the template
    /* const template = Handlebars.compile("<p>{{firstname}} {{lastname}}</p>");
    // execute the compiled template and print the output to the console
    const html = template({
        firstname: "Yehuda",
        lastname: "Katz",
    })
    console.log(html) */

    // ------- ejemplo 1 (con Ajax JQuery async/await) ----------
    // pido la plantilla al servidor con Ajax
    /* const plantilla = await $.ajax({url: 'plantillas/ejemplo1.hbs'})
    console.log(plantilla)
    // compile the template
    const template = Handlebars.compile(plantilla);
    // execute the compiled template and print the output to the console
    const html = template({ doesWhat: "rocks!" })
    console.log(html) */

    // ------- ejemplo 1 (con Ajax JQuery async/await) ----------
    // pido la plantilla al servidor con Ajax
    const plantilla = await $.ajax({ url: 'plantillas/ejemplo2.hbs' })
    console.log(plantilla)
    // compile the template
    const template = Handlebars.compile(plantilla);
    // execute the compiled template and print the output to the console
    const html = template({
        firstname: "Yehuda",
        lastname: "Katz",
    })
    console.log(html)

    $('#lista').html(html)
}

function start() {
    console.warn($('title').text())

    //testHandlebars()

    registrarServiceWorker()

    iniDialog()
    configurarListenersMenu()
    renderLista()
}


/* -------------------------------------- */
/*               EJECUCIÓN                */
/* -------------------------------------- */
//start()
//window.onload = () => start()
//window.onload = start
$(document).ready(start)