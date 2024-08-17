// Declaracion de variables
const containerTask = document.querySelector(".container-create-task");
const containerList = document.querySelector(".container-list-task");
const $template = document.querySelector(".template");

let listTask = []; // Arreglo de las listas de tareas

// Cargar al iniciar pagina
document.addEventListener('DOMContentLoaded', ()=>{
    
    listTask = JSON.parse(localStorage.getItem("task")) || [];
    AgregarTarea();

})

//Eventos click a los botones
containerTask.addEventListener("click", (e)=>{
    if(e.target.matches("#btn-task")){
        CreateTarea();
    }
})

containerList.addEventListener('click', e=>{
    if(e.target.closest(".btn-delete")){
        deleteTask(e.target);
    }
    
    if(e.target.matches('.content-task')){
        const taskId = e.target.parentElement.dataset.id;
        const existe = listTask.some(task => task.id === taskId);
    
        if(existe){
            const taks = listTask.map(task =>{
                if(task.id === taskId){
                    task.status = true;
                    return task;
                }else{
                    return task;
                }      
            })
            
            listTask = [...taks];
            SincronizarLocal();
            AgregarTarea();
        }
    }
})



// Eliminar tareas
function deleteTask(referencia){
   let $referencia = referencia.closest(".task");

   $referencia.remove();
   listTask = listTask.filter(task => task.id !== $referencia.dataset.id );

   SincronizarLocal();

   if(listTask <= 0){
     Mensaje()
   }

}

// Crear tareas
function CreateTarea(){

    // Valor del input
    const inputvalue = document.querySelector('#input-task');
    
    // Datos de la tarea
    const valueTask = {
        id: `${Math.random().toString(36).substring(2,9)}_${Date.now()}`,
        value : inputvalue.value,
        status: false
    }
   
    // Validacion de la tarea
    if(inputvalue.value == ""){
        CreateAlerta("Ingrese una Tarea");
        return;
    }


    // Agregando valores al arreglo
    listTask = [...listTask, valueTask];

    AgregarTarea();
    
    inputvalue.value = "";
}

// Crear alertas
function CreateAlerta(mensaje){
    const container = containerTask.parentElement;

    const alerta = document.createElement('p');
    alerta.textContent = mensaje;
    alerta.classList.add("alerta")

    container.prepend(alerta)

    setTimeout(()=>{
       alerta.remove()
    },3000)

}

// Agregando tareas
function AgregarTarea(){

    // Limpiamos el Html
    limpiarHtml();
    
    if(listTask.length > 0){
        listTask.forEach((task)=>{
            // clona el template
            const clone = $template.content.cloneNode(true);
            let valuetask = clone.querySelector("p")
            let containerTask = clone.querySelector('.task');

            // Cambiand valores del Template
            valuetask.textContent = task.value;
            containerTask.dataset.id = task.id;
            containerTask.dataset.status = task.status;

            if(task.status){
                valuetask.classList.add("marca")
            }

            // Agregando al Dom
            containerList.appendChild(clone);
        })
        //Sincronizar Base de datos
        SincronizarLocal();
        return;
    }
       
    // Mensaje si no hay valores
    Mensaje();
        

}

function Mensaje(){
    const mensaje = document.createElement("p");
    mensaje.textContent= "NO TIENE NINGUNA TAREA"
    mensaje.classList.add('vacio');
    
    containerList.appendChild(mensaje)
}

// Elimina elementos anteriores
function limpiarHtml(){
    while(containerList.firstChild){
        containerList.firstChild.remove()
    }
}

// Sincronizar elementos con el LocalStorage
function SincronizarLocal(){
    localStorage.setItem("task",JSON.stringify(listTask));
}


