const { DOMParser } = require("xmldom");

module.exports = {
  getUser,
};

async function getUser(req, res) {
  try {
    // Definir el cuerpo de la solicitud SOAP
    const soapRequestBody = `
<Envelope xmlns="http://schemas.xmlsoap.org/soap/envelope/">
    <Body>
        <PAlmacenWS.USUARIOLOGUEADO xmlns="Alonso"/>
    </Body>
</Envelope>
`;

    // Configurar los headers
    const headers = new Headers();
    headers.append("Content-Type", "text/xml; charset=utf-8");
    headers.append("SOAPAction", '"Alonsoaction/APALMACENWS.USUARIOLOGUEADO"');
    headers.append("Accept-Language", "es-419,es;q=0.9,en;q=0.8");
    headers.append(
      "Cookie",
      "GX_CLIENT_ID=ea8e3ddf-7bc5-48cb-94c6-2d1141c9927e; GX_SESSION_ID=N3v%2FRGwSI9A%2BAtf33tnolVTfkKXn6zpY3wM1w4%2BR6T8%3D; JSESSIONID=6AE920EDB10D76EF22A5102529A1BFE5; session_id=fe83ac6101af99b6e9486020ffbca52b3749278d; _ga=GA1.1.769312930.1718298310; _ga_WSTZY7HJ3M=GS1.1.1718301839.2.0.1718301839.0.0.0; GxTZOffset=America/Asuncion"
    );

    // Configurar las opciones de la solicitud
    const requestOptions = {
      method: "POST",
      headers: headers,
      body: soapRequestBody,
      redirect: "follow",
    };

    // Hacer la petición fetch
    const response = await fetch(
      "http://192.168.0.126:8080/AlonsoBodega/servlet/com.alonso.apalmacenws",
      requestOptions
    );

    if (!response.ok) {
      throw new Error(
        `Error en la solicitud: ${response.status} ${response.statusText}`
      );
    }

    const result = await response.text();

    // Parsear la respuesta XML para extraer el valor de <Mensaje>
    const doc = new DOMParser().parseFromString(result, "text/xml");
    const mensajeNode = doc.getElementsByTagName("Mensaje")[0];
    const usuario = mensajeNode ? mensajeNode.textContent : "No encontrado";

    // Enviar la respuesta al cliente
    res.status(200).json(usuario);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Error al obtener el usuario logueado" });
  }
}
