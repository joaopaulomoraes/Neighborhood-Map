export const loadMapJS = src => {
  const ref = window.document.getElementsByTagName("script")[0]
  const script = window.document.createElement("script")
  script.src = src
  script.async = true
  script.onerror = () => document.write("Error to loading Google Maps API")
  ref.parentNode.insertBefore(script, ref)
}
