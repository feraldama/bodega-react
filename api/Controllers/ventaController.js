// const Clientes = require("../Models/clientesModel");
module.exports = {
  postVenta,
};

async function postVenta(req, res) {
  const { xml } = req.body;
  console.log("log: 🚀  xml:", xml);

  // console.log("log: 🚀  req:", req.body);

  const config = {
    headers: {
      "Content-Type": "text/xml",
    },
  };

  try {
    // axios
    //   .post(
    //     process.env.REACT_APP_URL +
    //       process.env.REACT_APP_URL_GENEXUS +
    //       "apventaconfirmarws",
    //     xml,
    //     config
    //   )
    //   .then((response) => {
    //     console.log("log: 🚀  response:", response);
    //     res.status(200).json("BIEN"); // Cambia el status y la respuesta según tus necesidades
    //   });
    const response = await axios.post(
      process.env.REACT_APP_URL +
        process.env.REACT_APP_URL_GENEXUS +
        "apventaconfirmarws",
      xml,
      config
    );

    console.log(response.data);
    res.status(200).json("BIEN"); // Cambia el status y la respuesta según tus necesidades

    // console.log(response.data);

    //   // Enviar la respuesta al cliente
    //   res.status(200).json(response.data); // Cambia el status y la respuesta según tus necesidades
  } catch (error) {
    // Enviar una respuesta de error al cliente
    res.status(500).json({ error: "Error al guardar venta" }); // Puedes personalizar el mensaje de error
  }
}

// async function postVenta(req, res) {
//   const { cartItemsSinImagen, Total2 } = req.body;

//   const fecha = new Date();
//   let dia = fecha.getDate();
//   let mes = fecha.getMonth() + 1;
//   let año = fecha.getFullYear() % 100;
//   if (dia < 10) dia = "0" + dia;
//   if (mes < 10) mes = "0" + mes;
//   if (año < 10) año = "0" + año;
//   const fechaFormateada = `${dia}/${mes}/${año}`;
//   const SDTProductoItem = cartItems.map((producto) => ({
//     ClienteId: selectedCustomer.ClienteId,
//     Producto: {
//       ProductoId: producto.id,
//       VentaProductoCantidad: producto.quantity,
//       ProductoPrecioVenta:
//         producto.unidad == "U" ? producto.salePrice : producto.price,
//       ProductoUnidad: producto.unidad,
//       VentaProductoPrecioTotal: producto.totalPrice,
//       Combo: "N",
//       ComboPrecio: 0,
//     },
//   }));
//   const json = {
//     Envelope: {
//       _attributes: { xmlns: "http://schemas.xmlsoap.org/soap/envelope/" },
//       Body: {
//         "PVentaConfirmarWS.VENTACONFIRMAR": {
//           _attributes: { xmlns: "Alonso" },
//           Sdtproducto: {
//             SDTProductoItem: SDTProductoItem,
//           },
//           Ventafechastring: fechaFormateada,
//           Almacenorigenid: 1,
//           Clientetipo: selectedCustomer.ClienteTipo,
//           Cajaid: 1,
//           Usuarioid: "vendedor",
//           Efectivo: 50000,
//           Total2: Total2,
//           Ventatipo: ventaTipo,
//           Pagotipo: "E",
//           Clienteid: selectedCustomer.ClienteId,
//           Efectivoreact: efectivo,
//           Bancoreact: banco,
//           Clientecuentareact: cuentaCliente,
//         },
//       },
//     },
//   };
//   const xml = js2xml(json, { compact: true, ignoreComment: true, spaces: 4 });
//   const config = {
//     headers: {
//       "Content-Type": "text/xml",
//     },
//   };

//   // try {
//   //   axios.post(
//   //     process.env.REACT_APP_URL +
//   //       process.env.REACT_APP_URL_GENEXUS +
//   //       "apventaconfirmarws",
//   //     xml,
//   //     config
//   //   );
//   //   res.status(200).json("BIEN"); // Cambia el status y la respuesta según tus necesidades

//   //   // Enviar la respuesta al cliente
//   // } catch (error) {
//   //   console.log(error);

//   //   // Enviar una respuesta de error al cliente
//   //   res.status(500).json({ error: "Error al guardar venta" }); // Puedes personalizar el mensaje de error
//   // }

//   axios
//     .post(
//       process.env.REACT_APP_URL +
//         process.env.REACT_APP_URL_GENEXUS +
//         "apventaconfirmarws",
//       xml,
//       config
//     )
//     .then(function (response) {
//       res.status(200).json(response);
//     })
//     .catch(function (error) {
//       res.status(500).json({ error: "Error al guardar venta" });
//     });
// }
