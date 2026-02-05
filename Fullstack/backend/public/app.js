const feedback = document.getElementById ( 'feedback ' ) ;
const perfil = documento.getElementById ( ' perfil' )
 ;
const logoutButton = document.getElementById ( 'cerrar sesión' ) ;
const tabs = document.querySelectorAll ( '.tab ' ) ;
const forms = document.querySelectorAll ( '.form ' ) ;

const setFeedback = ( mensaje, tipo = 'info' ) => {
 
contenido de texto   de retroalimentación = mensaje;
  retroalimentación className = `feedback ${type} ` ;
};

const saveToken = ( token ) => {
 
  localStorage .setItem ( 'token' , token );
};

const getToken = ( ) => almacenamiento local . getItem ( 'token' );
 

const clearToken = ( ) => localStorage .removeItem ( ' token ' );
 

constante fetchProfile = async ( ) => {
 
  constante token = getToken ();
  si (!token) {
    perfil.textContent = 'No hay ninguna sesión activa. ' ;
    devolver ;
  }

  constante respuesta = await fetch ( '/api/users/me' , {
 
    encabezados : {
      Autorización : `Portador ${token} `
    }
  });

  si (!respuesta.ok )
 {
    perfil.textContent = 'Error al cargar el perfil. ' ;
    devolver ;
  }

  const data = esperar respuesta.json ( );
  perfil.textContent = JSON.stringify ( fecha , null , 2 ) ;
};

const handleAuth = async ( evento, punto final ) => {
 
  evento.preventDefault ()
 ;
  const formData = nuevo FormData (evento. objetivo );
 
  const payload = Object.fromEntries ( formData.entradas ( ) );

  respuesta constante = esperar búsqueda ( `/api/auth/ ${endpoint} ` , {
 
    método : 'POST' ,
    encabezados : {
      'Tipo de contenido' : 'application/json'
    },
    cuerpo : JSON . stringify (carga útil)
  });

  const data = esperar respuesta.json ( );

  si (!respuesta.ok )
 {
    setFeedback (data.error || ' Ocurrió un error' , 'error' );
    devolver ;
  }

  saveToken ( datos.token );
  setFeedback ( 'Autenticación exitosa' , 'éxito' );
  esperar fetchProfile ();
 
};

constante activateTab = ( tabId ) => {
 
  pestañas.forEach ( ( pestaña ) => pestaña.classList.toggle ( ' activo' , pestaña.dataset.tab === tabId ) ) ;
  formularios.forEach ( ( formulario ) => formulario.classList.toggle ( ' activo' , formulario.id === tabId ) );
};

documento . getElementById ( 'inicio de sesión' ). addEventListener ( 'enviar' , ( evento ) => handleAuth (evento, 'inicio de sesión' ));
 
documento . getElementById ( 'registrarse' ). addEventListener ( 'enviar' , ( evento ) => handleAuth (evento, 'registrarse' ));
 

botón_cerrar_sesión.addEventListener ( 'clic' , () = > {
  clearToken ();
  setFeedback ( 'Sesión cerrada' , 'info' );
  perfil.textContent = 'No hay ninguna sesión activa. ' ;
});

pestañas.forEach ( ( pestaña ) = > {
  tabla addEventListener ( 'click' , () => activateTab ( tab.dataset.tab ) ) ;
 
});

obtenerPerfil ();