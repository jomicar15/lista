"use strict";

const cmpDato=document.querySelector(".cmpDato");
const btnEnviar=document.querySelector(".btnEnviar");
const error=document.querySelector(".error");
const productos=document.querySelector(".productos");
const btnBorrar=document.querySelector(".btnBorrar");
const presupuesto=document.querySelector("#presupuesto");
const cmpMonto=document.querySelector('.cmpMonto');
const check=document.querySelector('#check');
const montoTotal=document.querySelector('#montoTotal');
const btnDesplegar=document.querySelector('.btnDesplegar');
const ocult=document.querySelector('.ocult');
const form=document.querySelector('.form');
let presupuestoTotal=0;
let arrayProductos=JSON.parse(localStorage.getItem('lista'))||[];


document.addEventListener('DOMContentLoaded',()=>{

/*INPUTS TO ADD PRESUPUESTO*/
	cmpMonto.addEventListener("keyup",ev=>{
		if(ev.key==='Enter'){
			let monto=Number(cmpMonto.value);
			if(isNaN(monto)|| cmpMonto.value.length===0){
				const mensaje='Debe introducir un número válido';
				mostrarError(mensaje);
				cmpMonto.value='';
				cmpDato.classList.remove('red');
			}else{
				limpiarError();
				// montoTotal.textContent=`${String(monto)}`;
				presupuestoTotal=monto;
				calcularTotal();
				colocarIconoUp();
				almacenarEnLocalStorage();
				localStorage.setItem('totalListaCompra',JSON.stringify(monto));
				cmpMonto.value='';
			}
		}
	});

	check.addEventListener("click",ev=>{
		if(ev.target.matches('#check')){
			let monto=Number(cmpMonto.value);
			if(isNaN(monto)|| cmpMonto.value.length===0){
				const mensaje='Debe introducir un número válido';
				mostrarError(mensaje);
				cmpMonto.value='';
				cmpDato.classList.remove('red');
			}else{
				limpiarError();
				presupuestoTotal=monto;
				localStorage.setItem('totalListaCompra',JSON.stringify(monto));
				calcularTotal();
				colocarIconoUp();
				almacenarEnLocalStorage();
				cmpMonto.value='';
			}
		}
	});

	btnDesplegar.addEventListener("click",ev=>{
		if(btnDesplegar.classList.contains('bi-caret-down-fill')){
			colocarIconoDown();

			form.style.animationName='up';
		}else if(btnDesplegar.classList.contains('bi-caret-up-fill')){
			colocarIconoUp();
		}
	});

	presupuesto.addEventListener("click",ev=>{
		if(btnDesplegar.classList.contains('bi-caret-down-fill')){
			colocarIconoDown();

			form.style.animationName='up';
		}else if(btnDesplegar.classList.contains('bi-caret-up-fill')){
			colocarIconoUp();
		}
	});



/*INPUTS TO ADD LIST*/
	btnEnviar.addEventListener("click",ev=>{	
		limpiarError();
		if (ev.target.matches(".btnEnviar")) {
			let dato=convertirPrimeraLetraMayuscula(cmpDato.value);
			let mensaje="";
			if(dato.length>0){
				limpiarInput();
				agregarProductos(dato);
				pintarLista();
				mostrarbtnBorrar();
				almacenarEnLocalStorage();
			}else{
				mensaje="Debe ingresar algún producto";
			}

			if(mensaje.length>0){
				mostrarError(mensaje);
			}
		}
	});

	cmpDato.addEventListener("keyup",ev=>{

		if(ev.key==='Enter'){
			limpiarError();
			let dato=convertirPrimeraLetraMayuscula(cmpDato.value);
			if(dato.length>0){
				agregarProductos(dato);
				pintarLista();
				mostrarbtnBorrar();
				limpiarInput();
				almacenarEnLocalStorage();
			}else{
				mostrarError("Debe ingresar algún producto");
			}
		}
	});

	btnBorrar.addEventListener("click",ev=>{
		if (ev.target.matches(".btnBorrar")) {
			vaciarLista();
			almacenarEnLocalStorage();
		}
	});

//EVENTOS DE CLICK SOBRE LA LISTA DE PRODUCTOS
	productos.addEventListener("click",ev=>{
		
		if(ev.target.matches('.bi-trash')){
			let id=ev.target.previousElementSibling.previousElementSibling.id;
			//presupuestoTotal=presupuestoTotal+arrayProductos[id].precio;
			arrayProductos.splice(id, 1);
			pintarLista();
			calcularTotal();			
			almacenarEnLocalStorage();
			if(arrayProductos.length===0){
				btnBorrar.hidden=true;
			}
		}

		if(ev.target.matches('.bi-cash-coin')){
			let id=ev.target.previousElementSibling.id;
			// ev.target.classList.add('position-rel');
			let containerPadre=ev.target.parentElement;
			containerPadre.classList.add('position-rel');
			const modal=document.createElement('SECTION');
			modal.classList.add('modal','position-absol');
			modal.setAttribute('data-set',id);
			modal.innerHTML=`<div class="btnCerrar" >
								<img src="img/icons8-cancelar-48.png" width="20px" height="20px"  alt="check" id="btnCerrar">
							</div>
							<p class="modal-text">Introduce precio</p>
							<input type="text" id="inputProductPrice" placeholder="Precio" value="${calcularPrecioInput(id)}">
							<div>
								<img src="img/Yes_Check_Circle.svg.png" alt="check" id="btnProductPrice">
							</div>`;
							//value="${arrayProductos[id].precio}"
			containerPadre.append(modal);
		}

		if(ev.target.matches('li')){
			let item=ev.target;
			let id= item.id;
			if(arrayProductos[id].clases.length===0){
				arrayProductos[id].clases.push("line-throughItem");
			}else{
				arrayProductos[id].clases.pop();
			}
			ev.target.classList.toggle("line-throughItem");
			almacenarEnLocalStorage();
		}

		if(ev.target.matches('#btnCerrar')){
			//eliminando el cuadro para introducir texto
			ev.target.parentElement.parentElement.remove();
		}

	});

	productos.addEventListener("keyup",ev=>{
		if(ev.key==='Enter'){
			const inputPrice=document.querySelector('#inputProductPrice');
			const price=Number(inputPrice.value);
			if(!isNaN(price)){
				if(price>=0){
					const id=inputPrice.parentElement.getAttribute('data-set');
					if(price===0 && arrayProductos[id].precio===0){
						//Código para añadir funcionalidad de un mensaje de error
					}else{
						arrayProductos[id].precio=price;
						calcularTotal();	
					}
				}
			}
			inputPrice.parentElement.remove();
		}
	});

	productos.addEventListener("click",ev=>{
		if(ev.target.matches('#btnProductPrice')){
			const inputPrice=document.querySelector('#inputProductPrice');
			const price=Number(inputPrice.value);
			if(!isNaN(price)){
				if(price>=0){
					const id=inputPrice.parentElement.getAttribute('data-set');
					if(price===0 && arrayProductos[id].precio===0){
						//Código para añadir funcionalidad de un mensaje de error
					}else{
						arrayProductos[id].precio=price;
						calcularTotal();
					}
				}
			}
			inputPrice.parentElement.remove();
		}
	});



const calcularPrecioInput=(id)=>{
	if(arrayProductos[id].precio>0){
		return arrayProductos[id].precio;
	}else{
		return "";
	}
}

const calcularTotal=()=>{
	montoTotal.innerHTML="";
	let precios=0;
	arrayProductos.forEach(elemento=>{
		precios= precios + elemento.precio;
	});
	montoTotal.textContent=presupuestoTotal-precios;
}


const limpiarInput=()=>cmpDato.value="";

const mostrarError=(mensaje)=>{
	error.innerHTML=`<li>${mensaje}</li>`;
	cmpDato.classList.add('red');
}
const mostrarbtnBorrar=()=>{
	if(arrayProductos.length>0){
		btnBorrar.hidden=false;
	}
}

const agregarProductos=(dato)=>{
	const obj={
		producto: dato,
		clases: [],
		precio: 0
	}
	arrayProductos.push(obj);
}

const vaciarLista=()=>{
	arrayProductos.length=0;
	productos.innerHTML="";
	limpiarError();
	if(arrayProductos.length===0){
		btnBorrar.hidden=true;
	}
}

const limpiarError=()=>{
		cmpDato.classList.remove('blue');
		cmpDato.classList.remove('red');
		error.innerHTML="";
}

const convertirPrimeraLetraMayuscula=(dato)=>dato.charAt(0).toUpperCase() + dato.slice(1);

const pintarLista=()=>{
	productos.innerHTML="";
	cmpDato.classList.add('blue');
	limpiarError();
	const fragment=document.createDocumentFragment();
	arrayProductos.forEach((item,index)=>{
		const containerPrincipal=document.createElement("DIV");
		const li=document.createElement("LI");
		const iconTrash=document.createElement("I");
		const iconCashCoin=document.createElement("I");
		containerPrincipal.classList.add('container-principal');
		li.setAttribute('id',index);
		li.textContent=`${item.producto}`;
		if(item.clases.length>0){
			item.clases.forEach(elemento=>{
				li.classList.add(elemento);
			});
		}
		iconTrash.classList.add("bi", "bi-trash");
		iconCashCoin.classList.add("bi", "bi-cash-coin");
		containerPrincipal.append(li);
		containerPrincipal.append(iconCashCoin);

		containerPrincipal.append(iconTrash);
		fragment.append(containerPrincipal);
	});
	productos.append(fragment);
}
const almacenarEnLocalStorage=()=>{
	localStorage.setItem('lista', JSON.stringify(arrayProductos));
}


const colocarIconoDown=()=>{
	btnDesplegar.classList.remove('bi-caret-down-fill');
	btnDesplegar.classList.add('bi-caret-up-fill');
	ocult.hidden=false;
}

const colocarIconoUp=()=>{
	btnDesplegar.classList.add('bi-caret-down-fill');
	btnDesplegar.classList.remove('bi-caret-up-fill');
	ocult.hidden=true;
}

const start=()=>{
	let prueba= JSON.parse(localStorage.getItem('totalListaCompra'));

	if(prueba!=null){
		presupuestoTotal=prueba;
		calcularTotal();
	}
	if(arrayProductos.length>0){
		pintarLista();
		btnBorrar.hidden=false;	
	}
}


start();

});//LOAD
