"""Genera el brief de diseño de Uppercat. Ejecutar desde la raíz del repositorio."""
from pathlib import Path
import os
import json
from xml.sax.saxutils import escape
from reportlab.pdfgen import canvas
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, Image, Flowable
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.enums import TA_LEFT
from PIL import Image as PILImage
from pypdf import PdfReader

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'output/pdf/Uppercat-brief-diseno-web.pdf'
OUT.parent.mkdir(parents=True, exist_ok=True)
REF = ROOT / 'docs/design-reference'
W, H = 595.276, 841.89
INK = colors.HexColor('#1f1f1f')
PINK = colors.HexColor('#c31c6b')
BLUE = colors.HexColor('#2967eb')
GRAY = colors.HexColor('#64646b')
LIGHT = colors.HexColor('#f0edf0')
fontdir = Path(os.environ.get('WINDIR', 'C:/Windows')) / 'Fonts'
if (fontdir / 'arial.ttf').exists():
    pdfmetrics.registerFont(TTFont('Body', str(fontdir / 'arial.ttf')))
    pdfmetrics.registerFont(TTFont('BodyBold', str(fontdir / 'arialbd.ttf')))
else:
    pdfmetrics.registerFont(TTFont('Body', str(ROOT / 'public/fonts/Anton-Regular.ttf')))
    pdfmetrics.registerFont(TTFont('BodyBold', str(ROOT / 'public/fonts/Anton-Regular.ttf')))
pdfmetrics.registerFontFamily('Body', normal='Body', bold='BodyBold', italic='Body', boldItalic='BodyBold')
pdfmetrics.registerFont(TTFont('Display', str(ROOT / 'public/fonts/Anton-Regular.ttf')))
styles = getSampleStyleSheet()
styles.add(ParagraphStyle(name='BodyText2', fontName='Body', fontSize=10, leading=15, textColor=INK, spaceAfter=10))
styles.add(ParagraphStyle(name='Small2', fontName='Body', fontSize=8, leading=11.5, textColor=GRAY, spaceAfter=7))
styles.add(ParagraphStyle(name='Title2', fontName='Display', fontSize=31, leading=36, textColor=INK, spaceAfter=17))
styles.add(ParagraphStyle(name='Sub2', fontName='BodyBold', fontSize=12, leading=16, textColor=PINK, spaceBefore=12, spaceAfter=9))
styles.add(ParagraphStyle(name='Cell2', fontName='Body', fontSize=8.1, leading=11.5, textColor=INK))
styles.add(ParagraphStyle(name='CellHead2', fontName='BodyBold', fontSize=8, leading=11, textColor=colors.white))
styles.add(ParagraphStyle(name='CoverTitle2', fontName='Display', fontSize=64, leading=67, textColor=colors.white, spaceAfter=22))
styles.add(ParagraphStyle(name='CoverBody2', fontName='Body', fontSize=13, leading=20, textColor=colors.HexColor('#d8c9d1'), spaceAfter=15))

story = []
def para(text, style='BodyText2'):
    return Paragraph(text, styles[style])
def p(text): story.append(para(text))
def sub(text): story.append(para(text, 'Sub2'))
def small(text): story.append(para(text, 'Small2'))
def title(num, text, intro=None):
    if story: story.append(PageBreak())
    story.append(para(f'{num:02d} / DISEÑO WEB', 'Small2'))
    story.append(para(text, 'Title2'))
    if intro: p(intro)
def bullets(items):
    for item in items: p(f'<font color="#c31c6b">•</font>  {item}')
def table(headers, rows, widths, compact=False):
    data = [[para(escape(h), 'CellHead2') for h in headers]]
    data += [[para(str(c), 'Cell2') for c in row] for row in rows]
    t = Table(data, colWidths=widths, repeatRows=1, hAlign='LEFT')
    t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), INK), ('VALIGN',(0,0),(-1,-1),'TOP'),
        ('LEFTPADDING',(0,0),(-1,-1),9), ('RIGHTPADDING',(0,0),(-1,-1),9),
        ('TOPPADDING',(0,0),(-1,-1),4 if compact else 9), ('BOTTOMPADDING',(0,0),(-1,-1),4 if compact else 9),
        ('ROWBACKGROUNDS',(0,1),(-1,-1),[LIGHT, colors.white]),
        ('LINEBELOW',(0,-1),(-1,-1),.5,colors.HexColor('#cccccc')),
    ]))
    story.append(t); story.append(Spacer(1, 12))
def image(path, maxw=499, maxh=300):
    if not path.exists():
        small('Referencia visual pendiente de captura. La estructura de las páginas anteriores define el diseño actual.')
        return
    with PILImage.open(path) as im: w,h=im.size
    ratio=min(maxw/w,maxh/h)
    story.append(Image(str(path), width=w*ratio, height=h*ratio, hAlign='LEFT'))
    story.append(Spacer(1,12))

class Palette(Flowable):
    def __init__(self): super().__init__(); self.width=499; self.height=105
    def draw(self):
        entries=[('#1f1f1f','Carbón'),('#f0f0f0','Blanco'),('#f04499','Rosa'),('#3b0826','Ciruela'),('#2967eb','Azul'),('#bb0707','Rojo')]
        for i,(hexval,name) in enumerate(entries):
            x=i*84; self.canv.setFillColor(colors.HexColor(hexval)); self.canv.roundRect(x,45,73,55,7,fill=1,stroke=0)
            self.canv.setFillColor(INK); self.canv.setFont('BodyBold',8); self.canv.drawString(x,29,name)
            self.canv.setFont('Body',8); self.canv.drawString(x,15,hexval)

class Wireframes(Flowable):
    def __init__(self): super().__init__(); self.width=499; self.height=295
    def draw(self):
        c=self.canv
        def box(x,y,w,h,label,fill):
            c.setFillColor(colors.HexColor(fill)); c.roundRect(x,y,w,h,4,fill=1,stroke=0)
            c.setFillColor(colors.white if fill not in ['#eeeeee','#f0f0f0'] else INK); c.setFont('BodyBold',7); c.drawString(x+8,y+h/2-2,label)
        c.setFillColor(INK);c.roundRect(0,0,325,285,10,fill=1,stroke=0)
        box(10,249,305,26,'LOGO       HOME / SERVICIOS / FOLIO / TIENDA       CTA','#eeeeee')
        box(10,133,305,108,'TITULAR HTML + FONDO FOTOGRÁFICO','#6b4457')
        box(10,100,305,25,'DISCIPLINAS O LOGOS REALES','#eeeeee')
        for i in range(3):box(10+i*103,18,97,74,'SERVICIO 0'+str(i+1),'#444444')
        c.setFillColor(INK);c.roundRect(365,0,126,285,12,fill=1,stroke=0)
        box(372,253,112,22,'LOGO     CTA    MENÚ','#eeeeee')
        box(372,90,112,155,'HERO VERTICAL','#6b4457')
        box(372,62,112,20,'DISCIPLINAS','#eeeeee')
        box(372,10,89,45,'TARJETA + SWIPE','#444444')

def frame(c, doc):
    if doc.page == 1:
        c.setFillColor(INK); c.rect(0,0,W,H,fill=1,stroke=0)
        c.setFillColor(colors.HexColor('#711940'));c.circle(560,130,205,fill=1,stroke=0)
        c.setStrokeColor(colors.HexColor('#f04499'));c.setLineWidth(8)
        import math
        for angle in range(0,360,45):
            a=math.radians(angle);c.line(488+32*math.cos(a),175+32*math.sin(a),488+125*math.cos(a),175+125*math.sin(a))
    else:
        c.setFillColor(PINK);c.rect(0,H-8,W,8,fill=1,stroke=0)
        c.setFillColor(GRAY);c.setFont('BodyBold',8);c.drawString(48,H-34,'UPPERCAT / BRIEF PARA DISEÑO')
        c.setFont('Body',8);c.drawRightString(W-48,H-34,'18 OCTUBRE 2026 · V1')
        c.setStrokeColor(colors.HexColor('#dddddd'));c.line(48,41,W-48,41)
        c.setFont('Body',7);c.drawString(48,27,'Portafolio + catálogo  /  Documento de trabajo')
        c.drawRightString(W-48,27,f'{doc.page:02d}')

# 1
story.append(Spacer(1,35))
story.append(para('UPPERCAT', 'CoverTitle2'))
story.append(para('BRIEF DE<br/>DISEÑO WEB', 'CoverTitle2'))
story.append(Spacer(1,15))
story.append(para('Portafolio creativo + catálogo de productos.<br/>Guía de dirección visual, imágenes, contenido<br/>y entrega para completar la web.', 'CoverBody2'))
story.append(Spacer(1,28))
story.append(para('18 OCTUBRE 2026 / VERSIÓN 1<br/>Base funcional: Next.js + React + TypeScript<br/>Artista: Uppercat', 'CoverBody2'))
story.append(Spacer(1,26))
story.append(para('60 espacios de imagen identificados.<br/>Las medidas son recomendaciones de exportación.<br/>Las capturas muestran la implementación actual,<br/>con reservas donde faltan los archivos definitivos.', 'CoverBody2'))

# 2
title(2,'EL PUNTO DE PARTIDA','La web presenta a Uppercat y convierte el interés por su trabajo o su colección en una conversación directa. El diseñador debe completar la identidad y las piezas visuales dentro de una estructura ya implementada.')
table(['Confirmado','Dato de trabajo'],[
 ('Nombre del artista','Uppercat. Sustituye TU MARCA y CARA CATO del HTML de referencia.'),
 ('WhatsApp','+56 9 3345 7166. Todos los CTA de consulta apuntan a esta cuenta.'),
 ('Correo','uppercat@gmail.com'),
 ('Páginas','Inicio / y Tienda /tienda. Catálogo de cinco espacios, sin cobro en línea.'),
 ('Línea visual','Carbón, bloques claros, rosa, ciruela y cierre azul. Tipografía condensada y composición expresiva.'),
 ('Archivo de origen','landing_portafolio_cara_cato_FINAL/landing_portafolio. Se conserva como referencia, no como aplicación activa.'),
], [125,374])
sub('Material aún no entregado')
bullets(['Fotografías, ilustraciones, logos oficiales y fichas finales de proyectos.', 'Nombres, precios, materiales, medidas, disponibilidad y fotos de los cinco productos.', 'Testimonios reales, permisos de uso y perfiles sociales oficiales.'])
small('No utilizar Oxford, Canon, Entel o Rally Copec como clientes confirmados: eran referencias del HTML. Tampoco está confirmado el descuento del 10%, por lo que no aparece en la versión migrada.')

# 3
title(3,'MAPA DE LA EXPERIENCIA','Dos recorridos principales: conocer el trabajo para encargar diseño, o explorar un objeto para consultar su disponibilidad.')
table(['Orden','Inicio /','Objetivo de diseño'],[
 ('01','Header + tres portadas','Presentar la voz del artista y abrir una consulta.'),
 ('02','Disciplinas / marcas','Contexto rápido. Logos solo con autorización.'),
 ('03','Habilidades','Cinco servicios; tres tarjetas visibles en escritorio.'),
 ('04','Packaging','Dos mosaicos con seis piezas en total.'),
 ('05','Diseño de menú','Cuatro cartas accesibles mediante acordeón.'),
 ('06','Ilustración','Obra principal + ocho miniaturas + ampliación.'),
 ('07','Redes sociales','Diez piezas, dos filas de cinco, ampliables.'),
 ('08','Diseño interior','Una imagen panorámica con titular superpuesto.'),
 ('09','Testimonios','Sección reservada; reseñas solo con contenido real.'),
 ('10','Acceso a tienda + footer','Tres vistas de producto y contacto directo.'),
], [40,164,295])
sub('Tienda /tienda')
p('Header compartido → presentación + tres destacados + audio manual → cinco productos → tres pasos de compra → contacto. Los destacados y las tarjetas reutilizan shop1, shop2 y shop3; no requieren imágenes duplicadas.')
small('El índice lateral enlaza nueve anclas del inicio. En anchos habituales se despliega con el botón ÍNDICE para evitar cubrir las piezas. El botón de WhatsApp permanece accesible en ambas páginas.')

# 4
title(4,'DIRECCIÓN VISUAL','La identidad debe sentirse artística, directa y con carácter. El protagonismo lo tienen las obras; las formas y el color acompañan su lectura.')
story.append(Palette())
sub('Tipografía y jerarquía')
table(['Nivel','Implementación actual','Criterio para el diseño'],[
 ('Titulares','Anton, mayúsculas, interlineado cercano a 1.05','Usar bloques breves. Evitar párrafos en tipografía condensada.'),
 ('Texto y UI','DM Sans, pesos 400 a 800','Texto legible, etiquetas pequeñas con espaciado; conservar contraste.'),
 ('Escala desktop','Hero hasta 124 px; títulos hasta 155 px','Los tamaños son fluidos y se ajustan al ancho.'),
 ('Escala móvil','Hero desde 52 px; texto 12 a 14 px','Revisar palabras largas y mantener CTA visibles.'),
], [89,190,220])
sub('Formas y composición')
bullets(['Navegación blanca en cápsula, tarjetas redondeadas y flechas circulares. Radios de 13 a 30 px según componente.', 'Retícula generosa: ancho de contenido máximo de 1320 px y portada máxima de 1440 px. Márgenes móviles desde 18 px; portada y header usan 12 px.', 'Usar el asterisco como acento provisional. El logo tipográfico actual y el icono U son provisionales; entregar identidad aprobada antes de considerarlos definitivos.'])
small('Las fuentes están alojadas localmente con sus licencias OFL. Si se cambian por otras, entregar fuentes web y licencia correspondiente. Los textos sobre fotografías necesitan una zona tranquila y contraste suficiente.')

# 5
title(5,'RESPONSIVE Y COMPOSICIÓN','El mismo contenido debe funcionar en escritorio y móvil. Estas maquetas explican la organización, no sustituyen el archivo editable de diseño.')
story.append(Wireframes());story.append(Spacer(1,16))
table(['Ancho de referencia','Comportamiento requerido'],[
 ('1440 px escritorio','Tres servicios y tres productos por vista; hero horizontal; ilustración en dos columnas.'),
 ('768 px tableta','Ajustar retícula y encabezados; catálogo con dos productos por vista.'),
 ('390 px móvil','Menú desplegable; hero alto; ilustración apilada; catálogo con una tarjeta y parte de la siguiente.'),
 ('320 px mínimo','Sin desplazamiento horizontal de toda la página. Los carruseles conservan su scroll interno.'),
], [135,364])
p('Preparar diseños al menos en 1440 y 390 px. Revisar además 320 y 768 px. No convertir la web en una sola imagen larga: títulos, enlaces y controles permanecen como elementos HTML.')
small('Los archivos actuales usan centrado de imagen. Si una foto exige encuadre distinto en móvil, entregar un recorte adicional y señalar que su integración responsive deberá añadirse; hoy no existe una segunda clave móvil en el manifiesto.')

# 6
title(6,'HEADER Y PORTADAS','Tres fondos distintos para presentar el universo de Uppercat. Cada banner inicia una conversación con un mensaje específico, sin mezclar los controles con el enlace de consulta.')
table(['Clave','Dirección de la pieza','Texto HTML actual'],[
 ('hero1','Universo creativo. Paleta ciruela y rosa. Imagen o composición que resuma la firma del artista.','IDEAS CON CARÁCTER. / Diseño que conecta tu marca con su propia forma de ver el mundo.'),
 ('hero2','Identidad aplicada: packaging o carta. Paleta azul grisácea.','TU MARCA, OTRA MIRADA. / Del packaging a la carta. Una identidad en cada detalle.'),
 ('hero3','Ilustración o arte. Paleta tierra con acento vibrante.','TRAZOS QUE DICEN ALGO. / Ilustración, contenido y espacios con una voz propia.'),
], [50,225,224])
sub('Producción de imagen')
bullets(['Tres archivos WebP o AVIF, recomendación 2880 × 1800 px como master adaptable. Referencia de vista desktop cercana a 2.3:1; en móvil la imagen se recorta a un bloque vertical.', 'Dejar aire en la mitad izquierda para el titular y la bajada. Reservar aproximadamente 90 px inferiores del bloque para controles. No exportar botones, textos del hero o flechas dentro del fondo.', 'Colocar el motivo principal donde sobreviva al recorte central. Entregar una prueba a 390 px; preferir composiciones abstractas o escenas amplias si no se integra una variante móvil.', 'Peso objetivo hasta 450 KB por portada. Exportar en sRGB, sin marcas de agua ni texto accidental de mockup.'])
sub('Identidad pendiente')
p('Entregar wordmark Uppercat en SVG, versión clara y oscura, zona de seguridad y favicon cuadrado. El SVG del logo debe quedar limpio de texto editable externo o dependencias. La integración del logo final se realiza en el header y footer, fuera de las 60 claves de fotografía.')

# 7
title(7,'PACKAGING Y CARTAS','Mostrar el objeto completo y permitir leer su diseño. Estas áreas usan ajuste contain: pueden aparecer márgenes si la proporción del archivo no coincide con el contenedor.')
sub('Packaging / pack1 a pack6')
p('Dos mosaicos. Cada mosaico tiene una pieza alta a la izquierda y dos apaisadas a la derecha. pack1, pack2 y pack3 forman el primero; pack4, pack5 y pack6, el segundo. El desplazamiento se puede pausar, arrastrar o controlar con flechas.')
table(['Piezas','Exportación sugerida','Qué debe verse'],[
 ('pack1, pack4','1400 × 1800 px, vertical','Envase o conjunto completo; silueta, marca y material legibles.'),
 ('pack2, pack3, pack5, pack6','1600 × 1000 px, horizontal','Detalle, variante o aplicación. Mantener unidad de luz y perspectiva.'),
 ('packHeader, opcional','1800 × 650 px, transparente','Acento gráfico sobre el encabezado. Evitar repetir el título PACKAGING.'),
], [110,169,220])
sub('Menús / menu1 a menu4')
p('Cuatro proyectos diferentes, cada uno con su título y fotografía. Exportar una vista horizontal de 2000 × 1200 px por proyecto; el modal no existe en esta sección, por lo que una carta con texto diminuto debe acompañarse de una composición editorial que muestre su identidad.')
bullets(['No comprimir una carta entera en una foto ilegible. Priorizar el objeto, material y composición; entregar el PDF original de la carta como respaldo de diseño, fuera de las imágenes web.', 'Cada ficha necesita nombre real del proyecto, rubro, encargo, año, rol de Uppercat y una descripción breve. La web muestra por ahora Carta 01 a Carta 04.', 'No añadir títulos o CTA al mockup si ya aparecen en la interfaz. Conservar bordes completos y sombras naturales.'])
small('Objetivo de peso: hasta 350 KB por imagen de packaging o menú. Conservar master editable con mockups, enlaces y permisos de uso identificados.')

# 8
title(8,'ILUSTRACIÓN Y REDES','Aquí la imagen debe ser la obra. La selección de miniatura cambia el visualizador; ampliar abre un modal con imagen y ficha. Las piezas sociales abren directamente su propio modal.')
sub('Ilustración / nueve archivos')
table(['Claves','Recomendación','Contenido'],[
 ('illustrationMain','1800 × 1800 px o proporción de la obra','Una pieza que represente el universo visual de Uppercat.'),
 ('illustration1 a illustration8','1600 px en el lado largo; mínimo 1200 px','Ocho obras distintas. Conservar un encuadre central útil para la miniatura.'),
 ('illustrationArt, opcional','1400 × 1600 px, fondo transparente','Gráfica decorativa del encabezado. Dejar legible el título ILUSTRACIÓN en HTML.'),
], [123,172,204])
p('El visualizador y las miniaturas usan recorte cover; el modal usa contain y conserva la proporción original. Entregar un master sin recorte para ampliación y evitar firmas o detalles importantes pegados al borde. La implementación actual reutiliza el mismo archivo en ambos contextos.')
sub('Redes sociales / social1 a social10')
bullets(['Diez diseños: social1 a social5 en la fila superior; social6 a social10 en la inferior. Las filas inician en sentidos opuestos y rebotan en los extremos; no se duplican las tarjetas.', 'Exportar 1080 × 1350 px, proporción 4:5. Si una pieza es cuadrada, mantenerla completa dentro de un lienzo 4:5 o señalar el recorte aprobado.', 'Cada modal necesita título, marca/campaña, objetivo, año y descripción de 30 a 60 palabras. No escribir esos datos como una placa adicional sobre la obra.', 'No confundir una pieza de portafolio con un perfil social oficial. Los enlaces de Instagram, Behance o TikTok solo se habilitan cuando se reciban las URL reales.'])
small('Peso objetivo: 250 KB por pieza social y 350 KB por ilustración. Una imagen de modal puede llegar a 500 KB si el detalle visual lo justifica.')

# 9
title(9,'ESPACIOS, MARCAS Y RESEÑAS','Estas piezas aportan contexto y confianza. Deben documentar trabajo real y mantener un estándar fotográfico coherente.')
sub('Diseño interior / interior')
p('Una escena amplia de 2600 × 1500 px. Mostrar profundidad, materiales y un punto de interés claro. Evitar verticales deformadas y luces quemadas. El texto DISEÑO INTERIOR se superpone a la izquierda: entregar esa zona con poco ruido visual. El fondo se recorta con cover.')
sub('Marcas / brand1 a brand10')
p('Hasta diez logos autorizados. Exportar SVG preferentemente o PNG/WebP transparente de 800 × 300 px. Misma escala óptica y área segura, sin estirar logos para igualar sus dimensiones. La banda usa ajuste contain; la cantidad efectiva depende de las marcas confirmadas.')
small('Actualmente brands está vacío: se ve una banda de disciplinas, no logos de clientes de ejemplo. Para habilitar cada marca se necesita su nombre, archivo y autorización.')
sub('Testimonios / review1 a review9')
p('Hasta nueve fotos de 400 × 400 px. Retrato centrado, luz uniforme y recorte circular. Por testimonio se requiere: cita real de 20 a 45 palabras, nombre, marca, relación con el proyecto y autorización de publicación.')
small('Actualmente reviews está vacío. La sección muestra un mensaje de reserva y no atribuye opiniones a personas ficticias. Al recibir reseñas se activa el carrusel desde el archivo de contenido.')
sub('Mascota o firma / footerMascot')
p('Pieza opcional de 800 × 800 px con transparencia para sustituir el sello tipográfico del footer. Dibujar una silueta legible en tamaños pequeños. Mantener margen de seguridad de 10% y entregar vector editable. Hasta recibirla, el sello es una composición tipográfica de Uppercat.')

# 10
title(10,'TIENDA: CINCO PIEZAS','El catálogo es una conversación de compra. No contiene carrito, pago, inventario automático ni confirmación de pedido. Diseñar una presentación clara que ayude a consultar.')
table(['Pieza','Uso en la web','Entrega requerida'],[
 ('shop1, shop2, shop3','Banner del inicio + destacados + catálogo','Tres fotos individuales, consistentes entre sí.'),
 ('shop4, shop5','Catálogo','Dos fotos con el mismo fondo, escala e iluminación.'),
 ('Cada producto','Tarjeta y consulta WhatsApp','Nombre real, categoría, precio o política de consulta, descripción, medidas, materiales y disponibilidad.'),
], [105,175,219])
sub('Fotografía de producto')
bullets(['Exportar cinco imágenes de 1600 × 1600 px. Fondo neutro o transparente, objeto completo centrado y margen de 12% a 15%. La web usa contain para no cortar el producto.', 'Mantener iluminación, temperatura, sombras y posición de cámara coherentes. Evitar accesorios que parezcan incluidos si no se venden con el artículo.', 'Entregar las fotos sin precio, descuento o botón incrustado. El nombre y el CTA se muestran como HTML y el mensaje de WhatsApp se genera desde la ficha.', 'Peso objetivo hasta 300 KB por imagen. Adjuntar master de alta resolución para futuros recortes.'])
sub('Estado comercial')
p('Los cinco nombres actuales son Producto 01 a Producto 05 y la colección se indica en preparación. No presentar estos espacios como stock confirmado. Definir también despacho, retiro, tiempos de producción, personalización y cambios para responder las consultas de forma consistente.')
small('La huincha actual dice HECHO CON IDEAS PROPIAS / HECHO POR UPPERCAT. Si se aprueba una promoción, entregar condiciones, vigencia y productos incluidos antes de reemplazarla. La música es manual y la pista incluida es una demostración de 25,6 segundos en loop, según el README original.')

# 11
title(11,'TEXTOS Y FICHAS EDITABLES','Entregar los textos en un documento o planilla, asociados a las claves de imagen. El equipo debe poder actualizar contenido sin abrir archivos de diseño.')
table(['Campo','Proyecto de portafolio','Producto'],[
 ('Identificador','Ejemplo: illustration2 o menu3','Ejemplo: shop2'),
 ('Título','Nombre del proyecto, 2 a 6 palabras','Nombre comercial, 2 a 6 palabras'),
 ('Contexto','Marca, rubro, encargo y año','Categoría, material y uso'),
 ('Descripción','30 a 60 palabras. Problema, enfoque y resultado comprobable.','25 a 45 palabras. Beneficio, material, tamaño y cuidados.'),
 ('Rol','Qué realizó Uppercat y quién colaboró','Autoría, fabricación o personalización'),
 ('Datos extra','Créditos, permiso del cliente y texto alternativo','Precio en CLP, medidas, stock, entrega y variantes'),
], [92,203,204])
sub('Voz de marca propuesta')
p('Breve, cercana y segura. Hablar desde el oficio, sin cifras ni resultados inventados. Mantener “Uppercat” con la misma escritura en todos los textos. Los titulares actuales son una propuesta editorial y pueden ajustarse sin cambiar la estructura.')
sub('Texto alternativo')
p('Describir lo que aporta la imagen. Ejemplo de estructura: “Caja plegable de [marca], vista frontal, con ilustración de [motivo]”. No escribir “imagen 1”, nombres de archivo ni una lista de palabras clave. Completar los ejemplos con la información real de cada pieza.')
sub('Contacto aprobado')
p('Nombre: Uppercat.<br/>WhatsApp: +56 9 3345 7166.<br/>Correo: uppercat@gmail.com.<br/>Redes: pendientes de URL oficial.<br/>La consulta por producto incluye su nombre y solicita precio, disponibilidad y entrega.')

# 12
title(12,'ESTÁNDAR DE ARCHIVOS','Las medidas siguientes son recomendaciones de producción para la retícula actual. No son medidas de impresión ni tamaños rígidos del navegador.')
table(['Familia','Cantidad','Master sugerido','Peso web objetivo'],[
 ('Portadas','3','2880 × 1800 px','450 KB / archivo'),
 ('Logos de clientes','Hasta 10','SVG o 800 × 300 px','50 KB'),
 ('Packaging','6','2 verticales 1400 × 1800;<br/>4 horizontales 1600 × 1000','350 KB'),
 ('Cartas','4','2000 × 1200 px','350 KB'),
 ('Ilustraciones','9','1600 a 1800 px lado largo','350 KB; modal hasta 500'),
 ('Redes sociales','10','1080 × 1350 px','250 KB'),
 ('Interior','1','2600 × 1500 px','450 KB'),
 ('Reseñas','Hasta 9','400 × 400 px','60 KB'),
 ('Productos','5','1600 × 1600 px','300 KB'),
 ('Gráficas opcionales','3','Según uso; fondo transparente','150 KB'),
], [119,57,211,112])
sub('Reglas de exportación')
bullets(['Formato de imagen: WebP/AVIF para fotos, PNG cuando la transparencia lo exija y SVG limpio para logos. Perfil sRGB. No usar CMYK ni DPI como criterio de calidad web.', 'Nombrar según la clave: pack1.webp, menu2.webp, shop5.webp. Evitar espacios, tildes, versiones ambiguas y nombres como final_final2.', 'Entregar también los masters editables y los enlaces originales. El paquete web no debe incluir archivos pesados de producción.'])
small('La implementación tiene 60 claves: 57 espacios de contenido y 3 gráficas opcionales. El máximo contempla diez marcas y nueve reseñas; publicar solo las que se reciban con datos reales.')

def inventory(keys, purpose):
    return [(key, f'{key}.webp', purpose(key)) for key in keys]

# 13
title(13,'INVENTARIO / A','Asignar los nombres de archivo a estas claves exactas. Un campo vacío mantiene la reserva de imagen; no genera una solicitud a un archivo inexistente.')
rows=[]
rows += inventory([f'hero{i}' for i in range(1,4)],lambda k:'Portada '+k[-1]+'; fondo con texto HTML superpuesto.')
rows += inventory([f'brand{i}' for i in range(1,11)],lambda k:'Logo autorizado de cliente; SVG preferido.')
rows += inventory([f'pack{i}' for i in range(1,7)],lambda k:'Mosaico '+('1' if int(k[4:])<=3 else '2')+'; '+('vertical.' if k in ['pack1','pack4'] else 'horizontal.'))
rows += inventory([f'menu{i}' for i in range(1,5)],lambda k:'Fotografía del proyecto Carta '+k[-1]+'.')
table(['Clave','Archivo propuesto','Ubicación y criterio'],rows,[103,137,259],compact=True)
small('23 claves en esta página. Para brand1 a brand10 se admite .svg en lugar de .webp. El manifiesto debe apuntar a la extensión que se entregue realmente.')

# 14
title(14,'INVENTARIO / B','Las obras se reutilizan en miniaturas, visualizador o modal. Un mismo identificador debe corresponder siempre a la misma pieza.')
rows=inventory(['illustrationMain'],lambda k:'Obra principal del visualizador de ilustración.')
rows+=inventory([f'illustration{i}' for i in range(1,9)],lambda k:'Miniatura '+k.replace('illustration','')+' y obra ampliada en modal.')
rows+=inventory([f'social{i}' for i in range(1,11)],lambda k:'Fila '+('superior' if int(k[6:])<=5 else 'inferior')+' y modal de redes sociales.')
rows+=inventory(['interior'],lambda k:'Fondo de la sección Diseño interior; recorte cover.')
table(['Clave','Archivo propuesto','Ubicación y criterio'],rows,[111,145,243],compact=True)
small('20 claves en esta página. Las fichas de ilustración y redes se editan junto a sus claves en data/site.ts. Entregar el título y la descripción en texto, separados del archivo gráfico.')

# 15
title(15,'INVENTARIO / C','Productos, retratos y gráficas opcionales completan el inventario. La cantidad máxima no obliga a inventar contenido para llenar espacios.')
rows=inventory([f'shop{i}' for i in range(1,6)],lambda k:'Producto '+k[-1]+(' en catálogo, portada de tienda y banner del inicio.' if int(k[-1])<4 else ' en catálogo.'))
rows+=inventory([f'review{i}' for i in range(1,10)],lambda k:'Retrato del testimonio '+k.replace('review','')+'; publicación condicionada a datos reales.')
rows+=inventory(['packHeader','illustrationArt','footerMascot'],lambda k:{'packHeader':'Gráfica opcional en encabezado de packaging.','illustrationArt':'Gráfica opcional en encabezado de ilustración.','footerMascot':'Firma o mascota opcional del footer.'}[k])
table(['Clave','Archivo propuesto','Ubicación y criterio'],rows,[102,133,264],compact=True)
sub('Balance del inventario')
p('Página A: 23 claves. Página B: 20 claves. Página C: 17 claves. Total: <b>60</b>. De ellas, 19 corresponden a marcas y testimonios que permanecen sin publicar hasta tener contenido real. Las tres gráficas de encabezado o firma son opcionales.')
small('Logo principal, favicon y variante de imagen móvil son entregables complementarios, fuera de estas 60 claves. La pista Lo-Fi existente es un archivo de audio aparte.')

# 16
title(16,'CAPTURAS / ESCRITORIO','Referencia visual de la implementación funcional. Las reservas no son imágenes finales ni ejemplos de trabajo realizado.')
image(REF/'home-desktop.png',maxh=240)
small('Inicio: cápsula de navegación, composición de portada, tipografía y controles. El color de fondo cambia entre las tres portadas.')
image(REF/'shop-desktop.png',maxh=240)
small('Tienda: presentación de la colección, destacados y reproductor manual. El catálogo continúa bajo la primera vista.')

# 17
title(17,'CAPTURAS / MÓVIL','Referencias a 390 px. Revisar el flujo vertical, los cortes de titular, el botón de menú y la continuidad de cada galería.')
imgs=[]
for filename in ['home-mobile.png','shop-mobile.png']:
    path=REF/filename
    if path.exists():
        with PILImage.open(path) as im: iw,ih=im.size
        scale=min(234/iw,470/ih)
        imgs.append(Image(str(path),width=iw*scale,height=ih*scale))
    else: imgs.append(para('Captura móvil pendiente.','Small2'))
t=Table([imgs],colWidths=[249.5,249.5]);t.setStyle(TableStyle([('VALIGN',(0,0),(-1,-1),'TOP'),('LEFTPADDING',(0,0),(-1,-1),0)]));story.append(t);story.append(Spacer(1,18))
table(['Inicio','Tienda'],[('La portada prioriza el mensaje. La banda de disciplinas se adapta al ancho y el índice se despliega desde abajo.','El reproductor ocupa su propia línea. El destacado pasa bajo el título; el catálogo permite swipe horizontal.')],[249.5,249.5])
small('Antes de aprobar cada imagen, probarla tanto en el bloque de escritorio como en el móvil. El recorte central automático puede desplazar el motivo o cortar bordes de una composición.')

# 18
title(18,'ENTREGA Y APROBACIÓN','El objetivo de la entrega es reemplazar las reservas sin reconstruir las interacciones ni perder legibilidad. Presentar cada pieza con su clave y estado de aprobación.')
sub('Paquete del diseñador')
bullets(['Archivo editable en Figma, Illustrator o equivalente: portada, componentes, retícula, tokens y versiones 1440/390 px. Incluir estados de hover, foco, selección y menú móvil.', 'Carpeta web/ con imágenes optimizadas y nombres del inventario. Carpeta masters/ con originales y mockups editables. Carpeta brand/ con SVG, favicon, paleta y tipografías licenciadas.', 'Documento o planilla de contenido con clave, título, descripción, alt, crédito, permiso y estado. Para productos, incorporar precio, materiales, medidas, variantes y disponibilidad.', 'Listado de cambios propuestos que requieran desarrollo adicional: imagen móvil distinta, video, páginas de proyecto, nuevos productos o compra en línea.'])
sub('Criterios de aceptación')
table(['Comprobar','Se considera listo cuando...'],[
 ('Identidad','Todo dice Uppercat; logo y favicon aprobados. Sin TU MARCA ni CARA CATO.'),
 ('Imágenes','Sin cortes accidentales, bordes pixelados, textos ilegibles o marcas de agua; pesos dentro de objetivos.'),
 ('Contenido','Cada ficha es real y completa. Las reseñas y marcas tienen permiso. Precios y promociones están confirmados.'),
 ('Interacción','Menú, carruseles, acordeón, selección, modal y WhatsApp se mantienen operables con teclado y móvil.'),
 ('Accesibilidad','Texto HTML legible, contraste suficiente, estados de foco visibles y respeto por movimiento reducido.'),
], [91,408])
sub('Integración técnica')
p('Copiar imágenes a public/images/; asignar /images/nombre.webp en data/images.json; completar fichas en data/site.ts. Ejecutar typecheck, build y test. Revisar de nuevo escritorio y móvil antes de actualizar main.')
small('Prioridad 1: identidad, tres portadas y selección principal de obras. Prioridad 2: fichas, cinco productos y sus fotos. Prioridad 3: logos, reseñas y gráficas opcionales. El artista aprueba la identidad y el contenido; el diseñador entrega piezas y el equipo de desarrollo las integra.')

doc=SimpleDocTemplate(str(OUT),pagesize=(W,H),rightMargin=48,leftMargin=48,topMargin=60,bottomMargin=57,title='Uppercat - Brief de diseño web',author='Uppercat',subject='Guía detallada de imágenes, contenido y entrega para diseño')
doc.build(story,onFirstPage=frame,onLaterPages=frame)
reader=PdfReader(OUT)
texts=[page.extract_text() or '' for page in reader.pages]
assert len(texts)==18, f'Expected 18 pages, got {len(texts)}'
keys=json.loads((ROOT/'data/images.json').read_text(encoding='utf-8'))
all_text='\n'.join(texts)
for key in keys: assert key in all_text, f'Missing inventory key {key}'
for value in ['Uppercat','+56 9 3345 7166','uppercat@gmail.com']: assert value in all_text
print(f'Generated {OUT.name}: {len(texts)} pages; all {len(keys)} image keys present.')
