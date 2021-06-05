const dark = document.getElementById('dark')
const light = document.getElementById('light')
const Form = document.getElementById('form')
const Count = document.getElementById('count')
const List = document.querySelector('.item-list > .items')
const ClearCompleted = document.getElementById('clear')
const filterAll = document.getElementById('filterAll')
const filterActive = document.getElementById('filterActive')
const filterCompleted = document.getElementById('filterCompleted')
const getId = () => new Date().valueOf() + Math.floor(Math.random() * (10000 - 10)) + 10;
let filtered = 'all'

let data = [
    {
        id: getId(),
        text: 'Jag around the park 3x',
        completed: false
    },
    {
        id: getId(),
        text: '10 minutes meditation',
        completed: true
    }
]

Form.addEventListener('submit', e => {
    console.log("caalll submit")
    e.preventDefault()
    const text = Form.children[0].value

    if (text.trim()) {
        data = [...data,{
            id: getId(),
            text,
            completed: false
        }]
        Form.children[0].value = ''
        filter(filtered)
    } else{
        console.error("Write a new TODO" )
    }
})

const completeTask = el => {
    const id = parseInt(el.parentElement.getAttribute('data-id'))
    
    data = data.map(item => {
        if (item.id === id) {
            item.completed = !item.completed
        }
        return item
    })
    filter(filtered)
}

const deleteTask = el => {  

    const parent = el.parentElement
    const id = parseInt(parent.getAttribute('data-id'))

    parent.addEventListener('animationend', () => {
        data = data.filter(item => item.id !== id)
        filter(filtered)
    })

    parent.classList.add('delete')
}

const deleteCompleted = () => {  
    if (window.confirm("Are you sure?")){
        data = data.filter(item => !item.completed)
        filter(filtered)
    }
}

const filter = type => {
    switch (type) {
        case 'active': 
        {
            filtered = 'active'
            filterActive.classList.add('active')
            filterAll.classList.remove('active')
            filterCompleted.classList.remove('active')        
            render(data.filter(item => !item.completed))
            break;
        }
        case 'completed': 
        {
            filtered = 'completed'
            filterAll.classList.remove('active')
            filterActive.classList.remove('active')
            filterCompleted.classList.add('active')        
            render(data.filter(item => item.completed))
            break;
        }
        default: {
            filtered = 'all'
            filterAll.classList.add('active')
            filterActive.classList.remove('active')
            filterCompleted.classList.remove('active')
            render()            
        }
    }
}

const Item = ({id, text, completed}) => {
    return `
        <div data-id="${id}" class="item ${completed && 'completed'}">
            <div class="item-status"></div>
            <div class="item-title">${text}</div>
            <div class="item-delete"></div>
        </div>    
    `
}

const NoItems = `<div class="item no-item"><p>There's no items...</p></div>`

const render = (todos = data) => {
    
    if (!todos.length) {
        List.innerHTML = NoItems
        Count.innerHTML = `No items left`
        return
    }

    const Todos = todos.map( item => Item(item)).join('')
    List.innerHTML = Todos

    const items_delete = document.querySelectorAll('.item-delete')
    const items_status = document.querySelectorAll('.item-status')

    items_status.forEach(btn => {
        btn.addEventListener('click', () => completeTask(btn))
    });
    
    items_delete.forEach(btn => {
        btn.addEventListener('click', () => deleteTask(btn))
    });

    Count.innerHTML = `${todos.length} items left`
}

const changeMode = () => {
    document.body.classList.toggle('dark-mode')
}

ClearCompleted.addEventListener('click', () => deleteCompleted())
filterAll.addEventListener('click', () => filter('all'))
filterActive.addEventListener('click', () => filter('active'))
filterCompleted.addEventListener('click', () => filter('completed'))

dark.addEventListener('click', changeMode)
light.addEventListener('click', changeMode)

render()

Sortable.create(List, {
    animation: 100
  });



