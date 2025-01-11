const apiProductos = (function() {

    function getURL(id) {
        return 'https://665b3ad4003609eda4604381.mockapi.io/api/productos/' + (id || '')
    }

    async function get() {
        const prods = await $.ajax({url: getURL()})
        return prods
    }

    async function post(producto) {
        const prodAgregado = await $.ajax({url: getURL(), method: 'post', data: producto})
        return prodAgregado
    }

    async function put(id, producto) {
        const prodActualizado = await $.ajax({url: getURL(id), method: 'put', data: producto})
        return prodActualizado
    }

    async function del(id) {
        const prodEliminado = await $.ajax({url: getURL(id), method: 'delete'})
        return prodEliminado
    }

    async function deleteAll() {
        for(let i=0; i<listaProductos.length; i++) {
            const id = listaProductos[i].id
            await del(id)
        }
    }

    return {
        get: () => get(),
        post: producto => post(producto),
        put: (id,producto) => put(id,producto),
        delete: id => del(id),
        deleteAll: () => deleteAll(),
    }
})()