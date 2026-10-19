/*
  CONFIGURACIÓN EDITABLE DE LA TIENDA.

  whatsapp: escribe el número al que deben llegar las consultas,
  con código de país y SIN "plus", espacios ni guiones.
  Ejemplo de formato para Chile: "569XXXXXXXX" (reemplaza las X por tu número).
  Sin número, los enlaces abren WhatsApp con el mensaje prellenado,
  pero NO pueden dirigirlo a un vendedor específico.

  Para modificar las fotos, edita shop1 ... shop5 en images.js
  y guarda los archivos en la carpeta assets/.

  Esta tienda NO cobra ni procesa compras: todas las consultas van a WhatsApp.
*/
window.SHOP_CONFIG = {
  whatsapp: "",
  products: [
    { name: "Producto 01", category: "COLECCIÓN / 01", price: "Consultar precio", description: "Descripción breve del producto. Cambia este texto por la información real.", badge: "01" },
    { name: "Producto 02", category: "COLECCIÓN / 02", price: "Consultar precio", description: "Agrega aquí el material, tamaño o las características que quieras destacar.", badge: "02" },
    { name: "Producto 03", category: "COLECCIÓN / 03", price: "Consultar precio", description: "Una descripción corta para presentar el artículo de manera atractiva.", badge: "03" },
    { name: "Producto 04", category: "COLECCIÓN / 04", price: "Consultar precio", description: "Completa este espacio con el detalle principal de tu producto.", badge: "04" },
    { name: "Producto 05", category: "COLECCIÓN / 05", price: "Consultar precio", description: "Este es el quinto producto de la tienda. Personaliza el nombre y el valor.", badge: "05" }
  ]
};
