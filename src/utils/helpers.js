export const loadMapJS = src => {
  const ref = window.document.getElementsByTagName("script")[0]
  const script = window.document.createElement("script")
  script.src = src
  script.async = true
  script.onerror = () => document.write("Error to loading Google Maps API")
  ref.parentNode.insertBefore(script, ref)
}

export const locations = [
  {
    title: 'Lanches Vaz',
    location: {
      lat: -22.8871538,
      lng: -48.4450821
    }
  },
  {
    title: 'The Hop Club',
    location: {
      lat: -22.885889,
      lng: -48.443462
    }
  },
  {
    title: 'Brooks Hamburgueria',
    location: {
      lat: -22.885775,
      lng: -48.442486
    }
  },
  {
    title: 'Salgados e Salgados',
    location: {
      lat: -22.8860484,
      lng: -48.4427503
    }
  },
  {
    title: 'Alquimia Burguer Artesanal',
    location: {
      lat: -22.8865892,
      lng: -48.4443522
    }
  },
  {
    title: 'VitStela - Sabores do Mundo',
    location: {
      lat: -22.8866214,
      lng: -48.4441476
    }
  },
  {
    title: 'Pessin',
    location: {
      lat: -22.8837139,
      lng: -48.4405039
    }
  }
]

export const mapStyles = [
	{
		featureType: 'administrative',
		elementType: 'labels.text.fill',
		stylers: [
			{
				color: '#444444'
			}
		]
	},
	{
		featureType: 'landscape',
		elementType: 'all',
		stylers: [
			{
				color: '#f2f2f2'
			}
		]
	},
	{
		featureType: 'poi',
		elementType: 'all',
		stylers: [
			{
				visibility: 'off'
			}
		]
	},
	{
		featureType: 'road',
		elementType: 'all',
		stylers: [
			{
				visibility: 'simplified'
			},
			{
				lightness: '19'
			},
			{
				saturation: '-85'
			},
			{
				gamma: '0.90'
			}
		]
	},
	{
		featureType: 'road.highway',
		elementType: 'all',
		stylers: [
			{
				visibility: 'simplified'
			}
		]
	},
	{
		featureType: 'road.arterial',
		elementType: 'labels.icon',
		stylers: [
			{
				visibility: 'off'
			}
		]
	},
	{
		featureType: 'transit',
		elementType: 'all',
		stylers: [
			{
				visibility: 'simplified'
			}
		]
	},
	{
		featureType: 'water',
		elementType: 'all',
		stylers: [
			{
				color: '#79d4fa'
			},
			{
				visibility: 'on'
			}
		]
	}
]
