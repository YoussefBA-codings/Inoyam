module.exports = {
  makePhotoArray: (photos) => photos?.map(p => p._links.self.href),
  getLocationCode: (location) => {
    try {
      let code = location.title.match(/\((\d+)\)$/);
      if (/paris (\d+)/i.test(location.title) && !code) {
        code = location.title.match(/paris (\d+)/i);
        code = `${location.departement}0${code[1].length > 1 ? '' : '0'}${code[1]}`;
      } else code = code[1];
      return code;
    } catch (err) {
      if (location.departement == null)
        throw new Error(`Le bien n'est pas en France`)
      else
        throw new Error(err)
    }
  },
  getLocationName: (location) => {
    try {
      let name = location.title.match(/([a-zA-ZÀ-ÿ-]+)\s?\(\d+\)$/);
      if (!name && location.departement == '75') name = 'Paris';
      else name = name[1].trim();
      return name;
    } catch (err) {
      throw new Error(err)
    }
  },
  categories: (category) => {
    const cats = {
      appartement: 'appartement',
      maison: 'maison,villa,peniche',
      immeuble: 'immeuble',
      parking: 'parking',
      terrain: 'terrain'
    };

    for (const catI in cats) {
      const cat = cats[catI];
      if (cat.match(',')) {
        for (const chunk of cat.split(',')) {
          const reg = new RegExp(chunk, 'gi');
          if (category.match(reg)) return catI;
        }
      } else {
        const reg = new RegExp(cat, 'gi');
        if (category.match(reg)) return catI;
      }
    }
    return null;
  }
}