var args = arguments[0] || {};

$.verFoto.height= Ti.UI.FILL;


if(args.foto!="")
{
	$.verFoto.image=args.foto;
}
if(args.link!=null)
{
	$.verFoto.image=args.link;
}
