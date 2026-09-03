const Usuario = document.getElementById("Usuario");
const Contrasena = document.getElementById("Contrasena")
const boton = document.getElementById("BtnSession")
const mensaje = document.getElementById("mensaje")

boton.addEventListener("click", function (){
    if(Usuario.value === "admin" && Contrasena.value === "1234"){
        mensaje.textContent = "inicio sesion correcto";
    } else {
        mensaje.textContent = "Usuario o contraseña incorrectos";
    }
});