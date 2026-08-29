export const studio = {
  name: 'Lopez Amoblamientos',
  city: 'Las Flores, Buenos Aires',
  email: 'hola@lopezamoblamientos.ar',
  phone: '+54 9 11 0000 0000',
  whatsapp: 'https://wa.me/5491100000000',
  instagram: 'https://instagram.com/lopezamoblamientos',
}

const image = (id, width = 1400) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=85`

export const projects = [
  {
    title: 'Cocina Roble Natural', slug: 'cocina-roble-natural', category: 'Cocina a medida', location: 'Palermo, Buenos Aires', materials: 'Roble natural', isPlaceholder: true,
    description: 'Una cocina abierta que necesitaba ordenar la vida cotidiana sin perder la calidez del departamento. Diseñamos una composición completa en roble natural, con frentes enmarcados y una isla que acompaña la circulación.',
    coverImage: image('photo-1556912173-3bb406ef7e77'), gallery: [image('photo-1556912173-3bb406ef7e77'), image('photo-1600566753086-00f18fb6b3ea'), image('photo-1556911220-e15b29be8c8f'), image('photo-1600607687920-4e2a09cf159d')],
    beforeImage: image('photo-1556912173-3bb406ef7e77'), afterImage: image('photo-1600566753086-00f18fb6b3ea'),
  },
  {
    title: 'Biblioteca Liniers', slug: 'biblioteca-liniers', category: 'Mueble interior', location: 'Liniers, Buenos Aires', materials: 'Petiribí y hierro', isPlaceholder: true,
    description: 'Una biblioteca de pared completa para reunir libros, objetos y el paso de la luz. La estructura combina estantes de madera maciza con una trama liviana de hierro pintado.', coverImage: image('photo-1618220179428-22790b461013'), gallery: [image('photo-1618220179428-22790b461013'), image('photo-1618221195710-dd6b41faaea6'), image('photo-1549490349-8643362247b5')], beforeImage: null, afterImage: null,
  },
  {
    title: 'Vestidor Belgrano', slug: 'vestidor-belgrano', category: 'Vestidor', location: 'Belgrano, Buenos Aires', materials: 'Guatambú teñido', isPlaceholder: true,
    description: 'Un vestidor sereno y preciso, resuelto con módulos abiertos para que cada objeto tenga su lugar. La madera teñida unifica el conjunto y aporta profundidad al dormitorio.', coverImage: image('photo-1616486338812-3dadae4b4ace'), gallery: [image('photo-1616486338812-3dadae4b4ace'), image('photo-1600607687920-4e2a09cf159d'), image('photo-1618221195710-dd6b41faaea6')], beforeImage: null, afterImage: null,
  },
  {
    title: 'Casa Chacarita', slug: 'casa-chacarita', category: 'Proyecto integral', location: 'Chacarita, Buenos Aires', materials: 'Paraíso y laca mineral', isPlaceholder: true,
    description: 'Muebles integrados para una casa que pedía continuidad entre los ambientes. Trabajamos puertas, guardado y piezas especiales bajo una misma paleta de materiales.', coverImage: image('photo-1600607688969-a5bfcd646154'), gallery: [image('photo-1600607688969-a5bfcd646154'), image('photo-1618220179428-22790b461013'), image('photo-1555041469-a586c61ea9bc')], beforeImage: null, afterImage: null,
  },
]
