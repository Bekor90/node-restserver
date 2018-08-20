/////// Puerto ////////////

process.env.PORT = process.env.PORT || 3000;

//////Entorno/////

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


/////BD/////

let urlDB;

if(process.env.NODE_ENV === 'dev')
{
	//se colocaria la de localhost ya seria para modo de desarrollo
	urlDB = 'mongodb://bekor:Jhon0730@ds243501.mlab.com:43501/cafe';

}else{
	urlDB = process.env.MONGO_URL;
}

process.env.URLDB = urlDB;


//////vencimiento del Token
///60 seg * 60 min * 24 hor * 30 D

process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;


/////Semilla de autenticacion

process.env.SEED = process.env.SEED || 'semilla';