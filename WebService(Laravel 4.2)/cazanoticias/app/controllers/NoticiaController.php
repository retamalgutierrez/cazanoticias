<?php

class NoticiaController extends \BaseController {

	public function postGuardarimagen()
	{
		$file = Input::file("media");
		$idNoticia = Request::input('idNoticia');
		$indice = Request::input('indice');

		$filename = $file->getClientOriginalName();
		$extension = $file->getClientOriginalExtension();

		date_default_timezone_set("America/Santiago");
        $dt = date('YmdHis');

		$name = $idNoticia . '_' . $dt . '_' . $indice . '.' . 'jpeg';

		$file->move('img/', $name);



		$multimedia = new Multimedia;
		$multimedia->archivo = $name;
		$multimedia->idNoticias = $idNoticia;
		$multimedia->save();

		return Response::json(array(
	        'error' => false,
	        'imagenes' => $multimedia->toArray()),
	        200
	    );
	}

	public function getImagen()
	{
		$idNoticia = Request::input("idNoticia");
		$archivo = Request::input("archivo");
		$multimedia = Multimedia::where('idNoticias', '=', $idNoticia)
						->where('archivo', '=', $archivo)->first();
		$foto = 'img/' . $multimedia->archivo;

		$image = File::get($foto); 
		$link = Response::make($image, 200, ['content-type' => 'image/jpg']); 
		return $link;
	}

	public function getObtenernoticias()
	{
		/*
		id: 'INTEGER PRIMARY KEY AUTOINCREMENT', NOTICIA
		link: "TEXT"							 USUARIO
	    name: "TEXT",						     USUARIO
	    tipo: "TEXT",							 USUARIO
	    fecha: "TEXT",                           NOTICIA
	    valoracion: "REAL",		                 INFOEXTRA 
	    titulo: "TEXT",							 NOTICIA
	    ubicacion: "TEXT",						 NOTICIA
	    cuerpo: "TEXT",							 NOTICIA
	    visitas: "INTEGER",						 INFOEXTRA
	    cantidadComentarios: "INTEGER",			 COMENTARIOS
	    idUser: "INTEGER"                        USUARIO
	    */

	    //$noticias = Noticia::all();
	    $infoextra = InfoExtra:: all();
	    $comentarios = Comentario::all();	 


	    $limiteInferior = Request::input('inferior');
	    $limiteSuperior = Request::input('superior');
	    if($limiteInferior == $limiteSuperior)
	    {
	    	$limiteSuperior = $limiteSuperior + 1;
	    }

	    $noticias = Noticia::take($limiteSuperior-$limiteInferior)
	    		->skip($limiteInferior)
	    		->orderBy('fecha','desc')
	    		->get();

	    $array = array();
	    //for ($i=$noticias->count()-1; $i >= 0; $i--) {
	    for ($i=0; $i < $noticias->count(); $i++) {
	    	$usuario = Usuario::where('id', '=', $noticias[$i]->idUser)->first(array('link','name','tipo','id'));
	    	$valoracion = InfoExtra::where('idNoticia', '=', $noticias[$i]->id)
	    							->where('valoracion', '<>', 0)
	    							->avg('valoracion');
	    	if(!$valoracion) $valoracion = 5;
	    	$visitas = InfoExtra::where('idNoticia', '=', $noticias[$i]->id)->sum('visita');
	    	$cantidadComentarios = Comentario::where('idNoticia', '=', $noticias[$i]->id)->count();
	    	$fecha = substr($noticias[$i]->fecha, 0, 10);
	    	$hora = substr($noticias[$i]->fecha, 11);
	    	$multimedia = Multimedia::where('idNoticias', '=', $noticias[$i]->id)
	    				->orderBy('archivo')
	    				->get();

	    	$array[$i]['id'] = $noticias[$i]->id;
	    	$array[$i]['link'] = $usuario->link;
	    	$array[$i]['name'] = $usuario->name;
	    	$array[$i]['tipo'] = "Usuario: " . $usuario->tipo;
	    	$array[$i]['fecha'] = $fecha . " a las " . $hora;
	    	$array[$i]['valoracion'] = "Valoracion actual: " . $valoracion;
	    	$array[$i]['titulo'] = $noticias[$i]->titulo;
	    	$array[$i]['fotos'] = $multimedia;
	    	$array[$i]['ubicacion'] = "Ubicacion de la noticia: " . $noticias[$i]->ubicacion;
	    	$array[$i]['cuerpo'] = $noticias[$i]->cuerpo;
	    	$array[$i]['visitas'] = "Visitas: " . $visitas;
	    	$array[$i]['cantidadComentarios'] = "Comentarios: " . $cantidadComentarios;
	    	$array[$i]['idUser'] = $usuario->id;
	    }
	 
	    return Response::json(array(
	        'error' => false,
	        'noticias' => $array),
	        200
	    );
	}

	public function getObtenernoticiacompleta()
	{
		/*
		id: 'INTEGER PRIMARY KEY AUTOINCREMENT', NOTICIA
		link: "TEXT"							 USUARIO
	    name: "TEXT",						     USUARIO
	    tipo: "TEXT",							 USUARIO
	    fecha: "TEXT",                           NOTICIA
	    valoracion: "REAL",		                 INFOEXTRA 
	    titulo: "TEXT",							 NOTICIA
	    ubicacion: "TEXT",						 NOTICIA
	    cuerpo: "TEXT",							 NOTICIA
	    visitas: "INTEGER",						 INFOEXTRA
	    cantidadComentarios: "INTEGER",			 COMENTARIOS
	    idUser: "INTEGER"                        USUARIO
	    */

	    
		//return $multimedia;

	    //$noticias = Noticia::all();
	    $infoextra = InfoExtra:: all();
	    $comentarios = Comentario::all();	 



		$id = Request::input('id');

		$array = array();

		$noticias = Noticia::where('id', '=', $id)->get();

    	$usuario = Usuario::where('id', '=', $noticias[0]->idUser)->first(array('link','name','tipo','id'));
    	$valoracion = InfoExtra::where('idNoticia', '=', $noticias[0]->id)
    							->where('valoracion', '<>', 0)
	    						->avg('valoracion');
    	if(!$valoracion) $valoracion = 5;
    	$visitas = InfoExtra::where('idNoticia', '=', $noticias[0]->id)->sum('visita');
    	$cantidadComentarios = Comentario::where('idNoticia', '=', $noticias[0]->id)->count();
    	$fecha = substr($noticias[0]->fecha, 0, 10);
    	$hora = substr($noticias[0]->fecha, 11);
    	$multimedia = Multimedia::where('idNoticias', '=', $noticias[0]->id)->get();

    	$array[0]['id'] = $noticias[0]->id;
    	$array[0]['link'] = $usuario->link;
    	$array[0]['name'] = $usuario->name;
    	$array[0]['tipo'] = "Usuario: " . $usuario->tipo;
    	$array[0]['fecha'] = $fecha . " a las " . $hora;
    	$array[0]['valoracion'] = "Valoracion actual: " . $valoracion;
    	$array[0]['titulo'] = $noticias[0]->titulo;
    	$array[0]['fotos'] = $multimedia;
    	$array[0]['ubicacion'] = "Ubicacion de la noticia: " . $noticias[0]->ubicacion;
    	$array[0]['cuerpo'] = $noticias[0]->cuerpo;
    	$array[0]['visitas'] = "Visitas: " . $visitas;
    	$array[0]['cantidadComentarios'] = "Comentarios: " . $cantidadComentarios;
    	$array[0]['idUser'] = $usuario->id;
	    
	 
	    return Response::json(array(
	        'error' => false,
	        'noticias' => $array),
	        200
	    );
	}

	public function getBuscarnoticias()
	{
	    $limiteInferior = Request::input('inferior');
	    $limiteSuperior = Request::input('superior');
	    $titulo = Request::input('titulo');
	    if($limiteInferior == $limiteSuperior)
	    {
	    	$limiteSuperior = $limiteSuperior + 1;
	    }

	    $noticias = Noticia::where('titulo', 'LIKE', '%'.$titulo.'%')
	    		->take($limiteSuperior-$limiteInferior)
	    		->skip($limiteInferior)
	    		->orderBy('fecha','desc')
	    		->get();

	    $array = array();
	    //for ($i=$noticias->count()-1; $i >= 0; $i--) {
	    for ($i=0; $i < $noticias->count(); $i++) {
	    	$usuario = Usuario::where('id', '=', $noticias[$i]->idUser)->first(array('link','name','tipo','id'));
	    	$fecha = substr($noticias[$i]->fecha, 0, 10);
	    	$hora = substr($noticias[$i]->fecha, 11);

	    	$array[$i]['id'] = $noticias[$i]->id;
	    	$array[$i]['link'] = $usuario->link;
	    	$array[$i]['name'] = $usuario->name;
	    	$array[$i]['tipo'] = "Usuario: " . $usuario->tipo;
	    	$array[$i]['fecha'] = $fecha . " a las " . $hora;
	    	$array[$i]['titulo'] = $noticias[$i]->titulo;
	    	$array[$i]['ubicacion'] = "Ubicacion de la noticia: " . $noticias[$i]->ubicacion;
	    	$array[$i]['cuerpo'] = $noticias[$i]->cuerpo;
	    	$array[$i]['idUser'] = $usuario->id;
	    }
	 
	    return Response::json(array(
	        'error' => false,
	        'noticias' => $array),
	        200
	    );
	}

	public function getObtenerupdatas()
	{
		$idUser = Request::input('idUser');

		$noticias = Noticia::where('idUser', '=', $idUser)->count();
		$usuario = Usuario::where('id', '=', $idUser)->first(array('tipo'));
	    
	    return Response::json(array(
	        'error' => false,
	        'tipo' => $usuario->tipo,
	    	'cantidad' => $noticias),
	        200
	    );
	}

	public function postGuardar()
	{
	    $noticia = new Noticia;
	    $noticia->titulo = Request::input('titulo');
	    $noticia->cuerpo = Request::input('cuerpo');
	    date_default_timezone_set("America/Santiago");
        $noticia->fecha = date('Y-m-d H:i:s');
	    $noticia->ubicacion = Request::input('ubicacion');
	    $noticia->idUser = Request::input('idUser');
	 
	    $noticia->save();

	    //$dato = Noticia::
	 
	    return Response::json(array(
	        'error' => false,
	        'noticia' => $noticia->id),
	        200
	    );
	}

	public function postGuardarusuario()
	{
	    $usuario = new Usuario;
	    $usuario->id = Request::input('id');
	    $usuario->name = Request::input('name');
	    $usuario->email = Request::input('email');
	    $email = Request::input('email');
	    if($email == null)
	    {
	    	$usuario->email = "oculto";
	    }
	    else
	    {
	    	$usuario->email = $email;
	    }
	    $usuario->sexo = Request::input('sexo');
	    $usuario->link = Request::input('link');
	    $usuario->tipo = Request::input('tipo');
	 
	    Usuario::destroy($usuario->id);
	 	$usuario->save();
	 
	    return Response::json(array(
	        'error' => false,
	        'usuario' => $usuario->toArray()),
	        200
	    );	
	}

	public function postInfoextravisitas()
	{
		$idUsuario = Request::input('idUsuario');
		$idNoticia = Request::input('idNoticia');

		$informacion = InfoExtra::where('idUsuario', '=', $idUsuario)
					->where('idNoticia', '=', $idNoticia)
					->count();

		if($informacion==0)
		{
			$infoextra = new InfoExtra;
			$infoextra->idUsuario = $idUsuario;
			$infoextra->idNoticia = $idNoticia;
			$infoextra->valoracion = 0;
			$infoextra->visita = 1;
			$infoextra->save();

			return Response::json(array(
		        'error' => false,
		        'message' => 'info ingresada'),
		        200
		    );
		}
		else
		{
			$infoActualizada = InfoExtra::where('idUsuario', '=', $idUsuario)
							->where('idNoticia', '=', $idNoticia)
							->first(array('idUsuario','idNoticia','visita'));

			$suma = $infoActualizada->visita + 1;

			InfoExtra::where('idUsuario', '=', $idUsuario)
					 ->where('idNoticia', '=', $idNoticia)
					 ->update(array('visita' => $suma));

			return Response::json(array(
		        'error' => false,
		        'message' => 'info actualizada'),
		        200
		    );
		}
	}

	public function postInfoextravaloracion()
	{
		$idUsuario = Request::input('idUsuario');
		$idNoticia = Request::input('idNoticia');
		$valoracion = Request::input('valoracion');

		InfoExtra::where('idUsuario', '=', $idUsuario)
				 ->where('idNoticia', '=', $idNoticia)
				 ->update(array('valoracion' => $valoracion));

		$valoracionFila = InfoExtra::where('idNoticia', '=', $idNoticia)
									->where('valoracion', '<>', 0)
									->avg('valoracion');

		return $valoracionFila;
	}

	public function getInfoextravaloracionanterior()
	{
		$idUsuario = Request::input('idUsuario');
		$idNoticia = Request::input('idNoticia');

		$valoracionFila = InfoExtra::where('idNoticia', '=', $idNoticia)
									->where('idUsuario', '=', $idUsuario)
									->first(array('valoracion'));

		return $valoracionFila->valoracion;
	}

	public function getObtenergaleria()
	{
		$idNoticia = Request::input('idNoticia');

		$multimedia = Multimedia::where('idNoticias', '=', $idNoticia)
						->orderBy('archivo')
						->get();



		return Response::json(array(
	        'error' => false,
	        'galeria' => $multimedia),
	        200
	    );
	}

	public function getObtenercomentarios()
	{
	    $idNoticia = Request::input('idNoticia');

	    $comentarios = Comentario::where('idNoticia', '=', $idNoticia)
	    					->orderBy('fecha')
	    					->get();

	    $noticia = Noticia::where('id', '=', $idNoticia)
	    					->first(array('idUser'));

	    //$usuario = Usuario::where('id', '=', $comentarios->idUsuario)
	    //					->first(array('link','name','tipo','id'));
	    	

	    $array = array();
	    //for ($i=$noticias->count()-1; $i >= 0; $i--) {
	    for ($i=0; $i < $comentarios->count(); $i++) {
	    	$array[$i]['id'] = $comentarios[$i]->id;
	    	$array[$i]['textoComentario'] = $comentarios[$i]->textoComentario;

	    	$fechaTotal = $comentarios[$i]->fecha;
	    	$fecha = substr($fechaTotal, 0, 10);
		    $hora = substr($fechaTotal, 11);

	    	$array[$i]['fecha'] = $fecha . " a las " . $hora;
	    	$array[$i]['idNoticia'] = $comentarios[$i]->idNoticia;

	    	$usuario = Usuario::where('id', '=', $comentarios[$i]->idUsuario)
	    					->first(array('link','name','tipo','id'));

	    	$array[$i]['name'] = $usuario->name;
	    	$array[$i]['link'] = $usuario->link;
	    	$array[$i]['tipo'] = $usuario->tipo;
	    	$array[$i]['idUser'] = $usuario->id;
	    }
	 
	    return Response::json(array(
	        'error' => false,
	        'comentarios' => $array),
	        200
	    );
	}

	public function postComentar()
	{
		$idNoticia = Request::input('idNoticia');
		$textoComentario = Request::input('textoComentario');
		$idUsuario = Request::input('idUsuario');

		
	    $comentario = new Comentario;

	    $comentario->textoComentario = $textoComentario;
	    date_default_timezone_set("America/Santiago");
	    $comentario->fecha = date('Y-m-d H:i:s');
	    $comentario->idNoticia = $idNoticia;
	    $comentario->idUsuario = $idUsuario;

	 	$comentario->save();
	 
	    return Response::json(array(
	        'error' => false,
	        'comentario' => 'comentario ingresado'),
	        200
	    );
	}
}