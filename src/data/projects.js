export const studio = {
  name: 'Lopez Amoblamientos',
  city: 'Las Flores, Buenos Aires',
  email: 'hola@lopezamoblamientos.ar',
  phone: '+54 9 11 0000 0000',
  whatsappNumber: '5491100000000',
  instagram: 'https://instagram.com/lopezamoblamientos',
}

export const whatsappLink = (text = 'Hola, quiero consultar por un mueble a medida.') =>
  `https://wa.me/${studio.whatsappNumber}?text=${encodeURIComponent(text)}`

const image = (id, width = 1600) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=80`

export const projects = [
  {
    title: 'Cocina Roble Natural', slug: 'cocina-roble-natural', category: 'Cocina a medida', location: 'Palermo, Buenos Aires', materials: 'Roble natural', isPlaceholder: true,
    size: '4,20 × 2,60 m',
    description: 'Una cocina abierta que necesitaba ordenar la vida cotidiana sin perder la calidez del departamento. Diseñamos una composición completa en roble natural, con frentes enmarcados y una isla que acompaña la circulación.',
    coverImage: image('photo-1556912173-3bb406ef7e77'), gallery: [image('photo-1556912173-3bb406ef7e77'), image('photo-1600566753086-00f18fb6b3ea'), image('photo-1556911220-e15b29be8c8f'), image('photo-1600607687920-4e2a09cf159d')],
    beforeImage: image('photo-1556912173-3bb406ef7e77'), afterImage: image('photo-1600566753086-00f18fb6b3ea'),
  },
  {
    title: 'Biblioteca Liniers', slug: 'biblioteca-liniers', category: 'Biblioteca de pared', location: 'Liniers, Buenos Aires', materials: 'Petiribí y hierro', isPlaceholder: true,
    size: '3,80 × 2,90 m',
    description: 'Una biblioteca de pared completa para reunir libros, objetos y el paso de la luz. La estructura combina estantes de madera maciza con una trama liviana de hierro pintado.',
    coverImage: image('photo-1618220179428-22790b461013'), gallery: [image('photo-1618220179428-22790b461013'), image('photo-1618221195710-dd6b41faaea6'), image('photo-1549490349-8643362247b5')], beforeImage: null, afterImage: null,
  },
  {
    title: 'Vestidor Belgrano', slug: 'vestidor-belgrano', category: 'Vestidor', location: 'Belgrano, Buenos Aires', materials: 'Guatambú teñido', isPlaceholder: true,
    size: '2,40 × 2,50 m',
    description: 'Un vestidor sereno y preciso, resuelto con módulos abiertos para que cada objeto tenga su lugar. La madera teñida unifica el conjunto y aporta profundidad al dormitorio.',
    coverImage: image('photo-1616486338812-3dadae4b4ace'), gallery: [image('photo-1616486338812-3dadae4b4ace'), image('photo-1600607687920-4e2a09cf159d'), image('photo-1618221195710-dd6b41faaea6')], beforeImage: null, afterImage: null,
  },
  {
    title: 'Casa Chacarita', slug: 'casa-chacarita', category: 'Proyecto integral', location: 'Chacarita, Buenos Aires', materials: 'Paraíso y laca mineral', isPlaceholder: true,
    size: '6 ambientes',
    description: 'Muebles integrados para una casa que pedía continuidad entre los ambientes. Trabajamos puertas, guardado y piezas especiales bajo una misma paleta de materiales.',
    coverImage: image('photo-1600607688969-a5bfcd646154'), gallery: [image('photo-1600607688969-a5bfcd646154'), image('photo-1618220179428-22790b461013'), image('photo-1555041469-a586c61ea9bc')], beforeImage: null, afterImage: null,
  },
]

export const services = [
  { title: 'Cocinas', copy: 'Bajo mesadas, alacenas, islas y despensas pensadas alrededor de cómo cocinás.', image: image('photo-1600566753190-17f0baa2a6c3', 1000) },
  { title: 'Placares y vestidores', copy: 'Interiores organizados a tu ropa, con frentes que acompañan el dormitorio.', image: image('photo-1616486338812-3dadae4b4ace', 1000) },
  { title: 'Bibliotecas y living', copy: 'Estanterías, racks y muebles de guardado que ordenan sin cargar el ambiente.', image: image('photo-1618220179428-22790b461013', 1000) },
  { title: 'Muebles a pedido', copy: 'Mesas, escritorios, vanitorys y piezas únicas para un rincón específico.', image: image('photo-1555041469-a586c61ea9bc', 1000) },
  { title: 'Proyectos integrales', copy: 'Toda la carpintería de una casa o un local, con una misma mirada de principio a fin.', image: image('photo-1600607688969-a5bfcd646154', 1000) },
]

export const steps = [
  { title: 'Consulta', copy: 'Nos contás qué necesitás, por WhatsApp o en persona. Si tenés fotos o ideas guardadas, mejor.' },
  { title: 'Medición', copy: 'Vamos a tu casa y tomamos cada medida en el lugar, con escuadra y nivel. Nada a ojo.' },
  { title: 'Diseño', copy: 'Te mostramos el plano, el material y el presupuesto. Ajustamos juntos hasta que cierre.' },
  { title: 'Fabricación', copy: 'Cortamos, armamos y terminamos cada pieza en nuestro taller de Las Flores.' },
  { title: 'Instalación', copy: 'Llevamos el mueble terminado, lo colocamos y dejamos todo limpio.' },
]

// Base, grain and ink colours drive the procedural wood swatches.
export const woods = [
  { name: 'Roble', note: 'Veta marcada y muy estable. Frentes de cocina y mesas.', base: '#c39a68', grain: '#6a4524' },
  { name: 'Petiribí', note: 'Nativa del litoral, tono miel oscuro. Bibliotecas y muebles de living.', base: '#a06a42', grain: '#5c3a22' },
  { name: 'Guatambú', note: 'Clara y pareja, de Misiones. Placares, vestidores e interiores.', base: '#e2cf9f', grain: '#a2844a' },
  { name: 'Paraíso', note: 'Rojiza y liviana. Puertas, sillas y piezas especiales.', base: '#b67b4f', grain: '#77462a' },
  { name: 'Melamina', note: 'Resistente y fácil de limpiar. Interiores y muebles de uso diario.', base: '#d9d2c4', grain: '#bdb4a3', flat: true },
]
