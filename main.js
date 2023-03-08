let listaDeItens = []
let itemAEditar 

const form = document.querySelector('#form-itens')
const itensInput = document.querySelector('#receber-item')
const ulItens = document.querySelector('#lista-de-itens')
const ulItensComprados = document.querySelector('#itens-comprados')
const listaRecuperada = localStorage.getItem('listaDeItens')

function atualizaLocalStorage() {
    localStorage.setItem('listaDeItens', JSON.stringify(listaDeItens))
}

if (listaRecuperada) {
    listaDeItens = JSON.parse(listaRecuperada)
    mostrarItem()
}

form.addEventListener("submit", (evento) => {
    evento.preventDefault()

    salvarItem()
    itensInput.focus()
})

function salvarItem () {
    const comprasItem = itensInput.value
    const checarDuplicado = listaDeItens.some(elemento => elemento['valor'].toUpperCase() === comprasItem.toUpperCase())

    if (checarDuplicado) {
        alert ('Esse item já existe')
    } else {
        listaDeItens.push({
            valor: comprasItem,
            checar: false
        })
        mostrarItem()
    }

    itensInput.value = ""
}

function mostrarItem () {
    ulItens.innerHTML = ""
    ulItensComprados.innerHTML = ""

    listaDeItens.forEach((elemento, index) => {
        if (elemento['checar']) {
            ulItensComprados.innerHTML += `
            <li class="item-compra is-flex is-justify-content-space-between" data-value="${index}">
                <div>
                    <input type="checkbox" checked class="is-clickable" />  
                    <span class="itens-comprados is-size-5">${elemento['valor']}</span>
                </div>
                <div>
                    <button class="deletar"><i class="fa-solid fa-trash is-clickable"></i></button> 
                </div>
            </li>
        `
        } else {
            ulItens.innerHTML += `
            <li class="item-compra is-flex is-justify-content-space-between" data-value="${index}">
                <div>
                    <input type="checkbox" class="is-clickable" />
                    <input type="text" class="is-size-5" value="${elemento['valor']}" ${index !== parseInt(itemAEditar) ? 'disabled' : ''}></input>
                </div>
                <div>
                    ${index === parseInt(itemAEditar) ? '<button onclick="salvarEdicao()"><i class="fa-regular fa-floppy-disk is-clickable"></i></button>' : '<button class="fa-regular is-clickable fa-pen-to-square editar"></button>'}
                    <button class="deletar"><i class="fa-solid fa-trash is-clickable"></i></button>
                </div>
            </li>
            `
        }    
    })

    const inputsCheck = document.querySelectorAll('input[type="checkbox"]')

    inputsCheck.forEach(input => { 
        input.addEventListener("click", (evento) => {
            const valorDoElemento = evento.target.parentNode.parentNode.getAttribute('data-value')

            listaDeItens[valorDoElemento]['checar'] = evento.target.checked
            console.log(listaDeItens[valorDoElemento]['checar'])

            mostrarItem()
        })
    }) 

    const deletarObjetos = document.querySelectorAll('.deletar')

    deletarObjetos.forEach((elemento) => {
        elemento.addEventListener("click", (evento) => {
            const elementoPai = evento.target.parentNode.parentNode.getAttribute('data-value')
            listaDeItens.splice(elementoPai, 1)

            mostrarItem()
        })
    })

    const editarItens = document.querySelectorAll('.editar')

    editarItens.forEach((elemento) => {
        elemento.addEventListener("click", (evento) => {
            itemAEditar = evento.target.parentNode.parentNode.getAttribute('data-value')

            mostrarItem()
        })
    })

    atualizaLocalStorage()

}

function salvarEdicao() {
    const itemEditado = document.querySelector(`[data-value="${itemAEditar}"] input[type="text"]`)
    listaDeItens[itemAEditar]['valor'] = itemEditado.value
    itemAEditar = -1
    mostrarItem()
}
