# Gmoon-tienda-gamer

1. Clonar el repositorio (solo la primera vez)
bash
git clone https://github.com/URDEON/Gmoon-tienda-gamer.git
cd Gmoon-tienda-gamer

Con esto ya tienen todo el contenido de main localmente.

2. Crear su propia rama a partir de main
bash
git checkout -b nombre-rama

Por ejemplo, si cada uno trabaja en una parte distinta:

bash
git checkout -b feature/carrito-compras
git checkout -b feature/login
git checkout -b feature/catalogo-productos
3. Trabajar y hacer commits normalmente
bash
git add .
git commit -m "Descripción del cambio"
4. Subir su rama al repositorio remoto
bash
git push -u origin nombre-rama

Esto crea la rama en GitHub sin tocar main.

5. Cuando terminen su parte

Hacen un Pull Request en GitHub desde su rama hacia main, para que alguien revise antes de fusionar (o lo fusionan directo si están de acuerdo en el equipo).

Si alguien ya tenía el repo clonado antes de tus últimos cambios

Deben actualizar su main local primero:

bash
git checkout main
git pull origin main
git checkout -b nombre-rama